
/*
  eslint no-unexpected-multiline: [0], dot-notation: [0]
*/

const defaultState = {
  title: '',
  description: '',
  subjects: [],
  courseSections: [{
    title: '',
    orderAs: 0,
    description: '',
    courseSectionVideos: [{ title: '', orderAs: 0, videoFile: null }],
  }],
  introImageFile: null,
  introVideoFile: null,
  standardErrors: null,
  requestErrors: null,
  isSavingToServer: false,
};

const state = { ...defaultState };

const mutations = {
  setCourseTitle(state, title) { state.title = title; },

  removeCourseSection(state, index) { state.courseSections.splice(index, 1); },

  removeCourseSectionVideo(state, payload) {
    const [courseSectionKey, courseSectionVideoIndex] = payload;

    state.courseSections
      [courseSectionKey]
      ['courseSectionVideos'].splice(courseSectionVideoIndex, 1);
  },

  setCourseDescription(state, description) {
    state.description = description;
  },

  addCourseRelatedSubject(state, subject) { state.subjects.push(subject); },

  setCourseIntroImageFile(state, introImageFile) {
    state.introImageFile = introImageFile;
  },

  updateCourseSection(state, payload) {
    const [index, fieldToUpdate, value] = payload;

    state.courseSections[index][fieldToUpdate] = value;
  },

  updateCourseSectionVideo(state, payload) {
    const [
      courseSectionKey,
      courseSectionVideoIndex,
      fieldToUpdate,
      value,
    ] = payload;

    state.courseSections
      [courseSectionKey]
      ['courseSectionVideos']
      [courseSectionVideoIndex]
      [fieldToUpdate] = value;
  },

  setCourseIntroVideoFile(state, introVideoFile) {
    state.introVideoFile = introVideoFile;
  },

  setCourseRelatedSubject(state, subjects) { state.subjects = [...subjects]; },

  addCourseSection(state, courseSection = {}) {
    state.courseSections.push({
      title: '',
      description: '',
      orderAs: state.courseSections.length,
      courseSectionVideos: [{
        title: '',
        orderAs: 0,
        videoFile: null,
      }],
      ...courseSection,
    });
  },

  addCourseSectionVideo(state, courseSectionKey) {
    const length =
      state
        .courseSections[courseSectionKey]
        .courseSectionVideos
        .length;

    state
      .courseSections[courseSectionKey]
      .courseSectionVideos
      .push({
        title: '',
        orderAs: length,
        videoFile: null,
      });
  },

  clearAllCourseSectionVideoFile(state) {
    state.courseSections.forEach(({ courseSectionVideos }) => {
      courseSectionVideos.forEach((elem) => {
        elem.videoFile = null;
      });
    });
  },

  removeFromTree(state, field, elem) {
    state[field].splice(state[field].indexOf(elem), 1);
  },

  clearNewCourseFormContent(state) {
    state.title = '';
    state.description = '';
    state.subjects = [];
    state.courseSections = [{
      title: '',
      description: '',
      orderAs: 0,
      courseSectionVideos: [{
        title: '',
        orderAs: 0,
        videoFile: null,
      }],
    }];
    state.introImageFile = '';
    state.standardErrors = null;
    state.requestErrors = null;
    state.isSavingToServer = false;
  },

  setNewCourseStandardErrors(state, errors) {
    state.standardErrors = errors;
  },

  setNewCourseRequestErrors(state, errors) {
    state.requestErrors = errors;
  },

  setSavingNewCourseToServer(state, isSaving) {
    state.isSavingToServer = isSaving;
  },
};

const getters = {
  newCourseTitle(state) { return state.title; },
  newCourseDescription(state) { return state.description; },
  newCourseRelatedSubjects(state) { return state.subjects; },
  newCourseSections(state) { return state.courseSections; },
  newCourseIntroImageFile(state) { return state.introImageFile; },
  newCourseIntroVideoFile(state) { return state.introVideoFile; },
  newCourseForm(state) { return state; },
  newCourseFormValidationErrors(state) {
    return [state.standardErrors, state.requestErrors];
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
