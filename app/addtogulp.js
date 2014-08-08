var fs = require('fs');

module.exports = function addtogulp(plugins) {
	var code = "";
	var less = "\n\n// compile less files"
			   + "\ngulp.task('less', function () {"
  			   + "\n    gulp.src('app/css/less/*.less')"
			   + "\n    .pipe($.sourcemaps.init())"
			   + "\n    .pipe($.less())"
			   + "\n    .on('error', console.error.bind('error'))"
			   + "\n    .pipe($.sourcemaps.write('maps'))"
			   + "\n    .pipe(gulp.dest('app/css'));"
			   + "\n});"
			   + "\n\ngulp.task('watchless', function() {"
			   + "\n    gulp.watch('app/css/less/*.less', function() {"
			   + "\n        gulp.start('less');"
			   + "\n    });"
			   + "\n});"
			   + "\n\ndefaultTask.push('watchless');";

	// choose which part to appen to gulpfile.js
	for (var i in plugins) {
		switch(plugins[i]) {
			case "less":
				code += less;
				break;
			default:
				break;
		}
		console.log("Add new module: " + plugins[i]);
	}

	code += "\n\ngulp.task('default', defaultTask);";

	fs.appendFile('./gulpfile.js', code, function(err) {
		if (err) throw err;
	});
}
