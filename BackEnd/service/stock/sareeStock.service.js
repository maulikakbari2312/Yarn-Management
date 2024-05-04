const { findAllOrders } = require("../../DBQuery/Order/order");
const {
  createSaleSaree,
  getAllSareeStock,
} = require("../../DBQuery/stock/saree");

exports.getSareeStock = async () => {
  try {
    const findOrders = await findAllOrders();
    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const newArr = [];
    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.settlePcs > 0) {
          newArr.push(ele);
        }
      }
    }

    const resultObject = {};

    newArr.forEach((item) => {
      if (resultObject[`${item.matchingId}:${item.tokenId}`]) {
        resultObject[`${item.matchingId}:${item.tokenId}`].stock +=
          item.settlePcs;
      } else {
        resultObject[`${item.matchingId}:${item.tokenId}`] = {
          tokenId: item.tokenId,
          matchingId: item.matchingId,
          party: item.party,
          pallu: item.pallu,
          design: item.design,
          groundColor: item.groundColor,
          stock: item.settlePcs,
        };
      }
    });

    const resultArray = Object.values(resultObject);

    return resultArray;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.editSareeStock = async (tokenId, matchingId, returnPcs) => {
  try {
    const findOrders = await findAllOrders();

    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.tokenId === tokenId && ele.matchingId === matchingId) {
          ele.settlePcs += returnPcs;
          ele.dispatch -= returnPcs;
          order.save();
        }
      }
    }
    return {
      status: 200,
      message: "Return saree stock updated successfully.",
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.saleSareeStock = async (tokenId, matchingId, saleSareeDetails) => {
  try {
    const findOrders = await findAllOrders();

    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const newArr = [];
    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.settlePcs > 0) {
          newArr.push(ele);
        }
      }
    }

    const resultObject = {};

    newArr.forEach((item) => {
      if (resultObject[`${item.matchingId}:${item.tokenId}`]) {
        resultObject[`${item.matchingId}:${item.tokenId}`].stock +=
          item.settlePcs;
      } else {
        resultObject[`${item.matchingId}:${item.tokenId}`] = {
          tokenId: item.tokenId,
          matchingId: item.matchingId,
          party: item.party,
          pallu: item.pallu,
          design: item.design,
          groundColor: item.groundColor,
          stock: item.settlePcs,
        };
      }
    });

    const resultArray = Object.values(resultObject);

    if (isNaN(saleSareeDetails.stock) || saleSareeDetails.stock <= 0) {
      return {
        status: 400,
        message: "Invalid sale quantity.",
      };
    }

    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.tokenId === tokenId && ele.matchingId === matchingId) {
          const findSettledata = resultArray.find(
            (ele) => ele.tokenId === tokenId && ele.matchingId === matchingId
          );
          if (!findSettledata) {
            return {
              status: 400,
              message: "Stock data not found.",
            };
          }
          if (findSettledata && findSettledata.stock < saleSareeDetails.stock) {
            return {
              status: 400,
              message: "You cannot sell more sarees than the available stock.",
            };
          }
          ele.settlePcs -= saleSareeDetails.stock;
          ele.salePcs += saleSareeDetails.stock;
          order.save();
        }
      }
    }

    const createSaleSareeDetail = await createSaleSaree(saleSareeDetails);
    await createSaleSareeDetail.save();
    return {
      status: 200,
      message: "Saree sale successfully.",
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.listSaleSaree = async () => {
  try {
    const findSaleSaree = await getAllSareeStock();
    if (!findSaleSaree) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const resultObject = {};

    findSaleSaree.forEach((item) => {
      if (resultObject[`${item.matchingId}:${item.party}`]) {
        resultObject[`${item.matchingId}:${item.party}`].stock += item.stock;
      } else {
        resultObject[`${item.matchingId}:${item.party}`] = {
          tokenId: item.tokenId,
          matchingId: item.matchingId,
          party: item.party,
          pallu: item.pallu,
          design: item.design,
          groundColor: item.groundColor,
          stock: item.stock,
        };
      }
    });
    const resultArray = Object.values(resultObject);
    return resultArray;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
