exports.chatServer = (req, res) => {
  res.send("Server has been started");
};

exports.pingServer = (req, res) => {
  res.status(200).json({
    success: true,
  });
};
