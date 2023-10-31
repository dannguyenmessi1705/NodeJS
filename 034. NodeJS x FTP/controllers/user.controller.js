const fs = require("fs");
const { loginFtp, logoutFtp } = require("../utils/ftpConfig");
const showList = (req, res) => {
  try {
    const username = req.username;
    const password = req.password;
    loginFtp({ username, password }, (err, client) => {
      if (err) {
        console.log("FTP login error:", err);
        res.status(500).json({ message: "Error connecting to FTP Server" });
        return;
      } else {
        client.list((err, list) => {
          if (err) {
            console.log("FTP list error:", err);
            res.status(500).json({ message: "Error retrieving FTP listing" });
            return;
          }
          client.end();
          const folders = [];
          const files = [];
          list.forEach((item) => {
            if (item.type === "d") {
              folders.push({
                name: item.name,
              });
            } else if (item.type === "-") {
              files.push({
                name: item.name,
              });
            }
          });
          res.status(200).json({ folders, files });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const accessFile = (req, res) => {
  try {
    const username = req.username;
    const password = req.password;
    const remoteFilePath = req.params.remoteFilePath;
    loginFtp({ username, password }, (err, client) => {
      client.get(remoteFilePath, (err, stream) => {
        if (err) {
          console.log("FTP get error:", err);
          res.status(500).json({ message: "Error retrieving file" });
          return;
        }
        stream.once("close", () => {
          client.end();
        });

        stream.pipe(res);
      });
      client.end();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadFile = (req, res) => {
  try {
    const username = req.username;
    const password = req.password;
    const remoteFilePath = req.params.remoteFilePath;
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
    }
    loginFtp({ username, password }, (err, client) => {
      if (err) {
        console.log("FTP login error:", err);
        res.status(500).json({ message: "Error connecting to FTP Server" });
        return;
      }
      client.put(file.path, remoteFilePath, (err) => {
        if (err) {
          console.log("FTP put error:", err);
          res.status(500).json({ message: "Error uploading file" });
          return;
        }
        client.end();
        res.status(200).json({ message: "File uploaded" });
      });
      fs.unlinkSync(file.path);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  showList,
  accessFile,
  uploadFile,
};
