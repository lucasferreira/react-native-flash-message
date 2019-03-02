/**
 * @noflow
 */

const fs = require("fs");
const path = require("path");
const blacklist = require("metro-config/src/defaults/blacklist");

module.exports = {
  resolver: {
    blacklistRE: getBlacklistRE(),
    extraNodeModules: getNodeModulesForDirectory(path.resolve(".")),
  },
};

function getBlacklistRE() {
  return blacklist([
    /react\-native\-flash\-message\/examples\/(?!FlashMessagePlayground).*/,
    /react\-native\-flash\-message\/node_modules\/react-native\/(.*)/,
    /react\-native\-flash\-message\/node_modules\/react\/(.*)/,
  ]);
}

function getNodeModulesForDirectory(rootPath) {
  const nodeModulePath = path.join(rootPath, "node_modules");
  const folders = fs.readdirSync(nodeModulePath);
  return folders.reduce((modules, folderName) => {
    const folderPath = path.join(nodeModulePath, folderName);
    if (folderName.startsWith("@")) {
      const scopedModuleFolders = fs.readdirSync(folderPath);
      const scopedModules = scopedModuleFolders.reduce((scopedModules, scopedFolderName) => {
        scopedModules[`${folderName}/${scopedFolderName}`] = maybeResolveSymlink(
          path.join(folderPath, scopedFolderName)
        );
        return scopedModules;
      }, {});
      return Object.assign({}, modules, scopedModules);
    }
    modules[folderName] = maybeResolveSymlink(folderPath);
    return modules;
  }, {});
}

function maybeResolveSymlink(maybeSymlinkPath) {
  if (fs.lstatSync(maybeSymlinkPath).isSymbolicLink()) {
    const resolved = path.resolve(path.dirname(maybeSymlinkPath), fs.readlinkSync(maybeSymlinkPath));
    return resolved;
  }
  return maybeSymlinkPath;
}
