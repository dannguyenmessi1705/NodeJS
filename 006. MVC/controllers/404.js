const notFound = (req, res) => {
  res.status(404).render("404", { title: "Page Not Found", path: "" });
}; // Trả về trang 404

module.exports = notFound;
