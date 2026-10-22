import {
  getCableComponentRefs,
  getConfiguredCableVerificationCutoff,
  isCableMarkerRequired,
  isWellFormedVariantId,
  MetadataItem,
  parseCableVerificationCutoff,
  resolveCableComponents,
  verifyCableConfiguration,
} from "./cableConfiguration";

// ---- GOLDEN VECTORS (keep identical to the order export's
// saleor-apps/apps/smtp/src/modules/order-export/verify-cable-line.test.ts) ----
type GoldenExpected = {
  result: "verified" | "missing-marker" | "invalid-marker" | "modified";
  changedKeys: string[];
};

const MARKER_KEY = "checkout_prices.cable_config";
const goldenBase: MetadataItem[] = [
  { key: "configurator_type", value: "cable" },
  { key: "cable_line_ref", value: "3f1c2b8e-0000-4000-8000-000000000001" },
  { key: "connecteur_1_id", value: "UHJvZHVjdFZhcmlhbnQ6MTAx" },
  { key: "connecteur_1_name", value: "Jack A" },
  { key: "longueur_cable_cm", value: "100" },
  { key: "total_price", value: "30.00" },
];
const goldenMarker = (entries: MetadataItem[]): MetadataItem => ({
  key: MARKER_KEY,
  value: JSON.stringify({
    v: 1,
    metadata: Object.fromEntries(entries.map(e => [e.key, e.value])),
  }),
});
const goldenWithValue = (entries: MetadataItem[], key: string, value: string): MetadataItem[] => [
  ...entries.filter(e => e.key !== key),
  { key, value },
];

const GOLDEN_VECTORS: Array<{
  name: string;
  metadata: MetadataItem[];
  privateMetadata: MetadataItem[];
  expected: GoldenExpected;
}> = [
  {
    name: "verified: public metadata equals the marker",
    metadata: goldenBase,
    privateMetadata: [goldenMarker(goldenBase)],
    expected: { result: "verified", changedKeys: [] },
  },
  {
    name: "verified: another app's namespaced key (contains a dot) is ignored",
    metadata: [...goldenBase, { key: "some_other_app.note", value: "gift wrap" }],
    privateMetadata: [goldenMarker(goldenBase)],
    expected: { result: "verified", changedKeys: [] },
  },
  {
    name: "NR-36 modified: an extra cable key the app never wrote (couleur_cable_name)",
    metadata: [...goldenBase, { key: "couleur_cable_name", value: "Rouge" }],
    privateMetadata: [goldenMarker(goldenBase)],
    expected: { result: "modified", changedKeys: ["couleur_cable_name"] },
  },
  {
    name: "NR-36 modified: an extra key with an empty value",
    metadata: [...goldenBase, { key: "note", value: "" }],
    privateMetadata: [goldenMarker(goldenBase)],
    expected: { result: "modified", changedKeys: ["note"] },
  },
  {
    name: "modified: a recorded key was deleted",
    metadata: goldenBase.filter(e => e.key !== "total_price"),
    privateMetadata: [goldenMarker(goldenBase)],
    expected: { result: "modified", changedKeys: ["total_price"] },
  },
  {
    name: "modified: values changed",
    metadata: goldenWithValue(
      goldenWithValue(goldenBase, "longueur_cable_cm", "5000"),
      "total_price",
      "3000.00",
    ),
    privateMetadata: [goldenMarker(goldenBase)],
    expected: { result: "modified", changedKeys: ["longueur_cable_cm", "total_price"] },
  },
  {
    name: "modified: the marker belongs to another (cheaper) line",
    metadata: goldenWithValue(goldenBase, "longueur_cable_cm", "2000"),
    privateMetadata: [goldenMarker(goldenBase)],
    expected: { result: "modified", changedKeys: ["longueur_cable_cm"] },
  },
  {
    name: "missing-marker: no private metadata",
    metadata: goldenBase,
    privateMetadata: [],
    expected: { result: "missing-marker", changedKeys: [] },
  },
  {
    name: "missing-marker: only unrelated private keys",
    metadata: goldenBase,
    privateMetadata: [{ key: "unrelated", value: "x" }],
    expected: { result: "missing-marker", changedKeys: [] },
  },
  {
    name: "invalid-marker: not JSON",
    metadata: goldenBase,
    privateMetadata: [{ key: MARKER_KEY, value: "not json" }],
    expected: { result: "invalid-marker", changedKeys: [] },
  },
  {
    name: "invalid-marker: another version",
    metadata: goldenBase,
    privateMetadata: [
      { key: MARKER_KEY, value: '{"v":2,"metadata":{"configurator_type":"cable"}}' },
    ],
    expected: { result: "invalid-marker", changedKeys: [] },
  },
  {
    name: "invalid-marker: non-string values",
    metadata: goldenBase,
    privateMetadata: [{ key: MARKER_KEY, value: '{"v":1,"metadata":{"total_price":30}}' }],
    expected: { result: "invalid-marker", changedKeys: [] },
  },
  {
    name: "invalid-marker: a JSON array",
    metadata: goldenBase,
    privateMetadata: [{ key: MARKER_KEY, value: '[{"v":1}]' }],
    expected: { result: "invalid-marker", changedKeys: [] },
  },
];
// ---- END GOLDEN VECTORS ----

describe("verifyCableConfiguration — golden vectors shared with the order export", () => {
  it.each(GOLDEN_VECTORS)("$name", ({ metadata, privateMetadata, expected }) => {
    // Act
    const verification = verifyCableConfiguration(metadata, privateMetadata);

    // Assert
    const actual: GoldenExpected =
      verification.status === "verified"
        ? { result: "verified", changedKeys: [] }
        : {
            result: verification.reason,
            changedKeys: verification.reason === "modified" ? verification.changedKeys : [],
          };

    expect(actual).toEqual(expected);
  });
});

