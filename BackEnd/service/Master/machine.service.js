const message = require("../../common/error.message");
const machineModel = require("../../model/Master/machine.model");

exports.createMachineDetail = async (machine) => {
  try {
    const getMachine = await machineModel.find();

    for (const ele of getMachine) {
      if (ele.machine === machine.machine) {
        return {
          status: 400,
          message: "Machine cannot be the same!",
        };
      }
    }

    const machineData = {
      machine: machine.machine,
      panna: machine.panna,
    };
    const createMachineDetail = new machineModel(machineData);
    const detail = await createMachineDetail.save();

    return {
      status: 200,
      message: message.MACHINE_CREATED,
      data: detail,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findMachine = async () => {
  try {
    const getMachine = await machineModel.find();
    if (!getMachine) {
      return {
        status: 404,
        message: message.MACHINE_NOT_FOUND,
      };
    }
    return getMachine;
  } catch (error) {
    throw error;
  }
};

exports.editMachineDetail = async (data, token) => {
  try {
    const getMachine = await machineModel.findOne({ machine: data.machine });
    if (getMachine && getMachine.tokenId !== token) {
      return {
        status: 400,
        message: "Machine cannot be the same!",
      };
    }

    // if (!getMachine) {
    //   return {
    //     status: 404,
    //     message: message.MACHINE_NOT_FOUND,
    //   };
    // }

    const machineData = {
      machine: data.machine,
      panna: data.panna,
    };

    if (!machineData) {
      return {
        status: 400,
        message: message.MACHINE_NOT_FOUND,
      };
    }
    const editMachine = await machineModel.findOneAndUpdate(
      { tokenId: token },
      machineData,
      { new: true }
    );

    if (!editMachine) {
      return {
        status: 404,
        message: message.MACHINE_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: message.MACHINE_DATA_UPDATED,
      data: editMachine,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteMachineDetail = async (whereCondition) => {
  try {
    const deleteMachine = await machineModel.deleteOne({
      tokenId: whereCondition,
    });
    if (!deleteMachine) {
      return {
        status: 404,
        message: "Unable to delete machine",
      };
    }
    return {
      status: 200,
      message: message.MACHINE_DELETE,
      data: deleteMachine,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
