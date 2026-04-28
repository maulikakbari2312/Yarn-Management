const machineService = require("../../service/Master/machine.service");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

exports.createMachine = async (req, res) => {
  try {
    const machineData = await machineService.createMachineDetail(req.body);

    if (!machineData) {
      throw new Error("Please enter valid machine information!");
    }

    return res.status(machineData.status).send(machineData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getMachine = async (req, res) => {
  try {
    const findMachine = await machineService.findMachine();

    if (!Array.isArray(findMachine)) {
      return res.status(findMachine.status).send(findMachine);
    }

    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;

    const pageItems = findMachine;

    const totalItems = findMachine.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "machine" : "machines";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status} available`,
    };
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.editMachine = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editMachineData = await machineService.editMachineDetail(
      req.body,
      token
    );

    return res.status(editMachineData.status).send(editMachineData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteMachine = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteMachineData = await machineService.deleteMachineDetail(token);

    return res.status(deleteMachineData.status).send(deleteMachineData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
