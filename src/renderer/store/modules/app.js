const state = {
  sourceKeyEventListenerCallback: () => {},
};

const mutations = {
  setAppSourceKeyEventListenerCallback(state, callback) {
    state.sourceKeyEventListenerCallback = callback;
  },

  clearAppSourceKeyEventListenerCallback(state) {
    state.sourceKeyEventListenerCallback = () => {};
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
