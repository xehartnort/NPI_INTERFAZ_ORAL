const express = require('express')
const sqlite3 = require('sqlite3').verbose();

const app = express()
const port = 3000

// open the database
const db = new sqlite3.Database('./db/curiosidades.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected :D');
});


app.get('/historia', (request, response) => {
  if (request.query.idioma) {
    let sql = "SELECT * FROM historia WHERE idioma=? ORDER BY uso ASC";
    db.get(sql, [request.query.idioma], (err, row) => {
      if (err) {
        throw err;
      }
      response.send(row.texto);
      sql = `UPDATE historia SET uso = ${row.uso + 1} WHERE texto= "${row.texto}"`;
      db.run(sql, [], (err) => {
        if (err) {
          return console.error(err.message);
        }
      });
    });
  } else {
    // devuelve siempre la misma leyenda por defecto
    response.send('Hello from Express!')
  } 
});

app.get('/leyenda', (request, response) => {
  if (request.query.idioma) {
    let sql = "SELECT * FROM leyenda WHERE idioma=? ORDER BY uso ASC";
    db.get(sql, [request.query.idioma], (err, row) => {
      if (err) {
        throw err;
      }
      response.send(row.texto);
      sql = `UPDATE leyenda SET uso = ${row.uso + 1} WHERE texto= "${row.texto}"`;
      db.run(sql, [], (err) => {
        if (err) {
          return console.error(err.message);
        }
      });
    });
  } else {
    // devuelve siempre la misma leyenda por defecto
    response.send('Hello from Express!')
  } 
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})