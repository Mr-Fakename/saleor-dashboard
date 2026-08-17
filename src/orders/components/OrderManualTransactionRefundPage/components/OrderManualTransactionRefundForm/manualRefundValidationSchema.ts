import { TransactionItemFragment } from "@dashboard/graphql";
import { refundReasonPickerMessages } from "@dashboard/orders/components/RefundReasonPicker/messages";
import { IntlShape } from "react-intl";
import { z } from "zod";

import { validationMessages } from "../../messages";

export const getValidationSchema = (
  intl: IntlShape,
  transactions: TransactionItemFragment[],
  /**
   * True when a refund-reason Model Type is configured. The API then rejects staff-issued
   * refunds without a reason reference, so catch it in the form instead of showing a raw
   * API error.
   */
  isReasonReferenceRequired = false,
) =>
  z
    .object({
      transationId: z.string().min(1, {
        message: intl.formatMessage(validationMessages.transactionIdRequired),
      }),
      amount: z.coerce.number().positive({
        message: intl.formatMessage(validationMessages.amountRequired),
      }),
      reason: z.string(),
      reasonReferenceId: isReasonReferenceRequired
        ? z.string().min(1, {
            message: intl.formatMessage(refundReasonPickerMessages.required),
          })
        : z.string(),
    })
    .refine(
      data => {
        const selectedTransaction = transactions.find(
          transaction => transaction.id === data.transationId,
        );

        if (!selectedTransaction) {
          return true;
        }

        return data.amount <= selectedTransaction.chargedAmount.amount;
      },
      {
        message: intl.formatMessage(validationMessages.amountExceedsChargedAmount),
        path: ["amount"],
      },
    );

export type ManualRefundForm = z.infer<ReturnType<typeof getValidationSchema>>;
