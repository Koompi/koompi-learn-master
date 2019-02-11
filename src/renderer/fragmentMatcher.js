
const createIntrospectionFactory = kind => (name, possibleTypes) => ({
  name,
  kind,
  possibleTypes: possibleTypes.map(typename => ({ name: typename })),
});

const createInterface = createIntrospectionFactory('INTERFACE');
// const createUnion = createIntrospectionFactory('UNION');

export default {
  introspectionQueryResultData: {
    __schema: {
      types: [
        createInterface('UserInfo', [
          'Student',
          'Instructor',
        ]),

        createInterface('CourseInfo', [
          'StudentCourseView',
          'OwnerCourseView',
        ]),
      ],
    },
  },
};
