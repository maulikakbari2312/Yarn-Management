const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");
const machineModel = require("../../model/Master/machine.model");

exports.findMachineReport = async () => {
  try {
    const findMachine = await machineModel.find();
    const findPcsOnMachine = await pcsOnMachineModel.find();

    let arr = [];
    for (const data of findPcsOnMachine) {
      if (data.machinesInProcess.length !== 0) {
        arr.push(...data.machinesInProcess);
      }
    }

    const machineReportArr = arr
      .map((ele) => {
        const machineData = findMachine.find(
          (data) => Number(data.machine) === ele.machineNo
        );
        if (machineData) {
          const repeat = ele.pcsOnMachine / machineData.panna;
          return {
            machineNo: ele.machineNo,
            pcsOnMachine: ele.pcsOnMachine,
            panna: machineData.panna,
            repeat,
          };
        }
        return null;
      })
      .filter((ele) => ele !== null);

    return machineReportArr;
  } catch (error) {
    throw error;
  }
};
