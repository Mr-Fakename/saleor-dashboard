import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { useWelcomePageNotificationsQuery } from "@dashboard/graphql";

import { LOW_STOCK_THRESHOLD } from "../../../HomeKpiCards/useHomeKpiData";

export const useWelcomePageStocksAnalytics = () => {
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";

  const {
    data: welcomePageNotificationsData,
    loading: welcomePageNotificationsLoading,
    error: welcomePageNotificationsError,
  } = useWelcomePageNotificationsQuery({
    skip: noChannel,
    variables: { channel: channel?.slug, lowStockThreshold: LOW_STOCK_THRESHOLD },
  });

  return {
    analytics: {
      productsOutOfStock: welcomePageNotificationsData?.productsOutOfStock?.totalCount ?? 0,
    },
    loading: welcomePageNotificationsLoading,
    hasError: !!welcomePageNotificationsError,
  };
};
