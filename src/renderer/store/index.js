import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';
import persistStorage from '../persistStorage';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  // strict: process.env.NODE_ENV !== 'production',
  strict: false,
  plugins: [persistStorage.plugin],
});
