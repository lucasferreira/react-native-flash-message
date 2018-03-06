import React, { Component } from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";

import PropTypes from "prop-types";

/*
* DETECTION AND DIMENSIONS CODE FROM:
* https://github.com/react-community/react-native-safe-area-view
*/

const X_WIDTH = 375;
const X_HEIGHT = 812;
const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");

const isIPhoneX = (() => {
  if (Platform.OS === "web") return false;

  return (
    Platform.OS === "ios" &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
  );
})();

const isIPad = (() => {
  if (Platform.OS !== "ios" || isIPhoneX) return false;

  // if portrait and width is smaller than iPad width
  if (D_HEIGHT > D_WIDTH && D_WIDTH < PAD_WIDTH) {
    return false;
  }

  // if landscape and height is smaller that iPad height
  if (D_WIDTH > D_HEIGHT && D_HEIGHT < PAD_WIDTH) {
    return false;
  }

  return true;
})();

const isOrientationLandscape = ({ width, height }) => width > height;

let _customStatusBarHeight = null;
const statusBarHeight = isLandscape => {
  if (_customStatusBarHeight !== null) {
    return _customStatusBarHeight;
  }

  /**
   * This is a temporary workaround because we don't have a way to detect
   * if the status bar is translucent or opaque. If opaque, we don't need to
   * factor in the height here; if translucent (content renders under it) then
   * we do.
   */
  if (Platform.OS === "android") {
    if (global.Expo) {
      return global.Expo.Constants.statusBarHeight;
    } else {
      return 0;
    }
  }

  if (isIPhoneX) {
    return isLandscape ? 0 : 44;
  }

  if (isIPad) {
    return 20;
  }

  return isLandscape ? 0 : 20;
};

const doubleFromPercentString = percent => {
  if (!percent.includes("%")) {
    return 0;
  }

  const dbl = parseFloat(percent) / 100;

  if (isNaN(dbl)) return 0;

  return dbl;
};

export function styleWithInset(style, wrapperInset) {
  const { width: viewWidth } = Dimensions.get("window");

  let {
    padding = 0,
    paddingVertical = padding,
    paddingHorizontal = padding,
    paddingTop = paddingVertical,
    paddingBottom = paddingVertical,
    paddingLeft = paddingHorizontal,
    paddingRight = paddingHorizontal,
    ...viewStyle
  } = StyleSheet.flatten(style || {});

  if (typeof paddingTop !== "number") {
    paddingTop = doubleFromPercentString(paddingTop) * viewWidth;
  }

  if (typeof paddingBottom !== "number") {
    paddingBottom = doubleFromPercentString(paddingBottom) * viewWidth;
  }

  if (typeof paddingLeft !== "number") {
    paddingLeft = doubleFromPercentString(paddingLeft) * viewWidth;
  }

  if (typeof paddingRight !== "number") {
    paddingRight = doubleFromPercentString(paddingRight) * viewWidth;
  }

  return {
    ...viewStyle,
    paddingTop: paddingTop + wrapperInset.insetTop,
    paddingBottom: paddingBottom + wrapperInset.insetBottom,
    paddingLeft: paddingLeft + wrapperInset.insetLeft,
    paddingRight: paddingRight + wrapperInset.insetRight,
  };
}

export default class FlashMessageWrapper extends Component {
  static defaultProps = {
    position: "top",
  };
  static propTypes = {
    position: PropTypes.string,
    children: PropTypes.func.isRequired,
  };
  static setStatusBarHeight = height => {
    _customStatusBarHeight = height;
  };
  constructor() {
    super();

    this.handleOrientationChange = this.handleOrientationChange.bind(this);

    const isLandscape = isOrientationLandscape(Dimensions.get("window"));
    this.state = { isLandscape };
  }
  componentDidMount() {
    Dimensions.addEventListener("change", this.handleOrientationChange);
  }
  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.handleOrientationChange);
  }
  handleOrientationChange({ window }) {
    const isLandscape = isOrientationLandscape(window);
    this.setState({ isLandscape });
  }
  render() {
    const { position, children } = this.props;
    const { isLandscape } = this.state;

    const _statusBarHeight = statusBarHeight(isLandscape);

    const wrapper = {
      isLandscape,
      isIPhoneX: isIPhoneX,
      isIPad: isIPad,
      statusBarHeight: _statusBarHeight,
      insetTop: position === "top" ? _statusBarHeight : 0,
      insetLeft: 0,
      insetRight: 0,
      insetBottom: 0,
    };

    return children(wrapper);
  }
}
