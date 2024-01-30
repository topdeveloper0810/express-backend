const free = (req, res) => {
  res.status(200).json("Free is running.");
};

const test = (req, res) => {
  res.status(200).json("Auth is running.");
};

module.exports = { free, test };
