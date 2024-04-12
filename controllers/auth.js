const jwt = require("jsonwebtoken");
const fs = require("fs");

const User = require("../models/user");

/**********************************/
/*** Unit route for Auth resource */

// exports.signup = async (req, res) => {
//   const { email, password } = req.body;

//   // Check data from request
//   if (!email || !password) {
//     return res.status(400).json({ message: "Missing Data" });
//   }

//   try {
//     // Password Hash
//     let hash = await bcrypt.hash(
//       password,
//       parseInt(process.env.BCRYPT_SALT_ROUND)
//     );
//     req.body.password = hash;
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Bad credentials" });
  }

  try {
    let user = await User.findOne({
      where: { email: req.body.email },
      raw: true,
    });
    if (!user) {
      return res.status(400).json({ message: "This account doesn't exists" });
    }

    let isCorrectPassword = await User.checkPassword(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const secret = fs.readFileSync("./.certs/private.pem");
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      secret,
      {
        expiresIn: process.env.JWT_DURING,
        algorithm: "RS256",
      }
    );
    return res.json({ access_token: token });
  } catch (err) {
    if (err.name == "SequelizeDatabaseError") {
      res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(500).json({ message: "Login process failed", error: err });
  }
};
