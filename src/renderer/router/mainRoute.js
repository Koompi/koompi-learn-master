
import {
  CourseDetailPage,
  CourseSearchPage,
  ProfilePage,
  ChangeUserPassword,
  UpdateUserProfile,
  AddNewCourse,
  CourseEdit,
  CourseSectionEdit,
  AddCourseSection,
} from '@/pages';

import {
  ProfileInformation,
  WishlistComponent,
  MyCourse,
} from '@/components';

import { MainLayout } from '../layouts';

const mainRoute = {
  path: '/main',
  name: 'main',
  component: MainLayout,

  children: [
    {
      path: 'course-detail/:courseId',
      name: 'course-detail',
      component: CourseDetailPage,
    },
    {
      path: 'search/:courseTitle?/:courseSubject?',
      name: 'search',
      component: CourseSearchPage,
    },
    {
      path: 'add-new-course',
      name: 'add-new-course',
      component: AddNewCourse,
    },
    {
      path: 'course-edit/:courseId',
      name: 'course-edit',
      component: CourseEdit,
    },
    {
      path: 'course-section-edit/:courseSection',
      name: 'course-section-edit',
      component: CourseSectionEdit,
      props: true,
    },
    {
      path: 'new-course-section/:courseId',
      name: 'new-course-section',
      component: AddCourseSection,
    },
    {
      path: 'profile',
      name: 'profile',
      component: ProfilePage,

      children: [
        {
          path: '',
          name: 'user-profile',
          component: ProfileInformation,
        },
        {
          path: 'wishlist',
          name: 'user-wishlist',
          component: WishlistComponent,
        },
        {
          path: 'my-courses',
          name: 'user-courses',
          component: MyCourse,
        },
        {
          path: 'change-password',
          name: 'change-password',
          component: ChangeUserPassword,
        },
        {
          path: 'update-profile/:userProfile',
          name: 'update-user-profile',
          component: UpdateUserProfile,
          props: true,
        },
      ],

    },
    {
      path: '*',
      component: CourseSearchPage,
    },
  ],
};

export default mainRoute;
