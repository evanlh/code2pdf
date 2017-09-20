const fs = require('fs');
const PdfDocument = require('pdfkit');
const highlight = require('highlight.js');
const constants = require('./constants.js');
const ThemeReader = require('./themeReader.js');
const FileRenderer = require('./fileRenderer.js');
const directoryCrawler = require('./directoryCrawler.js');
const commander = require('commander');


commander
.option('-t, --theme <cssfile>', 'Specify theme css')
.option('-d, --directory <directory>', 'One or more directories to traverse')
.option('-o, --output <outputfile>', 'Path to write PDF file to')
.parse(process.argv);

if (!commander.directory || !commander.output) {
  commander.help();
}
debugger;
let githubTheme = new ThemeReader(commander.cssfile || './themes/github.css');

console.log(commander.opts())

let filenames = commander.directory.split(/\s+/);
let files = [];
filenames.forEach((f) => {
  files = files.concat(directoryCrawler.crawl(f));
});

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

doc.pipe(fs.createWriteStream(commander.output))
doc.end()


