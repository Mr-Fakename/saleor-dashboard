import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import PriceField from "@dashboard/components/PriceField";
import {
  OrderDetailsFragment,
  OrderGrantRefundCreateErrorFragment,
  TransactionRequestRefundForGrantedRefundErrorFragment,
} from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { PaymentSubmitCardValuesProps } from "@dashboard/orders/components/OrderReturnPage/components/PaymentSubmitCard/PaymentSubmitCardValues";
import { refundReasonPickerMessages } from "@dashboard/orders/components/RefundReasonPicker/messages";
import { RefundReasonPicker } from "@dashboard/orders/components/RefundReasonPicker/RefundReasonPicker";
import { IMoney } from "@dashboard/utils/intl";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  canSendRefundDuringReturn,
  getReturnRefundValue,
  isRefundReasonReferenceMissing,
} from "../../utils";
import { GrantRefundCheckbox } from "./GrantRefundCheckbox";
import { submitCardMessages } from "./messages";
import RefundShipmentCheckbox from "./RefundShipmentCheckbox";
import { SendRefundCheckbox } from "./SendRefundCheckbox";
import { TransactionSelector } from "./TransactionSelector";

interface TransactionSubmitCardProps {
  disabled: boolean;
  onSubmit: () => void;
  submitStatus: ConfirmButtonTransitionState;
  autoGrantRefund: boolean;
  autoSendRefund: boolean;
  refundShipmentCosts: boolean;
  canRefundShipping: boolean;
  shippingCosts: IMoney;
  amountData: PaymentSubmitCardValuesProps;
  customRefundValue: number | undefined;
  onChange: FormChange;
  grantRefundErrors: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors: TransactionRequestRefundForGrantedRefundErrorFragment[];
  transactions: OrderDetailsFragment["transactions"];
  isAmountDirty: boolean;
  transactionId?: string;
  onAmountChange: (value: number) => void;
  /** Refund-reason Model Type from Configuration -> Refunds settings, null when not configured */
  modelForRefundReasonRefId: string | null;
  reasonReferenceId: string;
}

export const TransactionSubmitCard = ({
  disabled,
  onSubmit,
  submitStatus,
  autoGrantRefund,
  autoSendRefund,
  refundShipmentCosts,
  canRefundShipping,
  amountData,
  onChange,
  customRefundValue,
  grantRefundErrors,
  sendRefundErrors,
  transactions,
  isAmountDirty,
  transactionId,
  onAmountChange,
  modelForRefundReasonRefId,
  reasonReferenceId,
}: TransactionSubmitCardProps) => {
  const intl = useIntl();
  const canSendRefund = canSendRefundDuringReturn({
    autoGrantRefund,
    transactions,
  });

  // The API rejects a staff-issued refund without a reason reference once a reason
  // Model Type is configured, so require the pick before submitting.
  const reasonReferenceMissing = isRefundReasonReferenceMissing({
    autoGrantRefund,
    modelForRefundReasonRefId,
    reasonReferenceId,
  });

  const isSubmitDisabled =
    (!transactionId && autoGrantRefund) || reasonReferenceMissing || disabled;

  return (
    <div>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>
            {intl.formatMessage(submitCardMessages.cardTitle)}
          </DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content display="flex" flexDirection="column" gap={2} alignItems="start">
          <Box display="flex" gap={1} alignItems="center" marginBottom={4}>
            <Info size={iconSize.small} strokeWidth={iconStrokeWidth} />
            <Text color="default2">
              <FormattedMessage {...submitCardMessages.descrption} />
            </Text>
          </Box>
          <GrantRefundCheckbox
            autoGrantRefund={autoGrantRefund}
            grantRefundErrors={grantRefundErrors}
            onChange={onChange}
          />
          {autoGrantRefund && (
            <TransactionSelector
              transactions={transactions}
              onChange={onChange}
              value={transactionId}
            />
          )}
          {autoGrantRefund && !!modelForRefundReasonRefId && (
            <Box display="flex" flexDirection="column" gap={1} width="100%">
              <Text fontWeight="medium">
                <FormattedMessage {...refundReasonPickerMessages.cardTitle} />
              </Text>
              <RefundReasonPicker
                referenceModelTypeId={modelForRefundReasonRefId}
                value={reasonReferenceId}
                onChange={value =>
                  onChange({
                    target: { name: "reasonReferenceId", value },
                  })
                }
              />
            </Box>
          )}
          <SendRefundCheckbox
            canSendRefund={canSendRefund}
            autoSendRefund={autoSendRefund}
            sendRefundErrors={sendRefundErrors}
            onChange={onChange}
          />
          <RefundShipmentCheckbox
            refundShipmentCosts={refundShipmentCosts}
            canRefundShipping={canRefundShipping}
            autoGrantRefund={autoGrantRefund}
            shipmentCost={amountData?.shipmentCost}
            onChange={onChange}
          />
          <PriceField
            label={intl.formatMessage(submitCardMessages.returnRefundValueLabel)}
            onChange={e => onAmountChange(e.target.value)}
            name="amount"
            value={getReturnRefundValue({
              autoGrantRefund,
              isAmountDirty,
              customRefundValue,
              amountData,
            })}
            currencySymbol={amountData?.refundTotalAmount?.currency}
            disabled={!autoGrantRefund}
            width="100%"
          />
          <ConfirmButton
            data-test-id="return-submit-button"
            transitionState={submitStatus}
            disabled={isSubmitDisabled}
            variant="primary"
            onClick={onSubmit}
            width="100%"
            marginTop={4}
          >
            <FormattedMessage {...submitCardMessages.submitButton} />
          </ConfirmButton>
        </DashboardCard.Content>
      </DashboardCard>
    </div>
  );
};
