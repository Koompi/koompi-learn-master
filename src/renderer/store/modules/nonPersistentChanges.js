function defaultState() {
  return { userData: {} };
}

const state = defaultState();

const mutations = {
  setNonPersistentChanges(state, payload) {
    const { id, data } = payload;

    if (state.userData[id]) {
      state.userData = {
        ...state.userData,
        [id]: { ...state.userData[id], ...data },
      };
    } else {
      state.userData = { ...state.userData, [id]: data };
    }
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
