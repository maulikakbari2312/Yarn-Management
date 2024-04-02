exports.setUp = function (app) {
  const logIn = require("./Master/logIn.router");
  const company = require("./Master/company.router");
  const party = require("./Master/party.router");
  const colorYarn = require("./Master/colorYarn.router");
  const design = require("./Master/design.router");
  const matching = require("./Master/matching.router");
  const machine = require("./Master/machine.router");
  const yarnPurchase = require("./Yarn/yarnPurchase.router");
  const yarnSales = require("./Yarn/yarnSales.router");
  const yarnStock = require("./Yarn/yarnStock.router");
  const order = require("./Order/orders.router");
  const processOrder = require("./Order/processOrder.router");
  const completeOrder = require("./Order/completeOrder.router");
  const sareeStock = require("./stock/sareeStock.router");
  const orderStock = require("./stock/orderStock.router");



  const report = require("./Report/reports.router");

  app.use("/api/user", logIn);
  app.use("/api/company", company);
  app.use("/api/party", party);
  app.use("/api/coloryarn", colorYarn);
  app.use("/api/design", design);
  app.use("/api/matching", matching);
  app.use("/api/machine", machine);

  // yarn purchase
  app.use("/api/yarnPurchase", yarnPurchase);
  app.use("/api/yarnSales", yarnSales);
  app.use("/api/yarnStock", yarnStock);

  //order
  app.use("/api/order", order);
  app.use("/api/order", processOrder);
  app.use("/api/order", completeOrder);

  //stock
  app.use("/api/stock", sareeStock);
  app.use("/api/stock", orderStock);



  //report
  app.use("/api/report", report);
};
module.exports = exports;