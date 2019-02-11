
const state = {
  value: [],
};

const mutations = {
  setSubjects(state, subjects) {
    state.value = [...subjects];
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
