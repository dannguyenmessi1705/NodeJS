const { loginFtp, logoutFtp } = require("../utils/ftpConfig");

const postLogin = (req, res) => {
  try {
    const { username, password } = req.body;
    loginFtp({ username, password }, (err, client) => {
      if (err) {
        res.status(401).json({ message: "Invalid username or password" });
      } else {
        req.session.username = username;
        req.session.password = password;
        req.session.save(() => {
          console.log("FTP login successful");
          res.status(200).json({ message: "FTP login successful" });
          client.end();
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const postLogout = (req, res) => {
  try {
    const { client } = req.session;
    logoutFtp(client);
    req.session.destroy(() => {
      res.status(200).json({ message: "FTP logout successful" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  postLogin,
  postLogout,
};
