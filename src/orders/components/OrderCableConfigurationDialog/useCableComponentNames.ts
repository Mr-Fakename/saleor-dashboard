import { gql, useQuery } from "@apollo/client";

import { isWellFormedVariantId, ResolvedCableVariant } from "./cableConfiguration";

export type CableComponentNames =
  | { state: "loading" }
  | { state: "error" }
  | { state: "ready"; variants: ResolvedCableVariant[] };

// Hand-written on purpose: one small read-only query, no codegen needed.
const CABLE_COMPONENT_NAMES = gql`
  query CableComponentNames($ids: [ID!]!, $first: Int!, $channel: String) {
    productVariants(ids: $ids, first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          product {
            name
          }
        }
      }
    }
  }
`;

interface CableComponentNamesData {
  productVariants: {
    edges: Array<{ node: { id: string; name: string; product: { name: string } } }>;
  } | null;
}

interface UseCableComponentNamesArgs {
  /** ProductVariant ids to resolve (component ids of the line, and its base variant) */
  ids: string[];
  /** the order's channel slug: components are looked up where they were sold */
  channel: string | undefined;
  open: boolean;
}

/**
 * NR-35: component names in the line metadata are caller-supplied text. This
 * resolves each id live from Saleor so the dialog can show the catalogue's own
 * names. Always asks the network: a verdict never rests on a stale cache.
 *
 * Saleor rejects the WHOLE query when one id is malformed, so only well-formed
 * ids are sent; the others simply stay unresolved. A failed lookup is reported
 * as { state: "error" } and may only ADD a note to the dialog: the marker
 * verdict never depends on it.
 */
export const useCableComponentNames = ({
  ids,
  channel,
  open,
}: UseCableComponentNamesArgs): CableComponentNames => {
  const uniqueIds = Array.from(new Set(ids)).filter(isWellFormedVariantId);
  const { data, error, loading } = useQuery<
    CableComponentNamesData,
    { ids: string[]; first: number; channel?: string }
  >(CABLE_COMPONENT_NAMES, {
    variables: {
      ids: uniqueIds,
      first: Math.min(100, Math.max(1, uniqueIds.length)),
      channel,
    },
    skip: !open || uniqueIds.length === 0,
    fetchPolicy: "network-only",
  });

  if (uniqueIds.length === 0) {
    return { state: "ready", variants: [] };
  }

  if (error) {
    return { state: "error" };
  }

  if (loading || !data) {
    return { state: "loading" };
  }

  return {
    state: "ready",
    variants: (data.productVariants?.edges ?? []).map(({ node }) => ({
      id: node.id,
      name: node.name,
      productName: node.product.name,
    })),
  };
};
