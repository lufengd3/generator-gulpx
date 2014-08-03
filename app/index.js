'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var GulpxGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to Gulpx webapp generator!'));

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Choose the module which you will use in this project: ',
      choices: [{
        name: 'jQuery',
        value: 'withJquery',
        checked: true
      },{
        name: 'less',
        value: 'withLess',
        checked: false
      }]
    }];

    this.prompt(prompts, function (answer) {
      var features = answer.features;

      function hasFeature(key) {
        return features && features.indexOf(key) !== -1;
      }

      this.installJquery = hasFeature('withJquery');
      this.installLess = hasFeature('withLess');

       done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/js');
    this.mkdir('app/css');  
    this.mkdir('app/img');
    
    this.copy('index.html', 'app/index.html');
    this.copy('style.css', 'app/css/style.css');
    this.copy('gulplogo.png', 'app/img/gulplogo.png');
  },

  projectfiles: function () {
    this.copy('../../README.md', 'README.md');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');
    this.template('gulpfile.js');
  },

  install: function() {
    var done = this.async();
    var plugins = 
    [
      'gulp',
      'gulp-connect',
      'gulp-load-plugins',
      'gulp-open'
    ];
    this.pluginArray = [];

    if (this.installJquery) {
      this.copy('jquery-1.11.1.min.js', 'app/js/jquery.min.js');
    }

    if (this.installLess) {
      plugins.push('gulp-less', 'gulp-sourcemaps');
      this.pluginArray.push('less');
      this.mkdir('app/css/less');
      this.mkdir('app/css/maps');
      this.copy('style.less', 'app/css/less/style.less');
    }

    require('./addtogulp')(this.pluginArray);
    this.npmInstall(plugins, { 'saveDev': true }, done);
  }
});

module.exports = GulpxGenerator;
