const fs = require('fs');
const PdfDocument = require('pdfkit');
const highlight = require('highlight.js');
const constants = require('./constants.js');
const ThemeReader = require('./themeReader.js');
const FileRenderer = require('./fileRenderer.js');
const directoryCrawler = require('./directoryCrawler.js');


let githubTheme = new ThemeReader('./themes/github.css');
let files = directoryCrawler.crawl('/Users/elh/code/relay/packages');

console.log(files);
let doc = new PdfDocument({
  margin: constants.MARGINS.VERTICAL,
  size: 'A4'
});

let pages = 0;
/*doc.on('pageAdded', e => {
  // add page #'s
  pages++;
  //doc.save();
  // doc.font('fonts/SourceCodePro-Bold.ttf');
  // doc.fillColor("black");
  // doc.fontSize(12);
  let pageNum = "" + pages;
  // let w = doc.widthOfString(pageNum);
  // doc.y = doc.page.height - 30;
  doc.text(pageNum, { align: "center" })
  //doc.restore();
})*/

files.forEach(file => {
  let fr = new FileRenderer(file);
  fr.render(doc, githubTheme);
});

doc.pipe(fs.createWriteStream('relay.pdf'))
doc.end()


