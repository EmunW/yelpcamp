if(process.env.NODE_ENV !== 'production'){ // If the environment is not in production mode (We work on the app in development mode)
    require('dotenv').config() // Require the dotenv package (Takes the variables defined in the .env file and adds them to process.env)
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local'); // passport-local is having our own login method on the app instead of using twitter, google, etc.
const User = require('./models/user');
const helmet = require('helmet'); // helmet changes the behavior, turns on/off, or manipulates headers in the name of security

const mongoSanitize = require('express-mongo-sanitize'); // Prevents basic mongo injections
const MongoStore = require('connect-mongo');



// const Joi = require('joi'); // Not needed because we export 'joi' from our './schemas.js' file below
const ExpressError = require('./utils/ExpressError');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const dbUrl = process.env.DB_URL // Production database
//const dbUrl = 'mongodb://localhost:27017/yelp-camp' // Development database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("error")
    console.log(err)
})

app.engine('ejs', ejsMate);

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // Tells the database to only save after 24 * 3600 seconds if there are no changes to the database instead of saving everytime a user refreshes the page
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session', // Changes the session id cookie name to make it less vulnerable
    secret: 'thisshouldbeabettersecret!',
    resave: false, // Setting resave to false will make it so that the session cookie WILL NOT be reset for every request to the server
    saveUninitialized: true, // When an empty session object is created and no properties are set, it is in the uninitialized state
    cookie: {
        httpOnly: true, // Is the default but we put it here just to show, it is used for extra security
        // secure: true, // Cookies will only work in https
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // This counts in milliseconds, cookie expires a week from now
        maxAge: 1000 * 60 * 60 * 24 * 7 // Max age is one week
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.css",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.css",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({ // Just read the helmet docs to try and figure this out
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dkdcjy1wy/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize()); // Needed to initialize passport
app.use(passport.session()); // Needed for persistent login sessions, 'session(sessionConfig)' MUST be used before 'passport.session()'
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy with the authentication method defined in our User model

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // We turn 'public' into a static directory so we can use it in the boilerplate.ejs script without providing the full path

app.use(mongoSanitize());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success'); // Every single request will have access to flash('success') by using res.locals.success
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'coltttt@gmail.com', username: 'colttt'});
    const newUser = await User.register(user, 'chicken')
    res.send(newUser);
})



app.all('*', (req, res, next) => { // Runs only if nothing above this request ran
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
