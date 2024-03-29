const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ROUTES IMPORT
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const messageRouter = require('./routes/message');

const app = express();

// CORS
app.use(cors({
  //origin: 'http://localhost:5173',
  origin: 'https://top-we-text.vercel.app',
  credentials: true,
}));

// DB
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind((console, 'MongoDb error de conexión')));
console.log('Conectado a mongoDB');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES MIDDLEWARE
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
