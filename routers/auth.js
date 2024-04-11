const express = require("express");
const authCtrl = require("../controllers/auth");

/*** Get Expresss's router */
let router = express.Router();

/*********************************************/
/*** Middleware to log date for each request */
router.use((req, res, next) => {
  const event = new Date();
  console.log("AUTH Time:", event.toString());
  next();
});

/*** Routage de la ressource Auth */

router.post("/login", authCtrl.login);

module.exports = router;
