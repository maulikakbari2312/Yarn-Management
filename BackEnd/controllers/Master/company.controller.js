const companyService = require("../../service/Master/company.service");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

exports.createCompany = async (req, res) => {
  try {
    const companyData = await companyService.createCompanyDetail(req.body);

    if (!companyData) {
      throw new Error("Please enter valid company information!");
    }
    
    return res.status(companyData.status).send(companyData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getCompany = async (req, res) => {
  try {
    const findCompany = await companyService.findCompany();

    if (!Array.isArray(findCompany)) {
      return res.status(findCompany.status).send(findCompany);
    }

    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;

    const pageItems = findCompany;

    const totalItems = findCompany.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "company" : "companies";

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

exports.editCompany = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editCompanyData = await companyService.editCompanyDetail(
      req.body,
      token
    );  

    return res.status(editCompanyData.status).send(editCompanyData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteCompanyData = await companyService.deleteCompanyDetail(token);

    return res.status(deleteCompanyData.status).send(deleteCompanyData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
