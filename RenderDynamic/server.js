const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// {Template Engine: Handlebars} //
const ExpressHdbs = require("express-handlebars"); // import module express-handlebars
app.engine(
  "hbs",
  ExpressHdbs.engine({
    layoutsDir: "views/handlebars/layout",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
); // cài đặt view engine là handlebars (file có đuôi .hbs), cài đặt thư mục chứa các file layout, cài đặt file layout mặc định, cài đặt đuôi file là .hbs
app.set("view engine", "hbs"); // cài đặt view engine là handlebars (file có đuôi .hbs)
app.set("views", "./views/handlebars"); // cài đặt thư mục chứa các file handlebars

/*
// {Template Engine: PUG} //
app.set("view engine", "pug"); // cài đặt view engine là pug
app.set("views", "./views/pug"); // cài đặt thư mục chứa các file pug
*/

const adminRoute = require("./Routes/admin");
const personRoute = require("./Routes/personal");
const notFoundRoute = require("./Routes/notFound");

const path = require("path");
const rootDir = require("./util/path.js");
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoute.route);
app.use(personRoute);

app.use(notFoundRoute);

app.listen(3000);
