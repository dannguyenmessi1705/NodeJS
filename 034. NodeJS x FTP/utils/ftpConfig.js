const ftp = require("ftp");
const client = new ftp();
const ftpOptions = {
  host: process.env.FTP_HOST || "localhost",
  port: process.env.FTP_PORT || 21,
  user: undefined,
  password: undefined,
};
const loginFtp = ({ username, password }, callback) => {
  ftpOptions.user = username;
  ftpOptions.password = password;
  client.on("ready", () => {
    callback(null, client);
  });
  client.on("error", (err) => {
    console.error("FTP login error:", err);
    callback(err, null);
  });
  client.connect(ftpOptions);
};
const logoutFtp = (client) => {
  client.end();
};

module.exports = {
  loginFtp,
  logoutFtp,
};
