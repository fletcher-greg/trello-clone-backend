//  NPM IMPORTS
const express = require("express");
const app = express();
//  LOCAL IMPORTS
const config = require("./config");

//  CONFIGS
app.use(
  express.json(),

  express.urlencoded({ extended: true })
);
config();

const PORT = process.env.PORT || 3001;

// ROUTING

app.get("/api", (req, res) => {
  res.send("api");
});
app.get("/auth", (req, res) => res.send("authorized"));
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
