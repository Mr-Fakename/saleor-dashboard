import AppChannelSelect from "@dashboard/components/AppLayout/AppChannelSelect";
import Money from "@dashboard/components/Money";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { useHomePageContext } from "../HomePageContext";
import { homePageMessages } from "../messages";
import { useHomeKpiData } from "./useHomeKpiData";

export const HomeKpiCards = () => {
  const intl = useIntl();
  const { channels, selectedChannel, setChannel } = useHomePageContext();
  const { data, loading } = useHomeKpiData();

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Text size={5} fontWeight="bold" color="default2">
          <FormattedMessage {...homePageMessages.today} />
        </Text>
        <AppChannelSelect
          channels={channels}
          selectedChannelId={selectedChannel?.id ?? ""}
          onChannelSelect={setChannel}
        />
      </Box>
      <Box display="grid" gap={4} __gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))">
        <KpiCard
          title={intl.formatMessage(homePageMessages.revenueToday)}
          testId="kpi-revenue-today"
          loading={loading}
        >
          {data.salesToday ? (
            <Money money={data.salesToday} />
          ) : (
            <Text size={7} fontWeight="bold">
              —
            </Text>
          )}
        </KpiCard>

        <KpiCard
          title={intl.formatMessage(homePageMessages.revenueThisMonth)}
          testId="kpi-revenue-month"
          loading={loading}
        >
          {data.salesThisMonth ? (
            <Money money={data.salesThisMonth} />
          ) : (
            <Text size={7} fontWeight="bold">
              —
            </Text>
          )}
        </KpiCard>

        <KpiCard
          title={intl.formatMessage(homePageMessages.ordersReadyToFulfill)}
          testId="kpi-orders-unfulfilled"
          loading={loading}
        >
          <Text size={7} fontWeight="bold">
            {data.ordersUnfulfilled}
          </Text>
        </KpiCard>

        <KpiCard
          title={intl.formatMessage(homePageMessages.outOfStock)}
          testId="kpi-out-of-stock"
          loading={loading}
        >
          <Text size={7} fontWeight="bold">
            {data.productsOutOfStock}
          </Text>
        </KpiCard>
      </Box>
    </Box>
  );
};

interface KpiCardProps {
  title: string;
  testId: string;
  loading: boolean;
  children: React.ReactNode;
}

const KpiCard = ({ title, testId, loading, children }: KpiCardProps) => (
  <Box
    borderWidth={1}
    borderStyle="solid"
    borderColor="default1"
    borderRadius={3}
    paddingX={5}
    paddingY={5}
    display="flex"
    flexDirection="column"
    gap={2}
    data-test-id={testId}
  >
    <Text size={3} color="default2">
      {title}
    </Text>
    {loading ? (
      <Skeleton height={4} width={16} />
    ) : (
      <Box __fontSize="1.5rem" __lineHeight="1.2">
        {children}
      </Box>
    )}
  </Box>
);
