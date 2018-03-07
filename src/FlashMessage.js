"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

import PropTypes from "prop-types";

import FlashMessageManager from "./FlashMessageManager";
import FlashMessageWrapper, { styleWithInset } from "./FlashMessageWrapper";

/**
 * MessageComponent `minHeight` proporty used mainly in vertical transitions
 */
const OFFSET_HEIGHT = 48;

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
 *  showMessage({ message: "Contact sent", description "Your message was sent with success", type: "success" })
 *
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
 *  hideMessage()
 *
 */
export function hideMessage(...args) {
  const ref = FlashMessageManager.getDefault();
  if (!!ref) {
    ref.hideMessage(...args);
  }
}

/**
 * Default transtion config for FlashMessage component
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
  position,
  ...props
}) => {
  const hasDescription = !!message.description && message.description !== "";

  return (
    <FlashMessageWrapper
      position={typeof position === "string" ? position : null}>
      {wrapperInset => (
        <View
          style={styleWithInset(
            [
              styles.defaultFlash,
              !!message.backgroundColor
                ? { backgroundColor: message.backgroundColor }
                : !!message.type &&
                  !!FlashMessage.ColorTheme[message.type] && {
                    backgroundColor: FlashMessage.ColorTheme[message.type],
                  },
              style,
            ],
            wrapperInset
          )}
          {...props}>
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
            {hasDescription && (
              <Text
                style={[
                  styles.flashText,
                  !!message.color && { color: message.color },
                  textStyle,
                ]}>
                {message.description}
              </Text>
            )}
          </View>
        </View>
      )}
    </FlashMessageWrapper>
  );
};

DefaultFlash.propTypes = {
  message: MessagePropType,
};

/**
 * Main component of this package
 * The FlashMessage component it's a global utility to help you with easily and highly customizable flashbars, top notifications or alerts (with iPhone X "notch" support)
 * You can instace and use this component once in your main app screen
 * To global use, please add your <FlasshMessage /> as a last component in your root main screen
 *
 * <View style={{ flex: 1 }}>
 *  <YourMainApp />
 *  <FlasshMessage />   <--- here as last component
 * <View>
 *
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
     * The `position` prop set the position of a flash message
     * Expected options: "top" (default), "bottom", "center" or a custom object with { top, left, right, bottom } position
     */
    position: "top",
    /**
     * The `transitionConfig` prop set the transtion config function used in shown/hide anim interpolations
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
    onPress: PropTypes.func,
    animated: PropTypes.bool,
    animationDuration: PropTypes.number,
    duration: PropTypes.number,
    autoHide: PropTypes.bool,
    position: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
    ]),
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
    return !!message && prop in message
      ? message[prop]
      : prop in this.props ? this.props[prop] : null;
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
      const hideOnPress = this.prop(this.state.message, "hideOnPress");
      const onPress = this.prop(this.state.message, "onPress");

      if (hideOnPress) {
        this.hideMessage();
      }

      if (typeof onPress === "function") {
        onPress(event);
      }
    }
  }
  /**
   * Non-public method
   */
  toggleVisibility(visible = true, done) {
    const animated = this.prop(this.state.message, "animated");
    if (!animated) {
      return;
    }

    const animationDuration = this.prop(
      this.state.message,
      "animationDuration"
    );
    const duration = this.prop(this.state.message, "duration");
    const autoHide = this.prop(this.state.message, "autoHide");

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }

    if (visible) {
      this.setState({ isHidding: false });
      this.state.visibleValue.setValue(0);

      Animated.timing(this.state.visibleValue, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start(() => {
        if (!!autoHide && duration > 0) {
          this._hideTimeout = setTimeout(
            () => this.toggleVisibility(false),
            duration
          );
        }

        if (!!done && typeof done === "function") {
          done();
        }
      });
    } else {
      this.setState({ isHidding: true });

      Animated.timing(this.state.visibleValue, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ message: null, isHidding: false });

        if (!!done && typeof done === "function") {
          done();
        }
      });
    }
  }
  /**
   * Instace ref function to handle show messages
   * Pass some `message` object as first attribute to display a flash message
   *
   *  this.refs.YOUR_REF.showMessage({ message: "Contact sent", description "Your message was sent with success", type: "success" })
   *
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
      this.setState(
        { message: _message },
        () => animated && this.toggleVisibility(true)
      );
      return;
    }

    this.setState({ message: null, isHidding: false });
  }
  /**
   * Instace ref function to programmatically hide message
   *
   *  this.refs.YOUR_REF.hideMessage()
   *
   */
  hideMessage() {
    const animated = this.isAnimated(this.state.message);
    if (!animated) {
      this.setState({ message: null, isHidding: false });
    } else {
      this.toggleVisibility(false);
    }
  }
  render() {
    const { style, textStyle, titleStyle, MessageComponent } = this.props;

    const { message, visibleValue } = this.state;

    const position = this.prop(message, "position");
    const transitionConfig = this.prop(message, "transitionConfig");
    const animated = this.isAnimated(message);
    const animStyle = animated ? transitionConfig(visibleValue, position) : {};

    return (
      <Animated.View style={[positionStyle(styles.root, position), animStyle]}>
        {!!message && (
          <TouchableWithoutFeedback onPress={this.pressMessage}>
            <MessageComponent
              message={message}
              style={style}
              textStyle={textStyle}
              titleStyle={titleStyle}
              position={position}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
  },
  defaultFlash: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#696969",
    minHeight: OFFSET_HEIGHT,
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
});
