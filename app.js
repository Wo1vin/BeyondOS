const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db');
// const { default: mongoose } = require('mongoose');

// LOAD CONFIG
dotenv.config({ path: './config/.env' })

// PASSPORT CONFIG
require('./config/passport')(passport)

// CONNECT DB
connectDB()

const app = express()

// LOGGING
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// HANDLEBARS
// app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
//Sets handlebars configurations
app.engine('.hbs', exphbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: '.hbs',
    defaultLayout: 'main'
}));


// SESSION MIDDLEWARE
app.use(session({
    secret: 'keyboard cat',  // use what you want
    resave: false,  // we don't want to save a session if nothing is modified
    saveUninitialized: false,  // don't create a session until something is stored
    // cookie: { secure: true }
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI,
        mongooseConnection: mongoose.connection })
}))

// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

//ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))