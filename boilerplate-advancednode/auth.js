const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const GitHubStrategy = require('passport-github').Strategy;


module.exports = function (app, myDataBase) {
  // Serialization and deserialization here...
  // To serialize an object means to convert its contents into a small key that can then be deserialized into the original object. This is what allows us to know who has communicated with the server without having to send the authentication data, like the username and password, at each request for a new page.
  // The serializeUser is called with 2 arguments, the full user object and a callback used by passport. A unique key to identify that user should be returned in the callback, the easiest one to use being the user's _id in the object. It should be unique as it generated by MongoDB.
  passport.serializeUser((user, done) => {
    done(null, user._id);
});


  // deserializeUser is called with that key and a callback function for passport as well, but, this time, we have to take that key and return the full user object to the callback. To make a query search for a Mongo _id, you will have to create const ObjectID = require('mongodb').ObjectID;, and then to use it you call new ObjectID(THE_ID). Be sure to add MongoDB as a dependency
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  // This is defining the process to use when we try to authenticate someone locally. First, it tries to find a user in our database with the username entered, then it checks for the password to match, then finally, if no errors have popped up that we checked for, like an incorrect password, the user's object is returned and they are authenticated.
passport.use(new LocalStrategy(
  function(username, password, done) {
    myDataBase.findOne({ username: username }, function (err, user) {
      console.log('User '+ username +' attempted to log in.');
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!bcrypt.compareSync(password, user.password)) { 
        return done(null, false);
      }
      return done(null, user);
    });
  }
));
// To set up the GitHub strategy, you have to tell Passport to use an instantiated GitHubStrategy, which accepts 2 arguments: an object (containing clientID, clientSecret, and callbackURL) and a function to be called when a user is successfully authenticated, which will determine if the user is new and what fields to save initially in the user's database object. 
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://boilerplate-advancednode.pablomedina1.repl.co/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Database logic here with callback containing our user object
    // findOneAndUpdate allows you to search for an object and update it. If the object doesn't exist, it will be inserted and made available to the callback function. In this example, we always set last_login, increment the login_count by 1, and only populate the majority of the fields when a new object (new user) is inserted. Notice the use of default values. Sometimes a profile returned won't have all the information filled out or the user will keep it private. In this case, you handle it to prevent an error.
    myDataBase.findOneAndUpdate(
  { id: profile.id },
  {
    $setOnInsert: {
      id: profile.id,
      name: profile.displayName || 'John Doe',
      photo: profile.photos[0].value || '',
      email: Array.isArray(profile.emails)
        ? profile.emails[0].value
        : 'No public email',
      created_on: new Date(),
      provider: profile.provider || ''
    },
    $set: {
      last_login: new Date()
    },
    $inc: {
      login_count: 1
    }
  },
  { upsert: true, new: true },
  (err, doc) => {
    return cb(null, doc.value);
  }
);
  }
));
}