const designService = require("../../service/Master/design.service");
const path = require("path");

exports.createDesign = async (req, res) => {
  try {
    const designDetails = {
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
      pallu: req.body.pallu,
      feeders: JSON.parse(req.body.feeders),
    };
        const designData = await designService.createDesignDetail(designDetails);

    if (!designData) {
      throw new Error("Please enter valid Design information!");
    }

    res.status(designData.status).send(designData);
  } catch (error) {
    console.log("==error==", error);
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

exports.getDesign = async (req, res) => {
  try {
    const findDesign = await designService.findDesign();

    if (!Array.isArray(findDesign)) {
      return res.status(findDesign.status).send(findDesign);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findDesign.slice(startIndex, endIndex);

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

exports.editDesign = async (req, res) => {
  try {
      const designDetails = {
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
      pallu: req.body.pallu,
      feeders: JSON.parse(req.body.feeders),
    };

    const token = req.params.tokenId;
    const editDesignData = await designService.editDesignDetail(
      designDetails,
      token
    );

    res.status(editDesignData.status).send(editDesignData);
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

exports.deleteDesign = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteDesignData = await designService.deleteDesignDetail(token);
    res.status(deleteDesignData.status).send(deleteDesignData);
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

exports.getImage = async (req, res) => {
  try {
    const imageName = req.params.image;
    const imagePath = path.join(__dirname, "../../Images", imageName);
    res.sendFile(imagePath);
  } catch (error) {
    console.error(error);

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
