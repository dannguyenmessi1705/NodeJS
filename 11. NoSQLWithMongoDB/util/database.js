const { MongoClient, ServerApiVersion } = require("mongodb"); // Nhập vào object lấy từ module mongodb
const URL =
  "mongodb+srv://nodejsshop:12345@shop.zjodmkn.mongodb.net/?retryWrites=true&w=majority"; // URL của database
let _db; // Biến lưu trữ database
const client = new MongoClient(URL, {
  serverApi: {
    version: ServerApiVersion.v1, // Sử dụng phiên bản API 1
    strict: true, // Chỉ cho phép sử dụng những tính năng mới nhất của API
    deprecationErrors: true, // Hiển thị lỗi khi sử dụng những tính năng cũ
  },
}); // Tạo client kết nối với database

const mongoConnect = () => {
  client
    .connect() // Kết nối với database
    .then((result) => {
      console.log("Connected!");
      _db = result.db();
      // console.log(_db)
    }) // Lưu trữ database vào biến _db
    .catch((err) => {
      console.log(err);
      throw err;
    });
}; // Kết nối với database và lưu trữ database vào biến _db

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
}; // Trả về database

module.exports = {
  mongoConnect,
  getDB,
};
