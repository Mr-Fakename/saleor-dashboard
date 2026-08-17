import { defineMessages } from "react-intl";

export const refundsSettingsPageMessages = defineMessages({
  pageTitle: {
    defaultMessage: "Refunds settings",
    id: "t1scMK",
  },
  explainerTitle: {
    defaultMessage: "Refund reasons",
    id: "QpYazu",
  },
  explainerContent: {
    defaultMessage:
      "Select a Model Type. All Models extending the type will be available as refund reasons when issuing a refund.",
    id: "uGqPKY",
  },
  selectLabel: {
    defaultMessage: "Refunds Model Type",
    id: "e71euF",
  },
  selectHelper: {
    defaultMessage: "Choose the Model Type whose extended Models will serve as refund reasons.",
    id: "pepgIN",
  },
  createModelTypeLink: {
    defaultMessage: "Create new Model Type",
    id: "4Rj36Y",
  },
  previewTitle: {
    defaultMessage: "Current refund reasons from",
    id: "VSLrmT",
  },
  emptyModels: {
    defaultMessage: "This Model Type does not have created models yet.",
    id: "qZB1cn",
  },
  createModelLink: {
    defaultMessage: "Create a Model",
    id: "6J1m2c",
  },
  updateSuccess: {
    defaultMessage: "Refund reason reference type updated successfully",
    id: "tkxKAt",
  },
  updateError: {
    defaultMessage: "Failed to update refund reason reference type",
    id: "6ca7Pn",
  },
  clearSuccess: {
    defaultMessage: "Refund reason reference was cleared",
    id: "amdfBq",
  },
  clearError: {
    defaultMessage: "Failed to clear refund reason reference",
    id: "5BXvRB",
  },
});
