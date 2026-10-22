// Helpers for reading the custom cable configurator's order-line metadata.
// The metadata schema is written by the checkout-prices app
// (saleor-apps/apps/checkout-prices/src/pages/api/add-configured-cable.ts)
// and mirrored by the storefront's CableConfigurationDisplay component.
// Public line metadata is NOT trusted on its own: see verifyCableConfiguration.

export interface MetadataItem {
  key: string;
  value: string;
}

/**
 * A line is a configured custom cable when the configurator sentinel is present.
 * Detection is metadata-based, not product-name-based, matching the storefront.
 */
export const isConfiguredCableLine = (metadata: MetadataItem[] | null | undefined): boolean =>
  Boolean(metadata?.some(item => item.key === "configurator_type" && item.value === "cable"));

export interface CableComponentPrice {
  /** Amount actually charged for this component (already scaled by length where applicable). */
  amount: number;
  /** Per-meter reference rate, when the component is priced per meter. */
  perMeterRate?: number;
}

export interface CableConfiguration {
  variantName?: string;
  connector1Name?: string;
  connector2Name?: string;
  connector3Name?: string;
  cableTypeName?: string;
  directionName?: string;
  gaineName?: string;
  lengthCm: number;
  lengthMeters: number;
  currency?: string;
  totalPrice?: number;
  assemblyPrice?: number;
  connector1Price?: number;
  connector2Price?: number;
  connector3Price?: number;
  /** Cable charge = per-meter rate × length. */
  cableCharge?: CableComponentPrice;
  /** Sleeve charge = per-meter rate × length. */
  gaineCharge?: CableComponentPrice;
}

const toRecord = (metadata: MetadataItem[]): Record<string, string> =>
  metadata.reduce<Record<string, string>>((acc, { key, value }) => {
    acc[key] = value;

    return acc;
  }, {});

const parsePrice = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = parseFloat(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * PRIVATE order-line metadata key written by checkout-prices when it prices a
 * configured cable: JSON `{"v":1,"metadata":{<key>: <value>}}` holding exactly
 * the public metadata the app wrote (saleor-apps/apps/checkout-prices/src/
 * modules/cable/cable-line-marker.ts). Saleor copies checkout-line private
 * metadata onto the order line; shoppers cannot write it, staff need
 * MANAGE_ORDERS to read it.
 */
export const CABLE_CONFIG_MARKER_KEY = "checkout_prices.cable_config";

const CABLE_CONFIG_MARKER_VERSION = 1;

export type CableVerification =
  | { status: "verified" }
  | { status: "unverified"; reason: "missing-marker" | "invalid-marker" }
  | { status: "unverified"; reason: "modified"; changedKeys: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** The values recorded by checkout-prices, or null when the marker is unreadable. */
const parseCableConfigMarker = (raw: string): Map<string, string> | null => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed) || parsed.v !== CABLE_CONFIG_MARKER_VERSION || !isRecord(parsed.metadata)) {
    return null;
  }

  const recorded = new Map<string, string>();

  for (const [key, value] of Object.entries(parsed.metadata)) {
    if (typeof value !== "string") {
      return null;
    }

    recorded.set(key, value);
  }

  return recorded;
};

/**
 * Whether an order line's cable metadata is the one checkout-prices priced
 * (NR-33, NR-36). Cross-repo rule, identical to the order export's
 * saleor-apps/apps/smtp/src/modules/order-export/verify-cable-line.ts and pinned
 * by the same golden vectors (cableVerificationRules.test.ts):
 *
 *  1. no marker                        -> unverified, "missing-marker"
 *  2. marker unreadable                -> unverified, "invalid-marker"
 *  3. the WHOLE public key set is compared with the marker's; keys containing
 *     a "." belong to other apps and are ignored on both sides. Any extra,
 *     missing or changed key           -> unverified, "modified"
 *  4. otherwise                        -> verified
 *
 * "Verified" here only says the metadata is the one the app wrote. Names inside
 * it are caller-supplied text: show the ones resolveCableComponents returns.
 */
