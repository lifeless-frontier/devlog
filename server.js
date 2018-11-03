const express = require('express')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 5000

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, './content/articles.json')).toString())

let server = express()
  .use('/public', express.static(path.join(__dirname, 'dist', 'public')))
  .get('/scripts.js', (req, res) => res.send(fs.readFileSync('dist/scripts.js').toString()))
  .get('/styles.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.write(fs.readFileSync('dist/styles.css') +'');
    res.end();
  })
  .get('/', (req, res) => res.send(fs.readFileSync('dist/index.html') +''));

for (const article of articles) {
  server = server.get(`/${article.id}`, (req, res) => res.send(fs.readFileSync(`dist/${article.id}/index.html`).toString()));
}

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))