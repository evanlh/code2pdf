const fs = require('fs');
const PdfDocument = require('pdfkit');
const highlight = require('highlight.js');
const constants = require('./constants.js');
const ThemeReader = require('./themeReader.js');
const FileRenderer = require('./fileRenderer.js');
// import PdfDocument from 'pdfkit';
// import highlight from './highlight';
// import constants from './constants';
// import ThemeReader from './themeReader';
// import FileRenderer from './fileRenderer';
// import { join } from 'path'
// import fs from 'fs'
const path = require('path');
const join = path.join;

let githubTheme = new ThemeReader('./themes/github.css');

function rreaddirSync (dir, allFiles = []) {
  const files = fs.readdirSync(dir).map(f => join(dir, f))
  //allFiles.push(...files)
  files.forEach(f => {
    let stat = fs.statSync(f)
    if (stat.isDirectory())  {
      rreaddirSync(f, allFiles)
    }
    else {
      allFiles.push(f);
    }
  })
  return allFiles
}

let files = rreaddirSync ('/Users/elh/code/preact/src');
console.log(files);
debugger;
let doc = new PdfDocument();
doc.fontSize(8);

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

doc.pipe(fs.createWriteStream('preact.pdf'))
doc.end()


