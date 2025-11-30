const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.dev.js');

const server = new WebpackDevServer(webpack(config), config.devServer);
server.start().then(()=> {
  console.log('e2e started port 9000');
  if (process.send) {
    process.send('ok');
  }
}).catch(err => {
  console.error('e2e server failed', err);
});