const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = 'postgres://postgres:allergen@localhost:5432/todo';

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "moutmout";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DouchBag' });
});

/* On fournit ce qui a été consommé par l'utilisateur  */
router.get('/v1/user/repas', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const token = req.header('Authorization').substring(7);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    //Get user_id from token
    client.query('SELECT user_id FROM auth, tokens WHERE auth.username = tokens.username AND token=($1)',
    [token], (err_, res_) => {
      user_id = res_.rows[0].user_id;
      // SQL Query > Select Data
      const query = client.query(
        'SELECT users.nom as nom, users.prenom, aliments.nom as aliment, compo_repas.qte, \
          to_char(repas.time, \'DD Mon YYYY HH24:MM\') as time  \
          FROM users, aliments, repas, compo_repas \
          WHERE aliments.id = compo_repas.alim_id \
          AND repas.id = compo_repas.repas_id \
          AND users.id = repas.user_id \
          AND user_id=($1)', [user_id]);
      // Stream results back one row at a time
      query.on('row', (row) => {
        results.push(row);
      });
      // After all data is returned, close connection and return results
      query.on('end', () => {
        done();
        return res.json(results);
      });
    });
  });
});


/* On fournit la liste des aliments disponibles  */
router.get('/v1/listeAliments', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT id, nom FROM aliments');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


/* On ajoute un repas consommé par l'utilisateur*/
router.post('/v1/ajoutRepas', (req, res, next) => {
  //We avoid the array being converted to string if there is only one element
  if( typeof req.body['qte[]'] === 'string' ) {
    req.body['aliments[]'] = [ req.body['aliments[]'] ];
  }
  if( typeof req.body['qte[]'] === 'string' ) {
    req.body['qte[]'] = [ req.body['qte[]'] ];
  }
  // Grab data from http request
  const data = {token: req.body.token.toString(), time: req.body.time,
   alim:req.body['aliments[]'], qte: req.body['qte[]']};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    //Get user_id from token
    client.query('SELECT user_id FROM auth, tokens WHERE auth.username = tokens.username AND token=($1)',
    [data.token], (err_, res_) => {
      user_id = res_.rows[0].user_id;
      // SQL Query > On insère le repas
      client.query('INSERT INTO repas(user_id, time) VALUES($1, $2) RETURNING id',
      [user_id, data.time], (err, result) => { 
        console.log(data.time);
        id_repas = result.rows[0].id;
        // On insére les aliments qui composent le repas.
        for (var i = 0; i < data.alim.length; i++){
          client.query('INSERT INTO compo_repas(alim_id, repas_id, qte) \
          values($1, $2, $3)', [data.alim[i], id_repas, data.qte[i]]);
        }
      });
    });
  }); // End of connection to the database
});


// On vérifie que l'utilisateur est bien dans la base de données
router.post('/v1/auth', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {username: req.body.username, password: req.body.password};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('SELECT password from auth \
                  WHERE username = ($1)', [data.username], 
                  (err, result) => { 
      auth_ok = result.rows[0].password == data.password;
      if(auth_ok){
        var token = jwt.sign({ id: data.username }, 'shhhhh');
        client.query('INSERT INTO tokens(username, token, max_time) \
                    VALUES ($1, $2, now() + interval \'1 hour\') \
                    ON CONFLICT (username) \
                    DO \
                      UPDATE \
                        SET token = EXCLUDED.token', 
                    [data.username, token]);
        return res.json({'content-type': 'text/html',
                          'authorization': token 
                          });
      }
      else{
        return res.status(401).json({success: false, data: err});
      }
    });
  });
});


module.exports = router;
