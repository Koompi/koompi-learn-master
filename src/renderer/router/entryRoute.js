
import { EntryLayout } from '../layouts';

const entryRoute = {
  path: '/',
  name: 'koompi-learn',
  component: EntryLayout,

  beforeEnter(to, from, next) {
    // if (secureStorage.get('x-token')) {
    //   next({ path: '/dashboard' });
    // } else {
    //   next();
    // }
    next();
  },
};

export default entryRoute;
