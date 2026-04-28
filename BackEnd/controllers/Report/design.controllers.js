const designService = require("../../service/Report/design.service");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

exports.getReportDesign = async (req, res) => {
  try {
    const { name: matchingData } = req.body;
    const findDesign = await designService.findReportDesign(matchingData);
    const response = {
      design: findDesign,
      message: `design available`,
    };
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
