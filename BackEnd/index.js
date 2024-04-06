const express = require("express");
const app = express();
require("dotenv").config();
var cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./server");
app.use(cors());
app.use("/Images", express.static("./Images"))

function routeSetup() {
  const routes = require("./Route/route");
  routes.setUp(app)
}
routeSetup();
app.get("/", (req, res) => {
  res.send("Shree Ganeshay Namah")
});

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.json'); // The path to your Swagger definition

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on port ${PORT}`);
});
