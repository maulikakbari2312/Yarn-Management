const message = require("../../common/error.message");
const companyModel = require("../../model/Master/company.model");

exports.createCompanyDetail = async (company) => {
  try {
    const getCompany = await companyModel.find();

    for (const ele of getCompany) {
      if (ele.name.toLowerCase() === company.name.toLowerCase()) {
        return {
          status: 400,
          message: "Company name cannot be the same!",
        };
      }
    }

    const companyData = {
      name: company.name,
      address: company.address,
      mobile: company.mobile,
    };
    const createCompanyDetail = new companyModel(companyData);
    const detail = await createCompanyDetail.save();

    return {
      status: 200,
      message: message.COMPANY_CREATED,
      data: detail,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findCompany = async () => {
  try {
    const getCompany = await companyModel.find();
    if (!getCompany) {
      return {
        status: 404,
        message: message.COMPANY_NOT_FOUND,
      };
    }
    return getCompany;
  } catch (error) {
    throw error;
  }
};

exports.editCompanyDetail = async (data, token) => {
  try {
    const existingCompany = await companyModel.findOne({
      name: { $regex: new RegExp(data.name, "i") },
    });

    if (
      existingCompany &&
      existingCompany.tokenId !== token &&
      existingCompany.name.toLowerCase() === data.name.toLowerCase()
    ) {
      return {
        status: 400,
        message: "Company name cannot be the same!",
      };
    }

    const companyData = {
      name: data.name,
      address: data.address,
      mobile: data.mobile,
    };

    const editCompany = await companyModel.findOneAndUpdate(
      { tokenId: token },
      companyData,
      { new: true }
    );

    if (!editCompany) {
      return {
        status: 404,
        message: message.COMPANY_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: message.COMPANY_DATA_UPDATED,
      data: editCompany,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteCompanyDetail = async (whereCondition) => {
  try {
    const deleteCompany = await companyModel.deleteOne({
      tokenId: whereCondition,
    });
    if (!deleteCompany) {
      return {
        status: 404,
        message: "Unable to delete company",
      };
    }
    return {
      status: 200,
      message: message.COMPANY_DELETE,
      data: deleteCompany,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
