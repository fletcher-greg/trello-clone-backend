//  NPM IMPORTS
const express = require("express");
const app = express();
const setAuth = express.Router();
//  LOCAL IMPORTS
const config = require("./config");
const authRoutes = require("./authentication");

//  CONFIGS
app.use(
  express.json(),

  express.urlencoded({ extended: true })
);
config();
authRoutes(setAuth);
app.use("/api/auth", setAuth);
const PORT = process.env.PORT || 3001;

// ROUTING

app.get("/api", (req, res) => {
  res.send("api");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
