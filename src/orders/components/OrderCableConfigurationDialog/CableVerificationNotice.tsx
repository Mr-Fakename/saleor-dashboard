import { Callout } from "@dashboard/components/Callout/Callout";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Fragment } from "react";
import { useIntl } from "react-intl";

import {
  CableComponentView,
  CableVerification,
  MetadataItem,
  verifyCableConfiguration,
} from "./cableConfiguration";
import { messages } from "./messages";
import { CableComponentNames } from "./useCableComponentNames";
import { CableLinePrivateMetadata } from "./useCableLinePrivateMetadata";

interface CableVerificationNoticeProps {
  /** the order line's PUBLIC metadata, as displayed in the dialog */
  metadata: MetadataItem[] | null | undefined;
  marker: CableLinePrivateMetadata;
  /** component names resolved live from their ids (NR-35) */
  names: CableComponentNames;
  components: CableComponentView[];
  /**
   * order created on/after the cutoff: a missing marker has no harmless
   * explanation (M1). False when no cutoff is configured.
   */
  markerRequired: boolean;
}

/**
 * Extra line under the verdict about the component-name lookup. It can only ADD
 * information: a failed or partial lookup (Saleor rejects the whole query on
 * one malformed id) never changes the marker verdict above it.
 */
const NamesNote = ({
  names,
  components,
  verification,
}: {
  names: CableComponentNames;
  components: CableComponentView[];
  verification: CableVerification;
}) => {
  const intl = useIntl();

  if (names.state === "loading") {
    return (
      <Box data-test-id="cable-verification-names-loading" marginTop={2}>
        <Text size={2} color="default2">
          {intl.formatMessage(messages.namesLoadingNote)}
        </Text>
      </Box>
    );
  }

  if (names.state === "error") {
    return (
      <Box data-test-id="cable-verification-names-note" marginTop={2}>
        <Callout
          type="warning"
          title={
            <Text size={3} fontWeight="medium">
              {intl.formatMessage(messages.namesErrorTitle)}
            </Text>
          }
        >
          {intl.formatMessage(messages.namesErrorBody)}
        </Callout>
      </Box>
    );
  }

  if (!components.some(component => component.name === null)) {
    return null;
  }

  // On a line that matches its record the ids were validated server-side when
  // it was added, so a component that no longer resolves was deleted or
  // unpublished since: a warning. On any other line it is one more red flag.
  const matchesRecord = verification.status === "verified";

  return (
    <Box data-test-id="cable-verification-names-note" marginTop={2}>
      <Callout
        type={matchesRecord ? "warning" : "error"}
        title={
          <Text size={3} fontWeight="medium">
            {intl.formatMessage(messages.unresolvedComponentsTitle)}
          </Text>
        }
      >
        {intl.formatMessage(
          matchesRecord
            ? messages.unresolvedComponentsVerifiedBody
            : messages.unresolvedComponentsBody,
        )}
      </Callout>
    </Box>
  );
};

/**
 * NR-33 / NR-35: tells staff whether the displayed cable configuration is the
 * one checkout-prices priced, and whether every component id still resolves to
 * a product, before anyone builds the cable.
 *
 * Precedence: the marker verdict is computed on its own and shown FIRST. The
 * name lookup only adds a note below it.
 */
export const CableVerificationNotice = ({
  metadata,
  marker,
  names,
  components,
  markerRequired,
}: CableVerificationNoticeProps): JSX.Element => {
  const intl = useIntl();

  if (marker.state === "loading") {
    return (
      <Box data-test-id="cable-verification-loading">
        <Text size={2} color="default2">
          {intl.formatMessage(messages.verificationLoading)}
        </Text>
      </Box>
    );
  }

  if (marker.state === "error") {
    return (
      <Box data-test-id="cable-verification-error">
        <Callout
          type="warning"
          title={
            <Text size={3} fontWeight="medium">
              {intl.formatMessage(messages.verificationErrorTitle)}
            </Text>
          }
        >
          {intl.formatMessage(messages.verificationErrorBody)}
        </Callout>
      </Box>
    );
  }

  const verification = verifyCableConfiguration(metadata, marker.privateMetadata);
  const title = (
    <Text size={3} fontWeight="bold">
      {intl.formatMessage(messages.unverifiedTitle)}
    </Text>
  );
  let verdict: JSX.Element;

  if (verification.status === "verified") {
    verdict = (
      <Box data-test-id="cable-verification-verified">
        <Callout
          type="info"
          title={
            <Text size={3} fontWeight="medium">
              {intl.formatMessage(messages.verifiedTitle)}
            </Text>
          }
        >
          {intl.formatMessage(messages.verifiedBody)}
        </Callout>
      </Box>
    );
  } else if (verification.reason === "missing-marker") {
    verdict = (
      <Box data-test-id="cable-verification-unverified">
        {markerRequired ? (
          // After the cutoff every genuine line has a marker: offer no excuse.
          <Callout type="error" title={title}>
            {intl.formatMessage(messages.unverifiedMissingRequiredBody)}
          </Callout>
        ) : (
          // Neutral: also every line added before the marker existed, and any
          // line when no cutoff is configured.
          <Callout type="warning" title={title}>
            {intl.formatMessage(messages.unverifiedMissingBody)}
          </Callout>
        )}
      </Box>
    );
  } else {
    verdict = (
      <Box data-test-id="cable-verification-unverified">
        <Callout type="error" title={title}>
          {intl.formatMessage(messages.unverifiedModifiedBody)}
          {verification.reason === "modified" && (
            <Box as="span" display="block" marginTop={1}>
              {intl.formatMessage(messages.changedFields)}{" "}
              {verification.changedKeys.map((key, index) => (
                <Fragment key={key}>
                  {index > 0 && ", "}
                  <code>{key}</code>
                </Fragment>
              ))}
            </Box>
          )}
        </Callout>
      </Box>
    );
  }

  return (
    <Box>
      {verdict}
      <NamesNote names={names} components={components} verification={verification} />
    </Box>
  );
};
