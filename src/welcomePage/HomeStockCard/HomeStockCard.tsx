import { DashboardCard } from "@dashboard/components/Card";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productListPath } from "@dashboard/products/urls";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { useHomeKpiData } from "../HomeKpiCards/useHomeKpiData";
import { homePageMessages } from "../messages";

export const HomeStockCard = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { data, loading } = useHomeKpiData();

  return (
    <DashboardCard
      borderRadius={3}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      data-test-id="home-stock-card"
    >
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...homePageMessages.lowStockProducts} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {loading ? (
          <Box paddingBottom={4}>
            <Skeleton height={4} width={16} />
          </Box>
        ) : data.productsOutOfStock > 0 ? (
          <Box display="flex" alignItems="center" gap={3} paddingBottom={4}>
            <AlertTriangle size={20} color="var(--macaw-palette-statusCriticalDefault)" />
            <Text size={4}>
              {intl.formatMessage(homePageMessages.products, {
                count: data.productsOutOfStock,
              })}
            </Text>
          </Box>
        ) : (
          <Box paddingBottom={4}>
            <Text size={3} color="default2">
              <FormattedMessage
                id="a0bTfE"
                defaultMessage="All products are in stock"
                description="message when no products are out of stock"
              />
            </Text>
          </Box>
        )}
      </DashboardCard.Content>
      <DashboardCard.BottomActions>
        <Button variant="tertiary" size="small" onClick={() => navigate(productListPath)}>
          <FormattedMessage
            id="HNh09O"
            defaultMessage="View products"
            description="link to products list"
          />
          <ChevronRight size={16} />
        </Button>
      </DashboardCard.BottomActions>
    </DashboardCard>
  );
};
