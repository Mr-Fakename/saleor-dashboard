import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import { ChevronLeft, RotateCcw, Save } from "lucide-react";
import { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { EmailTemplate } from "./emailTemplates";
import { messages } from "./messages";
import styles from "./OrderEmailNotificationDialog.module.css";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateEditorProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
  onReset: () => void;
}

/**
 * Component for editing email templates with live preview.
 * Shows editor on the left and live preview on the right.
 */
export const TemplateEditor = ({ template, onSave, onCancel, onReset }: TemplateEditorProps) => {
  const intl = useIntl();
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentTemplate: EmailTemplate = { subject, body };

  const handleSave = useCallback(() => {
    onSave(currentTemplate);
  }, [currentTemplate, onSave]);

  const handleResetConfirm = useCallback(() => {
    setShowResetConfirm(false);
    onReset();
  }, [onReset]);

  const isModified = subject !== template.subject || body !== template.body;

  return (
    <Box display="flex" flexDirection="column" gap={4} className={styles.editor}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="tertiary" size="small" icon={<ChevronLeft size={16} />} onClick={onCancel}>
          <FormattedMessage {...messages.backButton} />
        </Button>
        <Text as="h3">
          <FormattedMessage {...messages.editingTitle} />
        </Text>
      </Box>

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <Box
          padding={3}
          borderWidth={1}
          borderColor="warning1"
          borderRadius={2}
          backgroundColor="warning1"
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Text>
            <FormattedMessage {...messages.resetConfirmMessage} />
          </Text>
          <Box display="flex" gap={2}>
            <Button variant="primary" size="small" onClick={handleResetConfirm}>
              <FormattedMessage {...messages.resetConfirmButton} />
            </Button>
            <Button variant="secondary" size="small" onClick={() => setShowResetConfirm(false)}>
              <FormattedMessage {...messages.cancelButton} />
            </Button>
          </Box>
        </Box>
      )}

      {/* Two column layout: Editor and Preview */}
      <Box display="grid" gap={4} className={styles.editorGrid}>
        {/* Left column: Editor */}
        <Box display="flex" flexDirection="column" gap={3}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Text>
              <FormattedMessage {...messages.subjectLabel} />
            </Text>
            <Input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={intl.formatMessage(messages.subjectPlaceholder)}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Text>
                <FormattedMessage {...messages.bodyHtmlLabel} />
              </Text>
              <Text>
                <FormattedMessage {...messages.placeholderHint} />
              </Text>
            </Box>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={intl.formatMessage(messages.bodyPlaceholder)}
              className={styles.htmlEditor}
            />
          </Box>
        </Box>

        {/* Right column: Live Preview */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Text>
            <FormattedMessage {...messages.livePreviewLabel} />
          </Text>
          <TemplatePreview template={currentTemplate} />
        </Box>
      </Box>

      {/* Action buttons */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="secondary"
          size="small"
          icon={<RotateCcw size={16} />}
          onClick={() => setShowResetConfirm(true)}
        >
          <FormattedMessage {...messages.resetToDefaultButton} />
        </Button>
        <Button
          variant="primary"
          size="small"
          icon={<Save size={16} />}
          onClick={handleSave}
          disabled={!isModified}
        >
          <FormattedMessage {...messages.saveButton} />
        </Button>
      </Box>
    </Box>
  );
};
