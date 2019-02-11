
import { CourseViewLayout } from '@/layouts';
import { CourseViewIntro, CourseVideoView } from '@/pages';

const courseViewRoute = {
  path: '/course-view/:courseId',
  name: 'course-view',
  component: CourseViewLayout,

  children: [{
    path: '',
    name: 'course-view-info',
    component: CourseViewIntro,
  }, {
    path: 'course-section-video/:courseSectionVideoId',
    name: 'course-section-video',
    component: CourseVideoView,
  }],

  beforeEnter(to, from, next) {
    // if (secureStorage.get('x-token')) {
    //   next({ path: '/dashboard' });
    // } else {
    //   next();
    // }
    next();
  },
};

export default courseViewRoute;
