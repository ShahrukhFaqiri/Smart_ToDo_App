/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //Get All Users;
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

  //GET Register User.
  router.post("/register", (req, res) => {
    const username = req.body.submit;
    db.query(`INSERT INTO users (name) VALUES ($1) RETURNING *;`, [username])
      .then((res) => {
        console.log(res.rows)
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST: Login Route.
  router.post("/login", (req, res) => {
    const body = req.body.submit;
    db.query(`SELECT * FROM users WHERE name =$1`, [body])
      .then((data) => {
        const users = data.rows[0].name;
        if (users) {
          req.session.user = users;
          res.redirect("/");
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.stack });
      });
  });
  //POST: Logout User.
  router.post("/logout", (req, res) => {
    if (req.session.user) {
      req.session = null;
      res.redirect("/");
    }
    res.status(403).send(`Hey bud, please login before trying to logout!`)
  });

  return router;
};
