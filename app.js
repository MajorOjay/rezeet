const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const {option, PORT} = require('./config/config');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const mysqlStore = require('express-mysql-session');
const sitemap = require('express-sitemap');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();


/* Express */
const app = express();
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(express.static(path.join(__dirname, 'public')));



const sessionStore = new mysqlStore(option);


// JWT secret for activation code
const activationCodeSecret = 'your-secret-key';


/* Flash and Sessions */
app.use(flash());

app.use(session({
    store: sessionStore,
    name: 'userSession',
    secret: 'lahsermania',
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 14406666666}
}));


/* Method Override */
app.use(methodOverride('newMethod'));


/* Handlebars */
app.engine('handlebars', hbs({defaultLayout: 'default'}));
app.set('view engine', 'handlebars');




/* Routes */
const defaultRoutes = require('./routes/defaultRoutes')
app.use('/', defaultRoutes)

app.use('/*', function(req, res) {
    res.status(404).redirect('404')
});

app.listen(PORT, () =>  {
    console.log(`Your Server is running at port ${PORT}`)
})


