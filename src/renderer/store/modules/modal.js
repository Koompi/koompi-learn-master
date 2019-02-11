const defaultState = () => ({
  isOpen: false,
  closeOnOutsideClick: false,
  contentProps: null,
  contentComponent: '',
  clearModalContentOnInit: false,
});

const state = defaultState();

const mutations = {
  openModal(
    state,
    payload,
  ) {
    state.isOpen = true;

    if (typeof payload === 'string') {
      state.contentComponent = payload;
    } else {
      state.contentComponent = payload.contentComponent;
      state.contentProps = payload.contentProps;
      state.modalContentComponent = payload.modalContentComponent;
      state.closeOnOutsideClick = payload.closeOnOutsideClick;
      state.clearModalContentOnInit = payload.clearModalContentOnInit;
    }
  },

  closeModal(state, callback = null) {
    if (state.clearModalContentOnInit) {
      Object.assign(state, defaultState());
    } else {
      state.isOpen = false;
      state.closeOnOutsideClick = false;
    }

    if (callback) {
      callback();
    }
  },

  setModalCloseOnOutsideClick(state, isCloseOnOutsideClick) {
    state.closeOnOutsideClick = isCloseOnOutsideClick;
  },

  setModalContentComponent(state, contentComponent) {
    state.contentComponent = contentComponent;
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
