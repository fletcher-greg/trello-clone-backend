const mongoose = require("mongoose");
module.exports = () => {
  //  DATABASE CONNECTION

  const DB_URI = process.env.MONGODB_URI || "mongodb://localhost/trello-clone";
  mongoose.connect(
    DB_URI,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    () => {
      console.info(`Connected to DB via ${DB_URI}`);
    }
  );
};
