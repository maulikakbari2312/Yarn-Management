const machineModel = require("../../model/Master/machine.model");

exports.findMachines = async () => {
  const getMachine = await machineModel.find();
  return getMachine;
};

exports.createMachine = async (machineData) => {
  const createMachines = new machineModel(machineData);
  return createMachines;
};

exports.findMachineById = async (whereCondition) => {
    const findMachines = await machineModel.findOne({
      ...whereCondition
    });
    return findMachines;
  };

  exports.updateMachine = async (token,machineData) => {
    const updateMachine = await machineModel.findOneAndUpdate(
        { tokenId: token },
        machineData,
        { new: true }
      );
    return updateMachine;
  };

  exports.deleteMachineById = async (token) => {
    const deleteMachines = await machineModel.deleteOne({
      tokenId: token,
    });
    return deleteMachines;
  };