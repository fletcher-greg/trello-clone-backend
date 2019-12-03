const User = require("../models/user/");

const register = async (req, res) => {
  //  get user name and password
  const { email, firstName, lastName, password } = req.body;
  if (!email || !firstName || !lastName || !password)
    return res.status(400).send(); //  invalid entry

  try {
    const newUser = await User.create({ email, firstName, lastName, password });
  } catch (err) {
    if (err.name === "MongoError" && error.code === 11000) {
      return res.json({
        error: { field: "email", message: "This email already exists" }
      });
    }

    //  catch other errors
    return res.status(500).send();
  }
};

module.exports = router => {
  router.get("/api/register", register);
};
