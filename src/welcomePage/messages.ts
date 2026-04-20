import { defineMessages } from "react-intl";

export const homePageMessages = defineMessages({
  title: {
    id: "hNVowy",
    defaultMessage: "Hello {userName}",
    description: "home page greeting title",
  },
  subtitle: {
    id: "0JLhU7",
    defaultMessage: "Here is what's happening with your store today",
    description: "home page subtitle",
  },
  revenueToday: {
    id: "dHbz1C",
    defaultMessage: "Revenue today",
    description: "home kpi card title for today revenue",
  },
  revenueThisMonth: {
    id: "0NYoP6",
    defaultMessage: "Revenue this month",
    description: "home kpi card title for monthly revenue",
  },
  outOfStock: {
    id: "e69qBk",
    defaultMessage: "Out of stock",
    description: "home kpi card title for out of stock products",
  },
  ordersReadyToFulfill: {
    id: "+FhDLH",
    defaultMessage: "Ready to fulfill",
    description: "home kpi card title for unfulfilled orders",
  },
  ordersRequiringAttention: {
    id: "OnhG1+",
    defaultMessage: "Orders requiring attention",
    description: "home section title for orders needing action",
  },
  unfulfilled: {
    id: "UJMzXj",
    defaultMessage: "Unfulfilled",
    description: "order status label",
  },
  unconfirmed: {
    id: "8Jee69",
    defaultMessage: "Unconfirmed",
    description: "order status label",
  },
  partiallyFulfilled: {
    id: "p8cLpp",
    defaultMessage: "Partially fulfilled",
    description: "order status label",
  },
  readyToCapture: {
    id: "F9xfpb",
    defaultMessage: "Ready to capture",
    description: "order status label",
  },
  viewAllOrders: {
    id: "0CcpQ6",
    defaultMessage: "View all orders",
    description: "link to orders list",
  },
  noOrdersRequiringAttention: {
    id: "c2lB/n",
    defaultMessage: "All orders are up to date",
    description: "empty state when no orders need attention",
  },
  activity: {
    id: "vM0nwz",
    defaultMessage: "Recent activity",
    description: "activity feed section header",
  },
  noActivities: {
    id: "LWglqp",
    defaultMessage: "No recent activity",
    description: "empty state for activity feed",
  },
  activityError: {
    id: "MET3o7",
    defaultMessage: "Couldn't load activities",
    description: "error state for activity feed",
  },
  lowStockProducts: {
    id: "Y/BB8I",
    defaultMessage: "Products out of stock",
    description: "section title for out of stock products",
  },
  noPermission: {
    id: "fij0GI",
    defaultMessage: "You don't have permission to view this data",
    description: "message shown when user lacks permissions",
  },
  today: {
    id: "i2BoDL",
    defaultMessage: "Today",
    description: "time period label",
  },
  thisMonth: {
    id: "t9MlRj",
    defaultMessage: "This month",
    description: "time period label",
  },
  orders: {
    id: "aG3QVB",
    defaultMessage: "{count, plural, one {# order} other {# orders}}",
    description: "order count with pluralization",
  },
  products: {
    id: "d6ftcy",
    defaultMessage: "{count, plural, one {# product} other {# products}}",
    description: "product count with pluralization",
  },
});
