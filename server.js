//  NPM IMPORTS
const express = require("express");
const app = express();
const setAuth = express.Router();
const helmet = require("helmet");
//  LOCAL IMPORTS
const config = require("./config");
const authRoutes = require("./authentication");

//  CONFIGS
app.use(
  express.json(),

  express.urlencoded({ extended: true })
);
app.use(helmet());
config(); // init DB
authRoutes(setAuth);
app.use("/api/auth", setAuth);

const PORT = process.env.PORT || 3001;

// ROUTING

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
