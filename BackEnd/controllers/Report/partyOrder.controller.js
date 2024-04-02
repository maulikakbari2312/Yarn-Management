const partyReportService = require("../../service/Report/partyOrder.service");
exports.getPartyOrder = async (req, res) => {
  try {
    const { party, design } = req.query;
    const findMachineReport = await partyReportService.getPartyOrder(
      party,
      design
    );

    res.status(findMachineReport.status).send(findMachineReport);
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

exports.findPartyDesign = async (req, res) => {
  try {
    const { party } = req.query;
    const findMachineReport = await partyReportService.findPartyDesign(party);

    res.status(findMachineReport.status).send(findMachineReport);
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
