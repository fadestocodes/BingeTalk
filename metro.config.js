// const { withNativeWind } = require("nativewind/metro");
// const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
// const {
//   getSentryExpoConfig
// } = require("@sentry/react-native/metro");

// const { getDefaultConfig } = require("expo/metro-config");


// const config = getSentryExpoConfig(__dirname);

// // First, wrap with Reanimated config
// const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

// // Then, apply NativeWind config
// module.exports = withNativeWind(reanimatedConfig, { input: "./global.css" });
const { getDefaultConfig } = require("expo/metro-config");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Start with the base Expo + Sentry config
const config = getSentryExpoConfig(__dirname);

// Wrap with Reanimated (required for animations to work correctly)
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

// Get Expo defaults so we can safely modify the asset and source extensions
const defaultConfig = getDefaultConfig(__dirname);

// Configure SVG transformer
const { assetExts, sourceExts } = defaultConfig.resolver;
const svgConfig = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
  },
};

// Merge everything and export through NativeWind
module.exports = withNativeWind(
  {
    ...reanimatedConfig,
    transformer: {
      ...reanimatedConfig.transformer,
      ...svgConfig.transformer,
    },
    resolver: {
      ...reanimatedConfig.resolver,
      ...svgConfig.resolver,
    },
  },
  { input: "./global.css" }
);
