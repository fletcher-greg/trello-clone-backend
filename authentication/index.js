const User = require("../models/user/user");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretkey";

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

    return res.json({ data: newUser.password });
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return res.json({
        error: { field: "email", message: "This email already exists" }
      });
    }
    if (err.password) {
      console.log("password errror");
      return res.json({ field: "password", message: err.password.message });
    }
    if (
      err.message ===
      "User validation failed: password: Password requires to have 8 characters minimum."
    ) {
      console.log("nope");
      return res.json({
        field: "password",
        message: err.message
      });
    }
    //  catch other errors
    return res.status(500).send("went through everything");
  }
};

const loggedUser = async (req, res) => {
  const { authorized } = req.headers;

  if (!authorized) {
    return res.status(204).send({ data: "not authorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id: userId } = await jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({ error: { message: "No User Found" } });
    }

    return res.json({ user: getSafeUser(user.toObject()) });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error });
    }

    return res.status(500).send();
  }
};
const cachedUser = async (req, res) => {
  const { authToken } = req.signedCookies;

  if (!authToken) {
    return res.status(204).send();
  }

  try {
    await jwt.verify(authToken, privateKey);

    return res.json({ token: authToken });
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ error });

    return res.status(500).send();
  }
};
module.exports = router => {
  router.post("/register", register);
  router.get("/loggedUser", loggedUser);
};
