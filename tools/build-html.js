const fs = require('fs');
const md = require('markdown-it')();
const path = require('path');
const md5File = require('md5-file')

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
        content: md.render(
            processImages(
                `../content/articles/${article.id}`,
                fs.readFileSync(path.join(__dirname, `../content/articles/${article.id}/content.md`)).toString())),
        summary: md.render(
            processImages(
                `../content/articles/${article.id}`,
                fs.readFileSync(path.join(__dirname, `../content/articles/${article.id}/summary.md`)).toString()))
    }))
}

function processImages(rootUrl, content) {
    const regex =/!\[.+\]\((.+)\)/g
    let result = content
    let m;
    do {
        m = regex.exec(content);

        if (!m) return result;

        const url = m[1];
        const filePath = path.join(__dirname, rootUrl, url);
        const hash = md5File.sync(filePath)
        const extension = url.split('.')[1];
        
        result = result.replace(url, `/public/${hash}.${extension}`);

        const file = fs.readFileSync(filePath);

        if (!fs.existsSync(path.join(__dirname, '../dist/public'))){
            fs.mkdirSync(path.join(__dirname, '../dist/public'));
        }

        fs.writeFileSync(path.join(__dirname, '../dist/public', `${hash}.${extension}`), file);

    } while (m);

    return result;
}

function CreateFrontPage() {
    let html = '';
    const articleTemplate = fs.readFileSync(path.join(__dirname, '../src/article-content.html')).toString()

    for (const article of articles) {
        html += articleTemplate
            .replace('{{heading}}', article.name)
            .replace('{{date}}', article.date)
            .replace('{{content}}', article.summary)
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