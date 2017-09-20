const fs = require('fs');
const PdfDocument = require('pdfkit');
const highlight = require('highlight.js');
const constants = require('./constants.js');
const ThemeReader = require('./themeReader.js');
const FileRenderer = require('./fileRenderer.js');
const directoryCrawler = require('./directoryCrawler.js');


module.exports = {
  /**
   * @params {Object} opts
   * @params {String[]} opts.directories Paths to recurse over
   * @params {String} opts.outputFile Path to the PDF file to generate
   * @params {String} [opts.cssFile] Path to a css file for highlight.js
   * @params {Object} [opts.pageOptions] Options to pass to PDFKit
   */
  createPDF: function(opts) {
    let githubTheme = new ThemeReader(opts.cssFile || './themes/github.css');
    let paths = opts.directories;
    let files = [];
    paths.forEach((f) => {
      files = files.concat(directoryCrawler.crawl(f));
    });

    console.log("opts: ", opts)
    console.log(files);

    debugger;
    let pageOpts = Object.assign({}, {
      margin: constants.MARGINS.VERTICAL,
      size: 'A4'
    }, opts.pageOptions || {});

    let doc = new PdfDocument(pageOpts);

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

    doc.pipe(fs.createWriteStream(opts.outputFile))
    doc.end()
  }
}
