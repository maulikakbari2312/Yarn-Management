const message = require("../../common/error.message");
const designModel = require("../../model/Master/design.model");
const fs = require("fs").promises;
const path = require("path");

exports.createDesignDetail = async (design) => {
  try {
    const getDesign = await designModel.find();

    for (const ele of getDesign) {
      if (ele.name.toLocaleLowerCase() === design.name.toLocaleLowerCase()) {
        return {
          status: 400,
          message: "Design name cannot be same!",
        };
      }
    }

    const createDesignDetail = new designModel(design);
    const detail = await createDesignDetail.save();
    return {
      status: 200,
      message: message.DESIGN_CREATED,
      data: detail,
    };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findDesign = async () => {
  try {
    const getDesign = await designModel.find();
    if (!getDesign) {
      return {
        status: 404,
        message: message.DESIGN_NOT_FOUND,
      };
    }
    return getDesign;
  } catch (error) {
    throw error;
  }
};

exports.editDesignDetail = async (data, token) => {
  try {
    const getDesign = await designModel.findOne({
      name: { $regex: new RegExp(data.name, "i") },
    });

    if (
      getDesign &&
      getDesign.tokenId !== token &&
      getDesign.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
    ) {
      return {
        status: 400,
        message: "Design name cannot be the same!",
      };
    }

    const newImage = data.image;

    if (newImage) {
      const existingDesign = await designModel.findOne({ tokenId: token });

      if (!existingDesign) {
        return {
          status: 404,
          message: "Design not found",
        };
      }

      if (existingDesign.image) {
        try {
          const imagePath = path.join(
            __dirname,
            "../Images",
            existingDesign.image
          );

          if (!imagePath) {
            return {
              status: 400,
              message: message.IMAGE_NOTFOUND,
            };
          }
          await fs.unlink(imagePath);
          console.log("Old image file deleted successfully");
        } catch (unlinkError) {
          console.error("Error deleting old image file:", unlinkError);
        }
      }
    }

    const editDesign = await designModel.findOneAndUpdate(
      { tokenId: token },
      data,
      { new: true }
    );

    if (!editDesign) {
      return {
        status: 404,
        message: "Design not found",
      };
    }

    return {
      status: 200,
      message: "Design data updated successfully",
      data: editDesign,
    };
  } catch (error) {
    if (error.colorCode === "ENOENT") {
      return {
        status: 404,
        message: "Image file not found",
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteDesignDetail = async (whereCondition) => {
  try {
    const findImage = await designModel.findOne({
      tokenId: whereCondition,
    });

    if (!findImage) {
      return {
        status: 404,
        message: "Design not found",
      };
    }

    const deleteDesign = await designModel.deleteOne({
      tokenId: whereCondition,
    });

    if (deleteDesign.deletedCount === 0) {
      return {
        status: 404,
        message: "Unable to delete Design",
      };
    }

    if (findImage.image) {
      try {
        const imagePath = path.join(__dirname, "../Images", findImage.image);
        if (!imagePath) {
          return {
            status: 400,
            message: message.IMAGE_NOTFOUND,
          };
        }

        await fs.unlink(imagePath);
        console.log("Image file deleted successfully");
      } catch (unlinkError) {
        console.error("Error deleting image file:", unlinkError);
      }
    } else {
      console.log("No image file found to delete");
    }

    return {
      status: 200,
      message: "Design deleted successfully",
      data: deleteDesign,
    };
  } catch (error) {
    console.error(error);

    if (error.colorCode === "ENOENT") {
      return {
        status: 404,
        message: "Image file not found",
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
