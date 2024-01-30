const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // get the token from the authorization header
    const token = await req.headers.authorization.split(" ")[1];
    // check if the token matches the supposed origin
    const decodedToken = await jwt.verify(
      token,
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Yjk3ZDI0MWJmYjdkZmEwZjBmNDk5NSIsIm5hbWUiOiJlZWUiLCJpYXQiOjE3MDY2NTUwMjksImV4cCI6MTcwNjY1NTAzMn0.KzLe-bPYXYJSVgdoQykJkp6rPcItawUwfU9ZOX-53T8"
    );
    // retrieve the user details of the logged in user
    const user = await decodedToken;
    // pass the user down to the endpoints here
    req.user = user;
    // pass down functionality to the endpoint
    next();
  } catch (error) {
    res.status(401).json({ "error": error });
  }
};