describe("isCableMarkerRequired (M1)", () => {
  const cutoff = new Date("2026-10-23T00:00:00Z");

  it("does not require a marker on an order created before the cutoff", () => {
    expect(isCableMarkerRequired("2026-10-22T23:59:59Z", cutoff)).toBe(false);
  });

  it.each(["2026-10-23T00:00:00Z", "2027-01-01T10:00:00Z"])(
    "requires a marker on an order created on or after the cutoff (%s)",
    created => {
      expect(isCableMarkerRequired(created, cutoff)).toBe(true);
    },
  );

  it.each([undefined, null, "", "not a date"])(
    "requires a marker when the order date is unknown (%p): no harmless explanation",
    created => {
      expect(isCableMarkerRequired(created, cutoff)).toBe(true);
    },
  );
});

describe("isCableMarkerRequired without a cutoff (P1-b)", () => {
  it.each([undefined, null, "", "not a date", "2026-10-22T23:59:59Z", "2099-01-01T00:00:00Z"])(
    "never requires a marker when no cutoff is configured (%p)",
    created => {
      expect(isCableMarkerRequired(created, null)).toBe(false);
    },
  );
});

describe("parseCableVerificationCutoff (M1, P1-b)", () => {
  it("uses the configured date", () => {
    expect(parseCableVerificationCutoff("2026-11-01")?.toISOString()).toBe(
      "2026-11-01T00:00:00.000Z",
    );
  });

  it.each([undefined, null, "", "   ", "garbage"])(
    "means NO cutoff for %p: never the placeholder date",
    raw => {
      expect(parseCableVerificationCutoff(raw)).toBeNull();
    },
  );
});

describe("getConfiguredCableVerificationCutoff (P1-b)", () => {
  const original = window.__SALEOR_CONFIG__;

  afterEach(() => {
    window.__SALEOR_CONFIG__ = original;
    jest.restoreAllMocks();
  });

  it("reads the runtime value from window.__SALEOR_CONFIG__", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);

    window.__SALEOR_CONFIG__ = {
      ...original,
      CABLE_VERIFICATION_CUTOFF: "2026-11-01",
    } as typeof original;

    expect(getConfiguredCableVerificationCutoff()?.toISOString()).toBe("2026-11-01T00:00:00.000Z");
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([undefined, ""])("returns null and warns when the runtime value is %p", value => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);

    window.__SALEOR_CONFIG__ = { ...original, CABLE_VERIFICATION_CUTOFF: value } as typeof original;

    expect(getConfiguredCableVerificationCutoff()).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("CABLE_VERIFICATION_CUTOFF"));
  });
});

describe("isWellFormedVariantId (P2-a)", () => {
  it.each(["UHJvZHVjdFZhcmlhbnQ6MTAx", btoa("ProductVariant:7")])("accepts %s", id => {
    expect(isWellFormedVariantId(id)).toBe(true);
  });

  it.each([
    "x",
    "",
    "not base64!!",
    btoa("Product:7"),
    btoa("ProductVariant:abc"),
    btoa("ProductVariant:"),
  ])("rejects %p", id => {
    expect(isWellFormedVariantId(id)).toBe(false);
  });
});

describe("cable component names (NR-35)", () => {
  // the shopper typed the names of expensive parts onto the cheapest valid ids
  const forged: MetadataItem[] = [
    { key: "configurator_type", value: "cable" },
    { key: "connecteur_1_id", value: "id-cheap-1" },
    { key: "connecteur_1_name", value: "Neutrik XLR gold" },
    { key: "connecteur_2_id", value: "id-cheap-2" },
    { key: "connecteur_2_name", value: "Jack B" },
    { key: "type_cable_id", value: "id-cable" },
    { key: "type_cable_name", value: "Câble" },
  ];
  const resolved = [
    { id: "id-cheap-1", name: "Jack 6.35", productName: "Jack 6.35" },
    { id: "id-cheap-2", name: "Default", productName: "Jack B" },
    { id: "id-cable", name: "", productName: "Câble" },
  ];

  it("lists the component ids and the cart labels, in slot order, skipping absent slots", () => {
    expect(getCableComponentRefs(forged)).toEqual([
      { slot: "connector1", id: "id-cheap-1", cartLabel: "Neutrik XLR gold" },
      { slot: "connector2", id: "id-cheap-2", cartLabel: "Jack B" },
      { slot: "cableType", id: "id-cable", cartLabel: "Câble" },
    ]);
  });

  it("displays the name Saleor holds for the id and flags a cart label that differs", () => {
    const views = resolveCableComponents(getCableComponentRefs(forged), resolved);

    expect(views.map(v => [v.slot, v.name, v.labelDiffers])).toEqual([
      ["connector1", "Jack 6.35", true],
      ["connector2", "Jack B – Default", false],
      ["cableType", "Câble", false],
    ]);
  });

  it("leaves an id Saleor cannot resolve without a name", () => {
    const views = resolveCableComponents(getCableComponentRefs(forged), resolved.slice(1));

    expect(views[0]).toMatchObject({ slot: "connector1", name: null });
  });

  it("is not fooled by case or spacing when comparing labels", () => {
    const views = resolveCableComponents(
      [{ slot: "connector1", id: "x", cartLabel: "  jack   6.35 " }],
      [{ id: "x", name: "Jack 6.35", productName: "Jack 6.35" }],
    );

    expect(views[0].labelDiffers).toBe(false);
  });
});
