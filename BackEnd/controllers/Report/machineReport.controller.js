const machineReportService = require("../../service/Report/machineReport.service");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

const getPagination = (req) => {
  const limit = parseInt(req.query.limit, 10) || 1000;
  const offset = parseInt(req.query.offset, 10) || 0;
  return { limit, offset };
};

exports.getMachineReport = async (req, res) => {
  try {
    const findMachineReport = await machineReportService.findMachineReport();

    if (!Array.isArray(findMachineReport)) {
      return res.status(findMachineReport.status).send(findMachineReport);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findMachineReport.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "machine report is" : "machine reports are";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: findMachineReport,
      message: `Total ${totalItems} ${status} available`,
    };
   
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
