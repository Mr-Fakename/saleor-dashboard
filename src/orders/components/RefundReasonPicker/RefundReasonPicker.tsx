import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { Select, Skeleton } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import { useIntl } from "react-intl";

import { refundReasonPickerMessages } from "./messages";

interface RefundReasonPickerProps {
  /** Model (page) type configured in Configuration -> Refunds settings. Empty when the feature is off. */
  referenceModelTypeId: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: ReactNode;
}

/**
 * Renders the list of Models extending the refund-reason Model Type. Shared by every refund
 * flow (refund with lines, manual refund, refund within return) so the options and the
 * placeholder stay identical everywhere.
 */
export const RefundReasonPicker = ({
  referenceModelTypeId,
  value,
  onChange,
  onBlur,
  name,
  disabled,
  error,
  helperText,
}: RefundReasonPickerProps) => {
  const intl = useIntl();
  const { data, loading } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: referenceModelTypeId,
    },
    skip: !referenceModelTypeId,
  });

  if (loading) {
    return <Skeleton />;
  }

  const options = [
    {
      value: "",
      label: intl.formatMessage(refundReasonPickerMessages.placeholder),
    },
    ...(data?.pages?.edges.map(({ node }) => ({
      value: node.id,
      label: node.title,
    })) ?? []),
  ];

  return (
    <Select
      data-test-id="refund-reason-picker"
      name={name}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      error={error}
      helperText={helperText}
    />
  );
};
