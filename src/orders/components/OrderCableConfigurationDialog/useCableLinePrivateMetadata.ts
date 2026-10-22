import { useOrderLinesMetadataLazyQuery } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";
import { useEffect } from "react";

import { MetadataItem } from "./cableConfiguration";

export type CableLinePrivateMetadata =
  | { state: "loading" }
  | { state: "error" }
  | { state: "ready"; privateMetadata: MetadataItem[] };

interface UseCableLinePrivateMetadataArgs {
  orderId: string;
  lineId: string | undefined;
  open: boolean;
}

/**
 * Private metadata of one order line, for the cable verification (NR-33).
 * Reuses the order-line metadata query of OrderLineMetadataDialog (no extra
 * codegen); always asks the network so a verdict never rests on a stale cache.
 */
export const useCableLinePrivateMetadata = ({
  orderId,
  lineId,
  open,
}: UseCableLinePrivateMetadataArgs): CableLinePrivateMetadata => {
  const hasManageProducts = useHasManageProductsPermission();
  const [fetchLines, { data, error, loading, called }] = useOrderLinesMetadataLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (open && orderId && lineId) {
      fetchLines({ variables: { id: orderId, hasManageProducts } });
    }
  }, [fetchLines, hasManageProducts, lineId, open, orderId]);

  if (error) {
    return { state: "error" };
  }

  if (!called || loading || !data) {
    return { state: "loading" };
  }

  const line = data.order?.lines.find(orderLine => orderLine.id === lineId);

  return line ? { state: "ready", privateMetadata: line.privateMetadata } : { state: "error" };
};
