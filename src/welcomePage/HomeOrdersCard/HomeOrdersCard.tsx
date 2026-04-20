import { DashboardCard } from "@dashboard/components/Card";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderListPath } from "@dashboard/orders/urls";
import { Box, Button, List, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { useHomeKpiData } from "../HomeKpiCards/useHomeKpiData";
import { useHomePageContext } from "../HomePageContext";
import { homePageMessages } from "../messages";

interface OrderStatusRow {
  labelMessage: MessageDescriptor;
  count: number;
}

export const HomeOrdersCard = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { hasPermissionToManageOrders } = useHomePageContext();
  const { data, loading } = useHomeKpiData();

  if (!hasPermissionToManageOrders) {
    return null;
  }

  const statusRows: OrderStatusRow[] = [
    {
      labelMessage: homePageMessages.unfulfilled,
      count: data.ordersUnfulfilled,
    },
    {
      labelMessage: homePageMessages.unconfirmed,
      count: data.ordersUnconfirmed,
    },
    {
      labelMessage: homePageMessages.partiallyFulfilled,
      count: data.ordersPartiallyFulfilled,
    },
    {
      labelMessage: homePageMessages.readyToCapture,
      count: data.ordersReadyToCapture,
    },
  ];

  const totalAttention = statusRows.reduce((sum, row) => sum + row.count, 0);

  return (
    <DashboardCard
      borderRadius={3}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      data-test-id="orders-requiring-attention"
    >
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...homePageMessages.ordersRequiringAttention} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {loading ? (
          <Box display="flex" flexDirection="column" gap={4} paddingBottom={4}>
            <Skeleton height={3} />
            <Skeleton height={3} __width="80%" />
            <Skeleton height={3} __width="60%" />
            <Skeleton height={3} __width="70%" />
          </Box>
        ) : totalAttention === 0 ? (
          <Box paddingY={4}>
            <Text size={3} color="default2">
              <FormattedMessage {...homePageMessages.noOrdersRequiringAttention} />
            </Text>
          </Box>
        ) : (
          <List>
            {statusRows.map((row, index) => (
              <List.Item
                key={row.labelMessage.id ?? index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                paddingY={3}
                cursor="auto"
                backgroundColor={{
                  default: "transparent",
                  hover: "default1Hovered",
                }}
                borderRadius={2}
              >
                <Text size={3}>{intl.formatMessage(row.labelMessage)}</Text>
                <Text size={3} fontWeight="bold">
                  {row.count}
                </Text>
              </List.Item>
            ))}
          </List>
        )}
      </DashboardCard.Content>
      <DashboardCard.BottomActions>
        <Button variant="tertiary" size="small" onClick={() => navigate(orderListPath)}>
          <FormattedMessage {...homePageMessages.viewAllOrders} />
          <ChevronRight size={16} />
        </Button>
      </DashboardCard.BottomActions>
    </DashboardCard>
  );
};
