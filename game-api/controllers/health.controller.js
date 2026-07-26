function healthCheck(req, res) {
  res.status(200).json({ status: "ok" });
}

module.exports = {
  healthCheck
};