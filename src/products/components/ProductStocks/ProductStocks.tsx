// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ProductErrorFragment, WarehouseFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { FormsetAtomicData, FormsetChange } from "@dashboard/hooks/useFormset";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import createNonNegativeValueChangeHandler from "@dashboard/utils/handlers/nonNegativeValueChangeHandler";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Checkbox, Input, Text, vars } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductStocksAssignWarehouses } from "./components/ProductStocksAssignWarehouses";
import { messages } from "./messages";
import { WarehouseInformationMessage } from "./WarehouseInformationMessage";

export interface ProductStockFormsetData {
  quantityAllocated: number;
}
export type ProductStockInput = FormsetAtomicData<ProductStockFormsetData, string, string>;
interface ProductStockFormData {
  sku: string;
  trackInventory: boolean;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

interface ProductStocksProps {
  productVariantChannelListings?: ChannelData[];
  data: ProductStockFormData;
  loading: boolean;
  errors: ProductErrorFragment[];
  hasVariants: boolean;
  stocks: ProductStockInput[];
  warehouses: WarehouseFragment[];
  onChange: FormsetChange;
  onFormDataChange: FormChange;
  onPreorderEndDateChange?: FormChange;
  onWarehouseStockAdd: (warehouseId: string, warehouseName: string) => void;
  onWarehouseStockDelete: (warehouseId: string) => void;
  onWarehouseConfigure: () => void;
  fetchMoreWarehouses: () => void;
  hasMoreWarehouses: boolean;
  isCreate: boolean;
  searchWarehouses: (query: string) => void;
}

export const ProductStocks = ({
  data,
  loading,
  hasVariants,
  errors,
  stocks,
  productVariantChannelListings = [],
  warehouses,
  hasMoreWarehouses,
  onChange,
  onFormDataChange,
  onPreorderEndDateChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete,
  onWarehouseConfigure,
  fetchMoreWarehouses,
  isCreate,
  searchWarehouses,
}: ProductStocksProps) => {
  const intl = useIntl();
  const [lastStockRowFocus, setLastStockRowFocus] = React.useState(false);
  const formErrors = getFormErrors(["sku"], errors);

  const stocksIds = React.useMemo(() => stocks.map(stock => stock.id), [stocks]);

  const warehousesToAssign =
    warehouses?.filter(warehouse => !stocksIds.includes(warehouse.id)) || [];

  const handleWarehouseStockAdd = (warehouseId: string, warehouseName: string) => {
    onWarehouseStockAdd(warehouseId, warehouseName);
    setLastStockRowFocus(true);
  };
  const handleStockInputFocus = (input: HTMLDivElement) => {
    if (lastStockRowFocus && input) {
      input.focus();
      setLastStockRowFocus(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormDataChange(e);
  };

  // Auto-toggle preorder based on stock quantity changes
  const handleStockChangeWithPreorderToggle = (stockId: string, value: string) => {
    onChange(stockId, value);

    const newQuantity = parseInt(value, 10) || 0;

    if (newQuantity > 0 && data.isPreorder) {
      // Stock restored → auto-disable preorder
      onFormDataChange({ target: { name: "isPreorder", value: false } });
    } else if (newQuantity === 0 && !data.isPreorder) {
      // Check if ALL stocks are now 0
      const allZero = stocks.every(s => (s.id === stockId ? true : parseInt(s.value, 10) === 0));

      if (allZero) {
        onFormDataChange({ target: { name: "isPreorder", value: true } });
      }
    }
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.title)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box __width="50%">
          <Input
            disabled={loading}
            error={!!formErrors.sku}
            label={intl.formatMessage(messages.sku)}
            name="sku"
            onChange={handleChange}
            value={data.sku}
            data-test-id="sku"
            size="small"
            helperText={getProductErrorMessage(formErrors.sku, intl)}
          />
        </Box>

        <Box paddingTop={5}>
          <Box>
            <Checkbox
              checked={data.trackInventory}
              name="trackInventory"
              disabled={loading}
              onCheckedChange={value =>
                onFormDataChange({ target: { name: "trackInventory", value } })
              }
            >
              <Box display="flex" flexDirection="column">
                <Text>
                  <FormattedMessage {...messages.trackInventory} />
                </Text>
              </Box>
            </Checkbox>

            <Text marginLeft={5} size={2} color="default2">
              <FormattedMessage {...messages.trackInventoryDescription} />
            </Text>
          </Box>

          {/* Preorder / Backorder toggle */}
          <Box marginTop={5}>
            <Checkbox
              checked={data.isPreorder}
              name="isPreorder"
              disabled={loading}
              onCheckedChange={value => onFormDataChange({ target: { name: "isPreorder", value } })}
            >
              <Box display="flex" flexDirection="column">
                <Text>
                  <FormattedMessage {...messages.variantInPreorder} />
                </Text>
              </Box>
            </Checkbox>

            {data.isPreorder && (
              <Box marginLeft={5} marginTop={3} display="grid" gap={3}>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.preorderProductsAvailability} />
                </Text>

                {/* Global threshold */}
                <Box __width="50%">
                  <Input
                    disabled={loading}
                    label={intl.formatMessage(messages.preorderTresholdLabel)}
                    name="globalThreshold"
                    type="number"
                    min={0}
                    onChange={handleChange}
                    value={data.globalThreshold ?? ""}
                    size="small"
                    helperText={
                      data.globalSoldUnits > 0
                        ? intl.formatMessage(messages.preorderTresholdUnitsLeft, {
                            unitsLeft: data.globalThreshold
                              ? parseInt(data.globalThreshold, 10) - data.globalSoldUnits
                              : "∞",
                          })
                        : intl.formatMessage(messages.preorderTresholdDescription)
                    }
                    endAdornment={
                      data.globalSoldUnits > 0 ? (
                        <Text size={2} color="default2" whiteSpace="nowrap">
                          {intl.formatMessage(messages.soldUnits)}: {data.globalSoldUnits}
                        </Text>
                      ) : undefined
                    }
                  />
                </Box>

                {/* End date toggle */}
                <Box display="flex" flexDirection="column" gap={2}>
                  {data.hasPreorderEndDate ? (
                    <>
                      <Input
                        disabled={loading}
                        label={intl.formatMessage(messages.preorderEndDateSetup)}
                        name="preorderEndDateTime"
                        type="datetime-local"
                        onChange={e => onPreorderEndDateChange?.(e) ?? onFormDataChange(e)}
                        value={
                          data.preorderEndDateTime ? data.preorderEndDateTime.slice(0, 16) : ""
                        }
                        size="small"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          onFormDataChange({
                            target: { name: "hasPreorderEndDate", value: false },
                          })
                        }
                      >
                        <FormattedMessage {...messages.endDateCancel} />
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() =>
                        onFormDataChange({
                          target: { name: "hasPreorderEndDate", value: true },
                        })
                      }
                    >
                      <FormattedMessage {...messages.endDateSetup} />
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          <Box display="grid" gap={2} marginTop={5}>
            <Box display="flex" flexDirection="column">
              <Text size={4} fontWeight="bold">
                <FormattedMessage {...messages.stock} />
              </Text>
              {!productVariantChannelListings?.length && (
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.noChannelWarehousesAllocation} />
                </Text>
              )}
            </Box>
            <WarehouseInformationMessage
              isCreate={isCreate}
              hasVariants={hasVariants}
              hasStocks={stocks?.length > 0}
              onWarehouseConfigure={onWarehouseConfigure}
            />
          </Box>
        </Box>
        {productVariantChannelListings?.length > 0 && stocks?.length > 0 && (
          <Table>
            <TableHead>
              <TableRowLink>
                <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                  <Text size={2} color="default2">
                    <FormattedMessage {...messages.warehouseName} />
                  </Text>
                </TableCell>
                <TableCell style={{ width: 100, verticalAlign: "middle" }}>
                  <Text size={2} color="default2">
                    <FormattedMessage {...messages.allocated} />
                  </Text>
                </TableCell>
                <TableCell style={{ width: 200, verticalAlign: "middle" }}>
                  <Text size={2} color="default2">
                    <FormattedMessage {...messages.quantity} />
                  </Text>
                </TableCell>
                <TableCell />
              </TableRowLink>
            </TableHead>
            <TableBody>
              {renderCollection(stocks, (stock, index) => {
                const handleQuantityChange = createNonNegativeValueChangeHandler(event =>
                  handleStockChangeWithPreorderToggle(stock.id, event.target.value),
                );

                return (
                  <TableRowLink
                    data-test-id={stock.label}
                    key={`product-stocks-${stock.id}-${index}`}
                  >
                    <TableCell style={{ paddingLeft: vars.spacing[6] }}>
                      <Text>{stock.label}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{stock.data?.quantityAllocated || 0}</Text>
                    </TableCell>
                    <TableCell>
                      <Input
                        data-test-id="stock-input"
                        disabled={loading}
                        onChange={handleQuantityChange}
                        value={stock.value}
                        size="small"
                        type="number"
                        min={0}
                        ref={input => stocks.length === index + 1 && handleStockInputFocus(input)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="secondary"
                        icon={
                          <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                        }
                        onClick={() => onWarehouseStockDelete(stock.id)}
                      />
                    </TableCell>
                  </TableRowLink>
                );
              })}
            </TableBody>
          </Table>
        )}

        <ProductStocksAssignWarehouses
          warehousesToAssign={warehousesToAssign}
          hasMoreWarehouses={hasMoreWarehouses}
          loadMoreWarehouses={fetchMoreWarehouses}
          onWarehouseSelect={handleWarehouseStockAdd}
          loading={loading}
          searchWarehouses={searchWarehouses}
          showAssignWarehousesButton={!isCreate}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
