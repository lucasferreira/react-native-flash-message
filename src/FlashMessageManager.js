/**
 * Utility class to handle the "default" FlashMessage instance to global use
 */
class FlashMessageManager {
  _preservedFlashMessages = [];
  _currentFlashMessage = null;
  _enabled = true;
  get isEnabled() {
    return !!this._enabled;
  }
  setDisabled(disable = true) {
    this._enabled = !disable;
  }
  hold(_tempInstance) {
    if ("_id" in _tempInstance) {
      let wasHeld = false;
      if (this._preservedFlashMessages.length > 0) {
        wasHeld = this._preservedFlashMessages[this._preservedFlashMessages.length - 1]._id === _tempInstance._id;
      }

      if (!wasHeld) {
        this._preservedFlashMessages.push(this._currentFlashMessage);
        this._currentFlashMessage = null;

        this.register(_tempInstance);
      }
    }
  }
  unhold() {
    if (this._preservedFlashMessages.length > 0) {
      // here the current instance is the one that's held momentarily...
      if (!!this._currentFlashMessage) {
        this._currentFlashMessage.hideMessage();
        this._currentFlashMessage = null;
      }

      this.register(this._preservedFlashMessages.pop());
    }
  }
  register(_instance) {
    if (!this._currentFlashMessage && "_id" in _instance) {
      this._currentFlashMessage = _instance;
    }
  }
  unregister(_instance) {
    if (!!this._currentFlashMessage && this._currentFlashMessage._id === _instance._id) {
      this._currentFlashMessage = null;
    }
  }
  getCurrent() {
    return this._currentFlashMessage;
  }
}

export default new FlashMessageManager();
