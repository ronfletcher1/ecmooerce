var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../database');
const bcrypt = require('bcrypt-nodejs')
const randToken = require('rand-token');

router.get('/auth/github',passport.authenticate('github'));

router.get('/auth/github/callback',passport.authenticate('github'),(req,res)=>{
  const selectQuery = `SELECT * FROM users WHERE username = $1`;
  const pgPromise = db.query(selectQuery,[req.user.username]);
  // console.log(pgPromise);
  pgPromise.then((data)=>{
    if(data.length === 0){
      console.log("Not Found")
      const insertQuery = `INSERT into users (username) VALUES ($1) returning id`;
      db.query(insertQuery,[req.user.username]).then((id)=>{
        const payload = {id, username: req.user.username}
        const token = jwt.sign(payload, config.jwtSecret, {expiresIn: "1d"});
        sendToken(res,token);
      }).catch((error)=>{
        res.json(error)
      })
    }else{
      console.log("Found")
      const payload = {id: data.id, username: data.username};
      const token = jwt.sign(payload, config.jwtSecret, {expiresIn: "1d"});
      console.log(token)
      sendToken(res, token);
    }
  }).catch((error)=>{
    res.json(error)
  })
})


function sendToken(res,token){
  res.send(
    `
        <script>
        window.opener.postMessage(
            {
            payload: ${JSON.stringify(token)},
            status: 'success'
            },
            window.opener.location
        );
    </script>
    `
    )
}

router.post('/register',(req, res)=>{
  // bcrypt
  // check if username exist
  const checkUsernameQuery = `SELECT * FROM users WHERE username = $1`;
  db.query(checkUsernameQuery,[req.body.username]).then((results)=>{
    // console.log(results);
    if(results.length === 0){
      // user does not exist!! Let's add them
      const insertUserQuery = `INSERT INTO users (username,password,token) VALUES ($1,$2,$3)`;
      const token = randToken.uid(50);
      // use bcrypt.hashSync to make their password something evil
      const hash = bcrypt.hashSync(req.body.password);
      db.query(insertUserQuery,[req.body.username,hash,token]).then(()=>{
        res.json({
          msg: "userAdded",
          token,
          username: req.body.username
        });
      })
    }else{
      // User exists. Goodbye.
      res.json({msg: "userExists"})
    }
  }).catch((error)=>{
    if(error){throw error;}
  })

  // if not, insert - username, hashed password
    // - create a token
  // if so, let react know
  // res.json(req.body);
})

router.post('/login',(req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  // 1. Get the row with this username from PG
  const selectUserQuery = `SELECT * FROM users WHERE username = $1`;
  db.query(selectUserQuery,[username]).then((results)=>{
    if(results.length === 0){
      // these aren't the droids we're looking for. Goodbye.
      res.json({
        msg: "badUser"
      })
    }else{
      // user exists.
      // now check password!
      const checkHash = bcrypt.compareSync(password, results[0].password)
      // checkHash is a bool!
      if(checkHash){
        // match! Create a new token
        const token = randToken.uid(50);
        // update the DB with the new Token
        const updateTokenQuery = `UPDATE users SET token = $1 
          WHERE username = $2`;
        db.query(updateTokenQuery,[token,username]).catch((error)=>{
          if (error){throw error};
        });
        res.json({
          msg: "loginSuccess",
          token,
          username
        })
      }else{
        // bogus password. Goodbye.
        // you don't want to sell me deathsticks.
        // you want to go home and rethink your life.
        res.json({
          msg: "badPassword"
        })
      }
    }
  }).catch((error)=>{
    if(error){throw error}
  })
})

module.exports = router;