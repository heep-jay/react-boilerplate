const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");



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
  res.json({ "Hello~": "How are u doing? sho alrigft" })
})

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
      userData: doc
    });
  })

});

const port = process.env.PORT || 5001; //process.env.port is Herokus port if i choose to deploy the app there 
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
