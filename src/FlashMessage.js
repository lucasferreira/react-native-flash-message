import React, { Component } from "react";
import { StyleSheet, TouchableWithoutFeedback, Platform, StatusBar, Animated, Image, Text, View } from "react-native";
import { isIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";
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
    if (typeof icon === "string") {
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
  const ref = FlashMessageManager.getDefault();
  if (!!ref) {
    ref.showMessage(...args);
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
  const ref = FlashMessageManager.getDefault();
  if (!!ref) {
    ref.hideMessage(...args);
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

export const renderFlashMessageIcon = (icon = "success", style = {}, customProps = {}) => {
  switch (icon) {
    case "success":
      return (
        <Image style={[styles.flashIcon, style]} source={require("./icons/fm_icon_success.png")} {...customProps} />
      );
    case "info":
      return <Image style={[styles.flashIcon, style]} source={require("./icons/fm_icon_info.png")} {...customProps} />;
    case "warning":
      return (
        <Image style={[styles.flashIcon, style]} source={require("./icons/fm_icon_warning.png")} {...customProps} />
      );
    case "danger":
      return (
        <Image style={[styles.flashIcon, style]} source={require("./icons/fm_icon_danger.png")} {...customProps} />
      );
    default:
      return null;
  }
};

/**
 * Default MessageComponent used in FlashMessage
 * This component it's wrapped in `FlashMessageWrapper` to handle orientation change and extra inset padding in special devices
 * For most of uses this component doesn't need to be change for custom versions, cause it's very customizable
 */
export const DefaultFlash = ({
  message,
  style,
  textStyle,
  titleStyle,
  renderFlashMessageIcon,
  position = "top",
  renderCustomContent,
  floating = false,
  icon,
  hideStatusBar = false,
  ...props
}) => {
  const hasDescription = !!message.description && message.description !== "";
  const iconView =
    !!icon &&
    !!icon.icon &&
    renderFlashMessageIcon(icon.icon === "auto" ? message.type : icon.icon, [
      icon.position === "left" && styles.flashIconLeft,
      icon.position === "right" && styles.flashIconRight,
      icon.style,
    ]);
  const hasIcon = !!iconView;

  return (
    <FlashMessageWrapper position={typeof position === "string" ? position : null}>
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
          {...props}>
          {hasIcon && icon.position === "left" && iconView}
          <View style={styles.flashLabel}>
            <Text
              style={[
                styles.flashText,
                hasDescription && styles.flashTitle,
                !!message.color && { color: message.color },
                titleStyle,
              ]}>
              {message.message}
            </Text>
            {!!renderCustomContent && renderCustomContent(message)}
            {hasDescription && (
              <Text style={[styles.flashText, !!message.color && { color: message.color }, textStyle]}>
                {message.description}
              </Text>
            )}
          </View>
          {hasIcon && icon.position === "right" && iconView}
        </View>
      )}
    </FlashMessageWrapper>
  );
};

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
     * The `floating` prop unstick the message from the edges and applying some border radius to component
     */
    floating: false,
    /**
     * The `position` prop set the position of a flash message
     * Expected options: "top" (default), "bottom", "center" or a custom object with { top, left, right, bottom } position
     */
    position: "top",
    /**
     * The `render` prop will render JSX below the title of a flash message
     * Expects a function that returns JSX
     */
    renderCustomContent: null,
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
    renderCustomContent: PropTypes.func,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    renderFlashMessageIcon: PropTypes.func,
    transitionConfig: PropTypes.func,
    MessageComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
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
    if (this.props.canRegisterAsDefault) {
      FlashMessageManager.register(this);
    }
  }
  componentWillUnmount() {
    if (this.props.canRegisterAsDefault) {
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
    const { renderFlashMessageIcon, renderCustomContent, MessageComponent } = this.props;
    const { message, visibleValue } = this.state;

    const style = this.prop(message, "style");
    const textStyle = this.prop(message, "textStyle");
    const titleStyle = this.prop(message, "titleStyle");
    const floating = this.prop(message, "floating");
    const position = this.prop(message, "position");
    const icon = parseIcon(this.prop(message, "icon"));
    const hideStatusBar = this.prop(message, "hideStatusBar");
    const transitionConfig = this.prop(message, "transitionConfig");
    const animated = this.isAnimated(message);
    const animStyle = animated ? transitionConfig(visibleValue, position) : {};

    return (
      <Animated.View
        style={[
          positionStyle(styles.root, position),
          position === "center" && !!message && styles.rootCenterEnabled,
          animStyle,
        ]}>
        {!!message && (
          <TouchableWithoutFeedback onPress={this.pressMessage} onLongPress={this.longPressMessage}>
            <MessageComponent
              position={position}
              floating={floating}
              message={message}
              hideStatusBar={hideStatusBar}
              renderFlashMessageIcon={renderFlashMessageIcon}
              renderCustomContent={renderCustomContent}
              icon={icon}
              style={style}
              textStyle={textStyle}
              titleStyle={titleStyle}
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
  },
  rootTop: {
    top: 0,
  },
  rootBottom: {
    bottom: 0,
  },
  rootCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  rootCenterEnabled: {
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  defaultFlash: {
    justifyContent: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#696969",
    minHeight: OFFSET_HEIGHT,
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
  flashLabel: {
    flexDirection: "column",
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
    tintColor: "#fff",
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
