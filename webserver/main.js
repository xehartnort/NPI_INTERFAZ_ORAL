const express = require('express')
const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();
const xml = require('xml');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.info`
    // - Write all logs with level `info` and below to `combined.info`
    //
    new winston.transports.File({ filename: 'error.info', level: 'error' }),
    new winston.transports.File({ filename: 'combined.info' })
  ]
});

const app = express()
const port = 3000

// open the database
const db = new sqlite3.Database('./db/curiosidades.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    logger.error(err.message);
  }
  logger.info('Connected :D');
});


app.get('/historia', (request, response) => {
  if (request.query.idioma) {
    let sql = "SELECT texto, uso FROM historia WHERE idioma=? ORDER BY uso ASC";
    db.get(sql, [request.query.idioma], (err, row) => {
      if (err) {
        throw err;
      }
      response.set('Content-Type', 'text/xml');
      response.send(xml(row));
      sql = `UPDATE historia SET uso = ${row.uso + 1} WHERE texto= "${row.texto}"`;
      db.run(sql, [], (err) => {
        if (err) {
          return logger.error(err.message);
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
    let sql = "SELECT texto, uso FROM leyenda WHERE idioma=? ORDER BY uso ASC";
    db.get(sql, [request.query.idioma], (err, row) => {
      if (err) {
        throw err;
      }
      response.set('Content-Type', 'text/xml');
      response.send(xml(row));
      sql = `UPDATE leyenda SET uso = ${row.uso + 1} WHERE texto= "${row.texto}"`;
      db.run(sql, [], (err) => {
        if (err) {
          return logger.error(err.message);
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
    return logger.info('something bad happened', err)
  }

  logger.info(`server is listening on ${port}`)
});




