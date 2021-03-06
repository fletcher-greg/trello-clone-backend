const User = require("../models/user/user");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretkey";

const getSafeUser = user => {
  return omit(user, ["__v", "_id", "password"]);
};

const signUserToken = id => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "7d" });
};

function getCookieOpts() {
  const afterSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60);

  const cookieOptions = {
    httpOnly: true,
    expires: afterSevenDays,
    signed: true
  };
  return cookieOptions;
}

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
    await jwt.verify(authToken, SECRET_KEY);

    return res.json({ token: authToken });
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ error });

    return res.status(500).send();
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).send();
  }

  const user = await User.findOne({ email });
  console.log(user);
  if (!user || !(await user.validatePassword(password))) {
    console.log("invalid");
    return res.json({ error: { message: "Invalid credentials" } });
  }

  // send a signed cookie with the token
  const token = signUserToken(user._id);
  console.log(token);
  console.log("we got the token");
  return res.cookie("authToken", token, getCookieOpts()).json({ token });
};
//  email subscription
const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).send();
  }
  //  TODO add the email to the database
  res.status(200).json({ message: "subscribed!" });
};

const initData = (req, res) =>
  res.json({
    cardData: [
      {
        title: "Awesome sauce",
        id: 0,
        cards: [
          { id: 0, text: "no you don't say", description: "", activity: [] }
        ]
      },
      {
        title: "Lols",
        id: 1,
        cards: [
          {
            id: 0,
            text: "Freedom",
            description: "",
            activity: [
              {
                id: 0,
                text: "We will, we will rock you",
                author: "Greg Fletcher",
                created: "10 minutes ago"
              }
            ]
          },
          { id: 1, text: "Billions", description: "", activity: [] }
        ]
      }
    ],
    dbSync: false,
    disconnected: false
  });
const updateDB = async (req, res) => {
  let data = req.body;

  // TODO update db
  return res.json({ message: "disconnected" });
};
module.exports = router => {
  router.post("/register", register);
  router.get("/loggedUser", loggedUser);
  router.post("/login", login);
  router.get("/cachedUser", cachedUser);
  router.post("/subscribe", subscribe);
  router.get("/user-data", initData);
  router.post("/update-user-list", updateDB);
};
