# each-csv [![Build Status](https://travis-ci.org/dfcreative/each-csv.svg?branch=master)](https://travis-ci.org/dfcreative/each-csv) [![Code Climate](https://codeclimate.com/github/dfcreative/each-csv/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/each-csv) <a href="UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>

Iterate over comma-separated values in string, ignoring parentheses.

```js
var eachCSV = require('each-csv').

eachCSV('a, b(2,3), c,, d(a())', function(value){
	console.log(value)
});

//'a', 'b(2,3)', 'c', '', 'd(a())'
```


[![NPM](https://nodei.co/npm/each-csv.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/each-csv/)