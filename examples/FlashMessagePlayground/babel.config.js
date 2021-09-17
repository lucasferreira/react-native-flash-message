module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "react-native-flash-message": "../../src/index",
        },
      },
    ],
  ],
};
