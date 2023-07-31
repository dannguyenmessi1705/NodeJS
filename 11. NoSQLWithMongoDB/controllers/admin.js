const Product = require("../models/products");
const addProduct = (req, res) => {
  res.render("./admin/editProduct", {
    title: "Add Product",
    path: "/admin/add-product",
    editing: false, // Phân biệt với trạng thái Edit vs Add Product
  });
};

// {CREAT PRODUCT In DATABASE From USER} //
// {USE SPECIAL METHOD SEQUELIZE} //
const postProduct = (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  const product = new Product(data.name, data.price, data.description, data.url)
  product.save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};
// /* Nếu không dùng Sepcial Method Sequelize thì dùng như sau:
// const postProduct = (req, res) => {
//   const data = JSON.parse(JSON.stringify(req.body));
//   Product.create({
//     name: data.name,
//     price: data.price,
//     description: data.description,
//     userId: req.user.id, // Lấy id của user đã được gán vào req.user ở middleware
//   })
//     .then((result) => res.redirect("/admin/product"))
//     .catch((err) => console.log(err));
// };
// */

// /*
// // {CREAT PRODUCT In DATABASE} //
// const postProduct = (req, res) => {
//   const data = JSON.parse(JSON.stringify(req.body));
//   console.log(data);
//   Product.create({
//     name: data.name,
//     price: data.price,
//     description: data.description,
//   })
//     .then((result) => res.redirect("/admin/product"))
//     .catch((err) => console.log(err));
// };
// */

// // {GET ALL PRODUCTS IN DATABASE From USER} //
// // {USE SPECIAL METHOD SEQUELIZE} //
// const getProduct = (req, res) => {
//   // dùng special method của sequelize để tạo 1 product mới từ user đã gán ở req bên middlewarevới các thuộc tính được truyền vào,
//   // thuộc tính userId được tự động gán bởi Sequelize
//   req.user
//     .getProducts()
//     .then((products) => {
//       res.render("./admin/products", {
//         title: "Admin Product",
//         items: products,
//         path: "/admin/product",
//       });
//     })
//     .catch((err) => console.log(err));
// };
// /*
// // {GET ALL PRODUCTS IN DATABASE} //
// const getProduct = (req, res) => {
//   Product.findAll()
//     .then((products) => {
//       res.render("./admin/products", {
//         title: "Admin Product",
//         items: products,
//         path: "/admin/product",
//       });
//     })
//     .catch((err) => console.log(err));
// };
// */

// // {EDIT PRODUCT IN DATABASE By USER} //
// // {USE SPECIAL METHOD SEQUELIZE} //
// const getEditProduct = (req, res) => {
//   const isEdit = req.query.edit;
//   if (!isEdit) {
//     res.redirect("/");
//   } else {
//     const ID = req.params.productID;
//     // dùng special method của sequelize để tạo 1 product mới từ user đã gán ở req bên middlewarevới các thuộc tính được truyền vào,
//     // thuộc tính userId được tự động gán bởi Sequelize
//     req.user
//       .getProducts({ where: { id: ID } }) // Phân quyền user, chỉ user mới truy cập đc
//       // Kết quả trả về 1 mảng => destructuring lấy phần tử đầu tiên chứa giá trị
//       .then(([product]) => {
//         res.render("./admin/editProduct", {
//           title: "Edit Product",
//           path: "/admin/add-product",
//           editing: isEdit, // truyền giá trị của query 'edit' vào biến editing để kiểm tra xem có phải đang ở trạng thái edit hay không
//           item: product, // gán product vừa tìm được vào biến item để đưa vào file ejs
//         });
//       })
//       .catch((err) => {
//         res.redirect("/");
//         console.log(err);
//       });
//   }
// };

// /*
// // {EDIT PRODUCT IN DATABASE} //
// const getEditProduct = (req, res) => {
//   const isEdit = req.query.edit; // lấy giá trị của query 'edit' từ url (vd url = "http://.../edit-poduct?id=1&edit=true" => isEdit = "true")
//   if (!isEdit) {
//     // nếu không có query 'edit' thì chuyển hướng về trang chủ
//     res.redirect("/");
//   } else {
//     // nếu có query 'edit'
//     const ID = req.params.productID; // Lấy productID của url có routes động (http://.../:productID)
//     Product.findByPk(ID) (nếu ko phân quyền user)
//       .then((product) => {
//         // Nếu tìm được render ra editProduct
//         res.render("./admin/editProduct", {
//           title: "Edit Product",
//           path: "/admin/add-product",
//           editing: isEdit, // truyền giá trị của query 'edit' vào biến editing để kiểm tra xem có phải đang ở trạng thái edit hay không
//           item: product, // gán product vừa tìm được vào biến item để đưa vào file ejs
//         });
//       })
//       .catch((err) => {
//         res.redirect("/");
//         console.log(err);
//       });
//   }
// };
// */

// // {UPDATE PRODUCT IN DATABASE FROM USER} //
// // {USE SPECIAL METHOD SEQUELIZE} //
// const postEditProduct = (req, res) => {
//   const idUpdate = req.body.id;
//   const data = JSON.parse(JSON.stringify(req.body));
//   // dùng special method của sequelize để tạo 1 product mới từ user đã gán ở req bên middlewarevới các thuộc tính được truyền vào,
//   // thuộc tính userId được tự động gán bởi Sequelize
//   req.user
//     .getProducts({ where: { id: idUpdate } })
//     // Kết quả trả về 1 mảng => destructuring lấy phần tử đầu tiên chứa giá trị
//     .then(([updateProduct]) => {
//       // Tìm được đối tượng từ database => update
//       return updateProduct
//         .update({
//           name: data.name,
//           price: data.price,
//           description: data.description,
//         })
//         .then(() => {
//           res.redirect("/admin/product");
//         });
//     })
//     .catch((err) => console.log(err));
// };
// /*
// // {UPDATE PRODUCT IN DATABASE} //
// const postEditProduct = (req, res) => {
//   const idUpdate = req.body.id; // Lấy id của product từ thẻ input đã được hidden trong editProduct.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
//   const data = JSON.parse(JSON.stringify(req.body));
//   Product.findByPk(idUpdate)
//     .then((updateProduct) => {
//       // Tìm được đối tượng từ database => update
//       return updateProduct
//         .update({
//           name: data.name,
//           price: data.price,
//           description: data.description,
//         })
//         .then(() => {
//           res.redirect("/admin/product");
//         });
//     })
//     .catch((err) => console.log(err));
// };
// */

// // {DELETE PRODUCT IN DATABASE} //
// const deleteProduct = (req, res) => {
//   const idDelete = req.body.id;
//   Product.findByPk(idDelete).then((product) => {
//     return product
//       .destroy()
//       .then(() => {
//         res.redirect("/admin/product");
//       })
//       .catch((err) => console.log(err));
//   });
// };

module.exports = {
  addProduct,
  postProduct,
  // getProduct,
  // getEditProduct,
  // postEditProduct,
  // deleteProduct,
};