export const verifyCableConfiguration = (
  metadata: MetadataItem[] | null | undefined,
  privateMetadata: MetadataItem[] | null | undefined,
): CableVerification => {
  const marker = privateMetadata?.find(item => item.key === CABLE_CONFIG_MARKER_KEY);

  if (!marker) {
    return { status: "unverified", reason: "missing-marker" };
  }

  const recorded = parseCableConfigMarker(marker.value);

  if (!recorded) {
    return { status: "unverified", reason: "invalid-marker" };
  }

  const isOwnKey = (key: string) => !key.includes(".");
  const current = new Map<string, string>(
    (metadata ?? [])
      .filter(({ key }) => isOwnKey(key))
      .map(({ key, value }): [string, string] => [key, value]),
  );
  const keysToCompare = new Set([
    ...current.keys(),
    ...Array.from(recorded.keys()).filter(isOwnKey),
  ]);
  const changedKeys = Array.from(keysToCompare)
    .filter(key => current.get(key) !== recorded.get(key))
    .sort();

  return changedKeys.length === 0
    ? { status: "verified" }
    : { status: "unverified", reason: "modified", changedKeys };
};

/**
 * Runtime cutoff of the verification (M1): orders created from this instant on
 * MUST carry a marker. Set it with the runtime setting CABLE_VERIFICATION_CUTOFF
 * (any date string, e.g. 2026-10-25; nginx/replace-env-vars.sh writes it into
 * index.html at container start). UNSET, empty or unreadable = NO cutoff: a
 * missing marker then gets the soft wording only. There is deliberately no
 * default date: a guessed date would make old orders look forged, or new
 * forgeries look old.
 */
export const parseCableVerificationCutoff = (raw: string | undefined | null): Date | null => {
  const parsed = raw && raw.trim() ? new Date(raw.trim()) : null;

  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
};

/**
 * The cutoff from the dashboard's runtime config (window.__SALEOR_CONFIG__), or
 * null (with a console warning) when none is configured.
 */
export const getConfiguredCableVerificationCutoff = (): Date | null => {
  const cutoff = parseCableVerificationCutoff(window?.__SALEOR_CONFIG__?.CABLE_VERIFICATION_CUTOFF);

  if (cutoff === null) {
    console.warn(
      "CABLE_VERIFICATION_CUTOFF is not set (or not a date): cable lines without a configurator record are shown with the soft wording, whatever the order date.",
    );
  }

  return cutoff;
};

/**
 * A line without a marker is only excusable on an order created before the
 * cutoff. An unknown or unreadable order date is NOT excused. With no cutoff
 * configured nothing can be called "required" (soft wording).
 */
export const isCableMarkerRequired = (
  orderCreatedAt: string | undefined | null,
  cutoff: Date | null,
): boolean => {
  if (cutoff === null) {
    return false;
  }

  const created = orderCreatedAt ? new Date(orderCreatedAt) : null;

  if (!created || Number.isNaN(created.getTime())) {
    return true;
  }

  return created.getTime() >= cutoff.getTime();
};

/**
 * Whether `id` decodes to a ProductVariant global ID (base64 "ProductVariant:<n>").
 * Saleor rejects a whole productVariants(ids: [...]) query when ONE id is
 * malformed, so only well-formed ids are looked up; the rest stay unresolved.
 */
export const isWellFormedVariantId = (id: string): boolean => {
  try {
    return /^ProductVariant:[1-9][0-9]*$/.test(atob(id));
  } catch {
    return false;
  }
};

export type CableComponentSlot = "connector1" | "connector2" | "connector3" | "cableType" | "gaine";

export interface CableComponentRef {
  slot: CableComponentSlot;
  /** ProductVariant id the app priced (checked server-side against the base variant's options) */
  id: string;
  /** the name carried by the cart: caller-supplied text, never authoritative (NR-35) */
  cartLabel: string | undefined;
}

export interface ResolvedCableVariant {
  id: string;
  /** variant name, may be empty or a generic "Default" */
  name: string;
  productName: string;
}

