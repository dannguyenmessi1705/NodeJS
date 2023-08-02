const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");

const adminRoute = require("./Routes/admin");
const personRoute = require("./Routes/user");
const notFoundRoute = require("./Routes/notFound");

const path = require("path");
const rootDir = require("./util/path.js");
app.use(express.static(path.join(rootDir, "public")));

// {Tạo bảng trong database} //
// Nếu bảng đã tồn tại thì không tạo lại, nếu chưa tồn tại thì tạo mới
const sequelize = require("./util/database");

// {Relationship} //
const Product = require("./models/products");
const User = require("./models/users");
const Cart = require("./models/carts");
const CartItem = require("./models/cartItems");
const Order = require("./models/orders");
const OrderItem = require("./models/orderItems");

// Tạo quan hệ 1-1 giữa Product và User (1 product chỉ có 1 user tạo ra)
Product.belongsTo(User, {
  constraints: true, // Tạo ràng buộc giữa 2 bảng để khi xóa 1 bảng thì bảng còn lại cũng bị xóa theo
  onDelete: "CASCADE", // Nếu user bị xóa thì product cũng bị xóa theo
});
User.hasMany(Product); // Tạo quan hệ 1-n giữa User và Product (1 user có thể tạo nhiều product)

Cart.belongsTo(User); // Tạo quan hệ 1-1 giữa Cart và User (1 cart chỉ thuộc về 1 user)
User.hasOne(Cart); // Tạo quan hệ 1-1 giữa User và Cart (1 user chỉ có 1 cart)

Cart.belongsToMany(Product, { through: CartItem }); // Tạo quan hệ n-n giữa Cart và Product (1 cart có thể có nhiều product), thông qua bảng trung gian CartItem
Product.belongsToMany(Cart, { through: CartItem }); // Tạo quan hệ n-n giữa Product và Cart (1 product có thể thuộc về nhiều cart), thông qua bảng trung gian CartItem

Order.belongsTo(User); // Tạo quan hệ 1-1 giữa Order và User (1 order chỉ thuộc về 1 user)
User.hasMany(Order); // Tạo quan hệ 1-n giữa User và Order (1 user có thể tạo nhiều order)

Order.belongsToMany(Product, { through: OrderItem }); // Tạo quan hệ n-n giữa Order và Product (1 order có thể có nhiều product), thông qua bảng trung gian OrderItem
Product.belongsToMany(Order, { through: OrderItem }); // Tạo quan hệ n-n giữa Product và Order (1 product có thể thuộc về nhiều order), thông qua bảng trung gian OrderItem

// {Check, tạo User và Model trong Database} //
sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        username: "Dan",
        email: "dan@gmail.com",
      });
    }
    return user;
  })
  .then((user) => {
    return user.createCart(); // Tạo cart cho user, sau khi khởi tạo 1 user mới
  })
  .then(() => {
    // Vì promise là 1 bất đồng bộ, nên phải đưa việc khởi động server vào trong hàm promise đê đợi kết quả trả về, chỉ khi thực hiện listen() thì các phương thức ở trên mới hoạt động => kiểm tra xong user rồi mới đến middleware
    const IP = "192.168.1.15";
    app.listen(3000, "localhost" || IP);
  })
  .catch((err) => {
    console.log(err);
  });

// {Middleware User} //
// Hàm này sẽ được thực hiện trước mọi request, nên nếu không có next() thì sẽ bị treo ở đây, ko cho thực hiện các chức năng khác nữa (Tạo xác thực giả cho người dùng, nếu có user thì gán user vào req.user, nếu không có thì gán null vào req.user)
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);
app.use(personRoute);
app.use(notFoundRoute);
