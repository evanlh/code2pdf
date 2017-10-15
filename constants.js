const TEXT_NODE = 3;

module.exports = {
  TEXT_NODE: TEXT_NODE,
  FONT: {
    HEADER: __dirname + '/fonts/RobotoCondensed-Regular.ttf',
    HEADER_SIZE: 12,
    BODY_BOLD: __dirname + '/fonts/SourceCodePro-Bold.ttf',
    BODY_REGULAR: __dirname + '/fonts/SourceCodePro-Regular.ttf',
    BODY_SIZE: 8
  },
  PAPER: {
    A4: {
      WIDTH: 595,
      HEIGHT: 842
    },
    A5: {
      WIDTH: 420,
      HEIGHT: 595
    },
    A6: {
      WIDTH: 298,
      HEIGHT: 420
    }
  },
  MARGINS: {
    VERTICAL: 50,
    HORIZONTAL: 50
  }
}
