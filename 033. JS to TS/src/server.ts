import express from 'express'
const app = express()

// Thiết lập các biến môi trường
import 'dotenv/config'

import compression from 'compression'
app.use(compression());

import morgan from 'morgan';
import fs from 'fs';
app.use(morgan('combined', {
  stream: fs.createWriteStream('./access.log', { flags: 'a' })
}))

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import cors from 'cors';
app.use(cors());

import path from 'path';
import rootDir from './util/path';
app.use(express.static(path.join(rootDir, 'public')));

import session from 'express-session';
import URL from './util/database';
import MongoDBSession from 'connect-mongodb-session';
const MongoDBStore = MongoDBSession(session);
const storeDB = new MongoDBStore({
  uri: URL,
  collection: 'sessions'
});

app.use(
  session({
    secret: process.env.SECRET_KEY_SESSION as string,
    resave: false,
    saveUninitialized: true,
    store: storeDB,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      signed: true
    }
  })
)

import {CreateCSRFTOKEN} from './middleware/csrfToken'
app.use(CreateCSRFTOKEN);

import multer from 'multer';
import {fileStorage, fileFilter} from './util/uploadFile'
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).single('image')
)

app.use('/images', express.static(path.join(rootDir, 'images')));

import flash from 'connect-flash'
app.use(flash());

import mongoose from 'mongoose'
import {Socket} from './util/socket'
mongoose.connect(URL).then(() => {
  const server = app.listen(process.env.PORT);
  const io = Socket.init(server)
  console.log('Server is running on port ' + process.env.PORT);
  io.on('connection', (socket: any) => {
    console.log('Client connected');
    socket.on('message', (message: any) => {
      console.log(message);
    })
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    })
  })
}).catch(err => {
  console.log(err);
})

import User from './models/users'
app.use(async (req: any, res: any, next: any) => {
  if (!req.session?.user) {
    res.locals.userId = undefined
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      res.locals.userId = undefined
      return next();
    }
    req.user = new User(user)
    res.locals.userId = req.session.user._id.toString();
    res.locals.username = req.session.user.username;
    res.locals.avatar = req.session.user.avatar;
    next();
  } catch (err) {
    next(err);
  }
})