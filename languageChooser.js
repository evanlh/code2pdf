// get the code_mirror language names
const highlightJS = require('highlightjs');
const ghLanguages = require('./languages.json');
const langKeys = {};
const extensionToCMLanguage = {};
Object.keys(ghLanguages).forEach(function(key) {
  let lang = langs[key];
  if (lang.codemirror_mode) {
    langKeys[lang.codemirror_mode] = true;

    if (lang.extension) {
      lang.extension.forEach(function(extension) {
        extensionToCMLanguage[extension] = lang.codemirror_mode;
      })
    }
  }
});

// array of CM language names
const cmLanguages = Object.keys(langKeys);
// array of HL language names
const hlLangs = hl.listLanguages();

/**
 * @param {String} filename
 * @returns {String|undefined} The highlight.js language extension, or undefined if unknown
 */
function chooseLanguage(filename) {
  var splitFn = filename.split(".");
  var extension = splitFn[splitFn.length - 1];
  var cmLanguageByExtension = extensionToCMLanguage[extension];
  if (!cmLanguageByExtension) {
    return;
  }

  if (hlLangs.indexOf(cmLanguageByExtension) !== -1) {
    return cmLanguageByExtension;
  }
}

module.exports = chooseLanguage;
