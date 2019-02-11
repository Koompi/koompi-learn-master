
const videoPlayerControlPropTypes = {
  isDisabledControl: {
    type: Boolean,
    default: true,
  },

  className: {
    type: String,
    default: '',
  },

  videoStreamProgress: {
    type: Number,
    default: 0,
  },

  isVideoPlaying: {
    type: Boolean,
    default: false,
  },

  videoPlayerControllStyle: {
    type: Object,
    default: null,
  },

  videoElement: {
    type: HTMLVideoElement,
    default: null,
  },

  initialVolumeLevel: {
    type: Number,
    default: 5,
  },

  onNextClick: {
    type: Function,
    default: () => {},
  },

  isHideNextButton: {
    type: Boolean,
    default: false,
  },

  isHideFullscreenButton: {
    type: Boolean,
    default: false,
  },

  onVideoScreenExpandClick: {
    type: Function,
    default: () => {},
  },
};

export default videoPlayerControlPropTypes;
