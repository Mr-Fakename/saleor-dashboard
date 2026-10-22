import {
  CABLE_CONFIG_MARKER_KEY,
  CableVerification,
  MetadataItem,
  verifyCableConfiguration,
} from "./cableConfiguration";
import { appMarkerFor, appWrittenCableMetadata, withValue } from "./testFixtures";

// NR-33: a configured-cable line is trustworthy only when its PUBLIC metadata
// (writable by any shopper through Saleor's public API) matches the PRIVATE
// record checkout-prices writes when it prices the cable.

describe("verifyCableConfiguration", () => {
  it("uses the private key checkout-prices writes", () => {
    expect(CABLE_CONFIG_MARKER_KEY).toBe("checkout_prices.cable_config");
  });

  it("verifies the golden marker pinned by checkout-prices' own test", () => {
    // Arrange — the exact string asserted in saleor-apps/apps/checkout-prices/
    // src/__tests__/cable-line-marker.test.ts (keys sorted, {v:1, metadata})
    const metadata: MetadataItem[] = [
      { key: "configurator_type", value: "cable" },
      { key: "longueur_cable_cm", value: "100" },
      { key: "total_price", value: "30.00" },
      { key: "connecteur_1_id", value: "UHJvZHVjdFZhcmlhbnQ6MTAx" },
      { key: "component_gaine_price", value: "1.00" },
      { key: "cable_line_ref", value: "3f1c2b8e-0000-4000-8000-000000000001" },
    ];
    const marker: MetadataItem = {
      key: CABLE_CONFIG_MARKER_KEY,
      value:
        '{"v":1,"metadata":{' +
        '"cable_line_ref":"3f1c2b8e-0000-4000-8000-000000000001",' +
        '"component_gaine_price":"1.00",' +
        '"configurator_type":"cable",' +
        '"connecteur_1_id":"UHJvZHVjdFZhcmlhbnQ6MTAx",' +
        '"longueur_cable_cm":"100",' +
        '"total_price":"30.00"}}',
    };

    // Act
    const result = verifyCableConfiguration(metadata, [marker]);

    // Assert
    expect(result).toEqual<CableVerification>({ status: "verified" });
  });

  it("verifies a line whose metadata matches the marker, whatever the order", () => {
    // Arrange
    const marker = appMarkerFor(appWrittenCableMetadata);

    // Act
    const result = verifyCableConfiguration([...appWrittenCableMetadata].reverse(), [marker]);

    // Assert
    expect(result).toEqual<CableVerification>({ status: "verified" });
  });

  it("does not verify forged cable metadata without a marker", () => {
    // Arrange — a 50 m cable described on the base variant via public checkoutLinesAdd
    const forged = withValue(appWrittenCableMetadata, "longueur_cable_cm", "5000");

    // Act
    const results = [
      verifyCableConfiguration(forged, []),
      verifyCableConfiguration(forged, undefined),
      verifyCableConfiguration(forged, [{ key: "unrelated", value: "x" }]),
    ];

    // Assert
    expect(results).toEqual<CableVerification[]>([
      { status: "unverified", reason: "missing-marker" },
      { status: "unverified", reason: "missing-marker" },
      { status: "unverified", reason: "missing-marker" },
    ]);
  });

  it("does not verify metadata changed after checkout-prices recorded it", () => {
    // Arrange — public updateMetadata / checkoutLinesUpdate on a genuine line
    const marker = appMarkerFor(appWrittenCableMetadata);
    const modified = withValue(
      withValue(appWrittenCableMetadata, "longueur_cable_cm", "5000"),
      "total_price",
      "3000.00",
    );

    // Act
    const result = verifyCableConfiguration(modified, [marker]);

    // Assert
    expect(result).toEqual<CableVerification>({
      status: "unverified",
      reason: "modified",
      changedKeys: ["longueur_cable_cm", "total_price"],
    });
  });

  it("does not verify a cable key the app never wrote (e.g. an added third connector)", () => {
    // Arrange
    const marker = appMarkerFor(appWrittenCableMetadata);
    const withExtraConnector = [
      ...appWrittenCableMetadata,
      { key: "connecteur_3_name", value: "XLR femelle" },
    ];

    // Act
    const result = verifyCableConfiguration(withExtraConnector, [marker]);

    // Assert
    expect(result).toEqual<CableVerification>({
      status: "unverified",
      reason: "modified",
      changedKeys: ["connecteur_3_name"],
    });
  });

  it("does not verify when a recorded key was deleted", () => {
    // Arrange
    const marker = appMarkerFor(appWrittenCableMetadata);
    const withoutSleevePrice = appWrittenCableMetadata.filter(
      item => item.key !== "component_gaine_price",
    );

    // Act
    const result = verifyCableConfiguration(withoutSleevePrice, [marker]);

    // Assert
    expect(result).toEqual<CableVerification>({
      status: "unverified",
      reason: "modified",
      changedKeys: ["component_gaine_price"],
    });
  });

  it("does not verify a configuration with a marker copied from another line", () => {
    // Arrange — the shopper's cheap genuine line vs. a forged expensive one
    const cheap = appWrittenCableMetadata;
    const expensive = withValue(cheap, "longueur_cable_cm", "2000");

    // Act
    const result = verifyCableConfiguration(expensive, [appMarkerFor(cheap)]);

    // Assert
    expect(result.status).toBe("unverified");
  });

  it("ignores public keys outside the cable contract", () => {
    // Arrange
    const marker = appMarkerFor(appWrittenCableMetadata);

    // Act
    const result = verifyCableConfiguration(
      [...appWrittenCableMetadata, { key: "some_other_app.note", value: "gift wrap" }],
      [marker],
    );

    // Assert
    expect(result).toEqual<CableVerification>({ status: "verified" });
  });

  it.each([
    ["not JSON", "not json"],
    ["another version", '{"v":2,"metadata":{"configurator_type":"cable"}}'],
    ["no metadata", '{"v":1}'],
    ["non-string values", '{"v":1,"metadata":{"total_price":30}}'],
    ["an array", '[{"v":1}]'],
  ])("does not verify an unreadable marker (%s)", (_label, value) => {
    // Arrange
    const marker: MetadataItem = { key: CABLE_CONFIG_MARKER_KEY, value };

    // Act
    const result = verifyCableConfiguration(appWrittenCableMetadata, [marker]);

    // Assert
    expect(result).toEqual<CableVerification>({ status: "unverified", reason: "invalid-marker" });
  });
});
