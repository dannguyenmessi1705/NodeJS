const products = require("../models/products");
const Product = require("../models/products");
// {ADD PRODUCT PAGE} //
const addProduct = (req, res) => {
  res.render("./admin/editProduct", {
    title: "Add Product",
    path: "/admin/add-product",
    editing: false, // Phân biệt với trạng thái Edit vs Add Product
  });
};

// {CREAT PRODUCT BY MONGOOSE} //
const postProduct = (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  const product = new Product({
    name: data.name,
    price: data.price,
    url: data.url,
    description: data.description,
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};

// {GET ALL PRODUCTS BY MONGOOSE} //
const getProduct = (req, res) => {
  Product.find()
    .select("name price url description -_id")
    .exec() // Chỉ lấy các thuộc tính name, price, url, description, bỏ thuộc tính _id
    .then((products) => {
      console.log(products);
      res.render("./admin/products", {
        title: "Admin Product",
        items: products,
        path: "/admin/product",
      });
    })
    .catch((err) => console.log(err));
};

// {GET EDIT PRODUCT BY MONGOOSE} //
const getEditProduct = (req, res) => {
  const isEdit = req.query.edit;
  if (!isEdit) {
    return res.redirect("/");
  }
  const ID = req.params.productID; // // Lấy route động :productID bên routes (URL) - VD: http://localhost:3000/product/0.7834371053383911 => ID = 0.7834371053383911
  Product.findById(ID)
    .then((product) => {
      res.render("./admin/editProduct", {
        title: "Edit Product",
        path: "/admin/add-product",
        editing: isEdit, // truyền giá trị của query 'edit' vào biến editing để kiểm tra xem có phải đang ở trạng thái edit hay không
        item: product, // gán product vừa tìm được vào biến item để đưa vào file ejs
      });
    })
    .catch((err) => console.log(err));
};

// {UPDATE PRODUCT BY MONGOOSE} //
const postEditProduct = (req, res) => {
  const data = req.body;
  const ID = req.body.id; // ".id" vì id được đặt trong thuộc tính name của thẻ input đã được hidden
  Product.findById(ID)
    .then((product) => {
      // Cập nhật lại các giá trị của product theo req.body
      product.name = data.name;
      product.price = data.price;
      product.url = data.url;
      product.description = data.description;
      // Lưu lại vào database
      return product
        .save()
        .then(() => {
          res.redirect("/admin/product");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  // Muốn nhanh hơn thì dùng method findByIdAndUpdate, ruy nhiên dùng save() có thể dùng được với middleware
};

// {DELETE PRODUCT BY MONGOOSE} //
const deleteProduct = (req, res) => {
  const ID = req.body.id; // ".id" vì id được đặt trong thuộc tính name của thẻ input đã được hidden
  Product.findByIdAndRemove(ID)
    .then(() => {
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};
module.exports = {
  addProduct,
  postProduct,
  getProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
};

/* 11. MongoDB 
const Product = require("../models/products");
const addProduct = (req, res) => {
  res.render("./admin/editProduct", {
    title: "Add Product",
    path: "/admin/add-product",
    editing: false, // Phân biệt với trạng thái Edit vs Add Product
  });
};

// {CREAT PRODUCT In MONGODB} //
const postProduct = (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  const product = new Product(
    data.name,
    data.price,
    data.url,
    data.description,
    req.user._id // Lấy id của user tạo product
  );
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};

// {GET ALL PRODUCTS IN MONGODB} //
const getProduct = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("./admin/products", {
        title: "Admin Product",
        items: products,
        path: "/admin/product",
      });
    })
    .catch((err) => console.log(err));
};

// /*
// {EDIT PRODUCT IN DATABASE} //
const getEditProduct = (req, res) => {
  const isEdit = req.query.edit; // lấy giá trị của query 'edit' từ url (vd url = "http://.../edit-poduct?id=1&edit=true" => isEdit = "true")
  if (!isEdit) {
    // nếu không có query 'edit' thì chuyển hướng về trang chủ
    res.redirect("/");
  } else {
    // nếu có query 'edit'
    const ID = req.params.productID; // Lấy productID của url có routes động (http://.../:productID)
    Product.findById(ID) // (nếu ko phân quyền user)
      .then((product) => {
        // Nếu tìm được render ra editProduct
        res.render("./admin/editProduct", {
          title: "Edit Product",
          path: "/admin/add-product",
          editing: isEdit, // truyền giá trị của query 'edit' vào biến editing để kiểm tra xem có phải đang ở trạng thái edit hay không
          item: product, // gán product vừa tìm được vào biến item để đưa vào file ejs
        });
      })
      .catch((err) => {
        res.redirect("/");
        console.log(err);
      });
  }
};

// {UPDATE PRODUCT IN DATABASE} //
const postEditProduct = (req, res) => {
  const idUpdate = req.body.id; // Lấy id của product từ thẻ input đã được hidden trong editProduct.ejs (mục đích dùng input là để lấy ra id của product đã có sẵn trong database, không cần phải thông qua việc kiểm tra id đó có tồn tại hay không)
  const data = JSON.parse(JSON.stringify(req.body));
  const productUpdate = new Product(
    data.name,
    data.price,
    data.url,
    data.description,
    req.user._id // id của user tạo product vẫn giữ nguyên
  );
  productUpdate
    .save(idUpdate)
    .then(() => {
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};

// {DELETE PRODUCT IN MONGODB} //
const deleteProduct = (req, res) => {
  const idDelete = req.body.id;
  Product.deleteById(idDelete)
    .then(() => {
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  addProduct,
  postProduct,
  getProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
};

*/
