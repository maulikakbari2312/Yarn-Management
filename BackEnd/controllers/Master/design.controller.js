const designService = require("../../service/Master/design.service");
const path = require("path");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

const buildDesignDetails = (req, withDefaultPallu) => ({
  name: req.body.name,
  pick: req.body.pick,
  reed: req.body.reed,
  hook: req.body.hook,
  dashRepeat: req.body.dashRepeat,
  feeder: req.body.feeder,
  image: req.file.filename,
  avgPick: req.body.avgPick,
  totalCards: req.body.totalCards,
  finalCut: req.body.finalCut,
  ground: req.body.ground,
  pallu: withDefaultPallu ? (req.body.pallu ? req.body.pallu : 0) : req.body.pallu,
  feeders: JSON.parse(req.body.feeders),
});

exports.createDesign = async (req, res) => {
  try {
    const designDetails = buildDesignDetails(req, true);
    const designData = await designService.createDesignDetail(designDetails);

    if (!designData) {
      throw new Error("Please enter valid Design information!");
    }

    return res.status(designData.status).send(designData);
  } catch (error) {
    console.log("==error==", error);
    return handleControllerError(error, res);
  }
};

exports.getDesign = async (req, res) => {
  try {
    const findDesign = await designService.findDesign();

    if (!Array.isArray(findDesign)) {
      return res.status(findDesign.status).send(findDesign);
    }

    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;

    const pageItems = findDesign;

    const totalItems = findDesign.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "design" : "designs";

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

exports.editDesign = async (req, res) => {
  try {
    const designDetails = buildDesignDetails(req, false);

    const token = req.params.tokenId;
    const editDesignData = await designService.editDesignDetail(
      designDetails,
      token
    );

    return res.status(editDesignData.status).send(editDesignData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteDesignData = await designService.deleteDesignDetail(token);
    return res.status(deleteDesignData.status).send(deleteDesignData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getImage = async (req, res) => {
  try {
    const imageName = req.params.image;
    const imagePath = path.join(__dirname, "../../Images", imageName);
    return res.sendFile(imagePath);
  } catch (error) {
    console.error(error);
    return handleControllerError(error, res);
  }
};
