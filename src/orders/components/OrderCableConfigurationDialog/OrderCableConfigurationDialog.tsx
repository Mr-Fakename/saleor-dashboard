import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderLineFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { DialogProps } from "@dashboard/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Cable } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";

import { parseCableConfiguration } from "./cableConfiguration";
import { messages } from "./messages";

interface OrderCableConfigurationDialogProps extends DialogProps {
  line: OrderLineFragment | undefined;
}

const ConfigurationRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" gap={4} paddingY={1.5}>
    <Text color="default2" size={2}>
      {label}
    </Text>
    <Text size={2} fontWeight="medium" textAlign="right">
      {value}
    </Text>
  </Box>
);

export const OrderCableConfigurationDialog = ({
  line,
  open,
  onClose,
}: OrderCableConfigurationDialogProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const configuration = useMemo(() => parseCableConfiguration(line?.metadata), [line?.metadata]);

  const formatPrice = (amount: number | undefined): string => {
    if (amount === undefined) {
      return "-";
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: configuration?.currency || "EUR",
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${configuration?.currency ?? ""}`.trim();
    }
  };

  const priceRows = configuration
    ? [
        {
          key: "assembly",
          label: intl.formatMessage(messages.assemblyFee),
          amount: configuration.assemblyPrice,
        },
        {
          key: "connector1",
          label: configuration.connector1Name || intl.formatMessage(messages.connector1),
          amount: configuration.connector1Price,
        },
        {
          key: "connector2",
          label: configuration.connector2Name || intl.formatMessage(messages.connector2),
          amount: configuration.connector2Price,
        },
        {
          key: "connector3",
          label: configuration.connector3Name || intl.formatMessage(messages.connector3),
          amount: configuration.connector3Price,
        },
        {
          key: "cable",
          label: configuration.cableTypeName || intl.formatMessage(messages.cableType),
          amount: configuration.cableCharge?.amount,
          perMeterRate: configuration.cableCharge?.perMeterRate,
        },
        {
          key: "gaine",
          label: configuration.gaineName || intl.formatMessage(messages.sleeve),
          amount: configuration.gaineCharge?.amount,
          perMeterRate: configuration.gaineCharge?.perMeterRate,
        },
      ].filter(row => row.amount !== undefined && row.amount > 0)
    : [];

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          <Box display="flex" alignItems="center" gap={3}>
            <Cable size={20} />
            {intl.formatMessage(messages.dialogTitle)}
            <Box paddingX={2} paddingY={0.5} borderRadius={4} backgroundColor="default2">
              <Text size={1} fontWeight="medium">
                {configuration?.variantName || intl.formatMessage(messages.customCableBadge)}
              </Text>
            </Box>
          </Box>
        </DashboardModal.Header>

        {!configuration ? (
          <Text color="default2">{intl.formatMessage(messages.notAvailable)}</Text>
        ) : (
          <Box display="flex" flexDirection="column">
            {line && (
              <Box marginBottom={3}>
                <Text color="default2" size={2}>
                  {line.productName}
                  {line.quantity > 1 ? ` × ${line.quantity}` : ""}
                </Text>
              </Box>
            )}

            <Box
              borderWidth={1}
              borderStyle="solid"
              borderColor="default1"
              borderRadius={4}
              paddingX={4}
              paddingY={2}
            >
              <ConfigurationRow
                label={intl.formatMessage(messages.connector1)}
                value={configuration.connector1Name || "-"}
              />
              <ConfigurationRow
                label={intl.formatMessage(messages.connector2)}
                value={configuration.connector2Name || "-"}
              />
              {configuration.connector3Name && (
                <ConfigurationRow
                  label={intl.formatMessage(messages.connector3)}
                  value={configuration.connector3Name}
                />
              )}
              <ConfigurationRow
                label={intl.formatMessage(messages.cableType)}
                value={configuration.cableTypeName || "-"}
              />
              <ConfigurationRow
                label={intl.formatMessage(messages.cableLength)}
                value={
                  configuration.lengthCm > 0
                    ? `${configuration.lengthCm} cm (${configuration.lengthMeters.toFixed(2)} m)`
                    : "-"
                }
              />
              {configuration.directionName && (
                <ConfigurationRow
                  label={intl.formatMessage(messages.cableDirection)}
                  value={configuration.directionName}
                />
              )}
              {configuration.gaineName && (
                <ConfigurationRow
                  label={intl.formatMessage(messages.sleeve)}
                  value={configuration.gaineName}
                />
              )}
            </Box>

            {priceRows.length > 0 && (
              <Box marginTop={4}>
                <Text size={2} fontWeight="medium" color="default2" textTransform="uppercase">
                  {intl.formatMessage(messages.priceBreakdown)}
                </Text>
                <Box
                  marginTop={2}
                  borderWidth={1}
                  borderStyle="solid"
                  borderColor="default1"
                  borderRadius={4}
                  paddingX={4}
                  paddingY={2}
                >
                  {priceRows.map(row => (
                    <ConfigurationRow
                      key={row.key}
                      label={
                        row.perMeterRate && row.perMeterRate > 0
                          ? `${row.label} (${intl.formatMessage(messages.perMeterDetail, {
                              rate: formatPrice(row.perMeterRate),
                              meters: configuration.lengthMeters.toFixed(2),
                            })})`
                          : row.label
                      }
                      value={formatPrice(row.amount)}
                    />
                  ))}
                  {configuration.totalPrice !== undefined && (
                    <Box
                      borderTopWidth={1}
                      borderTopStyle="solid"
                      borderColor="default1"
                      marginTop={1}
                    >
                      <ConfigurationRow
                        label={intl.formatMessage(messages.total)}
                        value={
                          <Text size={2} fontWeight="bold">
                            {formatPrice(configuration.totalPrice)}
                          </Text>
                        }
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderCableConfigurationDialog.displayName = "OrderCableConfigurationDialog";
