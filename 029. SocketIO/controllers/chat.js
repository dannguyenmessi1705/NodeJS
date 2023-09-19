const getChat = (req, res, next) => {
  res.render("./admin/chat", {
    title: "Chat",
    path: "/chat",
  });
};

module.exports = {
    getChat,
}