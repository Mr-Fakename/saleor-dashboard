// @ts-strict-ignore
import { LazyQueryResult } from "@apollo/client/react";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { ProductListColumns } from "@dashboard/config";
import {
  AttributeTypeEnum,
  Exact,
  GridAttributesQuery,
  ProductListQuery,
  useAvailableColumnAttributesLazyQuery,
} from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import useLocale from "@dashboard/hooks/useLocale";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { canBeSorted } from "@dashboard/products/views/ProductList/sort";
import { ChannelProps, ListProps, PageListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Item } from "@glideapps/glide-data-grid";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import { useCallback, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { getAttributeIdFromColumnValue, isAttributeColumnValue } from "../ProductListPage/utils";
import {
  createExpanderColumn,
  createGetCellContent,
  EXPANDER_COLUMN_ID,
  getAttributesFetchMoreProps,
  getAvailableAttributesData,
  getCellAction,
  getColumnMetadata,
  getColumnSortIconName,
  productListDynamicColumnAdapter,
  productListStaticColumnAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { useExpandableProductRows } from "./useExpandableProductRows";
import { usePriceClick } from "./usePriceClick";

interface ProductListDatagridProps
  extends ListProps<ProductListColumns>,
    PageListProps<ProductListColumns>,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  gridAttributesOpts: LazyQueryResult<
    GridAttributesQuery,
    Exact<{
      ids: string | string[];
    }>
  >;
  products: RelayToFlat<ProductListQuery["products"]>;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
  availableColumnsAttributesOpts: ReturnType<typeof useAvailableColumnAttributesLazyQuery>;
  onSelectProductIds: (rowsIndex: number[], clearSelection: () => void) => void;
  hasRowHover?: boolean;
  loading: boolean;
}

export const ProductListDatagrid = ({
  products,
  onRowClick,
  disabled,
  settings,
  onUpdateListSettings,
  selectedChannelId,
  onSort,
  sort,
  loading,
  gridAttributesOpts,
  availableColumnsAttributesOpts,
  activeAttributeSortId,
  filterDependency,
  onSelectProductIds,
  hasRowHover,
  rowAnchor,
}: ProductListDatagridProps) => {
  const isChannelSelected = !!selectedChannelId;
  const intl = useIntl();
  const { theme } = useTheme();
  const datagrid = useDatagridChangeState();
  const { locale } = useLocale();
  const location = useLocation();
  const onPriceClick = usePriceClick({ isChannelSelected });

  const { expandedIds, toggle, virtualRows, totalRows } = useExpandableProductRows(products);

  const productsLength = loading ? 1 : disabled ? 1 : totalRows || 0;

  const handleExpanderClick = useCallback(
    (productId: string) => {
      toggle(productId);

      return true; // Prevent row navigation
    },
    [toggle],
  );

  const expanderColumn = useMemo(
    () => createExpanderColumn(handleExpanderClick),
    [handleExpanderClick],
  );

  const handleColumnChange = useCallback(
    (picked: ProductListColumns[]) => {
      onUpdateListSettings("columns", picked.filter(Boolean));
    },
    [onUpdateListSettings],
  );
  const memoizedStaticColumns = useMemo(
    () =>
      productListStaticColumnAdapter({
        intl,
        sort,
        onPriceClick,
      }),
    [intl, sort],
  );
  const [queryAvailableColumnsAttributes, availableColumnsAttributesData] =
    availableColumnsAttributesOpts;
  const {
    handlers,
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    columnCategories,
    recentlyAddedColumn,
  } = useColumns({
    gridName: "product_list",
    staticColumns: memoizedStaticColumns,
    columnCategories: productListDynamicColumnAdapter({
      availableAttributesData: getAvailableAttributesData({
        availableColumnsAttributesData,
        gridAttributesOpts,
      }),
      selectedAttributesData: mapEdgesToItems(gridAttributesOpts.data?.selectedAttributes),
      activeAttributeSortId,
      sort,
      onSearch: (query: string) =>
        queryAvailableColumnsAttributes({
          variables: { search: query, first: 10, type: AttributeTypeEnum.PRODUCT_TYPE },
        }),
      initialSearch: availableColumnsAttributesData.variables?.search ?? "",
      ...getAttributesFetchMoreProps({
        queryAvailableColumnsAttributes,
        availableColumnsAttributesData,
        gridAttributesOpts,
      }),
      intl,
    }),
    selectedColumns: settings.columns,
    onSave: handleColumnChange,
  });

  // Prepend expander column to visible columns (not part of column picker)
  const columnsWithExpander = useMemo(
    () => [expanderColumn, ...visibleColumns],
    [expanderColumn, visibleColumns],
  );

  // Logic for updating sort icon in dynamic columns
  useEffect(() => {
    handlers.onCustomUpdateVisible(prevColumns =>
      prevColumns?.map(column => {
        if (isAttributeColumnValue(column.id)) {
          if (getAttributeIdFromColumnValue(column.id) === activeAttributeSortId) {
            return {
              ...column,
              icon: getColumnSortIconName(sort, ProductListUrlSortField.attribute),
            };
          }

          return {
            ...column,
            icon: undefined,
          };
        }

        return column;
      }),
    );
  }, [activeAttributeSortId, sort]);

  const handleHeaderClicked = useCallback(
    (col: number) => {
      const column = columnsWithExpander[col];

      if (!column || column.id === EXPANDER_COLUMN_ID) {
        return;
      }

      const { columnName, columnId } = getColumnMetadata(column.id);

      if (canBeSorted(columnName, !!selectedChannelId)) {
        onSort(columnName, columnId);
      }
    },
    [columnsWithExpander, onSort, selectedChannelId],
  );

  const handleRowClick = useCallback(
    ([col, row]: Item) => {
      if (!onRowClick) {
        return;
      }

      const virtualRow = virtualRows[row];

      if (!virtualRow) {
        return;
      }

      const clickedColumnId = columnsWithExpander[col]?.id;

      // For variant rows, only allow the expander action — suppress others (e.g. onPriceClick)
      if (virtualRow.type === "variant") {
        if (clickedColumnId === EXPANDER_COLUMN_ID) {
          const action = getCellAction(columnsWithExpander, col);

          if (action) {
            action(virtualRow.product.id);
          }
        }

        return;
      }

      // Product rows: check column actions (expander, price click)
      const action = getCellAction(columnsWithExpander, col);

      if (action) {
        const result = action(virtualRow.product.id);

        if (result) return;
      }

      onRowClick(virtualRow.product.id);
    },
    [onRowClick, virtualRows, columnsWithExpander],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor) {
        return;
      }

      const virtualRow = virtualRows[row];

      if (!virtualRow || virtualRow.type === "variant") {
        return "";
      }

      return rowAnchor(virtualRow.product.id);
    },
    [rowAnchor, virtualRows],
  );

  const handleGetColumnTooltipContent = useCallback(
    (colIndex: number): string => {
      const column = columnsWithExpander[colIndex];

      if (!column || column.id === EXPANDER_COLUMN_ID) {
        return "";
      }

      const { columnName } = getColumnMetadata(column.id);

      if (canBeSorted(columnName, !!selectedChannelId) || column.id === "empty") {
        return "";
      }

      if (!Object.keys(ProductListUrlSortField).includes(columnName)) {
        return intl.formatMessage(commonTooltipMessages.noSortable);
      }

      return intl.formatMessage(commonTooltipMessages.noFilterSelected, {
        filterName: filterDependency.label,
      });
    },
    [columnsWithExpander, filterDependency.label, intl, selectedChannelId],
  );

  // Map row selection to product indices only (filter out variant rows)
  const handleSelectProductIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!products) {
        return;
      }

      const productIndices = rows
        .map(row => virtualRows[row])
        .filter(vr => vr?.type === "product")
        .map(vr => vr.productIndex);

      onSelectProductIds(productIndices, clearSelection);
    },
    [virtualRows, products, onSelectProductIds],
  );

  const getCellContent = useMemo(
    () =>
      createGetCellContent({
        columns: columnsWithExpander,
        products,
        virtualRows,
        expandedIds,
        intl,
        theme,
        locale,
        selectedChannelId,
      }),
    [columnsWithExpander, products, virtualRows, expandedIds, intl, locale, selectedChannelId],
  );

  return (
    <Box __marginTop={productsLength > 0 ? -1 : 0}>
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          readonly
          loading={loading}
          rowMarkers="checkbox-visible"
          columnSelect="single"
          hasRowHover={hasRowHover}
          onColumnMoved={handlers.onMove}
          onColumnResize={handlers.onResize}
          verticalBorder={false}
          freezeColumns={2}
          getColumnTooltipContent={handleGetColumnTooltipContent}
          availableColumns={columnsWithExpander}
          onHeaderClicked={handleHeaderClicked}
          emptyText={intl.formatMessage(messages.emptyText)}
          getCellContent={getCellContent}
          getCellError={() => false}
          menuItems={() => []}
          rows={productsLength}
          onRowSelectionChange={handleSelectProductIds}
          selectionActions={() => null}
          onRowClick={handleRowClick}
          rowAnchor={handleRowAnchor}
          recentlyAddedColumn={recentlyAddedColumn}
          renderColumnPicker={() => (
            <ColumnPicker
              staticColumns={staticColumns}
              dynamicColumns={dynamicColumns}
              selectedColumns={selectedColumns}
              columnCategories={columnCategories}
              onToggle={handlers.onToggle}
            />
          )}
          navigatorOpts={{ state: getPrevLocationState(location) }}
        />

        <Box paddingX={6}>
          <TablePaginationWithContext
            component="div"
            colSpan={(products?.length === 0 ? 1 : 2) + settings.columns.length}
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        </Box>
      </DatagridChangeStateContext.Provider>
    </Box>
  );
};
