const jwt = require("jsonwebtoken");

const extractBearer = (authorization) => {
  if (typeof authorization !== "string") {
    return false;
  }
  const matches = authorization.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
};

module.exports.checkUser = (req, res, next) => {
  const token =
    req.headers.authorization && extractBearer(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Need token" });
  }

  // Vérifier la validité du token
  jwt.verify(token, process.env.PRIVATE_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Bad token" });
    }
    // const userId = decodedToken.userId;
    // if (req.body.userId && req.body.userId !== userId) {
    //   const message = "Not correct credentials user";
    //   res.status(401).json({ message });
    // }

    next();
  });
};
