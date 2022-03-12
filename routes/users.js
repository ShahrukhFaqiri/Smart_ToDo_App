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
    }
    res.render('edit', templateVars)
  })

  //POST: Change Username.
  router.post('/edit', (req, res) => {
    const templateVars = {
      username: req.session.username
    }
    // console.log(`User Submitted:`,req.body.submit);
    // console.log(`I have stored the ID,`, req.session)
    db.query(`UPDATE users SET name = $1 WHERE id = $2 RETURNING *;`, [req.body.submit, req.session.userId])
    .then((data)=>{
      console.log(`We are in here`, data)
      res.render('edit', templateVars);
    })

  });

  //GET Register User.
  router.post('/register', (req, res) => {
    const username = req.body.submit;
    // db.query(`SELECT name FROM users WHERE name = $1`, [username])
    // .then((data)=>{
    //   if(username === data.rows[0].name){
    //     return res.status(401).send(`Username is taken boss!`);
    //   }
    // })
  //
    db.query(`INSERT INTO users (name) VALUES ($1) RETURNING *;`, [username])
      .then((data) => {
        req.session.userId = data.rows[0].id;
        req.session.username = data.rows[0].name;
        res.redirect('/');
      })
      .catch((err) => {
        res.status(500).json({ error: err.stack });
      });
  });

  //POST: Login Route.
  router.post('/login', (req, res) => {
    const body = req.body.submit;
    db.query(`SELECT * FROM users WHERE name =$1`, [body])
      .then((data) => {
        const usersId = data.rows[0].id;
        const username = data.rows[0].name;
        if (usersId, username) {
          req.session.userId = usersId;
          req.session.username = username;
          res.redirect('/');
        }
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
    }
    res.status(403).send(`Hey bud, please login before trying to logout!`);
  });

  return router;
};
