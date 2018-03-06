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

const OFFSET_HEIGHT = 48;
const noop = () => {};

function srid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}-${s4()}-${s4()}`;
}

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

export function showMessage(...args) {
  const ref = FlashMessageManager.getDefault();
  if (!!ref) {
    ref.showMessage(...args);
  }
}

export function hideMessage(...args) {
  const ref = FlashMessageManager.getDefault();
  if (!!ref) {
    ref.hideMessage(...args);
  }
}

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
  message: PropTypes.shape({
    message: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
};

export default class FlashMessage extends Component {
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
  prop(message, prop) {
    return !!message && prop in message
      ? message[prop]
      : prop in this.props ? this.props[prop] : null;
  }
  isAnimated(message) {
    return this.prop(message, "animated");
  }
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
  hideMessage() {
    const animated = this.isAnimated(this.state.message);
    if (!animated) {
      this.setState({ message: null, isHidding: false });
    } else {
      this.toggleVisibility(false);
    }
  }
  pressMessage(event) {
    if (!this.state.isHidding) {
      const { hideOnPress, onPress } = this.props;
      if (hideOnPress) {
        this.hideMessage();
      }

      onPress(event);
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

  static defaultProps = {
    canRegisterAsDefault: true,
    hideOnPress: true,
    onPress: noop,
    animated: true,
    animationDuration: 225,
    duration: 1850,
    autoHide: true,
    position: "top",
    transitionConfig: FlashMessageTransition,
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
