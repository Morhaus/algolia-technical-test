import { resolve as r } from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

export default function createWebpackConfig(opts) {
  const config = {
    entry: (opts.hot ? [
      `webpack-dev-server/client?${opts.output.publicPath}`,
      'webpack/hot/only-dev-server',
    ] : []).concat(opts.entry),

    output: opts.output,

    resolve: {
      extensions: ['', '.js', '.jsx'],
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          include: r('src'),
          loader: `${opts.hot ? 'react-hot!' : ''}babel`,
        },
        {
          test: /\.css$/,
          include: r('src'),
          loader: 'style!css?modules!postcss',
        },
        {
          test: /\.css$/,
          include: r('node_modules'),
          loader: 'style!css',
        },
      ],
    },

    postcss: () => [autoprefixer],

    plugins: [
      new webpack.DefinePlugin({
        // Whitelist of environment variables available to the client.
        'process.env': JSON.stringify(opts.vars || {}),
      }),
      ...(opts.hot ? [new webpack.HotModuleReplacementPlugin()] : []),
      ...(opts.env === 'production' ? [new webpack.optimize.UglifyJsPlugin()] : []),
    ],
  };

  return config;
}
