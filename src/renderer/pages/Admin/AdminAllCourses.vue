<template>
  <div
    class="admin-all-courses flex size-calc-spacing-include
    justify-center align-center"
  >
    <div
      v-if="loading"
      class="flex column-align justify-center align-center"
    >
      <MoveBlockLoader/>
      <p class="margin-vertical-10px">Loading all courses</p>
    </div>

    <BaseTable
      v-if="courses"
      :data="courses"
      :numberOfEntry="allCourseCount"
      :numberOfEntryPerPage="numberOfEntryPerPage"
      :titleMapper="tableTitleMapper"
      :onPageIndexChange="onPageIndexChange"
      :dataActions="dataActions"
      :onSearchInput="onSearchInput"
      :reactiveDataMapper="approvalChanges"
      :loading="refetching"
    />

    <GraphQLErrorParser
      v-if="standardErrors || requestErrors"
      :stantardErrors="standardErrors"
      :requestErrors="requestErrors"
    />
  </div>
</template>

<script>
/*
  eslint max-lines: 0
*/
import _ from 'lodash';
import {
  COURSES_ADMIN_QUERY,
  ME_QUERY,
  ADMIN_ALL_COURSE_COUNT_QUERY,
} from '@/queries';
import { APPROVE_COURSE_MUTATION } from '@/mutations';
import {
  MoveBlockLoader,
  GraphQLErrorParser,
  BaseTable,
  BaseButton,
} from '@/components';

export default {
  name: 'AdminAllCourses',

  components: {
    MoveBlockLoader,
    GraphQLErrorParser,
    BaseTable,
  },

  watch: {
    searchInput() { this.refetching = true; },

    limit() { this.refetching = true; },

    pageOffset() { this.refetching = true; },
  },

  data() {
    return {
      courses: null,

      me: null,

      loading: true,
      refetching: false,

      standardErrors: null,
      requestErrors: null,

      allCourseCount: 0,

      approvalChanges: {},

      numberOfEntryPerPage: 10,
      searchInput: '',
      pageOffset: 0,
    };
  },

  apollo: {
    adminListCourses: {
      query: COURSES_ADMIN_QUERY,

      throttle: 2000,
      debounce: 2000,

      variables() {
        return {
          limit: this.numberOfEntryPerPage,
          title: this.searchInput,
          offset: this.pageOffset,
        };
      },

      error(errors) {
        this.requestErrors = errors;
      },

      result({ data, networkStatus }) {
        if (data.errors) {
          this.standardErrors = data.errors;
        } else if (networkStatus === 8) {
          this.standardErrors = [{ key: 'network', message: 'Unresolved' }];
        }

        this.courses = data.adminListCourses;

        this.loading = false;
        this.refetching = false;
      },
    },

    me: {
      query: ME_QUERY,
      throttle: 2000,
      debounce: 2000,

      error() { this.$router.push({ name: 'search' }); },
      result({ networkStatus, data }) {
        if (data.errors || networkStatus === 8) {
          this.$router.push({ name: 'search' });
        }
      },
    },

    allCourseCount: {
      query: ADMIN_ALL_COURSE_COUNT_QUERY,
      throttle: 2000,
      debouncec: 2000,
    },
  },

  computed: {
    dataActions() {
      return [{
        element: BaseButton,
        elementProps: {
          label: 'Approve',
          bgColor: 'bg-red',
          textColor: 'text-white',
          isDebounce: true,
          className: 'admin-all-course-action-button',
        },
        callback: this.approveCourse,
        customTransformer: (element, data, reactiveDataMapper) => {
          if (reactiveDataMapper[data.id]) {
            return { ...element, isDisabled: reactiveDataMapper[data.id] };
          }

          const isAdminApproval =
            data.approvals.find(el => el.approver.id === this.me.id);

          if (isAdminApproval && isAdminApproval.isApproved) {
            return { ...element, isDisabled: true };
          }

          return element;
        },
      }, {
        element: BaseButton,
        elementProps: {
          label: 'View Course',
          bgColor: 'bg-blue',
          textColor: 'text-white',
          className: 'admin-all-course-action-button',
        },
        callback: this.viewCourseDetail,
      }];
    },

    tableTitleMapper() {
      return [{
        fieldName: 'title',
        fieldNameRemap: 'Title',
        customFieldTransform: null,
        sortable: true,
        onSortBy: null,
        isSorted: null,
      }, {
        fieldName: 'instructorName',
        fieldNameRemap: 'Instructor',
        customFieldTransform: null,
        sortable: true,
        onSortBy: null,
        isSorted: null,
      }, {
        fieldName: 'insertedAt',
        fieldNameRemap: 'Created At',
        customFieldTransform: null,
        sortable: true,
        onSortBy: null,
        isSorted: null,
      }, {
        fieldName: 'approvals',
        fieldNameRemap: 'Is Approved',
        customFieldTransform: (dataField, reactiveDataMapper, data) => {
          if (reactiveDataMapper[data.id]) {
            return reactiveDataMapper[data.id];
          }

          const isAdminApprove =
            dataField.find(el => el.approver.id === this.me.id);

          if (isAdminApprove) {
            return isAdminApprove.isApproved;
          }

          return false;
        },
        sortable: true,
        onSortBy: null,
        isSorted: null,
      }, {
        fieldName: 'isPublish',
        fieldNameRemap: 'Is Published',
        customFieldTransform: null,
        sortable: true,
        onSortBy: null,
        isSorted: null,
      }];
    },
  },

  methods: {
    onPageIndexChange: _.debounce(function (index) {
      if (!this.refetching) {
        this.pageOffset = index * this.numberOfEntryPerPage;
      }
    }, 1000),

    onSearchInput(value) {
      if (!this.refetching) {
        this.searchInput = value;
      }
    },

    async approveCourse(course) {
      const isAdminApprove =
        course.approvals.find(approval => approval.id === this.me.id);

      try {
        const { data } = await this.$apollo.mutate({
          mutation: APPROVE_COURSE_MUTATION,

          variables: {
            courseId: course.id,
            isApproved: isAdminApprove === undefined ? true :
              !isAdminApprove.isApproved,
          },

          throttle: 2000,
          debounce: 2000,
        });

        if (data.approveCourse.ok) {
          this.approvalChanges = {
            ...this.approvalChanges,
            [course.id]: isAdminApprove === undefined ?
              true : !isAdminApprove.isApproved,
          };

          this.$toasted.success('Successfully approved the course', {
            duration: 2000,
            singleton: true,
          });
        } else if (data.approveCourse.errors) {
          console.log(data.approveCourse.errors);
        }
      } catch (errors) {
        console.log(errors);
      }
    },

    viewCourseDetail(course) {
      this.$router.push({
        name: 'course-detail',
        params: { courseId: course.id },
      });
    },
  },
};
</script>

<style>
.admin-all-courses {padding: 20px;}
.admin-all-course-action-button {padding: 0px 10px !important;}
</style>
