const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");

exports.findMachinePcs = async () => {
  const getProcessPcs = await pcsOnMachineModel.find();
  return getProcessPcs;
};

exports.findOrderPcsWorking = async (orderId, tokenId) => {
  const getProcessPcs = await pcsOnMachineModel.findOne({
    orderId: orderId,
    tokenId: tokenId,
  });
  return getProcessPcs;
};

exports.createPcsInProcess = async (
  machineNo,
  pcsOnMachine,
  orderId,
  tokenId
) => {
  const createPcsOnMachine = await new pcsOnMachineModel({
    machinesInProcess: [
      {
        machineNo: machineNo,
        pcsOnMachine: pcsOnMachine,
      },
    ],
    orderId: orderId,
    tokenId: tokenId,
  });
  return createPcsOnMachine;
};

exports.findOrderPcsById = async (orderId) => {
  const findPcsInMachineById = await pcsOnMachineModel.find({
    orderId: orderId,
  });
  return findPcsInMachineById;
};

exports.updatePcsOnMachine = async (filter, update) => {
  const updateOrderOnMachine = await pcsOnMachineModel.updateOne(
    filter,
    update
  );
  return updateOrderOnMachine;
};

exports.findOrderByAllId = async (orderId, tokenId, machineId) => {
  const findOrderOnMachine = await pcsOnMachineModel.findOne({
    orderId: orderId,
    tokenId: tokenId,
    "machinesInProcess.machineId": machineId,
  });
  return findOrderOnMachine;
};
