const companyModel = require("../../model/Master/company.model");

exports.findCompanies = async () => {
  return companyModel.find();
};

exports.createCompany = async (companyData) => {
  return new companyModel(companyData);
};

exports.updateCompany = async (token, companyData) => {
  return companyModel.findOneAndUpdate(
    { tokenId: token },
    companyData,
    { new: true }
  );
};

exports.deleteCompanyInfo = async (whereCondition) => {
  return companyModel.deleteOne({
    tokenId: whereCondition,
  });
};

exports.findParticularCompany = async (data) => {
  return companyModel.findOne({
    name: { $regex: new RegExp(data.name, "i") },
  });
};