import { ChannelFragment } from "@dashboard/graphql";
import { createContext, useContext } from "react";

export interface HomePageContextValue {
  selectedChannel: ChannelFragment | undefined;
  setChannel: (channelId: string) => void;
  channels: ChannelFragment[];
  hasNoChannels: boolean;
  hasPermissionToManageOrders: boolean;
}

export const HomePageContext = createContext<HomePageContextValue | null>(null);

export const useHomePageContext = () => {
  const context = useContext(HomePageContext);

  if (!context) {
    throw new Error(
      "HomePageContext is null. Make sure your component is wrapped in a <HomePageContext.Provider>",
    );
  }

  return context;
};