export interface CableComponentView {
  slot: CableComponentSlot;
  id: string;
  /** name resolved live from the id, null when the id resolves to nothing */
  name: string | null;
  cartLabel: string | undefined;
  /** the cart label is not a name Saleor knows for this id */
  labelDiffers: boolean;
}

const COMPONENT_KEYS: Array<{ slot: CableComponentSlot; idKey: string; nameKey: string }> = [
  { slot: "connector1", idKey: "connecteur_1_id", nameKey: "connecteur_1_name" },
  { slot: "connector2", idKey: "connecteur_2_id", nameKey: "connecteur_2_name" },
  { slot: "connector3", idKey: "connecteur_3_id", nameKey: "connecteur_3_name" },
  { slot: "cableType", idKey: "type_cable_id", nameKey: "type_cable_name" },
  { slot: "gaine", idKey: "reference_gaine_id", nameKey: "reference_gaine_name" },
];

/** The component ids of a configured-cable line, with the cart's (untrusted) labels. */
export const getCableComponentRefs = (
  metadata: MetadataItem[] | null | undefined,
): CableComponentRef[] => {
  const config = toRecord(metadata ?? []);

  return COMPONENT_KEYS.flatMap(({ slot, idKey, nameKey }) =>
    config[idKey] ? [{ slot, id: config[idKey], cartLabel: config[nameKey] || undefined }] : [],
  );
};

const normalizeLabel = (label: string): string => label.trim().replace(/\s+/g, " ").toLowerCase();

const displayName = ({ name, productName }: ResolvedCableVariant): string =>
  name && normalizeLabel(name) !== normalizeLabel(productName)
    ? `${productName} – ${name}`
    : productName;

const knownNames = (variant: ResolvedCableVariant): string[] =>
  [
    variant.productName,
    variant.name,
    displayName(variant),
    `${variant.productName} ${variant.name}`,
  ]
    .filter(Boolean)
    .map(normalizeLabel);

/** Resolves each component id against what Saleor returned for them. */
export const resolveCableComponents = (
  refs: CableComponentRef[],
  resolved: ResolvedCableVariant[],
): CableComponentView[] =>
  refs.map(ref => {
    const variant = resolved.find(item => item.id === ref.id);

    return {
      slot: ref.slot,
      id: ref.id,
      name: variant ? displayName(variant) : null,
      cartLabel: ref.cartLabel,
      labelDiffers:
        variant !== undefined &&
        ref.cartLabel !== undefined &&
        !knownNames(variant).includes(normalizeLabel(ref.cartLabel)),
    };
  });

/**
 * Parse the configurator metadata of an order line into a display-ready shape.
 * Returns null when the line is not a configured cable.
 */
export const parseCableConfiguration = (
  metadata: MetadataItem[] | null | undefined,
): CableConfiguration | null => {
  if (!metadata || !isConfiguredCableLine(metadata)) {
    return null;
  }

  const config = toRecord(metadata);
  const lengthCm = parseInt(config.longueur_cable_cm || "0", 10);
  const cableAmount = parsePrice(config.component_length_price);
  const gaineAmount = parsePrice(config.component_gaine_price);

  return {
    variantName: config.variant_name,
    connector1Name: config.connecteur_1_name,
    connector2Name: config.connecteur_2_name,
    connector3Name: config.connecteur_3_name,
    cableTypeName: config.type_cable_name,
    directionName: config.direction_cable_name,
    gaineName: config.reference_gaine_name,
    lengthCm,
    lengthMeters: lengthCm / 100,
    currency: config.currency,
    totalPrice: parsePrice(config.total_price),
    assemblyPrice: parsePrice(config.component_assembly_price),
    connector1Price: parsePrice(config.component_connector1_price),
    connector2Price: parsePrice(config.component_connector2_price),
    connector3Price: parsePrice(config.component_connector3_price),
    cableCharge:
      cableAmount !== undefined
        ? { amount: cableAmount, perMeterRate: parsePrice(config.component_cable_price) }
        : undefined,
    gaineCharge:
      gaineAmount !== undefined
        ? { amount: gaineAmount, perMeterRate: parsePrice(config.component_gaine_per_meter_price) }
        : undefined,
  };
};
