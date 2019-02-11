
import VuexPersistence from 'vuex-persist';

const persistStorage = new VuexPersistence({
  strictMode: false,

  storage: window.localStorage,

  reducer: state => ({
    wishLists: state.wishLists,

    newCourse: state.newCourse,
  }),
});

export default persistStorage;
