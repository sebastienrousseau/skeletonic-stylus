var src               = 'skeletonic';
var build             = 'build';
var development       = 'build/development';
var production        = 'build/production';
var srcAssets         = 'src/stylus';
var developmentAssets = 'build/development';
var productionAssets  = 'build/production';
var sourcemaps        = { css: true };

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [development, build, src]
      },
      port: 9999,
      files: [
        developmentAssets + '/styles/*.css'
      ]
    },
    production: {
      server: {
        baseDir: [production]
      },
      port: 9998
    }
  },
  base64: {
    src: developmentAssets + '/styles/*.css',
    dest: development
  },
  debug: {
    state: true,
    options: {
      // prefix: 'Debug:',
      // timestamp: false,
      // 'zero-format': 'No files matched',
      // 'one-format': 'Total: ' + chalk.cyan('1 file'),
      // 'many-format': 'Total: ' + chalk.cyan('%s files')
      // format: '>' + chalk.yellow('%s')
    }
  },
  buildCSS: {
    src: [
      srcAssets + '/skeletonic.styl'],
    dest: development
  },
  stylelint: {
    src: [
      srcAssets + '/css/*.css'],
    dest: development
  },
  minifyCSS: {
    src: [
      srcAssets + '/css/*.css'],
    dest: development
  },
  gzip: {
    src: [
      developmentAssets + '/styles/*.css'],
    dest: production,
    filename: 'skeletonic-v1.2.2',
    options: {
      extension: 'zip'
    }
  },
  sizereport: {
    src: [
      srcAssets + '/css/*.css'],
    dest: development,
    options: {
      gzip: true,
      '*': {
        'maxSize': 100000
      },
    }
  },
  styles: {
    src: [
      srcAssets + '/skeletonic.styl'],
    dest: development,
    sourcemap: sourcemaps.css,
    compile: {
      indentedSyntax: true
    },
    options: {
      precss: {},
      clean: {
        debug: true,
        level: 0, // The level option can be either 0, 1 (default), or 2, e.g.
        compatibility: 'ie8', // Internet Explorer 8+ compatibility mode
        keepSpecialComments: 0,
        format: 'keep-breaks' // formats output the default way but adds line breaks for improved readability
      },
      minify: {
        debug: true,
        level: 2, // The level option can be either 0, 1 (default), or 2, e.g.
        compatibility: 'ie8', // Internet Explorer 8+ compatibility mode
        // format: 'keep-breaks' // formats output the default way but adds line breaks for improved readability
      },
      mqpacker: {}
    }
  },
  collect: {
    src: [
      productionAssets + '/manifest.json',
      production + '/**/*.{json,css}'
    ],
    dest: production
  }
};
