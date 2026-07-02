import { useHomePageOrderCountsQuery, useWelcomePageNotificationsQuery } from "@dashboard/graphql";

import { useHomePageContext } from "../HomePageContext";

export const LOW_STOCK_THRESHOLD = 3;

export interface StockAlertProduct {
  id: string;
  name: string;
  totalStock: number;
}

export const useHomeKpiData = () => {
  const { selectedChannel, hasNoChannels, hasPermissionToManageOrders } = useHomePageContext();

  const channelSlug = selectedChannel?.slug ?? "";

  const { data: orderData, loading: orderLoading } = useHomePageOrderCountsQuery({
    skip: hasNoChannels,
    variables: {
      channel: channelSlug,
      hasPermissionToManageOrders,
    },
  });

  const { data: stockData, loading: stockLoading } = useWelcomePageNotificationsQuery({
    skip: hasNoChannels,
    variables: { channel: channelSlug, lowStockThreshold: LOW_STOCK_THRESHOLD },
  });

  const outOfStockProducts: StockAlertProduct[] =
    stockData?.productsOutOfStock?.edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      totalStock: 0,
    })) ?? [];

  const lowStockProducts: StockAlertProduct[] =
    stockData?.productsLowStock?.edges
      .map(({ node }) => ({
        id: node.id,
        name: node.name,
        totalStock:
          node.variants?.reduce(
            (variantSum, variant) =>
              variantSum +
              (variant.stocks?.reduce((stockSum, stock) => stockSum + stock.quantity, 0) ?? 0),
            0,
          ) ?? 0,
      }))
      // A product can pass the stocks-filter yet aggregate above the threshold
      // (e.g. low stock in one warehouse but plenty in others). Keep only the
      // ones whose total is actually low to avoid false alarms.
      .filter(product => product.totalStock > 0 && product.totalStock <= LOW_STOCK_THRESHOLD) ?? [];

  return {
    data: {
      salesToday: orderData?.ordersToday?.gross ?? null,
      salesThisMonth: orderData?.ordersThisMonth?.gross ?? null,
      ordersUnfulfilled: orderData?.ordersUnfulfilled?.totalCount ?? 0,
      ordersUnconfirmed: orderData?.ordersUnconfirmed?.totalCount ?? 0,
      ordersPartiallyFulfilled: orderData?.ordersPartiallyFulfilled?.totalCount ?? 0,
      ordersReadyToCapture: orderData?.ordersReadyToCapture?.totalCount ?? 0,
      productsOutOfStock: stockData?.productsOutOfStock?.totalCount ?? 0,
      productsLowStock: lowStockProducts.length,
      outOfStockProducts,
      lowStockProducts,
    },
    loading: orderLoading || stockLoading,
  };
};
