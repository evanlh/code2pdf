const fs = require('fs');
const csstree = require('css-tree');

const declarationsWeCareAbout = ['font-weight', 'font-style', 'color'];

class ThemeReader {
  constructor(themeFileName) {
    let file = fs.readFileSync(themeFileName, 'utf8');
    this.ast = csstree.parse(file);
    this.classToStylesMap = Object.create(null);

    let curClasses = [],
        curDeclaration = null,
        isValue = false;

    csstree.walk(this.ast, (node) => {

      if (isValue) {
        let value;
        if (node.type === 'Identifier') {
          value = node.name;
        }
        else if (node.type === 'HexColor') {
          value = '#' + node.value;
        }

        if (value && curClasses.length && curDeclaration) {
          curClasses.forEach((className) => {
            this.classToStylesMap[className] = this.classToStylesMap[className] || {};
            this.classToStylesMap[className][curDeclaration.property] = value;
          });
        }
        isValue = false;
      }

      if (node.type === 'ClassSelector') {
        curClasses.push(node.name);
      }
      else if (node.type === 'SelectorList') {
        curClasses = [];
      }
      else if (node.type === 'Declaration') {
        if (declarationsWeCareAbout.indexOf(node.property) !== -1) {
          curDeclaration = node;
        }
        else {
          curDeclaration = null;
        }
      }
      else if (node.type === 'Value' &&
               curDeclaration && curDeclaration.value.type === 'Value') {
        isValue = true;
      }
    });
    console.log(this.classToStylesMap);
  }


  match(classNames, defaultClass) {
    var value = {};
    if (Array.isArray(classNames)) {
      classNames.forEach((className) => {
        Object.assign(value, this.classToStylesMap[className] || {});
      })
      return value;
    }
    return this.classToStylesMap[classNames] ||
      this.classToStylesMap[defaultClass];
  }
}

module.exports = ThemeReader
