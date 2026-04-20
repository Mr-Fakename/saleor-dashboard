import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { EmailTemplate } from "./emailTemplates";
import { messages } from "./messages";
import styles from "./OrderEmailNotificationDialog.module.css";

interface TemplatePreviewProps {
  template: EmailTemplate;
  isCustomized?: boolean;
}

/**
 * Component to display an email template preview.
 * Shows subject and rendered HTML body.
 */
export const TemplatePreview = ({ template, isCustomized = false }: TemplatePreviewProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      padding={4}
      borderWidth={1}
      borderColor="default1"
      borderRadius={2}
      backgroundColor="default1"
    >
      {isCustomized && (
        <Box display="flex" alignItems="center" gap={2}>
          <Text color="warning1">
            <FormattedMessage {...messages.customizedBadge} />
          </Text>
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        <Text>
          <FormattedMessage {...messages.subjectLabel} />
        </Text>
        <Box
          padding={2}
          borderWidth={1}
          borderColor="default1"
          borderRadius={1}
          backgroundColor="default2"
          className={styles.templateContent}
        >
          <Text>{template.subject}</Text>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <Text>
          <FormattedMessage {...messages.previewBodyLabel} />
        </Text>
        <Box
          padding={2}
          borderWidth={1}
          borderColor="default1"
          borderRadius={1}
          backgroundColor="default2"
          className={styles.templateContent}
          dangerouslySetInnerHTML={{ __html: template.body }}
        />
      </Box>
    </Box>
  );
};
