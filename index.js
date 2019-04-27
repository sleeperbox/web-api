const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const Client = require('pg').Pool;
const client = new Client({
  user: 'aprizalc_sleeperbox',
  host: 'localhost',
  database: 'aprizalc_way',
  password: 'moalmakepassword',
  port: 5432,
})

const app = express();

app.get("/postgres", (req, res) => {
  client.connect()
  .then( () => console.log("Connect Postgres"))
  .catch( e => console.log(e))
});

 // at header
app.use(passport.initialize());
require("./config/passport");

app.use("/api", require("./routes/auth/google"));
app.use("/api", require("./routes/user/user"));
app.use("/api", require("./routes/user/rank"));
app.use("/api", require("./routes/user/uploadfoto"));
app.use("/api", require("./routes/friend/friend"));
app.use("/api", require("./routes/tags/tags"));
app.use("/api", require("./routes/posting/posting"));
app.use("/api", require("./routes/user/uploadfoto"));
app.use("/api", require("./routes/message/Message"));

app.use(morgan("combine"));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json({ type: "application/*+json" }));

app.get("/", (req, res) => {
  console.log("ok getting / ");
  res.send([
    {
      msg: "sukses"
    }
  ]);
});

app.listen(process.env.PORT || 8080, function() {
  console.log(" Starting server 8080....")
});
