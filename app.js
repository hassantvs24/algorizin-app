require('dotenv').config();
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require("helmet");

const db = require('./config/db');//Database

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoutes');
const assessmentRouter = require('./routes/assessment');

const app = express();

db.connect();
app.use(cors())
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/assessment', assessmentRouter);

module.exports = app;
