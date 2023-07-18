/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  projectRoot: __dirname,
  // watchFolders: ['/Users/mayanksharma/Documents/Tech/Dyte/react-native-ui-kit'],
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Add any other file extensions you're using
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  server: {
    rewriteRequestUrl: url => {
      if (!url.endsWith('.bundle')) {
        return url;
      }
      return (
        url +
        '?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true'
      );
    }, // ...
  },
};
