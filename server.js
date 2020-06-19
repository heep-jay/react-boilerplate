const express = require("express");
const app = express();
const mongoose = require("mongoose");



app.get("/", (req, res) => {
  res.send("hello world")
});

//DB Config
const db = require("./config/keys").mongoURI

//Connect to MongoDb
mongoose.connect(
  db,
  { useNewUrlParser: true }
).then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5001; //process.env.port is Herokus port if i choose to deploy the app there 

app.listen(port, () => console.log(`Server up and running on port
    ${port} !`));
