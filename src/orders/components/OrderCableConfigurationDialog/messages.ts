import { defineMessages } from "react-intl";

export const messages = defineMessages({
  dialogTitle: {
    id: "1TfYbU",
    defaultMessage: "Cable configuration",
    description: "cable configuration dialog title",
  },
  customCableBadge: {
    id: "rAGYqz",
    defaultMessage: "Custom cable",
    description: "badge shown next to the dialog title",
  },
  connector1: {
    id: "ZAx2t3",
    defaultMessage: "Connector 1",
    description: "cable configuration attribute",
  },
  connector2: {
    id: "2dqT/3",
    defaultMessage: "Connector 2",
    description: "cable configuration attribute",
  },
  connector3: {
    id: "irP0/z",
    defaultMessage: "Connector 3",
    description: "cable configuration attribute",
  },
  cableType: {
    id: "Ah1jp+",
    defaultMessage: "Cable type",
    description: "cable configuration attribute",
  },
  cableLength: {
    id: "iz5yG+",
    defaultMessage: "Length",
    description: "cable configuration attribute",
  },
  cableDirection: {
    id: "cBstSs",
    defaultMessage: "Direction",
    description: "cable configuration attribute",
  },
  sleeve: {
    id: "gMpvf6",
    defaultMessage: "Sleeve",
    description: "cable configuration attribute (gaine)",
  },
  priceBreakdown: {
    id: "PyePzm",
    defaultMessage: "Price breakdown",
    description: "cable configuration price section title",
  },
  assemblyFee: {
    id: "Nsn/V5",
    defaultMessage: "Assembly fee",
    description: "cable configuration price row",
  },
  perMeterDetail: {
    id: "DGEznb",
    defaultMessage: "{rate}/m × {meters}m",
    description: "per-meter price detail, e.g. €2.00/m × 3m",
  },
  total: {
    id: "+v3AE8",
    defaultMessage: "Total",
    description: "cable configuration total price row",
  },
  notAvailable: {
    id: "jFFzut",
    defaultMessage: "No cable configuration found on this line",
    description: "empty state when metadata is missing",
  },
  showConfiguration: {
    id: "Q8uVjV",
    defaultMessage: "Show cable configuration",
    description: "row action button tooltip",
  },
  verificationLoading: {
    id: "TvT/VD",
    defaultMessage: "Checking the configuration…",
    description: "cable configuration verification: private record still loading",
  },
  verifiedTitle: {
    id: "Dqi/84",
    defaultMessage: "Verified configuration",
    description: "cable configuration verification: line metadata matches the app's private record",
  },
  verifiedBody: {
    id: "wyb9HV",
    defaultMessage:
      "Matches the configuration the configurator recorded and priced when the cable was added to the cart.",
    description: "cable configuration verification: explanation of the verified state",
  },
  unverifiedTitle: {
    id: "FaHfes",
    defaultMessage: "Unverified configuration",
    description: "cable configuration verification: warning title",
  },
  unverifiedMissingBody: {
    id: "6QuRh2",
    defaultMessage:
      "This line has no configurator record: it was created before verification existed, or modified outside the configurator. Check the configuration and the price paid before building the cable.",
    description: "cable configuration verification: line has cable metadata but no private record",
  },
  unverifiedModifiedBody: {
    id: "K3JdVG",
    defaultMessage:
      "This line's details no longer match what the configurator recorded. Check the configuration and the price paid before building the cable.",
    description: "cable configuration verification: line metadata differs from the private record",
  },
  changedFields: {
    id: "IkF4cu",
    defaultMessage: "Changed fields:",
    description: "cable configuration verification: label before the list of changed metadata keys",
  },
  verificationErrorTitle: {
    id: "sK50F9",
    defaultMessage: "Configuration not checked",
    description: "cable configuration verification: the private record could not be loaded",
  },
  verificationErrorBody: {
    id: "yfCx3N",
    defaultMessage:
      "The verification data could not be loaded. Reload the page before building the cable.",
    description: "cable configuration verification: load error explanation",
  },
  unverifiedMissingRequiredBody: {
    id: "HbT+U8",
    defaultMessage:
      "This line has no configurator record, although the order was created after verification went live. Every genuine configured cable has one. Treat this configuration as forged: do not build the cable and check the order with the customer.",
    description:
      "cable configuration verification: missing record on an order created after the cutoff, no harmless explanation",
  },
  namesLoadingNote: {
    id: "Gj8pqh",
    defaultMessage: "Checking the component names…",
    description:
      "cable configuration verification: component names still loading, shown under the verdict",
  },
  namesErrorTitle: {
    id: "z1xXZo",
    defaultMessage: "Component names not checked",
    description: "cable configuration verification: the component name lookup failed",
  },
  namesErrorBody: {
    id: "GvRnZo",
    defaultMessage:
      "The component names could not be loaded from the catalogue. The verdict above does not depend on them; reload the page to check the names.",
    description: "cable configuration verification: name lookup failed, verdict unchanged",
  },
  unresolvedComponentsTitle: {
    id: "/8jtbU",
    defaultMessage: "Components not found",
    description: "cable configuration verification: some component ids resolve to nothing",
  },
  unresolvedComponentsVerifiedBody: {
    id: "D4GK8e",
    defaultMessage:
      "Some components of this line are no longer in the catalogue (deleted or unpublished since the order). The configuration itself matches what the configurator recorded. Check that the parts are still available before building the cable.",
    description:
      "cable configuration verification: unresolved component on a line that matches its record",
  },
  unresolvedComponentsBody: {
    id: "ACo6PV",
    defaultMessage:
      "Some components of this line could not be found in the catalogue. Do not build the cable until the order has been checked.",
    description: "cable configuration verification: a component id does not resolve to a product",
  },
  cartLabel: {
    id: "07qtbz",
    defaultMessage: "Cart label (differs from the catalogue):",
    description:
      "cable configuration: name the shopper's cart carried, when it differs from the catalogue name",
  },
  unresolvedComponent: {
    id: "bnXPCl",
    defaultMessage: "Not found in the catalogue",
    description: "cable configuration: component id that resolves to no product",
  },
});
