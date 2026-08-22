import { OrderChargeStatusEnum } from "@dashboard/graphql";

import { isAwaitingBankTransfer } from "./awaitingBankTransfer";

const bankTransferMetadata = [
  { key: "payment_method", value: "bank_transfer" },
  { key: "b2b_reverse_charge", value: "false" },
];

describe("isAwaitingBankTransfer", () => {
  it("flags an unpaid order the customer chose to pay by transfer", () => {
    // Arrange
    const order = {
      metadata: bankTransferMetadata,
      chargeStatus: OrderChargeStatusEnum.NONE,
    };

    // Act
    const result = isAwaitingBankTransfer(order);

    // Assert
    expect(result).toBe(true);
  });

  it("stops flagging once the transfer has been collected", () => {
    // Arrange
    const order = {
      metadata: bankTransferMetadata,
      chargeStatus: OrderChargeStatusEnum.FULL,
    };

    // Act
    const result = isAwaitingBankTransfer(order);

    // Assert
    expect(result).toBe(false);
  });

  it("does not flag a partially collected transfer as paid", () => {
    // Arrange
    const order = {
      metadata: bankTransferMetadata,
      chargeStatus: OrderChargeStatusEnum.PARTIAL,
    };

    // Act
    const result = isAwaitingBankTransfer(order);

    // Assert
    expect(result).toBe(true);
  });

  it("leaves a card order that simply failed to pay alone", () => {
    // Arrange
    const order = {
      metadata: [{ key: "b2b_reverse_charge", value: "false" }],
      chargeStatus: OrderChargeStatusEnum.NONE,
    };

    // Act
    const result = isAwaitingBankTransfer(order);

    // Assert
    expect(result).toBe(false);
  });

  it("handles orders with no metadata at all", () => {
    // Arrange & Act
    const result = isAwaitingBankTransfer({ chargeStatus: OrderChargeStatusEnum.NONE });

    // Assert
    expect(result).toBe(false);
  });
});
