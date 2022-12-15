import React, { Component } from "react";
import { StyleSheet, TouchableWithoutFeedback, Platform, StatusBar, Animated, Image, Text, View } from "react-native";
import { isIphoneX, getStatusBarHeight } from "react-native-iphone-screen-helper";
import PropTypes from "prop-types";

import FlashMessageManager from "./FlashMessageManager";
import FlashMessageWrapper, { styleWithInset } from "./FlashMessageWrapper";

/**
 * MessageComponent `minHeight` property used mainly in vertical transitions
 */
const OFFSET_HEIGHT = Platform.OS !== "ios" ? 60 : 48;

/**
 * `message` prop it's expected to be some "object"
 * The `message` attribute is mandatory.
 * If you pass some `description` attribute your flash message will be displayed in two lines (first `message` as a title and after `description` as simple text)
 * The `type` attribute set the type and color of your flash message, default options are "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray)
 * If you need to customize the bg color or text color for a single message you can use the `backgroundColor` and `color` attributes
 */
const MessagePropType = PropTypes.shape({
  message: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
}).isRequired;

/**
 * Non-operation func
 */
const noop = () => {};

/**
 * Simple random ID for internal FlashMessage component usage
 */
function srid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}-${s4()}-${s4()}`;
}

/**
 * Translates icon prop value into complex internal object
 */
function parseIcon(icon = "none") {
  if (!!icon && icon !== "none") {
    if (typeof icon === "string" || typeof icon === "function") {
      return { icon, position: "left", style: {} };
    }

    return { position: "left", style: {}, ...icon };
  }

  return null;
}

/**
 * Translates string positions like "top", "bottom" and "center" to style classes
 */
export function positionStyle(style, position) {
  if (typeof position === "string") {
    return [
      style,
      position === "top" && styles.rootTop,
      position === "bottom" && styles.rootBottom,
      position === "center" && styles.rootCenter,
    ];
  }

  return [style, position];
}

/**
 * Global function to handle show messages that can be called anywhere in your app
 * Pass some `message` object as first attribute to display flash messages in your app
 *
 * ```
 *  showMessage({ message: "Contact sent", description "Your message was sent with success", type: "success" })
 * ```
 */
export function showMessage(...args) {
  if (!!FlashMessageManager._enabled) {
    const ref = FlashMessageManager.getCurrent();
    if (!!ref) ref.showMessage(...args);
  }
}

/**
 * Global function to programmatically hide messages that can be called anywhere in your app
 *
 * ```
 *  hideMessage()
 * ```
 */
export function hideMessage(...args) {
  if (!!FlashMessageManager._enabled) {
    const ref = FlashMessageManager.getCurrent();
    if (!!ref) ref.hideMessage(...args);
  }
}

/**
 * Default transition config for FlashMessage component
 * You can create your own transition config with interpolation, just remember to return some style object with transform options
 */
export function FlashMessageTransition(animValue, position = "top") {
  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (position === "top") {
    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-OFFSET_HEIGHT, 0],
    });

    return {
      transform: [{ translateY }],
      opacity,
    };
  } else if (position === "bottom") {
    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [OFFSET_HEIGHT, 0],
    });

    return {
      transform: [{ translateY }],
      opacity,
    };
  }

  return {
    opacity,
  };
}

// prettier-ignore
const DefaultIcons = {
  success: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAQAAAAk/gHOAAADSElEQVR42u2ZwUsbQRTGv4IFBbXYtAQFIR5E8A9wrdUmvUgptUVItEd78dyzYMGrCMWznrx5sFfBQ9oaeoiCJGmbapXkoELJRXLQmITslo3R2ezO7szszubkfMe8mffL7Ns3b98A98PN6EEU68iggBJq0OqqoYQCMlhHFD1+Oh/AMnKoNNzaqYIcljEg330MKVQZzo2qIoWYPPezyAs4NyqPWe/uh5CE6hJAl4okhrwALOLKg/tbXWHRnfsu7Epwf6tddIkChHAmEUDXGUIiAMO4kAyg6wLD/DvgB8ANRIgvBs59AtB1zhMTCR8BdCVYAEs+A+hacgIYlJIH2Hli0B7hoAUAug7sAKKeUrFY2o7SEfItArg5wChjuoUAuqatCGkf3PzAZ9vf0maAfqGChE8ZPKqftnZFTX8zwop0gJ94enfk0y1WmhFykgF+3QHo4xPVJmcE6GYWpaIAT0wP+iO10O0mBlNSAX4jYAn2UarlFDFYkwjwx7IDwEtcUm3XiElGGsAhZQcito85Q4wKkgCOKDsQcYizAjErOS78AV+4AP5SAMKOgV4ihjUHszcAHiDOAWB9BBMoO86pEVN7o7cNizZ8lQ6gi4nwzrBgG74JAYxzADAQVERMi7bhOzfAGBeA5hwLKl5bFqZBHFEBrrkAauw34j0TggbwjBOg6Y2wzws0iIQjwCg3QFNeSDmYWTsEDxsQtEyoCABoSJGJq46GMxSILP553AFdq2TqJMPUCvHYXPO4ANAwSSZ3MuuFGeaH4JgwQAWdxgWOmROcIZ4LA2g4Nrd02FPsO2jjLgA0c/snyFVB0yEmXAFUETQvlOSaaIV44QpAQxKU0kJzARHmPAusitA29JBzctSAXXZd4FFHmPvLOuYRQEXYLrLj3Iu8guLh2yNu/3b32hTb9H/iFuASvU4pZq4Fn/VzrES76TPAJrvp146sjwBZtPM0PwPS+8+kDx3gbQH34dQHgFP0iTTCA9IbP2n+HSAxsSERYIMvBmi3UkUJ7ovebqiC2PJ4N7VlPZTFh4J9lwD7UORdFI5gW+hQKmMbI/KvSwOYxx6zQLnGHubFo19kdEDBAnZwgiKq9ThRUUURJ9jBAhR03F/ruxn/ATogMH6gfbG4AAAAAElFTkSuQmCC",
  info: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAQAAAAk/gHOAAAB/0lEQVR42u2ZsYrCQBCG/9JrFQTf4CqjjyF4jYW1voiCFoKIgvEBhKQUEYS0dtcK6UM68wAWwUaPICEmeprJbtzhuP3rf+cjbGZnZ4D/lWV9oIoOFrBgw4OPM3x4sGFhgQ6q+MgzeBEtGHBweSoHBlooyg+vYQ73RfBbuZhDkxe+BhMnQvhQJ5ioiYcvY4xjhvChjhijLALQwF4gfKg9GtnCFzCQED7UAAUqQAkriQCBVihRACrYSQYItEMl/RfIA+AKUUp3BtY5AQRapzkTwxwBAg1fATRTb7XBV0yb1M7m80SUPg/0E94+IU88SVYzwgedJrxTgnf2G0CdlIpFEI6oP0YwScdKBOEC8/F9SLsNewl/j3iLPrhDdeLPtUUrpi3Rr99XRG7O+eC+qElUVu03AwRqxxEMBQhGvCp2yBss8RnTkryDc1ttaxJyfZa75abA7Wawi+WFq7qRfaEIYRHZLUUIVmS3FSHYkd1ThOBFdl8Rgh/Zz4oQzqy+AoOzwOCPYJAXGGRHBneEpghBE6sXxBGceHfOUIBgiNaO4ght0QpaFMG9703qb0bQxV9TYginxx1J5W9KFi9rBv0FWpdlkvBO5HRZKL2mUcI5ktNroryKDviO6SCr48ai78ig+8qiB82iE89iHsFiKsNkNsViQsdkTslkWstkZv131w9xpmDY0IYKPAAAAABJRU5ErkJggg==",
  warning: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAQAAAAk/gHOAAACpUlEQVR42u2ZPUsrQRSGnxgVG0OCgtgJFhYR4y+wshFvpVgrdhb+AEEJKCgoGoxpbNRLUliICEpaW72CQgoLIaSS/IAUIU1yCfeGza75mLOz66Rw3vo958lm5sycGfgZbsYQM6yRIkuOImWqlCmSI0uKNWYY8jN5hCXS5Kl1VJ40S0S8Tx8jSaFL8mYVSBLzLv0sGSqC9A1VyDCrn36EQ0ou0jdU4pARHYAF3jTSN/TGgrv0A+x6kL6hXQakACFuPASo64aQBGCUR48B6npkVP0L+AHwDyKkNgdufQKo61ZlTuz5CFDXXjeAReVQd/yy6U7Zudh5F1CvA3GHNy6oEx12kITgg544vCcCb6IdwLSoFOsglJhujZARTSsdhBqZVgBR4W6oh1Ah+hXhTLi49BBqnDkBhkUHEi8QCgzbAyyLS4wuQo1le4C0AYS0fV/IG0DIN+8XUy5qvT5CjSnLvmoIYdWypwwhpCx71hBC1rLnDCHkLHvREELRspcNIZQte9UQQrWnvkIPzIUeWBE9UBeShhCSln3FEMKKZZ8whDBh2YMuzgs7DoQdF+eFYHOAK3GAd37b9C6OcGX/DfM+N7OtNG9HGBSfoHVVYNB5jD8SV7Y/Nkkr7NHXVmZc2E0dOPwHwm5qvFVLdyEKcuxwH4vcF63b2rFv7KzH2rX38W9CiLe/4ujn9Rv+iFf6O131RJUD7Tuc+8rOaLcLrw3lRflkk+qi3FC5ebz0sSBdqt2+9vHgE8ADfapXwEHufQC4t++M3UaAc48BzgnIXyTWPQRYd/sqM8mzB+mfmdR5Ggqyqfk2tSmbAa1HmFOXL3SnhL17KAyzJTpf5tnyMr1VL2Ik+OiS/IMEMfX172YEiDDHNte88Pn/zfqTF67ZZo6Im6X3M+AvvehZ3bNZqSIAAAAASUVORK5CYII=",
  danger: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAQAAAAk/gHOAAADgUlEQVR42u2Zz0tbQRDHvxq1UmqaoFU8tAgePESMf4EgeBF7qdaz4s2Df4AgTTGWtrEm5oe1IqiYQD2IFyW34sFCawMKOQbEk+QP8BC8xJLa8PLy5u3ubN67uXN7md35ZHd2ZnYXeGw6rR1DmEUKWeRRRAlllFBEHlmkMIshtLtp3I9JpHGFe6FcIY1J+J03H0QC1xLjtXKNBILOmR9GBncM81W5QwbDjZvvRAS3GuarcosIOhsBGMdlA+arcolxPfOtWHbAfFWW0coF8OLQQYCKHMLLAejCqcMAFTlFl/oMuAHwAOFV84EjlwAqcqTiE2EXASoSlgFMkN0usKNhLIFf5PcJcRag4kABLwBEmQDvATxHnowTggwSIwFeCn61jwMPrZuEiNkBDBKhuIBXEkTZelMQtxikETIW1T/ordNRWY6Vuj4+/LToZCiAAJEN9wk9GcQHos93IosGrGpJcsA1RY+pykdC/xupmaxX67AtSFYZEJ8I3U3boqbDrDgl+GcRRYjPhN5XwbhTZtW0cH0jCj5B6WwIR02b84KsKKWmeE0CkJIWujX5YkBhq1GOtipYgqTCmAOG+oxSwKG2WwL3iNt8l8uM+pTZBZ1Ke0N8W1ccL2V0ybJjv6ip55Ks0SmvkYDsGiej5o1uRXYatmurrJGKRscSsxZYwRPywMutKUpG5zK7IholEF6zRynrz0LYZhbW9GeB5wvvBL4Q0fUFzo4ISXZERG9HZB2ZAT5ElhtOaYC3DWzNhNFlWnsJkuaBmBDTRoc+TYCooLz7ojBmn6HukdYLFEC85veoBsQVPLXqe2yAhMLxRAyxZ1Ye0/CBelln+sSYWbXNtoIOMWrCdcZMXKNNjTfErIrVIYjDQS9xmtpgAthBbBOnqV4qqlnvEM4sd4abClut3jGf4odFZ4cOrD3EyTqPbunRTAzhRY44WffYRfcQmUq6mQC1EBSAMNW14IKEeAZgi1kLRP/tsxx5bdQiynIBcrjf2Ne4a9rGGfk9IEu18y7fuM2r3Dzuugiwq3b72owTlwBO0Kx6BezBsQsAx+bMKGtN7B0gky008V8k5hwEmNN9lenHuQPmz9HfyNOQBwsNvk0t8DyAbj7ENV/o4vA591Dow6K0vjTXhYtOmjfiRRAxFCTGC4ghqL7/dVoT/BjBEg6Qw83/N+sb5HCAJYzAr7P1HhvwF5GXIpRNQBinAAAAAElFTkSuQmCC",
};

export function renderFlashMessageIcon(icon = "success", style = {}, iconProps = {}) {
  if (typeof icon === "function") {
    return React.createElement(icon, { style: [styles.flashIcon, style], ...iconProps });
  }

  if (!!DefaultIcons[icon]) {
    return (
      <Image
        style={[styles.flashIcon, { tintColor: "#fff" }, style]}
        source={{ uri: DefaultIcons[icon] }}
        {...iconProps}
      />
    );
  }

  return null;
}

/**
 * Default MessageComponent used in FlashMessage
 * This component it's wrapped in `FlashMessageWrapper` to handle orientation change and extra inset padding in special devices
 * For most of uses this component doesn't need to be change for custom versions, cause it's very customizable
 */
export const DefaultFlash = React.forwardRef(
  (
    {
      message,
      style,
      textStyle,
      titleStyle,
      titleProps,
      textProps,
      icon,
      iconProps,
      renderFlashMessageIcon,
      position = "top",
      statusBarHeight = null,
      renderBeforeContent,
      renderCustomContent,
      renderAfterContent,
      floating = false,
      hideStatusBar = false,
      ...props
    },
    ref
  ) => {
    const hasDescription = !!message.description && message.description !== "";

    let iconView = null;
    let hasIcon = false;
    if (!!icon && !!icon.icon) {
      iconView = renderFlashMessageIcon(
        typeof icon.icon === "string" && icon.icon === "auto" ? message.type : icon.icon,
        [
          icon.position === "left" && styles.flashIconLeft,
          icon.position === "right" && styles.flashIconRight,
          icon.style,
        ],
        !!iconProps ? iconProps : "props" in icon && !!icon.props ? icon.props : {}
      );

      hasIcon = !!iconView;
    }

    return (
      <FlashMessageWrapper
        ref={ref}
        position={typeof position === "string" ? position : null}
        statusBarHeight={statusBarHeight}
      >
        {wrapperInset => (
          <View
            style={styleWithInset(
              [
                styles.defaultFlash,
                position === "center" && styles.defaultFlashCenter,
                position !== "center" && floating && styles.defaultFlashFloating,
                hasIcon && styles.defaultFlashWithIcon,
                !!message.backgroundColor
                  ? { backgroundColor: message.backgroundColor }
                  : !!message.type &&
                    !!FlashMessage.ColorTheme[message.type] && {
                      backgroundColor: FlashMessage.ColorTheme[message.type],
                    },
                style,
              ],
              wrapperInset,
              !!hideStatusBar,
              position !== "center" && floating ? "margin" : "padding"
            )}
            {...props}
          >
            {hasIcon && icon.position === "left" && iconView}
            <View style={[{ flexDirection: "column" }, position !== "center" && { flex: 1 }]}>
              {!!renderBeforeContent && renderBeforeContent(message)}
              <Text
                style={[
                  styles.flashText,
                  hasDescription && styles.flashTitle,
                  !!message.color && { color: message.color },
                  titleStyle,
                ]}
                {...textProps}
                {...titleProps}
              >
                {message.message}
              </Text>
              {!!renderCustomContent && renderCustomContent(message)}
              {hasDescription && (
                <Text style={[styles.flashText, !!message.color && { color: message.color }, textStyle]} {...textProps}>
                  {message.description}
                </Text>
              )}
              {!!renderAfterContent && renderAfterContent(message)}
            </View>
            {hasIcon && icon.position === "right" && iconView}
          </View>
        )}
      </FlashMessageWrapper>
    );
  }
);

DefaultFlash.propTypes = {
  message: MessagePropType,
  renderFlashMessageIcon: PropTypes.func,
};

/**
 * Main component of this package
 * The FlashMessage component it's a global utility to help you with easily and highly customizable flashbars, top notifications or alerts (with iPhone X "notch" support)
 * You can instace and use this component once in your main app screen
 * To global use, please add your <FlasshMessage /> as a last component in your root main screen
 *
 * ```
 *   <View style={{ flex: 1 }}>
 *     <YourMainApp />
 *     <FlasshMessage />   <--- here as last component
 *   <View>
 * ```
 */
export default class FlashMessage extends Component {
  static defaultProps = {
    /**
     * Use to handle if the instance can be registed as default/global instance
     */
    canRegisterAsDefault: true,
    /**
     * Controls if the flash message can be closed on press
     */
    hideOnPress: true,
    /**
     * `onPress` callback for flash message press
     */
    onPress: noop,
    /**
     * `onLongPress` callback for flash message long press
     */
    onLongPress: noop,
    /**
     * Controls if the flash message will be shown with animation or not
     */
    animated: true,
    /**
     * Animations duration/speed
     */
    animationDuration: 225,
    /**
     * Controls if the flash message can hide itself after some `duration` time
     */
    autoHide: true,
    /**
     * How many milliseconds the flash message will be shown if the `autoHide` it's true
     */
    duration: 1850,
    /**
     * Controls if the flash message will auto hide the native status bar
     * Note: Works OK in iOS, not all Android versions support this.
     */
    hideStatusBar: false,
    /**
     * Custom status bar height size prop to sum in message padding top
     */
    statusBarHeight: null,
    /**
     * The `floating` prop unstick the message from the edges and applying some border radius to component
     */
    floating: false,
    /**
     * The `position` prop set the position of a flash message
     * Expected options: "top" (default), "bottom", "center" or a custom object with { top, left, right, bottom } position
     */
    position: "top",
    /**
     * The `render` prop will render JSX before the title of a flash message
     * Expects a function that returns JSX
     */
    renderBeforeContent: null,
    /**
     * The `render` prop will render JSX below the title of a flash message
     * Expects a function that returns JSX
     */
    renderCustomContent: null,
    /**
     * The `render` prop will render JSX after the title (or description) of a flash message
     * Expects a function that returns JSX
     */
    renderAfterContent: null,
    /**
     * The `icon` prop set the graphical icon of a flash message
     * Expected options: "none" (default), "auto" (guided by `type`), "success", "info", "warning", "danger" or a custom object with icon type/name and position (left or right) attributes, e.g.: { icon: "success", position: "right" }
     */
    icon: "none",
    /**
     * The `renderFlashMessageIcon` prop set a custom render function for inside message icons
     */
    renderFlashMessageIcon,
    /**
     * The `transitionConfig` prop set the transition config function used in shown/hide anim interpolations
     */
    transitionConfig: FlashMessageTransition,
    /**
     * The `MessageComponent` prop set the default flash message render component used to show all the messages
     */
    MessageComponent: DefaultFlash,
  };
  static propTypes = {
    canRegisterAsDefault: PropTypes.bool,
    hideOnPress: PropTypes.bool,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    animated: PropTypes.bool,
    animationDuration: PropTypes.number,
    duration: PropTypes.number,
    autoHide: PropTypes.bool,
    hideStatusBar: PropTypes.bool,
    floating: PropTypes.bool,
    position: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    renderBeforeContent: PropTypes.func,
    renderCustomContent: PropTypes.func,
    renderAfterContent: PropTypes.func,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    renderFlashMessageIcon: PropTypes.func,
    transitionConfig: PropTypes.func,
  };
  /**
   * Your can customize the default ColorTheme of this component
   * Use `setColorTheme` static method to override the primary colors/types of flash messages
   */
  static ColorTheme = {
    success: "#5cb85c",
    info: "#5bc0de",
    warning: "#f0ad4e",
    danger: "#d9534f",
  };
  static setColorTheme = theme => {
    FlashMessage.ColorTheme = Object.assign(FlashMessage.ColorTheme, theme);
  };
  constructor(props) {
    super(props);

    this.prop = this.prop.bind(this);
    this.pressMessage = this.pressMessage.bind(this);
    this.longPressMessage = this.longPressMessage.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    if (!this._id) this._id = srid();

    this.state = {
      visibleValue: new Animated.Value(0),
      isHidding: false,
      message: props.message || null,
    };
  }
  componentDidMount() {
    if (this.props.canRegisterAsDefault !== false) {
      FlashMessageManager.register(this);
    }
  }
  componentWillUnmount() {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
    if (this.props.canRegisterAsDefault !== false) {
      FlashMessageManager.unregister(this);
    }
  }
  /**
   * Non-public method
   */
  prop(message, prop) {
    return !!message && prop in message ? message[prop] : prop in this.props ? this.props[prop] : null;
  }
  /**
   * Non-public method
   */
  isAnimated(message) {
    return this.prop(message, "animated");
  }
  /**
   * Non-public method
   */
  pressMessage(event) {
    if (!this.state.isHidding) {
      const { message } = this.state;
      const hideOnPress = this.prop(message, "hideOnPress");
      const onPress = this.prop(message, "onPress");

      if (hideOnPress) {
        this.hideMessage();
      }

      if (typeof onPress === "function") {
        onPress(event, message);
      }
    }
  }
  /**
   * Non-public method
   */
  longPressMessage(event) {
    if (!this.state.isHidding) {
      const { message } = this.state;
      const hideOnPress = this.prop(message, "hideOnPress");
      const onLongPress = this.prop(message, "onLongPress");

      if (hideOnPress) {
        this.hideMessage();
      }

      if (typeof onLongPress === "function") {
        onLongPress(event, message);
      }
    }
  }
  /**
   * Non-public method
   */
  toggleVisibility(visible = true, animated = true, done) {
    const { message } = this.state;

    const position = this.prop(message, "position");
    const animationDuration = this.prop(message, "animationDuration");
    const duration = this.prop(message, "duration");
    const autoHide = this.prop(message, "autoHide");
    const hideStatusBar = this.prop(message, "hideStatusBar");

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }

    if (visible) {
      const onShow = this.prop(message, "onShow") || noop;
      const finish = () => {
        if (!!autoHide && duration > 0) {
          this._hideTimeout = setTimeout(() => this.toggleVisibility(false, animated), duration);
        }

        if (!!done && typeof done === "function") {
          done();
        }
      };

      this.setState({ isHidding: false });
      this.state.visibleValue.setValue(0);

      if (!!onShow && typeof onShow === "function") {
        onShow(this);
      }

      if (!!hideStatusBar) {
        StatusBar.setHidden(true, typeof hideStatusBar === "string" ? hideStatusBar : "slide");
      }

      if (animated) {
        Animated.timing(this.state.visibleValue, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(finish);
      } else {
        finish();
      }
    } else {
      const onHide = this.prop(message, "onHide") || noop;
      const finish = () => {
        this.setState({ message: null, isHidding: false });

        if (!!onHide && typeof onHide === "function") {
          onHide(this);
        }

        if (!!done && typeof done === "function") {
          done();
        }
      };

      this.setState({ isHidding: true });

      if (!!hideStatusBar) {
        StatusBar.setHidden(false, typeof hideStatusBar === "string" ? hideStatusBar : "slide");
      }

      if (animated) {
        Animated.timing(this.state.visibleValue, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(finish);
      } else {
        finish();
      }
    }
  }
  /**
   * Instace ref function to handle show messages
   * Pass some `message` object as first attribute to display a flash message
   *
   * ```
   * this.refs.YOUR_REF.showMessage({ message: "Contact sent", description "Your message was sent with success", type: "success" })
   * ```
   */
  showMessage(message, description = null, type = "default") {
    if (!!message) {
      let _message = {};
      if (typeof message === "string") {
        _message = { message, description, type };
      } else if ("message" in message) {
        _message = { description: null, type: "default", ...message };
      }

      const animated = this.isAnimated(_message);
      this.setState({ message: _message }, () => this.toggleVisibility(true, animated));
      return;
    }

    this.setState({ message: null, isHidding: false });
  }
  /**
   * Instace ref function to programmatically hide message
   *
   * ```
   * this.refs.YOUR_REF.hideMessage()
   * ```
   */
  hideMessage() {
    const animated = this.isAnimated(this.state.message);
    this.toggleVisibility(false, animated);
  }
  render() {
    const { message, visibleValue } = this.state;

    const { MessageComponent, testID, accessible, accessibilityLabel, ...otherProps } = this.props;
    const renderBeforeContent = this.prop(message, "renderBeforeContent");
    const renderCustomContent = this.prop(message, "renderCustomContent");
    const renderAfterContent = this.prop(message, "renderAfterContent");
    const renderFlashMessageIcon = this.prop(message, "renderFlashMessageIcon");
    const style = this.prop(message, "style");
    const textStyle = this.prop(message, "textStyle");
    const titleStyle = this.prop(message, "titleStyle");
    const titleProps = this.prop(message, "titleProps");
    const textProps = this.prop(message, "textProps");
    const iconProps = this.prop(message, "iconProps");
    const floating = this.prop(message, "floating");
    const position = this.prop(message, "position");
    const statusBarHeight = this.prop(message, "statusBarHeight");
    const icon = parseIcon(this.prop(message, "icon"));
    const hideStatusBar = this.prop(message, "hideStatusBar");
    const transitionConfig = this.prop(message, "transitionConfig");
    const animated = this.isAnimated(message);
    const animStyle = animated ? transitionConfig(visibleValue, position) : {};

    return (
      <Animated.View pointerEvents="box-none" style={[positionStyle(styles.root, position), animStyle]}>
        {!!message && (
          <TouchableWithoutFeedback onPress={this.pressMessage} onLongPress={this.longPressMessage} accessible={false}>
            <MessageComponent
              position={position}
              floating={floating}
              message={message}
              hideStatusBar={hideStatusBar}
              renderFlashMessageIcon={renderFlashMessageIcon}
              renderBeforeContent={renderBeforeContent}
              renderCustomContent={renderCustomContent}
              renderAfterContent={renderAfterContent}
              statusBarHeight={statusBarHeight}
              icon={icon}
              style={style}
              textStyle={textStyle}
              titleStyle={titleStyle}
              titleProps={titleProps}
              textProps={textProps}
              iconProps={iconProps}
              accessible={!!accessible}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
            />
          </TouchableWithoutFeedback>
        )}
      </Animated.View>
    );
  }
  _hideTimeout;
  _id;
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 99,
  },
  rootTop: {
    top: 0,
  },
  rootBottom: {
    bottom: 0,
  },
  rootCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultFlash: {
    justifyContent: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#696969",
  },
  defaultFlashCenter: {
    margin: 44,
    borderRadius: 8,
    overflow: "hidden",
  },
  defaultFlashFloating: {
    marginTop: 10,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 10,
    borderRadius: 8,
    minHeight: OFFSET_HEIGHT - getStatusBarHeight(),
  },
  defaultFlashWithIcon: {
    flexDirection: "row",
  },
  flashText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#fff",
  },
  flashTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  flashIcon: {
    marginTop: -1,
    width: 21,
    height: 21,
  },
  flashIconLeft: {
    marginLeft: -6,
    marginRight: 9,
  },
  flashIconRight: {
    marginRight: -6,
    marginLeft: 9,
  },
});
