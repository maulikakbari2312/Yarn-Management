// import
import React, { Component } from 'react';
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import Company from "./views/Dashboard/Master/Company.js"

import {
  HomeIcon,
  PersonIcon,
  CompanyIcon,
  PartyIcon,
  AdminIcon,
  ColorYarnIcon,
  DesignIcon,
  MatchingIcon,
  MachineIcon,
  YarnIcon,
  BuyIcon,
  SaleIcon,
  OrderIcon,
  OrdersIcon,
  ProcessOrderIcon,
  CompleteOrderIcon,
  DeliveredOrderIcon,
  LogoutIcon,
  StockIcon,
  ReportIcon,
  PendingOrderYarnIcon,
  RemainingYarnIcon,
} from "./components/Icons/Icons.js";
import Party from './views/Dashboard/Master/Party.jsx';
import AddAdmin from './views/Dashboard/Account/AddAdmin.jsx';
import ColorYarn from './views/Dashboard/Master/ColorYarn.jsx';
import Design from './views/Dashboard/Master/Design.jsx';
import Matching from './views/Dashboard/Master/Matching.jsx';
import Dashboard from './views/Dashboard/Dashboard.js';
import Machine from './views/Dashboard/Master/Machine.jsx';
import BuyYarn from './views/Yarn/BuyYarn.jsx';
import SaleYarn from './views/Yarn/SaleYarn.jsx';
import Orders from './views/Order/Orders.jsx';
import ProcessOrder from './views/Order/ProcessOrder.jsx';
import CompletedOrders from './views/Order/CompletedOrders.jsx';
import DeliveredOrders from './views/Order/DeliveredOrders.jsx';
import { useSelector } from 'react-redux';
import SareeStock from './views/Stock/SareeStock.jsx';
import OrderStock from './views/Stock/OrderStock.jsx';
import RemainingYarnStock from './views/Stock/RemainingYarnStock.jsx';
import OrderPendingYarnStock from './views/Stock/OrderPendingYarnStock.jsx';
import MachineReport from './views/Report/MachineReport.jsx';
import OrderProcessStockReport from './views/Report/OrderProcessStockReport.jsx';
import DesignReport from './views/Report/DesignReport.jsx';
import StockYarn from './views/Yarn/StockYarn.jsx';
import Cookies from 'js-cookie';
const DashboardRoutes = () => {
  const isAdminCookie = localStorage.getItem('isAdmin');
  var dashRoutes = [
    {
      name: "Dashboard",
      category: "page",
      state: "pageCollapse",
      icon: <HomeIcon color='inherit' />,
      views: [{
        path: "/company",
        name: "Company",
        icon: <CompanyIcon color='inherit' />,
        secondaryNavbar: true,
        component: Company,
        layout: "/admin",
      },
      {
        path: "/party",
        name: "Party",
        icon: <PartyIcon color='inherit' />,
        secondaryNavbar: true,
        component: Party,
        layout: "/admin",
      },
      {
        path: "/color-yarn",
        name: "Color Yarn",
        icon: <ColorYarnIcon color='inherit' />,
        secondaryNavbar: true,
        component: ColorYarn,
        layout: "/admin",
      },
      {
        path: "/design",
        name: "Design",
        icon: <DesignIcon color='inherit' />,
        secondaryNavbar: true,
        component: Design,
        layout: "/admin",
      },
      {
        path: "/matching",
        name: "Matching",
        icon: <MatchingIcon color='inherit' />,
        secondaryNavbar: true,
        component: Matching,
        layout: "/admin",
      },
      {
        path: "/machine",
        name: "Machine",
        icon: <MachineIcon color='inherit' />,
        secondaryNavbar: true,
        component: Machine,
        layout: "/admin",
      },
      ]
    },
    {
      name: "Yarn",
      category: "page",
      state: "pageCollapse",
      icon: <YarnIcon color='inherit' />,
      views: [{
        path: "/purchase-yarn",
        name: "Purchase Yarn",
        icon: <BuyIcon color='inherit' />,
        secondaryNavbar: true,
        component: BuyYarn,
        layout: "/admin",
      }, {
        path: "/stock-yarn",
        name: "Stock Yarn",
        icon: <StockIcon color='inherit' />,
        secondaryNavbar: true,
        component: StockYarn,
        layout: "/admin",
      },
      {
        path: "/sale-yarn",
        name: "Sale Yarn",
        icon: <SaleIcon color='inherit' />,
        secondaryNavbar: true,
        component: SaleYarn,
        layout: "/admin",
      },
      ]
    },
    {
      name: "Order",
      category: "page",
      state: "pageCollapse",
      icon: <OrderIcon color='inherit' />,
      views: [{
        path: "/orders",
        name: "Orders",
        icon: <OrdersIcon color='inherit' />,
        secondaryNavbar: true,
        component: Orders,
        layout: "/admin",
      }, {
        path: "/process-order",
        name: "Process Order",
        icon: <ProcessOrderIcon color='inherit' />,
        secondaryNavbar: true,
        component: ProcessOrder,
        layout: "/admin",
      }, {
        path: "/complete-order",
        name: "Complete Order",
        icon: <CompleteOrderIcon color='inherit' />,
        secondaryNavbar: true,
        component: CompletedOrders,
        layout: "/admin",
      }, {
        path: "/delivered-order",
        name: "Delivered Order",
        icon: <DeliveredOrderIcon color='inherit' />,
        secondaryNavbar: true,
        component: DeliveredOrders,
        layout: "/admin",
      },
      ]
    },
    {
      name: "Stock",
      category: "page",
      state: "pageCollapse",
      icon: <StockIcon color='inherit' />,
      views: [{
        path: "/saree-stock",
        name: "Saree Stock",
        icon: <OrdersIcon color='inherit' />,
        secondaryNavbar: true,
        component: SareeStock,
        layout: "/admin",
      }, {
        path: "/order-stock",
        name: "Order Yarn Stock",
        icon: <ProcessOrderIcon color='inherit' />,
        secondaryNavbar: true,
        component: OrderStock,
        layout: "/admin",
      }, {
        path: "/remaining-yarn-stock",
        name: "Remaining Yarn Stock",
        icon: <RemainingYarnIcon color='inherit' />,
        secondaryNavbar: true,
        component: RemainingYarnStock,
        layout: "/admin",
      },
        // {
        //   path: "/order-pending-yarn-stock",
        //   name: "Order Yarn Stock",
        //   icon: <PendingOrderYarnIcon color='inherit' />,
        //   secondaryNavbar: true,
        //   component: OrderPendingYarnStock,
        //   layout: "/admin",
        // },
      ]
    },
    {
      name: "Report",
      category: "page",
      state: "pageCollapse",
      icon: <ReportIcon color='inherit' />,
      views: [{
        path: "/design-report",
        name: "Design Report",
        icon: <OrdersIcon color='inherit' />,
        secondaryNavbar: true,
        component: DesignReport,
        layout: "/admin",
      }, {
        path: "/machine-report",
        name: "Machine Report",
        icon: <MachineIcon color='inherit' />,
        secondaryNavbar: true,
        component: MachineReport,
        layout: "/admin",
      }, {
        path: "/order-processed-stock-report",
        name: "Order Processed Report",
        icon: <PendingOrderYarnIcon color='inherit' />,
        secondaryNavbar: true,
        component: OrderProcessStockReport,
        layout: "/admin",
      },
      ]
    },
    {
      name: "ACCOUNT PAGES",
      category: "page",
      state: "pageCollapse",
      icon: <CompanyIcon color='inherit' />,
      views: [
        {
          path: "/profile",
          name: "Profile",
          icon: <PersonIcon color='inherit' />,
          secondaryNavbar: true,
          component: Profile,
          layout: "/admin",
        },
        isAdminCookie === "true" && {
          path: "/addAdmin",
          name: "Create Admin",
          icon: <AdminIcon color='inherit' />,
          secondaryNavbar: true,
          component: AddAdmin,
          layout: "/admin",
        },
        // Add null for non-admin route
      ].filter(Boolean), // Remove null elements from the array
    },
  ];
  return dashRoutes;
};

export default DashboardRoutes;
