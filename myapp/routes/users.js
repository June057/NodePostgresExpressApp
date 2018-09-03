var express = require('express');
var router = express.Router();
const { Client, Pool } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password123',
    port: 5432,
});

client.connect();
const createQuery = {
     text : 'CREATE TABLE if not exists users(role_id VARCHAR(20) PRIMARY KEY, name VARCHAR(20), email VARCHAR(50),role_name VARCHAR(10))',
};
const insertQuery = {
     text : 'INSERT INTO users(role_id,name, email,role_name) VALUES($1, $2,$3,$4) RETURNING *',
};
const getQuery = {
     text : 'SELECT * from users',
};
const deleteQuery = {
     text : 'delete from users where role_id = $1',
};
const updateQuery = {
     text : 'UPDATE users SET name = $1 where role_id=$2',
};

createTable();

function createTable() {
    ProcessQuery(createQuery,function (err,result) {
        if(err) throw err;
        else
            console.log('Table created if not exists')
    });
}
/* GET users listing. */
router.post('/', function(req, res, next) {
    insertQuery.values = [req.body.id,req.body.name,req.body.email,req.body.role];
    ProcessQuery(insertQuery,function (err,result) {
        if(err) res.send(err);
        else
        res.send('data Inserted successfully')
    });
});

router.get('/', function(req, res, next) {
  ProcessQuery(getQuery,function (err,result) {
      if(err) res.send(err);
      else
      res.send(result)
  });
});


router.put('/', function(req, res, next) {
    updateQuery.values = [req.body.name, req.query.id];
    ProcessQuery(updateQuery, function (err, result) {
        if(err) res.send(err);
        else
        res.send('updated successfully');
    });
});

router.delete('/', function(req, res, next) {
    deleteQuery.values = [req.query.roleid];
    ProcessQuery(deleteQuery, function (err, result) {
        if(err) res.send(err);
        else
        res.send('data deleted successfully');
    });
});


function ProcessQuery(query,callback) {
    console.log(query);
    client.query(query)
        .then(res => callback(null,res.rows))
        .catch(err => callback(err,null))
}

module.exports = router;
