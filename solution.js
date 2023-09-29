const express = require("express");
const app = express();
const port = 3000;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./newkey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");
app.get("/signup.ejs", (req, res) => {
  res.render("signup");
});
app.get("/login.ejs", (req, res) => {
  res.render("login");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/loginsubmit", (req, res) => {
  const email = req.query.mail;
  const password = req.query.password;
  db.collection("users")
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.render("index");
      }
    });
});

app.get("/signupsubmit", (req, res) => {
  const first_name = req.query.first_name;
  const last_name = req.query.last_name;
  const email = req.query.email;
  const password = req.query.password;
  //Adding new data to collection
  db.collection("users")
    .add({
      name: first_name + " " + last_name,
      email: email,
      password: password,
    })
    .then(() => {
      res.render("index");
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
