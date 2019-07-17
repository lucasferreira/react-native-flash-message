/**
 * Non-public global class to handle the "default" FlashMessage instance to global use
 */
class FlashMessageManager {
  _defaultFlashMessage = null;
  register(_ref) {
    if (!this._defaultFlashMessage && "_id" in _ref) {
      this._defaultFlashMessage = _ref;
    }
  }
  unregister(_ref) {
    if (!!this._defaultFlashMessage && this._defaultFlashMessage._id === _ref._id) {
      this._defaultFlashMessage = null;
    }
  }
  getDefault() {
    return this._defaultFlashMessage;
  }
}

export default new FlashMessageManager();
