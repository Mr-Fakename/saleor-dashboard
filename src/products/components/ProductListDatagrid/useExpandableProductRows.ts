import { ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { useCallback, useMemo, useState } from "react";

type Product = RelayToFlat<ProductListQuery["products"]>[number];
type Variant = NonNullable<Product["variants"]>[number];

export interface ProductVirtualRow {
  type: "product";
  productIndex: number;
  product: Product;
}

export interface VariantVirtualRow {
  type: "variant";
  productIndex: number;
  variantIndex: number;
  product: Product;
  variant: Variant;
}

export type VirtualRow = ProductVirtualRow | VariantVirtualRow;

interface UseExpandableProductRowsResult {
  expandedIds: Set<string>;
  toggle: (productId: string) => void;
  virtualRows: VirtualRow[];
  totalRows: number;
}

export function useExpandableProductRows(
  products: RelayToFlat<ProductListQuery["products"]> | undefined,
): UseExpandableProductRowsResult {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((productId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  }, []);

  const virtualRows = useMemo<VirtualRow[]>(() => {
    if (!products?.length) {
      return [];
    }

    const rows: VirtualRow[] = [];

    products.forEach((product, productIndex) => {
      rows.push({ type: "product", productIndex, product });

      const hasVariants = (product.variants?.length ?? 0) > 0;

      if (hasVariants && expandedIds.has(product.id)) {
        product.variants!.forEach((variant, variantIndex) => {
          rows.push({
            type: "variant",
            productIndex,
            variantIndex,
            product,
            variant,
          });
        });
      }
    });

    return rows;
  }, [products, expandedIds]);

  return {
    expandedIds,
    toggle,
    virtualRows,
    totalRows: virtualRows.length,
  };
}
