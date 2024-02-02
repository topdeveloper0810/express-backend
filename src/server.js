const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const dbConnect = require("./config/db");
const routes = require("./routes/api");

const app = express();

dotenv.config();
dbConnect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.get("/", (req, res) => {
  res.status(200).json("Server is running!");
});

app.use("/api/v1", routes);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port: http://${HOST}:${PORT}`);
});
