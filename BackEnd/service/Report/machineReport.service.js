const { findMachinePcs } = require("../../DBQuery/Order/pcsOnMachine");
const { findMachines } = require("../../DBQuery/Master/machine");

exports.findMachineReport = async () => {
  try {
    const findMachine = await findMachines();
    const findPcsOnMachine = await findMachinePcs();

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
