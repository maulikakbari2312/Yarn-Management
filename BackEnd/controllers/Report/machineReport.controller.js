const machineReportService = require("../../service/Report/machineReport.service");
exports.getMachineReport = async (req, res) => {
  try {
    const findMachineReport = await machineReportService.findMachineReport();

    if (!Array.isArray(findMachineReport)) {
      return res.status(findMachineReport.status).send(findMachineReport);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findMachineReport.slice(startIndex, endIndex);

    const totalItems = findMachineReport.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "machine report is" : "machine reports are";

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
