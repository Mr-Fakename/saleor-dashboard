import { MetadataItem } from "./cableConfiguration";

/**
 * Public line metadata exactly as checkout-prices' /api/add-configured-cable
 * writes it for a 100 cm cable (saleor-apps/apps/checkout-prices/src/__tests__/
 * api/add-configured-cable.test.ts, validConfiguration()).
 */
export const appWrittenCableMetadata: MetadataItem[] = [
  { key: "configurator_type", value: "cable" },
  { key: "config_fingerprint", value: "0123456789abcdef" },
  { key: "cable_line_ref", value: "3f1c2b8e-0000-4000-8000-000000000001" },
  { key: "variant_name", value: "Standard" },
  { key: "connecteur_1_id", value: "UHJvZHVjdFZhcmlhbnQ6MTAx" },
  { key: "connecteur_1_name", value: "Jack A" },
  { key: "connecteur_2_id", value: "UHJvZHVjdFZhcmlhbnQ6MTEx" },
  { key: "connecteur_2_name", value: "Jack B" },
  { key: "type_cable_id", value: "UHJvZHVjdFZhcmlhbnQ6MjAx" },
  { key: "type_cable_name", value: "Câble" },
  { key: "direction_cable_id", value: "QXR0cmlidXRlVmFsdWU6Nw==" },
  { key: "direction_cable_name", value: "Droit" },
  { key: "longueur_cable_cm", value: "100" },
  { key: "longueur_cable_name", value: "100cm" },
  { key: "total_price", value: "30.00" },
  { key: "currency", value: "EUR" },
  { key: "component_assembly_price", value: "15.00" },
  { key: "component_connector1_price", value: "5.00" },
  { key: "component_connector2_price", value: "7.00" },
  { key: "component_cable_price", value: "2.00" },
  { key: "component_length_price", value: "2.00" },
  { key: "reference_gaine_id", value: "UHJvZHVjdFZhcmlhbnQ6MzAx" },
  { key: "reference_gaine_name", value: "Gaine" },
  { key: "component_gaine_price", value: "1.00" },
  { key: "component_gaine_per_meter_price", value: "1.00" },
];

/** The private record checkout-prices writes for `metadata` (key order does not matter). */
export const appMarkerFor = (metadata: MetadataItem[]): MetadataItem => ({
  key: "checkout_prices.cable_config",
  value: JSON.stringify({
    v: 1,
    metadata: Object.fromEntries(metadata.map(({ key, value }) => [key, value])),
  }),
});

/** `metadata` with one key's value replaced (or added). */
export const withValue = (metadata: MetadataItem[], key: string, value: string): MetadataItem[] => [
  ...metadata.filter(item => item.key !== key),
  { key, value },
];
