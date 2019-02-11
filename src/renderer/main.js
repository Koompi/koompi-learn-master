
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import fullscreen from 'vue-fullscreen';
import axios from 'axios';
import Toasted from 'vue-toasted';

import App from './App';
import router from './router';
import store from './store';
import apolloClient from './apolloClient';

import './assets/styles/global.scss';
import './assets/styles/classes.scss';
import './assets/styles/variables.scss';

function userTokenListener(mutation, state) {
  if (!state.user.token || state.user.isResetPassword) {
    const { currentRoute: { path } } = router;
    let isRedirect = false;

    if (
      path.indexOf('profile') > -1 ||
      path.indexOf('add-new-course') > -1 ||
      path.indexOf('admin') > -1 ||
      path.indexOf('course-view') > -1 ||
      path.indexOf('edit') > -1
    ) {
      isRedirect = true;
    }

    if (isRedirect) {
      router.push({ name: 'search' });
    }
  }
}

router.beforeEach((to, from, next) => {
  let toProceed = true;

  if (store.state.user.token) {
    if (to.path === '/') {
      toProceed = { name: 'search' };
    }
  }

  next(toProceed);
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

const vueToastDefaultOptions = {
  position: 'bottom-center',
  theme: 'bubble',
  iconPack: 'fontawesome',
  action: [{
    icon: 'times',
    class: 'text-white',
    onClick: (event, toastObject) => {
      toastObject.goAway(0);

      return event;
    },
  }],
};

Vue.use(VueApollo);
Vue.use(fullscreen);
Vue.use(Toasted, vueToastDefaultOptions);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

store.subscribe(userTokenListener);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  provide: apolloProvider.provide(),
}).$mount('#app');
