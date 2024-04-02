const companyService = require("../../service/Master/company.service");
exports.createCompany = async (req, res) => {
  try {
    const companyData = await companyService.createCompanyDetail(req.body);

    if (!companyData) {
      throw new Error("Please enter valid company information!");
    }
    
    res.status(companyData.status).send(companyData);
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

exports.getCompany = async (req, res) => {
  try {
    const findCompany = await companyService.findCompany();

    if (!Array.isArray(findCompany)) {
      return res.status(findCompany.status).send(findCompany);
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findCompany.slice(startIndex, endIndex);

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

exports.editCompany = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editCompanyData = await companyService.editCompanyDetail(
      req.body,
      token
    );  

    res.status(editCompanyData.status).send(editCompanyData);
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

exports.deleteCompany = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteCompanyData = await companyService.deleteCompanyDetail(token);

    res.status(deleteCompanyData.status).send(deleteCompanyData);
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
