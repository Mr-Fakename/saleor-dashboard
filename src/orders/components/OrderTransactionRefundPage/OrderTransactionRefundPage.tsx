import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Link from "@dashboard/components/Link";
import { Pill } from "@dashboard/components/Pill";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
import { useCustomSidebarBreakpoint } from "@dashboard/components/Sidebar/SidebarContext";
import { OrderDetailsGrantRefundFragment, PermissionEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { pageListUrl } from "@dashboard/modeling/urls";
import { refundReasonPickerMessages } from "@dashboard/orders/components/RefundReasonPicker/messages";
import { RefundReasonPicker } from "@dashboard/orders/components/RefundReasonPicker/RefundReasonPicker";
import { refundReasonSelectHelperMessages } from "@dashboard/orders/messages";
import { rippleNewRefundReasons } from "@dashboard/orders/ripples/newRefundReasons";
import { orderUrl } from "@dashboard/orders/urls";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { Control, SubmitHandler, useController, useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { RefundWithLinesOrderTransactionReason } from "./components/OrderTransactionReason/RefundWithLinesOrderTransactionReason";
import { OrderTransactionReasonModal } from "./components/OrderTransactionReasonModal/OrderTransactionReasonModal";
import { OrderTransactionSummary } from "./components/OrderTransactionRefundSummary/OrderTransactionSummary";
import {
  OrderRefundTransactionDatagridError,
  OrderTransactionRefundTable,
} from "./components/OrderTransactionRefundTable/OrderTransactionRefundTable";
import { OrderTransactionTiles } from "./components/OrderTransactionTiles/OrderTransactionTiles";
import { getRefundFormDefaultValues } from "./formDefaults";
import { orderTransactionRefundMessages as messages } from "./messages";
import {
  canRefundShipping,
  getRefundFormSubmitBehavior,
  getRefundStatusColor,
  getRefundStatusLabel,
  getRefundViewTitle,
  getSelectedProductsValue,
  handleLinesToRefundChange,
  handleReasonChange,
  RefundQuantityChange,
  useRecalculateTotalAmount,
} from "./utils";

export interface OrderTransactionRefundError {
  field: string;
  message: string;
  code: string;
  lines: Array<{
    field: string;
    message: string;
    code: string;
    lineId: string;
  }>;
}
interface OrderTransactionRefundPageProps {
  errors: OrderTransactionRefundError[];
  order: OrderDetailsGrantRefundFragment | null | undefined;
  draftRefund?: OrderDetailsGrantRefundFragment["grantedRefunds"][0];
  disabled: boolean;
  onSaveDraft: (submitData: OrderTransactionRefundPageFormData) => SubmitPromise;
  onTransferFunds?: () => void;
  onSaveDraftState: ConfirmButtonTransitionState;
  onTransferFundsState?: ConfirmButtonTransitionState;
  modelForRefundReasonRefId: string | null;
}

export interface LineToRefund {
  quantity: number | string;
  reason: string;
}

export interface OrderTransactionRefundPageFormData {
  linesToRefund: LineToRefund[];
  amount: number | undefined;
  includeShipping: boolean;
  reason: string;
  transactionId: string;
  reasonReference: string;
}

type ModelPickerProps = {
  referenceModelTypeId: string;
  control: Control<OrderTransactionRefundPageFormData>;
  disabled: boolean;
};

const ModelsPicker = (props: ModelPickerProps) => {
  const { field, fieldState } = useController({
    name: "reasonReference",
    control: props.control,
  });

  return (
    <RefundReasonPicker
      referenceModelTypeId={props.referenceModelTypeId}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      name={field.name}
      disabled={props.disabled}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
};

const OrderTransactionRefundPage = ({
  errors,
  order,
  draftRefund,
  disabled,
  onSaveDraft,
  onTransferFunds,
  onSaveDraftState,
  onTransferFundsState,
  modelForRefundReasonRefId,
}: OrderTransactionRefundPageProps) => {
  const navigate = useNavigator();
  const intl = useIntl();

  // Use wider breakpoint to show minimal sidebar and give more horizontal space for the transaction table
  useCustomSidebarBreakpoint("wide");

  const [editedRefundLineIndex, setEditedRefundLineIndex] = useState<number | null>(null);

  const datagridErrors: OrderRefundTransactionDatagridError[] = errors
    .filter(err => err.field === "lines" || err.field === "addLines")
    .flatMap(error => error?.lines)
    .filter(Boolean);

  const amountError = errors.find(error => error.field === "amount");

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    getValues,
    getFieldState,
    setError,
    clearErrors,
    formState: { isDirty, errors: formErrors },
  } = useForm<OrderTransactionRefundPageFormData>({
    values: getRefundFormDefaultValues({ order, draftRefund }),
  });

  const { fields: refundFields, update: refundFieldsUpdate } = useFieldArray({
    name: "linesToRefund",
    control,
  });

  const permissions = useUserPermissions();
  const canHandlePayments = hasPermissions(permissions ?? [], [PermissionEnum.HANDLE_PAYMENTS]);
  const canManageSettings = hasPermissions(permissions ?? [], [PermissionEnum.MANAGE_SETTINGS]);

  const handleTransferFunds = (data: OrderTransactionRefundPageFormData) => {
    if (!data.amount) {
      setError("amount", {
        type: "custom",
        message: intl.formatMessage(messages.amountError),
      });

      return;
    }

    onTransferFunds?.();
  };

  const handleSaveDraft = (data: OrderTransactionRefundPageFormData) => {
    // When a refund-reason Model Type is configured, the API rejects staff-issued refunds
    // without a reason reference - block here so the user gets a field error, not an API error.
    if (modelForRefundReasonRefId && !data.reasonReference) {
      setError("reasonReference", {
        type: "custom",
        message: intl.formatMessage(refundReasonPickerMessages.required),
      });

      return;
    }

    clearErrors("reasonReference");

    onSaveDraft({
      ...data,
      amount: getFieldState("amount").isDirty ? data.amount : undefined,
    });
  };

  const submitBehavior = getRefundFormSubmitBehavior({
    canHandlePayments,
    isDirty,
    isEdit: !!draftRefund,
    onTransferFunds: handleTransferFunds,
    onSaveDraft: handleSaveDraft,
    onSaveDraftState,
    onTransferFundsState,
    intl,
  });

  const onSubmit: SubmitHandler<OrderTransactionRefundPageFormData> = data => {
    submitBehavior.onSubmit(data);
  };

  const linesToRefund = watch("linesToRefund");
  const includeShipping = watch("includeShipping");

  const selectedProductsValue =
    getSelectedProductsValue({
      linesToRefund,
      order,
    }) ?? 0;

  useRecalculateTotalAmount({
    getValues,
    includeShipping,
    order,
    linesToRefund,
    setValue,
    selectedProductsValue,
    isFormDirty: isDirty,
  });

  const onLinesToRefundChange = (data: RefundQuantityChange, index: number) => {
    handleLinesToRefundChange({
      data,
      index,
      linesToRefund,
      setValue,
    });
  };

  const onReasonChange = (reason: string, index: number) => {
    handleReasonChange({
      reason,
      index,
      linesToRefund,
      refundFieldsUpdate,
    });
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <Box as="form" display="contents" onSubmit={handleSubmit(onSubmit)}>
        <TopNav href={orderUrl(order?.id ?? "")} title={getRefundViewTitle(draftRefund, intl)}>
          {draftRefund && (
            <Pill
              color={getRefundStatusColor(draftRefund.status)}
              label={getRefundStatusLabel(draftRefund.status, intl).toLocaleUpperCase()}
            />
          )}
        </TopNav>
        <DetailPageLayout.Content>
          <DashboardCard>
            <DashboardCard.Content marginBottom={5}>
              <Text fontWeight="medium" as="p" marginTop={5}>
                <FormattedMessage {...messages.selectQuantitiesToRefund} />
              </Text>
            </DashboardCard.Content>
          </DashboardCard>
          <DashboardCard paddingX={6}>
            <OrderTransactionRefundTable
              errors={datagridErrors}
              order={order}
              draftRefund={draftRefund}
              control={control}
              onChange={onLinesToRefundChange}
              onEditReasonModal={setEditedRefundLineIndex}
              linesToRefund={linesToRefund}
              refundFields={refundFields}
              refundFieldsUpdate={refundFieldsUpdate}
            />
          </DashboardCard>
          <DashboardCard marginBottom={5}>
            <DashboardCard.Content>
              <Text fontWeight="medium" as="p" marginTop={5}>
                <FormattedMessage {...messages.selectTransactionToRefund} />
              </Text>
            </DashboardCard.Content>
          </DashboardCard>
          <OrderTransactionTiles transactions={order?.transactions} control={control} />
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar
          gridRow={{
            mobile: "6",
            tablet: "6",
            desktop: "full",
          }}
        >
          <Box __width="400px" display="flex" flexDirection="column" height="100%" gap={8}>
            <OrderTransactionSummary
              amountError={amountError || formErrors.amount}
              control={control}
              selectedProductsValue={selectedProductsValue}
              canRefundShipping={canRefundShipping(order, draftRefund)}
              shippingCost={order?.shippingPrice.gross}
              currency={order?.total.gross.currency}
            />
            <Box>
              <DashboardCard>
                <DashboardCard.Header>
                  <DashboardCard.Title>
                    <FormattedMessage {...refundReasonPickerMessages.cardTitle} />
                  </DashboardCard.Title>
                  <Box marginLeft={4}>
                    <Ripple model={rippleNewRefundReasons} />
                  </Box>
                </DashboardCard.Header>
                <DashboardCard.Content>
                  <ModelsPicker
                    disabled={!modelForRefundReasonRefId}
                    referenceModelTypeId={modelForRefundReasonRefId ?? ""}
                    control={control}
                  />
                  <Box marginTop={2}>
                    {canManageSettings && modelForRefundReasonRefId && (
                      <Link href={pageListUrl()}>
                        <Text color="inherit">
                          {intl.formatMessage(refundReasonSelectHelperMessages.manageReasons)}
                        </Text>
                      </Link>
                    )}
                    {canManageSettings && !modelForRefundReasonRefId && (
                      <Link href={refundsSettingsPath}>
                        <Text color="inherit">
                          {intl.formatMessage(
                            refundReasonSelectHelperMessages.enableReasonsInSettings,
                          )}
                        </Text>
                      </Link>
                    )}
                    {!canManageSettings && (
                      <Text color="default2">
                        {intl.formatMessage(refundReasonSelectHelperMessages.noPermissionsHint)}
                      </Text>
                    )}
                  </Box>
                </DashboardCard.Content>
              </DashboardCard>
            </Box>
            <Box>
              <RefundWithLinesOrderTransactionReason control={control} />
            </Box>
          </Box>
        </DetailPageLayout.RightSidebar>
        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton onClick={() => navigate(orderUrl(order?.id ?? ""))}>
            {submitBehavior.submitLabels.cancel}
          </Savebar.CancelButton>
          <Savebar.ConfirmButton
            transitionState={submitBehavior.submitState}
            onClick={handleSubmit(onSubmit)}
            disabled={disabled}
          >
            {submitBehavior.submitLabels.confirm}
          </Savebar.ConfirmButton>
        </Savebar>
        <OrderTransactionReasonModal
          open={editedRefundLineIndex !== null}
          reason={linesToRefund[editedRefundLineIndex!]?.reason}
          onClose={() => setEditedRefundLineIndex(null)}
          onConfirm={(reason: string) => {
            onReasonChange(reason, editedRefundLineIndex!);
          }}
        />
      </Box>
    </DetailPageLayout>
  );
};

export default OrderTransactionRefundPage;
