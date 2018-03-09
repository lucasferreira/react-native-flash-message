var path = require("path");

var config = {
  extraNodeModules: {
    "prop-types": path.resolve(__dirname, "node_modules/prop-types"),
    "react-native": path.resolve(__dirname, "node_modules/react-native"),
    "react-navigation": path.resolve(__dirname, "node_modules/react-navigation"),
    react: path.resolve(__dirname, "node_modules/react"),
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),
      path.resolve(__dirname, "../../src"), // path to the external module
    ];
  },
};

module.exports = config;
