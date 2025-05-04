/**
 * @module each-csv
 */
module.exports = eachCSV;


var paren = require('parenthesis');


/** iterate over every item in string */
function eachCSV(str, fn){
	if (!str) return;

	//force string be primitive
	str += '';

	//escape parentheses
	var parens = paren.parse(str);

	var list = parens[0].split(/\s*,\s*/);

	for (var i = 0; i < list.length; i++) {
		fn(paren.stringify(list[i], parens), i);
	}
}