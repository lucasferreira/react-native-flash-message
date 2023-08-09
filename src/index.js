import FlashMessageManager from "./FlashMessageManager";
import FlashMessageWrapper, { getFlashMessageStatusBarHeight, styleWithInset } from "./FlashMessageWrapper";
import FlashMessage, {
  DefaultFlash,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon,
} from "./FlashMessage";

export {
  FlashMessageManager,
  DefaultFlash,
  styleWithInset,
  getFlashMessageStatusBarHeight,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon,
};

export default FlashMessage;
