import { DashboardCard } from "@dashboard/components/Card";
import { StockAvailability } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productListUrl, productUrl } from "@dashboard/products/urls";
import { Box, Button, List, Skeleton, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, ChevronRight, PackageX } from "lucide-react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import {
  LOW_STOCK_THRESHOLD,
  StockAlertProduct,
  useHomeKpiData,
} from "../HomeKpiCards/useHomeKpiData";
import { homePageMessages } from "../messages";

export const HomeStockCard = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { data, loading } = useHomeKpiData();

  const lowStockProducts = data.lowStockProducts;
  const outOfStockProducts = data.outOfStockProducts;
  const outOfStockTotal = data.productsOutOfStock;
  const lowStockTotal = data.productsLowStock;

  const hasAlerts = outOfStockProducts.length > 0 || lowStockProducts.length > 0;

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
          <FormattedMessage {...homePageMessages.stockAlertsTitle} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {loading ? (
          <Box display="flex" flexDirection="column" gap={4} paddingBottom={4}>
            <Skeleton height={3} />
            <Skeleton height={3} __width="80%" />
            <Skeleton height={3} __width="60%" />
          </Box>
        ) : !hasAlerts ? (
          <Box paddingY={4}>
            <Text size={3} color="default2">
              <FormattedMessage {...homePageMessages.allStockHealthy} />
            </Text>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={5}>
            {lowStockProducts.length > 0 && (
              <StockAlertSection
                testId="low-stock-section"
                titleMessage={homePageMessages.runningLowSection}
                hint={intl.formatMessage(homePageMessages.lowStockThresholdHint, {
                  threshold: LOW_STOCK_THRESHOLD,
                })}
                products={lowStockProducts}
                totalCount={lowStockTotal}
                onProductClick={id => navigate(productUrl(id))}
                renderBadge={product => (
                  <Box display="flex" alignItems="center" gap={2}>
                    <AlertTriangle size={14} color="var(--macaw-palette-statusWarningDefault)" />
                    <Text size={2} color="warning1">
                      {intl.formatMessage(homePageMessages.unitsRemaining, {
                        count: product.totalStock,
                      })}
                    </Text>
                  </Box>
                )}
              />
            )}
            {outOfStockProducts.length > 0 && (
              <StockAlertSection
                testId="out-of-stock-section"
                titleMessage={homePageMessages.outOfStockSection}
                products={outOfStockProducts}
                totalCount={outOfStockTotal}
                onProductClick={id => navigate(productUrl(id))}
                renderBadge={() => (
                  <Box display="flex" alignItems="center" gap={2}>
                    <PackageX size={14} color="var(--macaw-palette-statusCriticalDefault)" />
                    <Text size={2} color="critical1">
                      <FormattedMessage {...homePageMessages.outOfStockSection} />
                    </Text>
                  </Box>
                )}
              />
            )}
          </Box>
        )}
      </DashboardCard.Content>
      <DashboardCard.BottomActions>
        <Button
          variant="tertiary"
          size="small"
          onClick={() => navigate(productListUrl({ stockStatus: StockAvailability.OUT_OF_STOCK }))}
        >
          <FormattedMessage {...homePageMessages.viewAllOutOfStock} />
          <ChevronRight size={16} />
        </Button>
      </DashboardCard.BottomActions>
    </DashboardCard>
  );
};

interface StockAlertSectionProps {
  testId: string;
  titleMessage: MessageDescriptor;
  hint?: string;
  products: StockAlertProduct[];
  totalCount: number;
  onProductClick: (id: string) => void;
  renderBadge: (product: StockAlertProduct) => React.ReactNode;
}

const StockAlertSection = ({
  testId,
  titleMessage,
  hint,
  products,
  totalCount,
  onProductClick,
  renderBadge,
}: StockAlertSectionProps) => {
  const remaining = Math.max(totalCount - products.length, 0);

  return (
    <Box display="flex" flexDirection="column" gap={2} data-test-id={testId}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={3} fontWeight="bold" color="default2">
          <FormattedMessage {...titleMessage} />
        </Text>
        {hint && (
          <Text size={2} color="default2">
            {hint}
          </Text>
        )}
      </Box>
      <List>
        {products.map(product => (
          <List.Item
            key={product.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingY={3}
            paddingX={3}
            cursor="pointer"
            backgroundColor={{
              default: "transparent",
              hover: "default1Hovered",
            }}
            borderRadius={2}
            onClick={() => onProductClick(product.id)}
            data-test-id="stock-alert-row"
          >
            <Text size={3} __overflow="hidden" __textOverflow="ellipsis" __whiteSpace="nowrap">
              {product.name}
            </Text>
            {renderBadge(product)}
          </List.Item>
        ))}
      </List>
      {remaining > 0 && (
        <Text size={2} color="default2">
          <FormattedMessage {...homePageMessages.andMoreItems} values={{ count: remaining }} />
        </Text>
      )}
    </Box>
  );
};
