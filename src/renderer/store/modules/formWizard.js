
const state = {
  index: 0,
  maxIndex: 0,
};

const mutations = {
  nextFormWizardStep(state) {
    if (state.index < state.maxIndex) {
      state.index += 1;
    }
  },

  prevFormWizardStep(state) {
    if (state.index > 0) {
      state.index -= 1;
    }
  },

  setFormWizardStep(state, index) {
    if (index >= 0 && index < state.maxIndex) {
      state.index = index;
    }
  },

  setMaxWizardStep(state, max) {
    state.maxIndex = max;
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
