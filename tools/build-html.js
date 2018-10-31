var fs = require('fs');
var md = require('markdown-it')();
var path = require('path');

function fromDir(startPath, filter, array){

    if (!fs.existsSync(startPath)){
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            array.push(filename);
            console.log('-- found: ',filename);
        };
    };
};

var markdownFiles = [];
fromDir('src/markdown', '.md', markdownFiles);

var result = markdownFiles.map(file => {
    var content = fs.readFileSync(file).toString();
    return md.render(content);
}).join('</article><article class="page__article">');

var source = fs.readFileSync('src/index.html');
fs.writeFileSync('dist/index.html', source.toString().replace('{{content}}', result));