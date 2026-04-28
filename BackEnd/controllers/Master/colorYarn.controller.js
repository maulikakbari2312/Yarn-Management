const colorYarnService = require("../../service/Master/colorYarn.service");

const handleValidationOrInternalError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

exports.createColorYarn = async (req, res) => {
  try {
    const colorYarnData = await colorYarnService.createColorYarnDetail(
      req.body
    );

    if (!colorYarnData) {
      throw new Error("Please enter valid colorYarn information!");
    }

    return res.status(colorYarnData.status).send(colorYarnData);
  } catch (error) {
    return handleValidationOrInternalError(error, res);
  }
};

exports.getColorYarn = async (req, res) => {
  try {
    const findColorYarn = await colorYarnService.findColorYarn();

    if (!Array.isArray(findColorYarn)) {
      return res.status(findColorYarn.status).send(findColorYarn);
    }

    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;

    const totalItems = findColorYarn.length;

    const pageItems = findColorYarn;

    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "colorYarn" : "colorYarns";

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
    console.log("==error===", error);
    if (error.message === "ColorYarn not found") {
      return res.status(404).json({ error: "ColorYarn not found" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editColorYarn = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editColorYarnData = await colorYarnService.editColorYarnDetail(
      req.body,
      token
    );

    return res.status(editColorYarnData.status).send(editColorYarnData);
  } catch (error) {
    return handleValidationOrInternalError(error, res);
  }
};

exports.deleteColorYarn = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteColorYarnData = await colorYarnService.deleteColorYarnDetail(
      token
    );

    return res.status(deleteColorYarnData.status).send(deleteColorYarnData);
  } catch (error) {
    return handleValidationOrInternalError(error, res);
  }
};

exports.getColorCode = async (req, res) => {
  try {
    const { colorCode } = req.body;
    const findColorCode = await colorYarnService.findColorCode(colorCode);

    return res.status(findColorCode.status).send(findColorCode);
  } catch (error) {
    return handleValidationOrInternalError(error, res);
  }
};
