
export const computedKeyCodes = {
  backspaceKey() { return 8; },
  deleteKey() { return 46; },
  upArrowKey() { return 38; },
  leftArrowKey() { return 37; },
  rightArrowKey() { return 39; },
  downArrowKey() { return 40; },
  fKey() { return 70; },
  escapeKey() { return 27; },
  spaceKey() { return 32; },
  enterKey() { return 13; },
};

export default function videoPlayerOnKeyPressEvent(event) {
  const { keyCode } = event;

  switch (keyCode) {
    case this.backspaceKey:
    case this.deleteKey:
    case this.leftArrowKey: {
      this.onPrevVideo();
      break;
    }

    case this.rightArrowKey: {
      this.onNextVideo();
      break;
    }

    case this.spaceKey:
    case this.enterKey: {
      this.videoOnPress();
      break;
    }

    case this.escapeKey: {
      if (this.isFullscreen) {
        this.videoScreenExpand();
      }
      break;
    }

    case this.fKey: {
      this.videoScreenExpand();
      break;
    }

    default: {
      break;
    }
  }
}
