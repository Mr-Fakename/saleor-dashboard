import { gql } from "@apollo/client";

export const welcomePageActivities = gql`
  query WelcomePageActivities($hasPermissionToManageOrders: Boolean!) {
    activities: homepageEvents(last: 10) @include(if: $hasPermissionToManageOrders) {
      edges {
        node {
          ...Activities
        }
      }
    }
  }
`;

export const welcomePageAnalytics = gql`
  query WelcomePageAnalytics($channel: String!, $hasPermissionToManageOrders: Boolean!) {
    salesToday: ordersTotal(period: TODAY, channel: $channel)
      @include(if: $hasPermissionToManageOrders) {
      gross {
        amount
        currency
      }
    }
  }
`;

export const welcomePageNotifications = gql`
  query welcomePageNotifications($channel: String!) {
    productsOutOfStock: products(filter: { stockAvailability: OUT_OF_STOCK }, channel: $channel) {
      totalCount
    }
  }
`;

export const homePageOrderCounts = gql`
  query HomePageOrderCounts($channel: String!, $hasPermissionToManageOrders: Boolean!) {
    ordersToday: ordersTotal(period: TODAY, channel: $channel)
      @include(if: $hasPermissionToManageOrders) {
      gross {
        amount
        currency
      }
    }
    ordersThisMonth: ordersTotal(period: THIS_MONTH, channel: $channel)
      @include(if: $hasPermissionToManageOrders) {
      gross {
        amount
        currency
      }
    }
    ordersUnfulfilled: orders(filter: { status: UNFULFILLED })
      @include(if: $hasPermissionToManageOrders) {
      totalCount
    }
    ordersUnconfirmed: orders(filter: { status: UNCONFIRMED })
      @include(if: $hasPermissionToManageOrders) {
      totalCount
    }
    ordersPartiallyFulfilled: orders(filter: { status: PARTIALLY_FULFILLED })
      @include(if: $hasPermissionToManageOrders) {
      totalCount
    }
    ordersReadyToCapture: orders(filter: { status: READY_TO_CAPTURE })
      @include(if: $hasPermissionToManageOrders) {
      totalCount
    }
  }
`;
