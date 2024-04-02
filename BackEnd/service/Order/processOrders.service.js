const message = require("../../common/error.message");
const ordersModel = require("../../model/Order/orders.model");
const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");

exports.createProcessOrder = async (orderId, tokenId, data) => {
  try {
    const findByOrderId = await ordersModel.findOne({ orderId: orderId });
    const findOrderOnMachine = await pcsOnMachineModel.find();

    if (!findByOrderId) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    let orderToUpdate = findByOrderId.orders.find(
      (ele) => ele.tokenId === tokenId
    );
    if (!orderToUpdate) {
      return {
        status: 404,
        message: "Order can not update",
      };
    }

    for (const detail of findOrderOnMachine) {
      for (const machineData of detail.machinesInProcess) {
        if (
          machineData.machineNo === data.machineNo &&
          machineData.pcsOnMachine > 0
        ) {
          const findOrder = findByOrderId.orders.find(
            (ele) => ele.tokenId === detail.tokenId
          );

          if(!findOrder){
            return {
              status: 404,
              message: "Machine is inProcess with other order.",
            };
          }
          
          if (findOrder.tokenId !== tokenId) {
            return {
              status: 404,
              message: "Another ground color order is inProcess.",
            };
          }
          if (detail.orderId !== orderId && detail.tokenId !== tokenId) {
            return {
              status: 404,
              message: "Another order is already in process.",
            };
          }
        }
      }
    }

    orderToUpdate.machineNo = data.machineNo;
    if (!orderToUpdate.pendingPcs > orderToUpdate.pcs) {
      return {
        status: 404,
        message: `Only ${orderToUpdate.pcs} orders are pending.`,
      };
    }

    if (orderToUpdate.pendingPcs < data.pcsOnMachine) {
      return {
        status: 404,
        message: `Only ${orderToUpdate.pendingPcs} orders are pending.`,
      };
    }

    if (orderToUpdate.pcsOnMachine === 0) {
      orderToUpdate.pcsOnMachine = data.pcsOnMachine;
    } else {
      orderToUpdate.pcsOnMachine =
        orderToUpdate.pcsOnMachine + data.pcsOnMachine;
    }
    orderToUpdate.pendingPcs = orderToUpdate.pendingPcs - data.pcsOnMachine;

    const updatedOrder = await findByOrderId.save();

    const findOrderInProcess = await pcsOnMachineModel.findOne({
      orderId: orderId,
      tokenId: tokenId,
    });

    if (!findOrderInProcess) {
      const createOrderDetail = new pcsOnMachineModel({
        machinesInProcess: [
          {
            machineNo: data.machineNo,
            pcsOnMachine: data.pcsOnMachine,
          },
        ],
        orderId: orderId,
        tokenId: tokenId,
      });

      await createOrderDetail.save();
    } else {
      let machineFound = false;
      for (const ele of findOrderInProcess.machinesInProcess) {
        if (ele.machineNo === data.machineNo) {
          ele.pcsOnMachine = ele.pcsOnMachine + data.pcsOnMachine;
          machineFound = true;
          break;
        }
      }
      if (!machineFound) {
        findOrderInProcess.machinesInProcess.push({
          machineNo: data.machineNo,
          pcsOnMachine: data.pcsOnMachine,
        });
      }
      await findOrderInProcess.save();
    }

    return {
      status: 200,
      message: message.PROCESS_ORDER_SUCESS,
      data: updatedOrder,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getProcessOrder = async (orderId) => {
  try {
    const findByOrderId = await ordersModel.findOne({ orderId: orderId });

    if (!findByOrderId) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const processOrderArr = [];
    for (const ele of findByOrderId.orders) {
      if (ele.pcsOnMachine > 0) {
        processOrderArr.push(ele);
      }
    }

    return processOrderArr;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getAllProcessOrder = async () => {
  try {
    const findOrders = await ordersModel.find();
    const findOrderOnMachine = await pcsOnMachineModel.find();

    const processOrderArr = [];

    for (const order of findOrders) {
      for (const ele of order.orders) {
        for (const detail of findOrderOnMachine) {
          for (const machineData of detail.machinesInProcess) {
            if (
              machineData.pcsOnMachine > 0 &&
              ele.tokenId === detail.tokenId
            ) {
              const response = {
                orderNo: ele.orderNo,
                date: ele.date,
                party: ele.party,
                design: ele.design,
                machineNo: machineData.machineNo,
                groundColor: ele.groundColor,
                pcsOnMachine: machineData.pcsOnMachine,
                tokenId: ele.tokenId,
                orderId: order.orderId,
                machineId: machineData.machineId,
              };
              processOrderArr.push(response);
            }
          }
        }
      }
    }

    return processOrderArr;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.deleteAllProcessOrder = async (orderId, tokenId, machineId) => {
  try {
    const findOrders = await ordersModel.findOne({ orderId: orderId });

    if (!findOrders) {
      return {
        status: 404,
        message: message.ORDER_NOT_FOUND,
      };
    }

    const findOrderOnMachine = await pcsOnMachineModel.find({
      orderId: orderId,
    });

    let processOrderArr = [];

    for (const ele of findOrders.orders) {
      for (const detail of findOrderOnMachine) {
        for (const machineData of detail.machinesInProcess) {
          if (
            machineData.pcsOnMachine > 0 &&
            findOrders.orderId === detail.orderId
          ) {
            const response = {
              orderNo: ele.orderNo,
              date: ele.date,
              party: ele.party,
              design: ele.design,
              machineNo: machineData.machineNo,
              groundColor: ele.groundColor,
              pcsOnMachine: machineData.pcsOnMachine,
              tokenId: ele.tokenId,
              orderId: orderId,
              machineId: machineData.machineId,
            };
            processOrderArr.push(response);
          }
        }
      }
    }

    let findOrder = findOrders.orders.find(
      (order) => order.tokenId === tokenId
    );

    let pcsOnMachineToUpdate = 0;

    for (const data of findOrderOnMachine) {
      const filter = {
        orderId: orderId,
        tokenId: tokenId,
      };

      const update = {
        $pull: {
          machinesInProcess: { machineId: machineId },
        },
      };

      await pcsOnMachineModel.updateOne(filter, update);

      const removedObjectIndex = data.machinesInProcess.findIndex(
        (obj) => obj.machineId === machineId
      );
      if (removedObjectIndex !== -1) {
        pcsOnMachineToUpdate =
          pcsOnMachineToUpdate +
          data.machinesInProcess[removedObjectIndex].pcsOnMachine;
        data.machinesInProcess.splice(removedObjectIndex, 1);
      }
    }

    findOrder.pcsOnMachine = findOrder.pcsOnMachine - pcsOnMachineToUpdate;
    findOrder.pendingPcs = findOrder.pendingPcs + pcsOnMachineToUpdate;

    const pendingProcessPcs = processOrderArr.filter(
      (ele) => ele.machineId !== machineId
    );

    await findOrders.save();
    return pendingProcessPcs;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

