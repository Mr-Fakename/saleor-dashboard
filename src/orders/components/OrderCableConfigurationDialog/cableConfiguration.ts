// Helpers for reading the custom cable configurator's order-line metadata.
// The metadata schema is written by the checkout-prices app
// (saleor-apps/apps/checkout-prices/src/pages/api/add-configured-cable.ts)
// and mirrored by the storefront's CableConfigurationDisplay component.

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
