import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderLineFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { DialogProps } from "@dashboard/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Cable } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  CableComponentSlot,
  CableComponentView,
  getCableComponentRefs,
  getConfiguredCableVerificationCutoff,
  isCableMarkerRequired,
  parseCableConfiguration,
  resolveCableComponents,
} from "./cableConfiguration";
import { CableVerificationNotice } from "./CableVerificationNotice";
import { messages } from "./messages";
import { useCableComponentNames } from "./useCableComponentNames";
import { useCableLinePrivateMetadata } from "./useCableLinePrivateMetadata";

export type OrderCableConfigurationDialogLine = Pick<
  OrderLineFragment,
  "id" | "productName" | "quantity" | "metadata" | "variant"
>;

interface OrderCableConfigurationDialogProps extends DialogProps {
  orderId: string;
  /** the order's channel slug: where the components are looked up */
  channelSlug?: string;
  /** the order's creation date: decides whether a missing marker is excusable (M1) */
  orderCreatedAt: string | undefined;
  line: OrderCableConfigurationDialogLine | undefined;
}

/** The catalogue's name for a component; the cart's label only as flagged secondary text (NR-35). */
const ComponentValue = ({
  view,
  resolved,
}: {
  view: CableComponentView | undefined;
  resolved: boolean;
}) => {
  const intl = useIntl();

  if (!view) {
    return <>-</>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <span>
        {view.name ?? (resolved ? intl.formatMessage(messages.unresolvedComponent) : "-")}
      </span>
      {view.labelDiffers && view.cartLabel && (
        <Text size={1} color="critical1" fontWeight="regular">
          {intl.formatMessage(messages.cartLabel)} {view.cartLabel}
        </Text>
      )}
    </Box>
  );
};

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
  orderId,
  channelSlug,
  orderCreatedAt,
  line,
  open,
  onClose,
}: OrderCableConfigurationDialogProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const configuration = useMemo(() => parseCableConfiguration(line?.metadata), [line?.metadata]);
  // NR-33: the metadata above is public (any shopper can write it); its
  // private record from checkout-prices says whether it can be trusted.
  const marker = useCableLinePrivateMetadata({
    orderId,
    lineId: line?.id,
    open: open && configuration !== null,
  });
  // NR-35: component names in the metadata are caller-supplied; resolve each id live.
  const refs = useMemo(() => getCableComponentRefs(line?.metadata), [line?.metadata]);
  const names = useCableComponentNames({
    ids: refs.map(ref => ref.id),
    channel: channelSlug,
    open: open && configuration !== null,
  });
  const namesResolved = names.state === "ready";
  const components = useMemo(
    () => (names.state === "ready" ? resolveCableComponents(refs, names.variants) : []),
    [names, refs],
  );
  const componentViews: CableComponentView[] = namesResolved
    ? components
    : resolveCableComponents(refs, []).map(view => ({ ...view, labelDiffers: false }));
  const viewOf = (slot: CableComponentSlot): CableComponentView | undefined =>
    componentViews.find(view => view.slot === slot);
  const nameOf = (slot: CableComponentSlot): string | undefined => viewOf(slot)?.name ?? undefined;
  // runtime setting; null (warned about once per mount) = no cutoff = soft wording
  const cutoff = useMemo(() => getConfiguredCableVerificationCutoff(), []);
  const markerRequired = isCableMarkerRequired(orderCreatedAt, cutoff);

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
          label: nameOf("connector1") || intl.formatMessage(messages.connector1),
          amount: configuration.connector1Price,
        },
        {
          key: "connector2",
          label: nameOf("connector2") || intl.formatMessage(messages.connector2),
          amount: configuration.connector2Price,
        },
        {
          key: "connector3",
          label: nameOf("connector3") || intl.formatMessage(messages.connector3),
          amount: configuration.connector3Price,
        },
        {
          key: "cable",
          label: nameOf("cableType") || intl.formatMessage(messages.cableType),
          amount: configuration.cableCharge?.amount,
          perMeterRate: configuration.cableCharge?.perMeterRate,
        },
        {
          key: "gaine",
          label: nameOf("gaine") || intl.formatMessage(messages.sleeve),
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
                {line?.variant?.name || intl.formatMessage(messages.customCableBadge)}
              </Text>
            </Box>
          </Box>
        </DashboardModal.Header>

        {!configuration ? (
          <Text color="default2">{intl.formatMessage(messages.notAvailable)}</Text>
        ) : (
          <Box display="flex" flexDirection="column">
            <Box marginBottom={3}>
              <CableVerificationNotice
                metadata={line?.metadata}
                marker={marker}
                names={names}
                components={components}
                markerRequired={markerRequired}
              />
            </Box>

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
                value={<ComponentValue view={viewOf("connector1")} resolved={namesResolved} />}
              />
              <ConfigurationRow
                label={intl.formatMessage(messages.connector2)}
                value={<ComponentValue view={viewOf("connector2")} resolved={namesResolved} />}
              />
              {viewOf("connector3") && (
                <ConfigurationRow
                  label={intl.formatMessage(messages.connector3)}
                  value={<ComponentValue view={viewOf("connector3")} resolved={namesResolved} />}
                />
              )}
              <ConfigurationRow
                label={intl.formatMessage(messages.cableType)}
                value={<ComponentValue view={viewOf("cableType")} resolved={namesResolved} />}
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
              {viewOf("gaine") && (
                <ConfigurationRow
                  label={intl.formatMessage(messages.sleeve)}
                  value={<ComponentValue view={viewOf("gaine")} resolved={namesResolved} />}
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
