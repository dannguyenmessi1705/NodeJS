const rootDir = require("../util/path");
const path = require("path");
const fs = require("fs");

const pathFile = path.join(rootDir, "data", "cart.json"); // Lấy đường dẫn tới file cart.json

// Tạo class Cart chứa thông tin sản phẩm đã thêm vào giỏ hàng và tổng giá tiền của chúng (trường hợp mua nhiều hơn 1)
class Cart {
  // hàm static không cân phải tạo thêm đồi tượng mới bằng new, vì sản phẩm đưa vào cart này luôn có sẵn
  static addCart(ID, price) {
    // --- Lấy ra tất cả sản phẩm có trong giỏ hàng từ trước ---- //
    // Đọc file cart.json
    fs.readFile(pathFile, (err, fileContent) => {
      // Khởi tạo biến cart ban đầu chưa có sản phẩm nào, và giá bằng 0
      let cart = {
        products: [],
        totalPrice: 0,
      };
      // Nếu quá trình thực hiện không có lỗi, truyền dữ liệu từ file vào biến cart
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // --- Phân tích sản phẩm, kiểm tra xem sản phẩm thêm vào có trùng hay không ---//
      let isExistProductIndex = cart.products.findIndex(
        (product) => product.id === ID
      ); // Tạo biến kiểm tra xem ID của sản phẩm thêm vào có trùng với id sản phẩm đã có sẵn trong giỏ hàng ko
      // Nếu không tìm được thì isExistProductIndex = -1
      let isExistProduct = cart.products[isExistProductIndex];
      let updateCart; // Tạo biến để cập nhật lại giỏ hàng khi có sự kiện thêm sản phẩm vào giỏ
      // Nếu sản phẩm thêm vào trong giỏ ko bị trùng

      // --- Thêm sản phẩm mới hoặc cập nhật lại số lượng
      if (!isExistProduct) {
        // Tạo sản phẩm mới cho giỏ hàng với id = ID của sản phẩm thêm vào, số lượng = 1
        updateCart = {
          id: ID,
          count: 1,
        };
        cart.products = [...cart.products, updateCart]; // Thêm sản phẩm mới đó vào trong giỏ hàng cùng với các sản phẩm có sẵn
      }
      // Ngược lại, nếu san phẩm thêm vào đã có sẵn trong giỏ hàng
      else {
        updateCart = { ...isExistProduct }; // Kế thừa thuộc tính từ sản phẩm đang có sẵn trong giỏ hàng
        updateCart.count = updateCart.count + 1; // Tăng số lượng sản phâm lên
        cart.products = [...cart.products]; // Lấy mảng danh sách các sản phâm có trong giỏ hàng đưa lại vào mảng
        cart.products[isExistProductIndex] = updateCart; // cập nhật lại sản phẩm (cụ thể là số lượng) khi thêm vào giỏ sản phẩm đã có sẵn
      }
      cart.totalPrice = +cart.totalPrice + +price; // Cập nhật lại tổng giá sản phẩm sau khi thêm giỏ hàng
      // Thêm lại dữ liệu vào file cart.json
      fs.writeFile(pathFile, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  // {DELETE CART} //
  static deleteCartItem(ID, price) {
    // Đọc DL từ file
    fs.readFile(pathFile, (err, fileContent) => {
      if (err) return;
      const carts = JSON.parse(fileContent);
      // Tìm vị trísản phẩm trong giỏ muốn xoá thông qua ID
      const deleteCartIndex = carts.products.findIndex(
        (product) => product.id == ID
      );
      // Nếu không tìm được thì chứng tỏ không có sản phẩm nào trong giỏ hàng
      if (deleteCartIndex < 0) {
        return;
      }
      // Nếu tìm được
      let updateCart = {...carts}; // Lấy dữ liệu của file truyền vào biến mới
      updateCart.totalPrice -=
        updateCart.products[deleteCartIndex].count * +price; // Cập nhật lại tổng giá sản phẩm trong giỏ sau khi xoá
      updateCart.products.splice(deleteCartIndex, 1); // Xoá sản phẩm trong giỏ hàng
      // Ghi lại dữ liệu ra file
      fs.writeFile(pathFile, JSON.stringify(updateCart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  // {UPDATE CART} //
  static UpdateCartItem(ID, oldPrice, newPrice) {
    // Đọc DL từ file
    fs.readFile(pathFile, (err, fileContent) => {
      if (err) return;
      const carts = JSON.parse(fileContent);
      // Tìm vị trísản phẩm trong giỏ muốn cập nhật giá thông qua ID
      const updateCartIndex = carts.products.findIndex(
        (product) => product.id == ID
      );
      // Nếu không tìm được thì chứng tỏ không có sản phẩm nào trong giỏ hàng
      if (updateCartIndex < 0) {
        return;
      }
      // Nếu tìm được
      let updateCart = {...carts}; // Lấy dữ liệu của file truyền vào biến mới
      updateCart.totalPrice = (updateCart.totalPrice - updateCart.products[updateCartIndex].count * +oldPrice) + (updateCart.products[updateCartIndex].count * +newPrice); // Cập nhật lại tổng giá sản phẩm trong giỏ sau khi Update lại giá
      // Ghi lại dữ liệu ra file
      fs.writeFile(pathFile, JSON.stringify(updateCart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
}

module.exports = Cart;
