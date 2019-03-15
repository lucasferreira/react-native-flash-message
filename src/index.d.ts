import * as React from "react";
import { Animated, ImageProps, ImageStyle, StyleProp, TextStyle, TranslateYTransform, ViewStyle } from "react-native";

type Position = "top" | "bottom" | "center";
type MessageType = "none" | "default" | "info" | "success" | "danger" | "warning";

type Icon =
  | MessageType
  | {
      icon: MessageType;
      position: Position;
    };

type Transition =
  | {
      transform: TranslateYTransform[];
      opacity: number;
    }
  | { opacity: number }
  | {};

interface MessageComponentProps {
  position: Position;
  floating: boolean;
  message: string;
  hideStatusBar: boolean;
  icon: Icon;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  titleStyle: StyleProp<TextStyle>;
  renderFlashMessageIcon?(
    icon: Icon,
    style: StyleProp<ImageStyle>,
    customProps: Partial<ImageProps>
  ): React.ReactElement<{}> | null;
}

interface MessageOptions {
  animated?: boolean;
  animationDuration?: number;
  backgroundColor?: string;
  autoHide?: boolean;
  color?: string;
  description?: string;
  duration?: number;
  floating?: boolean;
  hideOnPress?: boolean;
  hideStatusBar?: boolean;
  icon?: Icon;
  message: string;
  position?: Position;
  type?: MessageType;
  onPress?(): void;
}

interface FlashMessageProps extends Partial<MessageOptions> {
  canRegisterAsDefault?: boolean;
  MessageComponent?: React.ReactElement<MessageComponentProps>;
  transitionConfig?(animValue: Animated.Value, position: Position): Transition;
  renderFlashMessageIcon?(
    icon: Icon,
    style: StyleProp<ImageStyle>,
    customProps: Partial<ImageProps>
  ): React.ReactElement<{}> | null;
}

export function showMessage(options: MessageOptions): void;
export function hideMessage(): void;
export function positionStyle(style: StyleProp<ViewStyle>, position: Position): StyleProp<ViewStyle>;

export function FlashMessageTransition(animValue: Animated.Value, position: Position): Transition;
export default class FlashMessage extends React.Component<FlashMessageProps> {}
