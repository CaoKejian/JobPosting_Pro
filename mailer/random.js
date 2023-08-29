var code_fill_str = ["000000", "00000", "0000", "000", "00", "0", ""];
var code = '' + parseInt(Math.random() * 1000000);
code = code_fill_str[code.length] + code;
module.exports = code;
