import { TransactionItemFragment } from "@dashboard/graphql";
import { orderTransactions } from "@dashboard/orders/fixtures";
import { IntlShape } from "react-intl";

import { getValidationSchema } from "./manualRefundValidationSchema";

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
} as IntlShape;

const transaction: TransactionItemFragment = {
  ...orderTransactions[0],
  chargedAmount: { __typename: "Money", amount: 100, currency: "EUR" },
};

const formData = {
  transationId: transaction.id,
  amount: 10,
  reason: "",
  reasonReferenceId: "",
};

describe("manualRefundValidationSchema", () => {
  it("accepts an empty reason reference when refund reasons are not configured", () => {
    // Arrange
    const schema = getValidationSchema(intl, [transaction], false);

    // Act
    const result = schema.safeParse(formData);

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an empty reason reference when refund reasons are configured", () => {
    // Arrange
    const schema = getValidationSchema(intl, [transaction], true);

    // Act
    const result = schema.safeParse(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.success === false && result.error.issues[0].path).toEqual(["reasonReferenceId"]);
  });

  it("accepts a picked reason reference when refund reasons are configured", () => {
    // Arrange
    const schema = getValidationSchema(intl, [transaction], true);

    // Act
    const result = schema.safeParse({ ...formData, reasonReferenceId: "UGFnZTo0Mg==" });

    // Assert
    expect(result.success).toBe(true);
  });
});
