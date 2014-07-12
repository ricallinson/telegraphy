
exports.GET_index = function (req, res) {

	var data = {
		title: "Simple Example",
		body: "Hi there!"
	};

	res.render("sample/views/index.html", data);
};