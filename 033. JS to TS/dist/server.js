"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Thiết lập các biến môi trường
require("dotenv/config");
const compression_1 = __importDefault(require("compression"));
app.use((0, compression_1.default)());
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
app.use((0, morgan_1.default)('combined', {
    stream: fs_1.default.createWriteStream('./access.log', { flags: 'a' })
}));
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
const path_1 = __importDefault(require("path"));
const path_2 = __importDefault(require("./util/path"));
app.use(express_1.default.static(path_1.default.join(path_2.default, 'public')));
const express_session_1 = __importDefault(require("express-session"));
const database_1 = __importDefault(require("./util/database"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const storeDB = new MongoDBStore({
    uri: database_1.default,
    collection: 'sessions'
});
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    store: storeDB,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        signed: true
    }
}));
const csrfToken_1 = require("./middleware/csrfToken");
app.use(csrfToken_1.CreateCSRFTOKEN);
const multer_1 = __importDefault(require("multer"));
const uploadFile_1 = require("./util/uploadFile");
app.use((0, multer_1.default)({
    storage: uploadFile_1.fileStorage,
    fileFilter: uploadFile_1.fileFilter
}).single('image'));
app.use('/images', express_1.default.static(path_1.default.join(path_2.default, 'images')));
const connect_flash_1 = __importDefault(require("connect-flash"));
app.use((0, connect_flash_1.default)());
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = require("./util/socket");
mongoose_1.default.connect(database_1.default).then(() => {
    const server = app.listen(process.env.PORT);
    const io = socket_1.Socket.init(server);
    console.log('Server is running on port ' + process.env.PORT);
    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('message', (message) => {
            console.log(message);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}).catch(err => {
    console.log(err);
});
const users_1 = __importDefault(require("./models/users"));
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
        res.locals.userId = undefined;
        return next();
    }
    try {
        const user = yield users_1.default.findById(req.session.user._id);
        if (!user) {
            res.locals.userId = undefined;
            return next();
        }
        req.user = new users_1.default(user);
        res.locals.userId = req.session.user._id.toString();
        res.locals.username = req.session.user.username;
        res.locals.avatar = req.session.user.avatar;
        next();
    }
    catch (err) {
        next(err);
    }
}));
