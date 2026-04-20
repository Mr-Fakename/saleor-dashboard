import { useHomePageOrderCountsQuery, useWelcomePageNotificationsQuery } from "@dashboard/graphql";

import { useHomePageContext } from "../HomePageContext";

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
    variables: { channel: channelSlug },
  });

  return {
    data: {
      salesToday: orderData?.ordersToday?.gross ?? null,
      salesThisMonth: orderData?.ordersThisMonth?.gross ?? null,
      ordersUnfulfilled: orderData?.ordersUnfulfilled?.totalCount ?? 0,
      ordersUnconfirmed: orderData?.ordersUnconfirmed?.totalCount ?? 0,
      ordersPartiallyFulfilled: orderData?.ordersPartiallyFulfilled?.totalCount ?? 0,
      ordersReadyToCapture: orderData?.ordersReadyToCapture?.totalCount ?? 0,
      productsOutOfStock: stockData?.productsOutOfStock?.totalCount ?? 0,
    },
    loading: orderLoading || stockLoading,
  };
};
