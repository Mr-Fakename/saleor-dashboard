import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";

import { HomeActivityCard } from "./HomeActivityCard/HomeActivityCard";
import { HomeKpiCards } from "./HomeKpiCards/HomeKpiCards";
import { HomeOrdersCard } from "./HomeOrdersCard/HomeOrdersCard";
import { HomePageContext } from "./HomePageContext";
import { HomeStockCard } from "./HomeStockCard/HomeStockCard";
import { WelcomePageTitle } from "./WelcomePageTitle";

export const WelcomePage = () => {
  const { channel, setChannel } = useAppChannel(false);
  const { user } = useUser();
  const channels = user?.accessibleChannels ?? [];
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);
  const hasNoChannels = !channel && typeof channel !== "undefined";

  return (
    <HomePageContext.Provider
      value={{
        selectedChannel: channel,
        setChannel,
        channels,
        hasNoChannels,
        hasPermissionToManageOrders,
      }}
    >
      <Box display="flex" flexDirection="column" gap={6} paddingX={8} paddingY={6} paddingTop={9}>
        <WelcomePageTitle />

        <HomeKpiCards />

        <Box
          display="grid"
          gap={6}
          gridTemplateColumns={{
            mobile: 1,
            tablet: 1,
            desktop: 2,
          }}
        >
          <HomeOrdersCard />
          <HomeActivityCard />
        </Box>

        <HomeStockCard />
      </Box>
    </HomePageContext.Provider>
  );
};
