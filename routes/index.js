const express = require('express');
const router  = express.Router();
const User    = require('../models/user').User;

const AuthError = require('../models/user').AuthError;
const path      = require('path');
const https     = require('https');

router.get('/status', (req, res) => res.send('API is on'));

router.get('/exists:username', (req, res,) => {
  const username = req.url.substring(req.url.lastIndexOf(':') + 1, req.url.length);
  User.findOne({ username: username }, (err, user) => {

    if (user === undefined || user === null) {
      res.json({ exists: false });
    } else
      res.json({ exists: true });
  });
});

router.get('/', (req, res,) => res.render('index', { username: null }));

router.get('/chat', (req, res) => {
  const username = req.query.username;
  res.render('chat', { username: username });
});

router.get('/register', (req, res,) => res.render('register', { username: null }));

router.post('/create', (req, res) => {
  const userJson = req.body;
  User.findOne({ username: userJson.username }, (err, user) => {
    if (user === undefined || user === null) {

      https.get('https://picsum.photos/200', (res1) => {
        const picUrl    = res1.headers.location;
        const userEntry = new User({ username: userJson.username, publicKey: userJson.key, userPictureUrl: picUrl });
        userEntry.save(err => {
          if (err) {
            console.log(err);
            return res.json({ successful: false });
          } else
            return res.json({ successful: true });
        });
      });
    } else
      res.render();
  });
});

router.get('/login*', (req, res) => {
  const username = decodeURIComponent(req.query.user);
  const key      = decodeURIComponent(req.query.key);

  User.authorize(username, key, (err, user) => {
    if (err) {
      if (err instanceof AuthError)
        res.status(403).send('');
      else
        res.status(500).send('');
    } else {

      res.status(200).send('');
    }
  });
});

module.exports = router;
