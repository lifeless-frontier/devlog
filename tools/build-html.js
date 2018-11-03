const fs = require('fs');
const md = require('markdown-it')();
const path = require('path');
const extractSummary = require('extract-summary')

const articles = loadArticles();
CreateFrontPage();
CreateArticlePages();

fs.writeFileSync('dist/CNAME', 'www.lifeless-frontier.com'); 

function loadArticles() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../content/articles.json')).toString())
    .map(article => ({
        id: article.id,
        name: article.name,
        date: article.date,
        content: md.render(fs.readFileSync(path.join(__dirname, `../content/articles/${article.id}/content.md`)).toString())
    }))
}

function CreateFrontPage() {
    let html = '';
    const articleTemplate = fs.readFileSync(path.join(__dirname, '../src/article-content.html')).toString()

    for (const article of articles) {
        html += articleTemplate
            .replace('{{heading}}', article.name)
            .replace('{{date}}', article.date)
            .replace('{{content}}', extractSummary(article.content, 'html'))
            .replace('{{article-url}}', `/${article.id}`)
    }

    const source = fs.readFileSync('src/index.html');
    fs.writeFileSync('dist/index.html', source.toString().replace('{{content}}', html));
}

function CreateArticlePages() {
    const pageTemplate = fs.readFileSync(path.join(__dirname, '../src/article-page.html')).toString()

    for (const article of articles) {
        const html = pageTemplate
            .replace('{{heading}}', article.name)
            .replace('{{date}}', article.date)
            .replace('{{content}}', article.content);

        const dir = `dist/${article.id}`;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(`${dir}/index.html`, html);
    }
}