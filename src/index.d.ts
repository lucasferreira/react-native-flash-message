import * as React from "react";
import { Animated, ImageProps, ImageStyle, StyleProp, TextStyle, TranslateYTransform, ViewStyle } from "react-native";

export type Position = "top" | "bottom" | "center";

type Color = "info" | "success" | "danger" | "warning";

export type MessageType = "default" | Color;

export type IconType = "none" | "auto" | Color;

export type ColorTheme = {
  [k in Color]?: string
}

export type Icon<T = IconType> =
  | T
  | {
      icon: T;
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
  type?: MessageType;
  backgroundColor?: string;
  color?: string;
}

export interface MessageComponentProps<T = IconType> {
  position?: Position;
  floating?: boolean;
  message: Message;
  hideStatusBar?: boolean;
  icon: Icon<T>;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  titleStyle: StyleProp<TextStyle>;
  renderFlashMessageIcon?(
    icon: Icon<T>,
    style: StyleProp<ImageStyle>,
    customProps: Partial<ImageProps>
  ): React.ReactElement<{}> | null;
}

export interface MessageOptions<T = IconType> {
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
  icon?: Icon<T>;
  message: string;
  position?: Position;
  textStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  type?: MessageType;
  onPress?(): void;
  onLongPress?(): void;
}

export interface FlashMessageProps<T = IconType> extends Partial<MessageOptions<T>> {
  canRegisterAsDefault?: boolean;
  style?: StyleProp<ViewStyle>;
  MessageComponent?: React.SFC<MessageComponentProps> | React.ReactElement<MessageComponentProps>;
  transitionConfig?(animValue: Animated.Value, position: Position): Transition;
  renderFlashMessageIcon?(
    icon: Icon<T>,
    style: StyleProp<ImageStyle>,
    customProps: Partial<ImageProps>
  ): React.ReactElement<{}> | null;
}

export class DefaultFlash extends React.Component<MessageComponentProps> {}

export function showMessage<T = IconType>(options: MessageOptions<T>): void;
export function hideMessage(): void;
export function positionStyle(style: StyleProp<ViewStyle>, position: Position): StyleProp<ViewStyle>;

export function FlashMessageTransition(animValue: Animated.Value, position: Position): Transition;
export default class FlashMessage extends React.Component<FlashMessageProps> {
  static setColorTheme(theme: ColorTheme): void;
}
