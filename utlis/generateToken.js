var jwt = require("jsonwebtoken");
const generateToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

module.exports = {
  generateToken,
};
