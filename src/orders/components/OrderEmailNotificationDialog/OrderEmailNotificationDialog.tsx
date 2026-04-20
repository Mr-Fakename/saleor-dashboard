import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DashboardModal } from "@dashboard/components/Modal";
import { DialogProps } from "@dashboard/types";
import { Box, Button, Input, Select, Text } from "@saleor/macaw-ui-next";
import { Edit2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { EMAIL_REASONS, EmailTemplate, fillTemplate, getEmailTemplate } from "./emailTemplates";
import { messages } from "./messages";
import { TemplateEditor } from "./TemplateEditor";
import { TemplatePreview } from "./TemplatePreview";
import { useEmailTemplates } from "./useEmailTemplates";

interface OrderEmailNotificationDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  customerEmail: string | null;
  customerName: string;
  orderNumber: string;
  languageCode: string;
  onSend: (data: { to: string; subject: string; html: string }) => void;
  error?: string | null;
}

export const OrderEmailNotificationDialog = ({
  confirmButtonState,
  customerEmail,
  customerName,
  orderNumber,
  languageCode,
  open,
  onClose,
  onSend,
  error,
}: OrderEmailNotificationDialogProps) => {
  const intl = useIntl();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customSubject, setCustomSubject] = useState<string>("");
  const [customBody, setCustomBody] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);

  const emailTemplates = useEmailTemplates();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedReason("");
      setCustomSubject("");
      setCustomBody("");
      setEditMode(false);
    }
  }, [open]);

  // Get reason label based on id
  const getReasonLabel = useCallback(
    (reasonId: string): string => {
      switch (reasonId) {
        case "crafting":
          return intl.formatMessage(messages.reasonCrafting);
        case "delay":
          return intl.formatMessage(messages.reasonDelay);
        case "shipping_soon":
          return intl.formatMessage(messages.reasonShippingSoon);
        case "quality_check":
          return intl.formatMessage(messages.reasonQualityCheck);
        case "custom":
          return intl.formatMessage(messages.reasonCustom);
        default:
          return reasonId;
      }
    },
    [intl],
  );

  // Generate options for the select dropdown
  const reasonOptions = useMemo(
    () =>
      EMAIL_REASONS.map(reason => ({
        value: reason.id,
        label: getReasonLabel(reason.id),
      })),
    [getReasonLabel],
  );

  // Get template based on selected reason and language with overrides
  const template = useMemo(() => {
    if (!selectedReason || selectedReason === "custom") {
      return null;
    }

    const rawTemplate = getEmailTemplate(selectedReason, languageCode, emailTemplates.overrides);

    if (!rawTemplate) {
      return null;
    }

    return fillTemplate(rawTemplate, {
      id: orderNumber,
      name: customerName || "Customer",
    });
  }, [selectedReason, languageCode, orderNumber, customerName, emailTemplates.overrides]);

  // Determine final subject and body
  const finalSubject = selectedReason === "custom" ? customSubject : template?.subject || "";
  const finalBody = selectedReason === "custom" ? customBody : template?.body || "";

  // Handle save template
  const handleSaveTemplate = useCallback(
    (editedTemplate: EmailTemplate) => {
      if (selectedReason && selectedReason !== "custom") {
        emailTemplates.saveOverride(selectedReason, languageCode, editedTemplate);
        setEditMode(false);
      }
    },
    [selectedReason, languageCode, emailTemplates],
  );

  // Handle reset template to default
  const handleResetTemplate = useCallback(() => {
    if (selectedReason && selectedReason !== "custom") {
      emailTemplates.deleteOverride(selectedReason, languageCode);
      setEditMode(false);
    }
  }, [selectedReason, languageCode, emailTemplates]);

  // Handle send
  const handleSend = useCallback(() => {
    if (!customerEmail || !finalSubject || !finalBody) {
      return;
    }

    onSend({
      to: customerEmail,
      subject: finalSubject,
      html: finalBody,
    });
  }, [customerEmail, finalSubject, finalBody, onSend]);

  const isCustom = selectedReason === "custom";
  const canSend = customerEmail && selectedReason && finalSubject && finalBody;
  const isTemplateCustomized =
    !isCustom && selectedReason ? emailTemplates.hasOverride(selectedReason, languageCode) : false;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="md">
        <DashboardModal.Header>{intl.formatMessage(messages.dialogTitle)}</DashboardModal.Header>

        {!customerEmail ? (
          <Text color="critical1">{intl.formatMessage(messages.noEmailError)}</Text>
        ) : (
          <>
            {/* Recipient info */}
            <Box marginBottom={4}>
              <Text color="default2">{intl.formatMessage(messages.recipientLabel)}</Text>
              <Text>{customerEmail}</Text>
            </Box>

            {/* Language info */}
            <Box marginBottom={4}>
              <Text color="default2">{intl.formatMessage(messages.languageLabel)}</Text>
              <Text>{languageCode || "EN"}</Text>
            </Box>

            {/* Reason selector */}
            <Box marginBottom={4}>
              <Select
                label={intl.formatMessage(messages.selectReason)}
                value={selectedReason}
                onChange={value => setSelectedReason(value as string)}
                options={reasonOptions}
                size="medium"
              />
            </Box>

            {/* Custom fields when "custom" is selected */}
            {isCustom && (
              <>
                <Box marginBottom={4}>
                  <Input
                    label={intl.formatMessage(messages.subjectLabel)}
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    size="medium"
                  />
                </Box>
                <Box marginBottom={4}>
                  <Text color="default2">{intl.formatMessage(messages.bodyLabelCustom)}</Text>
                  <textarea
                    value={customBody}
                    onChange={e => setCustomBody(e.target.value)}
                    rows={8}
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      resize: "vertical",
                    }}
                    placeholder="<p>Hi {{name}},</p><p>Your message here...</p>"
                  />
                </Box>
              </>
            )}

            {/* Template editor for non-custom templates */}
            {selectedReason && !isCustom && template && editMode && (
              <>
                <FormSpacer />
                <TemplateEditor
                  template={template}
                  onSave={handleSaveTemplate}
                  onCancel={() => setEditMode(false)}
                  onReset={handleResetTemplate}
                />
              </>
            )}

            {/* Preview section with edit button for non-custom templates */}
            {selectedReason && !isCustom && template && !editMode && (
              <>
                <Box
                  marginTop={4}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text color="default2">{intl.formatMessage(messages.previewLabel)}</Text>
                  <Button
                    size="small"
                    variant="secondary"
                    icon={<Edit2 size={16} />}
                    onClick={() => setEditMode(true)}
                  >
                    <FormattedMessage {...messages.editButton} />
                  </Button>
                </Box>
                <FormSpacer />
                <TemplatePreview template={template} isCustomized={isTemplateCustomized} />
              </>
            )}

            {error && (
              <>
                <FormSpacer />
                <Text color="critical1">{error}</Text>
              </>
            )}
          </>
        )}

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            transitionState={confirmButtonState}
            onClick={handleSend}
            disabled={!canSend}
          >
            {intl.formatMessage(messages.sendButton)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderEmailNotificationDialog.displayName = "OrderEmailNotificationDialog";
