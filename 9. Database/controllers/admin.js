const Product = require("../models/products");
const addProduct = (req, res) => {
  res.render("./admin/editProduct", {
    title: "Add Product",
    path: "/admin/add-product",
    editing: false, // Phân biệt với trạng thái Edit vs Add Product
  });
};

const postProduct = (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  const product = new Product(data, null);
  product.save();
  res.redirect("/");
};

const getProduct = (req, res) => {
  Product.fetchAll((products) => {
    res.render("./admin/products", {
      title: "Admin Product",
      items: products,
      path: "/admin/product",
    });
  });
};

// {ADD EDIT PRODUCT} //
const getEditProduct = (req, res) => {
  const isEdit = req.query.edit; // lấy giá trị của query 'edit' từ url (vd url = "http://.../edit-poduct?id=1&edit=true" => isEdit = "true")
  if (!isEdit) {
    // nếu không có query 'edit' thì chuyển hướng về trang chủ
    res.redirect("/");
  } else {
    // nếu có query 'edit'
    const ID = req.params.productID; // Lấy productID của url có routes động (http://.../:productID)
    Product.findByID(ID, (product) => {
      // Nếu ko tìm được product có id = ID
      if (!product) {
        res.redirect("/");
      }
      // Nếu tìm được render ra editProduct
      else {
        res.render("./admin/editProduct", {
          title: "Edit Product",
          path: "/admin/add-product",
          editing: isEdit, // truyền giá trị của query 'edit' vào biến editing để kiểm tra xem có phải đang ở trạng thái edit hay không
          item: product, // gán product vừa tìm được vào biến item để đưa vào file ejs
        });
      }
    });
  }
};
// {UPDATE PRODUCT} //
const postEditProduct = (req, res) => {
  const idUpdate = req.body.id; // Lấy id của product từ thẻ input đã được hidden trong editProduct.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
  const data = JSON.parse(JSON.stringify(req.body));
  const updateProduct = new Product(data, idUpdate);
  updateProduct.save();
  res.redirect("/admin/product");
};

// {DELETE PRODUCT} //
const deleteProduct = (req, res) => {
  const idDelete = req.body.id;
  Product.findByID(idDelete, (item) => {
    const delProduct = new Product(item, idDelete);
    delProduct.save("isDelete");
    res.redirect("/admin/product");
  });
};

module.exports = {
  addProduct,
  postProduct,
  getProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
};
