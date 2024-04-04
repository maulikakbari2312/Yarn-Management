const machineService = require("../../service/Master/machine.service");
exports.createMachine = async (req, res) => {
  try {
    const machineData = await machineService.createMachineDetail(req.body);

    if (!machineData) {
      throw new Error("Please enter valid machine information!");
    }

    res.status(machineData.status).send(machineData);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.getMachine = async (req, res) => {
  try {
    const findMachine = await machineService.findMachine();

    if (!Array.isArray(findMachine)) {
      return res.status(findMachine.status).send(findMachine);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findMachine.slice(startIndex, endIndex);

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
    res.status(200).send(response);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.editMachine = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editMachineData = await machineService.editMachineDetail(
      req.body,
      token
    );

    res.status(editMachineData.status).send(editMachineData);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.deleteMachine = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteMachineData = await machineService.deleteMachineDetail(token);

    res.status(deleteMachineData.status).send(deleteMachineData);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
