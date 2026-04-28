const { findMachinePcs } = require("../../DBQuery/Order/pcsOnMachine");
const { findMachines } = require("../../DBQuery/Master/machine");

exports.findMachineReport = async () => {
  try {
    const findMachine = await findMachines();
    const findPcsOnMachine = await findMachinePcs();
    const machineByNo = new Map(
      findMachine.map((machine) => [Number(machine.machine), machine])
    );

    const arr = findPcsOnMachine.flatMap((data) => data.machinesInProcess || []);

    const machineReportArr = arr
      .map((ele) => {
        const machineData = machineByNo.get(ele.machineNo);
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
