//Configuration
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('posts', ['posts']);
var users = mongojs('users', ['users']);
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var cookieparser = require('cookie-parser');
var localStrategy = require('passport-local').Strategy;
var morgan = require('morgan');

var log = function (value) {
    console.log(Date() + ': ' + value)
}

app.use(morgan('tiny'));
app.use(express.static('/home/rfm/projects/mashtonmeals.com/'));
app.use(bodyParser.json());
app.use(cookieparser({secret: 'steve the cat'}));
app.set('trust proxy', 1)
app.use(session({
    secret: 'steve the cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    users.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new localStrategy(
    function (username, password, done) {
        log("auth request though passport")
        users.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username/password'});
            }
            if (!user.validatePassword(password)) {
                return done(null, false, {message: 'Incorrect username/password'});
            }
            return done(null, user);
        });
    }
));

var checkForAdmin = function() {
    users.users.findOne({ username: "admin"}, function(err, doc) {
        log(err + ' ' + doc)
        if (err) {
            log("error with 'admin' user" + err)

        } else if (!doc) {
            log('no error and no admin user doc')
            users.save( {username: 'admin', password: 'default'}, function(err, doc) {
                log('insert admin user callback');
                if (!err) {
                    log('no error: ' + doc);
                } else {
                    log('error inserting admin: ' + err);
                }
            });
        }
    });
};
//-------------------------------------

//Server Routes
var noPostsPost = [{
    title: "No posts to show",
    date: "7/31/2016",
    content: "Sorry the site has not yet launched or there was an error getting posts from the server"
}];

var eitherOr = function (err, docs) {
    log('entered processRequest')
    if (!err) {
        log('No error! sending ' + docs.length + 'docs from mongo')
        return docs
    } else {
        log('Error getting posts from mongo: ' + JSON.stringify(err));
        return err
    }
}

app.get('/posts', function (req, res) {
    log('get request to /posts')
    db.posts.find(function (err, docs) {
        log('finding all posts')
        res.send(eitherOr(err, docs))
    });
});

app.get('posts/:type', function (req, res) {
    log("request to /posts/" + req.params.type);
    db.posts.find({type: req.params.type}, function (err, docs) {
        log('sending ' + req.params.type)
            res.send(eitherOr(err, docs));
    });
});

//-------------------------------------

app.listen('3003', function () {
    log("listening on 3003")
    checkForAdmin()
});