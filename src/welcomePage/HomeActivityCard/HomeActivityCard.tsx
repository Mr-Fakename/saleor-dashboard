import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date/DateTime";
import { useWelcomePageActivitiesQuery } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, List, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { useHomePageContext } from "../HomePageContext";
import { homePageMessages } from "../messages";
import { getActivityMessage } from "../WelcomePageSidebar/components/WelcomePageActivities/activityMessages";

export const HomeActivityCard = () => {
  const intl = useIntl();
  const { hasNoChannels, hasPermissionToManageOrders } = useHomePageContext();

  const { data, loading, error } = useWelcomePageActivitiesQuery({
    skip: hasNoChannels,
    variables: {
      hasPermissionToManageOrders,
    },
  });

  const activities = mapEdgesToItems(data?.activities)?.reverse();

  if (!hasPermissionToManageOrders) {
    return null;
  }

  const title = intl.formatMessage(homePageMessages.activity);

  if (error) {
    return (
      <DashboardCard
        borderRadius={3}
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        data-test-id="home-activity-card"
      >
        <DashboardCard.Header>
          <DashboardCard.Title>{title}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content>
          <Text color="default2">
            <FormattedMessage {...homePageMessages.activityError} />
          </Text>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  if (loading) {
    return (
      <DashboardCard
        borderRadius={3}
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        data-test-id="home-activity-card"
      >
        <DashboardCard.Header>
          <DashboardCard.Title>{title}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content paddingBottom={6}>
          <Box display="flex" flexDirection="column" gap={5}>
            <Skeleton height={3} />
            <Skeleton __width="80%" height={3} />
            <Skeleton height={3} />
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      borderRadius={3}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      data-test-id="home-activity-card"
    >
      <DashboardCard.Header>
        <DashboardCard.Title>{title}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content paddingBottom={5}>
        <List>
          {renderCollection(
            activities,
            (activity, activityId) => (
              <List.Item
                key={activityId}
                flexDirection="column"
                alignItems="flex-start"
                cursor="auto"
                paddingY={1}
                marginBottom={2}
                backgroundColor={{
                  default: "transparent",
                  hover: "default1Hovered",
                }}
                borderRadius={2}
              >
                {activity ? (
                  <>
                    <Text size={3}>{getActivityMessage(activity, intl)}</Text>
                    <Text size={2} color="default2">
                      <DateTime date={activity.date} plain />
                    </Text>
                  </>
                ) : (
                  <Box paddingY={4}>
                    <Skeleton />
                  </Box>
                )}
              </List.Item>
            ),
            () => (
              <Box paddingY={4}>
                <Text size={3} color="default2">
                  <FormattedMessage {...homePageMessages.noActivities} />
                </Text>
              </Box>
            ),
          )}
        </List>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
