const commander = require('commander');
const code2pdf = require('./code2pdf');

commander
.option('-t, --theme <cssfile>', 'Specify theme css')
.option('-d, --directory <directory>', 'One or more directories to traverse')
.option('-o, --output <outputfile>', 'Path to write PDF file to')
.option('-p, --pagesize <pagesize>', 'A3|A4|A5|A6')
.parse(process.argv);

if (!commander.directory || !commander.output) {
  commander.help();
}

console.log(commander.opts())

code2pdf.createPDF({
  cssFile: commander.cssfile,
  directories: commander.directory.split(/\s+/),
  outputFile: commander.output,
  pageOptions: {
    size: commander.pagesize || 'A4'
  }
});
