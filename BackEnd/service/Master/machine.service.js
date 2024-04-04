const message = require("../../common/error.message");
const { findMachines, createMachine, findMachineById, updateMachine, deleteMachineById } = require("../../DBQuery/Master/machine");

exports.createMachineDetail = async (machine) => {
  try {
    const getMachine = await findMachines();

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
    const createMachineDetail = await createMachine(machineData);
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
    const getMachine = await findMachines();
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
    const getMachine = await findMachineById({ machine: data.machine });
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
    const editMachine = await updateMachine(token,machineData)

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

exports.deleteMachineDetail = async (token) => {
  try {
    const deleteMachine = await deleteMachineById(token);
  
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
