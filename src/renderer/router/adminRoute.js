
import { AdminLayout } from '@/layouts';

import {
  AdminDashboard,
  AdminAllCourses,
  AdminAllUsers,
  AdminAllSubjects,
  AdminAllFieldStudy,
} from '@/pages';

const adminRoute = {
  path: '/admin',
  name: 'admin-panel',
  component: AdminLayout,

  children: [{
    path: '',
    name: 'admin-dashboard',
    component: AdminDashboard,
  }, {
    path: 'all-courses',
    name: 'admin-all-courses',
    component: AdminAllCourses,
  }, {
    path: 'all-users',
    name: 'admin-all-users',
    component: AdminAllUsers,
  }, {
    path: 'all-subjects',
    name: 'admin-all-subjects',
    component: AdminAllSubjects,
  }, {
    path: 'all-field-study',
    name: 'admin-all-field-study',
    component: AdminAllFieldStudy,
  }],
};

export default adminRoute;
