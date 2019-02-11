
import createTree from 'functional-red-black-tree';

const state = {
  courseWishes: createTree(),
};

const mutations = {
  addCourseToWishList(state, courseInfo) {
    state.courseWishes.insert(courseInfo.id, { ...courseInfo });
  },

  removeCourseFromWishList(state, courseId) {
    state.courseWishes.remove(courseId);
  },

  clearCourseWishList(state) {
    state.courseWishes = createTree();
  },
};

const getters = {
  listCourseFromWishList(state) {
    return state.courseWishes.values;
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
