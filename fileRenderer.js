const fs = require('fs');
const R = require('ramda');
const cheerio = require('cheerio');
const highlight = require('highlight.js');
const constants = require('./constants.js')

class FileRenderer {
  constructor(filename) {
    this.textNodes = [];

    this.fileName = filename;
    this.file = fs.readFileSync(filename, 'utf8');

    let highlighted = highlight.highlightAuto(this.file, ['javascript']);
    let html = highlighted.value
    let $ = cheerio.load(html);

    this.recurseNodes($(':root'), undefined, $);

    // put \n's in their own nodes by themselves
    this.textNodes = R.flatten(this.textNodes.map(n => {
      let splitText = this._newlineSplitter(n.text);
      return splitText.map(t => {
        return R.merge(n, { text: t });
      })
    }));
  }

  _newlineSplitter (text) {
    let splitted = text.split(/\n/);
    if (splitted.length === 1) {
      return splitted;
    }
    return R.intersperse("\n", splitted).filter(t => {
      return t.length !== 0;
    });
  }

  _replaceTabs (text) {
    return text.replace(/\t/g, '  ');
  }

  recurseNodes (el, currentClass, $) {
    currentClass = currentClass || 'hljs';
    var thisElem = $(el);
    if (thisElem[0].tagName === 'span') {
      let className = thisElem.attr('class');
      if (className) {
        currentClass = className;
      }
    }

    if (thisElem[0].nodeType === constants.TEXT_NODE) {
      this.textNodes.push({
        "class": currentClass,
        "text": this._replaceTabs(thisElem.text())
      });
    }

    let children = thisElem.contents();
    for (let index = 0; index < children.length; index++) {
      this.recurseNodes(children[index], currentClass, $);
    }
  }

  _renderTitle(doc) {

    let height = doc.heightOfString(this.fileName) + 6;
    doc.moveDown();
    let y = doc.y - 6

    doc.rect(0, y, 600, height)
      .fillColor('#eee').fill();

    doc.fillColor('#333')
      .font('fonts/SourceCodePro-Bold.ttf')
      .text(this.fileName)
      .moveDown()

  }

  render(doc, theme) {
    this._renderTitle(doc);
    this.textNodes.forEach((node) => {
      let format = theme.match(node.class, 'hljs') || {};
      let opts = {
        continued: node.text !== "\n",
      };
      if (format.color) {
        doc.fillColor(format.color);
      }

      // if (format['font-style'] === 'italic') {
      //   doc.font('fonts/SourceCodePro-Italic.ttf');
      // }
      if (format['font-weight'] === 'bold') {
        doc.font('fonts/SourceCodePro-Bold.ttf');
      }
      else {
        doc.font('fonts/SourceCodePro-Regular.ttf')
      }

      doc.text(node.text, opts);
    })
  }

}

module.exports = FileRenderer;
