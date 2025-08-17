module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress source map warnings for missing source files
      webpackConfig.ignoreWarnings = [
        {
          module: /node_modules\/@microsoft\/fetch-event-source/,
        },
        function ignoreSourceMapWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source map')
          );
        },
      ];
      
      return webpackConfig;
    },
  },
};
