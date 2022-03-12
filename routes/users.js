/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const cookieSession = require("cookie-session");
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/login", (req, res) => {
    // console.log(`WE ARE HEREL`,req);
    const body = req.body.submit;

    db.query(`SELECT * FROM users WHERE name =$1`, [body])
      .then(data => {
        const users = data.rows[0].name;
        if(users) {
          req.session.user = users;
          res.redirect("/");
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.stack });
      });
  });


  return router;
};
