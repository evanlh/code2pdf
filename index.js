const cheerio = require('cheerio');
const PdfDocument = require('pdfkit');
const highlight = require('highlight.js');
const fs = require('fs');
const constants = require('./constants.js');
const ThemeReader = require('./themeReader.js');
const FileRenderer = require('./fileRenderer.js');

let githubTheme = new ThemeReader('./themes/github.css');
let file = new FileRenderer('./node_modules/pdfkit/js/gradient.js');




let doc = new PdfDocument();
doc.fontSize(9);

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

file.render(doc, githubTheme);
doc.pipe(fs.createWriteStream('myfirst.pdf'))
doc.end()


