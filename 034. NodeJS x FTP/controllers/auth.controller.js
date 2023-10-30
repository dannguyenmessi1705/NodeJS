const postLogin = (req, res) => {
  try {
    const { username, password } = req.body;
    const ftpOptions = {
      host: process.env.FTP_HOST || "localhost",
      port: process.env.FTP_PORT || 21,
      user: username,
      password: password,
    };
    const ftp = require("ftp");
    const client = new ftp();
    client.on("ready", () => {
      console.log("FTP login successful");
      res.cookie("ftpConnection", "aaaa", {sign: true});
      res.status(200).json({ message: "FTP login successful" });
    });

    client.on("error", (err) => {
      console.error("FTP login error:", err);
      res.status(401).json({ message: "Invalid username or password" });
    });

    client.connect(ftpOptions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  postLogin,
};
