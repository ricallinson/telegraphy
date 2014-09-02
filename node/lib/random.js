//    (The MIT License)
//
//    Copyright (c) 2012 Richard S Allinson <rsa@mountainmansoftware.com>
//
//    Permission is hereby granted, free of charge, to any person obtaining
//    a copy of this software and associated documentation files (the
//    "Software"), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//
//    The above copyright notice and this permission notice shall be
//    included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

"use strict";

var fslib = require("fs");
var pathlib = require("path");
var nouns = fslib.readFileSync(pathlib.join(__dirname, "..", "data", "nouns.txt"), "utf-8").split("\n");
var range = nouns.length;

function getRandomWord() {
	return nouns[Math.floor(Math.random() * range)];
}

/*
    Push a random word to the notifier.
*/

exports.word = function (notifier) {
	notifier.sendAlert(getRandomWord());
};

/*
    Push a random sentence to the notifier.
*/

exports.words = function (notifier, length) {
	var i;
	var words = [];
	length = length || 3;
	for (i = 0; i < length; i++) {
		words.push(getRandomWord());
	}
	console.log(words.join(" "));
	notifier.sendAlert(words.join(" "));
};
