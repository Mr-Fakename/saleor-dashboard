import { OrderChargeStatusEnum } from "@dashboard/graphql";

/**
 * The storefront stamps the chosen payment method on the order when the customer picks
 * bank transfer instead of paying by card. Such an order is created deliberately unpaid
 * (the channel allows it) and waits for the transfer to land - which reads as "payment
 * refused but order accepted" unless the UI says so.
 */
export const PAYMENT_METHOD_METADATA_KEY = "payment_method";
export const BANK_TRANSFER_PAYMENT_METHOD = "bank_transfer";

interface MetadataItem {
  key: string;
  value: string;
}

interface AwaitingBankTransferArgs {
  metadata?: MetadataItem[] | null;
  chargeStatus?: OrderChargeStatusEnum | null;
}

export const isAwaitingBankTransfer = ({
  metadata,
  chargeStatus,
}: AwaitingBankTransferArgs): boolean => {
  const paidStatuses: Array<OrderChargeStatusEnum | null | undefined> = [
    OrderChargeStatusEnum.FULL,
    OrderChargeStatusEnum.OVERCHARGED,
  ];

  if (paidStatuses.includes(chargeStatus)) {
    return false;
  }

  return !!metadata?.some(
    ({ key, value }) =>
      key === PAYMENT_METHOD_METADATA_KEY && value === BANK_TRANSFER_PAYMENT_METHOD,
  );
};
