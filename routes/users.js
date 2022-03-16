/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  //Get All Users.
  router.get('/', (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //GET: All Users.
  router.get('/register', (req, res) => {
    res.render('register');
  });

  //GET: User Edit.
  router.get('/edit', (req, res) => {
    const templateVars = {
      username: req.session.username
    };
    res.render('edit', templateVars);
  });

  //POST: Change Username.
  router.post('/edit', (req, res) => {
    db.query(`UPDATE users SET name = $1 WHERE id = $2 RETURNING *;`, [req.body.submit, req.session.userId])
      .then((data) => {
        if (data.rows.length !== 0) {
          res.status(401).send(`Username is taken boss!`);
          return false;
        };
        req.session.username = data.rows[0].name;
        res.redirect('/');
      });
  });

  //GET Register User.
  router.post('/register', (req, res) => {
    const username = req.body.submit;
    db.query(`SELECT * FROM users WHERE name = $1`, [username])
      .then((data) => {
        if (data.rows.length !== 0) {
          res.status(401).send(`Username is taken boss!`);
          return false;
        };
        return true;
      })
      .then(ifNewUser => {
        if (ifNewUser) {
          db.query(`INSERT INTO users (name) VALUES ($1) RETURNING *;`, [username])
            .then((data) => {
              req.session.userId = data.rows[0].id;
              req.session.username = data.rows[0].name;
              res.redirect('/');
            })
            .catch((err) => {
              res.status(500).json({ error: err.stack });
            });
        }
      });
  });

  //POST: Login Route.
  router.post('/login', (req, res) => {
    const body = req.body.submit;
    db.query(`SELECT * FROM users WHERE name =$1`, [body])
      .then((data) => {
        if (data.rows.length !== 0) {
          const usersId = data.rows[0].id;
          const username = data.rows[0].name;
          if (usersId, username) {
            req.session.userId = usersId;
            req.session.username = username;
            res.redirect('/');
          };
        } else {
          res.status(403).send(`Invalid user information, register here: <a href="/users/register">Register!</a>`);
        };
      })
      .catch((err) => {
        res.status(500).json({ error: err.stack });
      });
  });
  //POST: Logout User.
  router.post('/logout', (req, res) => {
    if (req.session.userId) {
      req.session = null;
      res.redirect('/');
    } else {
      res.status(403).send(`Hey bud, please login before trying to logout!`);
    };
  });

  return router;
};
