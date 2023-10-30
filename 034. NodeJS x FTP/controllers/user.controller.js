const fs = require("fs");

const showList = (req, res) => {
  try {
    const client = req.ftpConnection;
    console.log(client);
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
          file.push({
            name: item.name,
          });
        }
      });
      res.status(200).json({ folders, files });
    });
    client.on("error", (err) => {
      console.log("FTP error: ", err);
      res.status(500).json({ message: "Error connecting to FTP Server" });
    });
    client.connect();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadFile = (req, res) => {
  try {
    const remoteFilePath = req.params.remoteFilePath;
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
    }
    const client = req.ftpClient;
    client.put(file.path, remoteFilePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ message: "File uploaded" });
      }
      fs.unlinkSync(file.path);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  showList,
  uploadFile,
};
