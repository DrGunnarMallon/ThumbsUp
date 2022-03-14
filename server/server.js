const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const session = require('express-session');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// Start up mongoose
connectDB();

// Initialise server
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/dashboard', require('./routes/dashboard'));
app.use('/auth', require('./routes/auth'));
app.use('/course', require('./routes/course'));
// app.use('/lecture', require('./routes/lecture'));
// app.use('/questionnaire', require('./routes/questionnaire'));
// app.use('/result', require('./routes/result'));

// Run express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
