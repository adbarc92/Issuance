const path = require('path');
const BUILD_PATH = path.resolve(__dirname, './build');

process.env.SKIP_PREFLIGHT_CHECK = 'true';

const removeCssHashPlugin = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    const plugins = webpackConfig.plugins;
    plugins.forEach(plugin => {
      const options = plugin.options;

      if (!options) {
        return;
      }

      if (options.filename && options.filename.endsWith('.css')) {
        options.filename = 'static/css/[name].css';
        options.chunkFilename = 'static/css/[name].chunk.css';
      }
    });
    return webpackConfig;
  },
};

module.exports = {
  plugins: [{ plugin: removeCssHashPlugin }],
  // devServer: {
  //   proxy: {
  //     '/api/*': 'http://localhost:4000',
  //     '/socket.io': {
  //       target: 'http://localhost:4000',
  //       ws: true,
  //     },
  //     '/socket.io/socket.io.js': {
  //       target: 'http://localhost:4000',
  //       ws: true,
  //     },
  //   },
  // },
  webpack: {
    configure: {
      output: {
        path: BUILD_PATH,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
      },
    },
  },
};
