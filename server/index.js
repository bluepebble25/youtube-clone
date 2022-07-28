const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const users = require('./router/users');
const comment = require('./router/comment');
const like = require('./router/like');
const videos = require('./router/videos');
const subscribe = require('./router/subscribe');

// config
require('dotenv').config({ path: '../.env'});
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// DB connection
const mongoose = require('mongoose');
mongoose.connect(MONGO_URI)
  .then(() => { console.log('MongoDB connected...'); })
  .catch(err => console.log(err));

// Routing
app.use('/api/users', users);
app.use('/api/comment', comment);
app.use('/api/like', like);
app.use('/api/videos', videos);
app.use('/api/subscribe', subscribe);

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});