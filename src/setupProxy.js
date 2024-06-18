const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://www.rightmove.co.uk',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api/_search',
      },
    })
  );
};
