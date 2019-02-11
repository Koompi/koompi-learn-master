import Vue from 'vue';
import Router from 'vue-router';

import entryRoute from './entryRoute';
import mainRoute from './mainRoute';
import adminRoute from './adminRoute';
import courseVideoRoute from './courseVideoRoute';

Vue.use(Router);

const router = new Router({
  routes: [
    entryRoute,

    mainRoute,

    courseVideoRoute,

    adminRoute,
  ],
});

export default router;
