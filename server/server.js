const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const { auth } = require("./middleware/auth");



//DB Config
const db = require("./config/keys").mongoURI

//Connect to MongoDb
mongoose.connect(
  db,
  { useNewUrlParser: true }
).then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  return res.json({ "hello": "so whats up and hoe are u doing" })
})

app.get('/api/user/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.name,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role
  })

})

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });

});

app.post('/api/users/login', (req, res) => {
  //find the mail
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed , email not found"
      })
    //compare password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "Email and password mismatch"
        })
      }
    })
    //generate token
    user.generateToken((err, user) => {
      if (err) res.status(400).send(err)
      res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true })
    })
  });


})

app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: true }, err)
    return res.status(200).json({ success: true })
  })
})


const port = process.env.PORT || 5001; //process.env.port is Herokus port if i choose to deploy the app there 
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
