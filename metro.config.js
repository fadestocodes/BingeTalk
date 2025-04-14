const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// First, wrap with Reanimated config
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

// Then, apply NativeWind config
module.exports = withNativeWind(reanimatedConfig, { input: "./global.css" });