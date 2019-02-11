const state = {
  status: {
    isCompleted: true,
    uploading: {},
  },
};

const mutations = {
  clearFilesUploadingStatus(state) {
    state.status = {
      isCompleted: true,
      uploading: {},
    };
  },

  setFileUploadingProgress(state, { filename, progress, id }) {
    state.status.isCompleted = false;
    state.status.uploading = {
      ...state.status.uploading,
      [id]: { filename, progress },
    };
  },

  setIsFileUploadCompleted(state, isCompleted) {
    state.status.isCompleted = isCompleted;
  },
};

const actions = {};

const getters = {
  getCurrentFilesUploadingContent(state) {
    return state.status.uploading;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
