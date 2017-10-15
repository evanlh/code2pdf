// codemirror language ->
CODEMIRROR_TO_HL = {
  "clike": "cpp"
}

// get the code_mirror language names
const highlightJS = require('highlight.js');
const ghLanguages = require('./languages.json');
const langKeys = {};
const extensionToCMLanguage = {};


Object.keys(ghLanguages).forEach(function(key) {
  let lang = ghLanguages[key];
  if (lang.codemirror_mode) {
    console.log("ext ", lang.codemirror_mode, lang.extensions)
    langKeys[lang.codemirror_mode] = true;

    if (lang.extensions) {
      lang.extensions.forEach(function(extension) {
        extensionToCMLanguage[extension] = lang.codemirror_mode;
      })
    }
  }
});

// array of CM language names
const cmLanguages = Object.keys(langKeys);
// array of HL language names
const hlLangs = highlightJS.listLanguages();

/**
 * @param {String} filename
 * @returns {String|undefined} The highlight.js language extension, or undefined if unknown
 */
function chooseLanguage(filename) {
  var splitFn = filename.split(".");
  var extension = splitFn[splitFn.length - 1];
  extension = "." + extension;
  var cmLanguageByExtension = extensionToCMLanguage[extension];
  if (!cmLanguageByExtension) {
    return;
  }

  if (CODEMIRROR_TO_HL[cmLanguageByExtension]) {
    return CODEMIRROR_TO_HL[cmLanguageByExtension];
  }
  else if (hlLangs.indexOf(cmLanguageByExtension) !== -1) {
    return cmLanguageByExtension;
  }

}

module.exports = chooseLanguage;
chooseLanguage.extensionToCMLanguage = extensionToCMLanguage;
chooseLanguage.hlLangs = hlLangs;
