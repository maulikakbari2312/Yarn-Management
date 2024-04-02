const designService = require("../../service/Report/design.service");
exports.getReportDesign = async (req, res) => {
  try {
    const matchingData = req.body.name;
    const findDesign = await designService.findReportDesign(matchingData);
    const response = {
      design: findDesign,
      message: `design available`,
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
