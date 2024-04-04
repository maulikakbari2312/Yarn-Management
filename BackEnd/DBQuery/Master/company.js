const companyModel = require("../../model/Master/company.model");

exports.findCompanies = async () => {
  const getCompany = await companyModel.find();
  return getCompany;
};

exports.createCompany = async (companyData) => {
  const createComp = await new companyModel(companyData)
  return createComp;
};

exports.updateCompany = async (token,companyData) => {
  const updateComp = await companyModel.findOneAndUpdate(
    { tokenId: token },
    companyData,
    { new: true }
  );
  return updateComp;
};

exports.deleteCompanyInfo = async (whereCondition) => {
  const deleteCompany = await companyModel.deleteOne({
    tokenId: whereCondition,
  });
  return deleteCompany;
};

exports.findParticularCompany = async (data) => {
  const findCompany = await companyModel.findOne({
    name: { $regex: new RegExp(data.name, "i") },
  });
  return findCompany;
};