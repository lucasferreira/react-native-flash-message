import * as React from "react";
import { Animated, ImageProps, ImageStyle, StyleProp, TextStyle, TranslateYTransform, ViewStyle } from "react-native";

export type Position = "top" | "bottom" | "center";
export type MessageType = "none" | "default" | "info" | "success" | "danger" | "warning";

export type Icon =
  | MessageType
  | {
      icon: MessageType;
      position: Position;
    };

export type Transition =
  | {
      transform: TranslateYTransform[];
      opacity: number;
    }
  | { opacity: number }
  | {};

export interface Message {
  message: string;
  description?: string;
  type?: string;
  backgroundColor?: string;
  color?: string;
}

export interface MessageComponentProps {
  position?: Position;
  floating?: boolean;
  message: Message;
  hideStatusBar?: boolean;
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

export interface MessageOptions {
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
  textStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  type?: MessageType;
  onPress?(): void;
  onLongPress?(): void;
}

export interface FlashMessageProps extends Partial<MessageOptions> {
  canRegisterAsDefault?: boolean;
  style?: StyleProp<ViewStyle>;
  MessageComponent?: React.SFC<MessageComponentProps> | React.ReactElement<MessageComponentProps>;
  transitionConfig?(animValue: Animated.Value, position: Position): Transition;
  renderFlashMessageIcon?(
    icon: Icon,
    style: StyleProp<ImageStyle>,
    customProps: Partial<ImageProps>
  ): React.ReactElement<{}> | null;
}

export class DefaultFlash extends React.Component<MessageComponentProps> {}

export function showMessage(options: MessageOptions): void;
export function hideMessage(): void;
export function positionStyle(style: StyleProp<ViewStyle>, position: Position): StyleProp<ViewStyle>;

export function FlashMessageTransition(animValue: Animated.Value, position: Position): Transition;
export default class FlashMessage extends React.Component<FlashMessageProps> {
  static setColorTheme(theme: ColorTheme): void;
}

export interface ColorTheme {
  success?: string;
  info?: string;
  warning?: string;
  danger?: string;
}
