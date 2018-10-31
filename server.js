const express = require('express')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 5000

express()
  .use('/public', express.static(path.join(__dirname, 'dist', 'public')))
  .get('/scripts.js', (req, res) => res.send(fs.readFileSync('dist/scripts.js') +''))
  .get('/styles.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.write(fs.readFileSync('dist/styles.css') +'');
    res.end();
  })
  .get('/', (req, res) => res.send(fs.readFileSync('dist/index.html') +''))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))