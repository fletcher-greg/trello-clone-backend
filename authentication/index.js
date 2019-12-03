const User = require("../models/user/user");

const register = async (req, res) => {
  //  get user name and password
  console.log("hi");
  const { email, firstName, lastName, password } = req.body;
  if (!email || !firstName || !lastName || !password)
    return res.status(400).send(); //  invalid entry

  try {
    console.log("got here");
    console.log(email, firstName, lastName, password);
    const newUser = await User.create({ email, firstName, lastName, password });

    return res.json({ lol: "hi" });
  } catch (err) {
    if (err.name === "MongoError" && error.code === 11000) {
      return res.json({
        error: { field: "email", message: "This email already exists" }
      });
    }
    if (
      err.message ===
      "User validation failed: password: Password requires to have 8 characters minimum."
    ) {
      return res.json({
        field: "password",
        message: err.message
      });
    }
    //  catch other errors
    return res.status(500).send("went through everything");
  }
};

module.exports = router => {
  router.post("/register", register);
};
