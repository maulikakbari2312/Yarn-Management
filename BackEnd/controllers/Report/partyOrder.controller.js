const partyReportService = require("../../service/Report/partyOrder.service");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

exports.getPartyOrder = async (req, res) => {
  try {
    const { party, design } = req.query;
    const findMachineReport = await partyReportService.getPartyOrder(
      party,
      design
    );

    return res.status(findMachineReport.status).send(findMachineReport);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.findPartyDesign = async (req, res) => {
  try {
    const { party } = req.query;
    const findMachineReport = await partyReportService.findPartyDesign(party);

    return res.status(findMachineReport.status).send(findMachineReport);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
