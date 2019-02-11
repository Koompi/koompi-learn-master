<template>
  <div
    class="admin-all-subjects flex size-calc-spacing-include
    justify-center align-center relative"
  >
    <div
      v-if="loading"
      class="flex column-align justify-center align-center"
    >
      <MoveBlockLoader/>
      <p class="margin-vertical-10px">Loading all subjects</p>
    </div>

    <BaseTable
      v-if="subjects"
      :data="subjects"
      :numberOfEntry="allSubjectCount"
      :numberOfEntryPerPage="numberOfEntryPerPage"
      :titleMapper="tableTitleMapper"
      :onPageIndexChange="onPageIndexChange"
      :dataActions="dataActions"
      :reactiveDataMapper="subjectChanges"
      :loading="refetching"
    />

    <GraphQLErrorParser
      v-if="standardErrors || requestErrors"
      :stantardErrors="standardErrors"
      :requestErrors="requestErrors"
    />

    <BaseButton
      label="+ Subject"
      bgColor="bg-blue"
      textColor="text-white"
      className="absolute admin-add-subject-button"
      :onClick="openAddSubjectModal"
      :loading="isAddingSubject"
    />
  </div>
</template>

<script>
/*
  eslint max-lines: 0
*/
import _ from 'lodash';
import { ADMIN_ALL_SUBJECT_COUNT_QUERY, SUBJECTS_QUERY } from '@/queries';
import {
  ADD_SUBJECT_MUTATION,
  UPDATE_SUBJECT_MUTATION,
  REMOVE_SUBJECT_MUTATION,
} from '@/mutations';
import {
  BaseTable,
  MoveBlockLoader,
  GraphQLErrorParser,
  BaseButton,
  BaseForm,
} from '@/components';

export default {
  name: 'AdminAllSubjects',

  components: {
    BaseTable,
    MoveBlockLoader,
    GraphQLErrorParser,
    BaseButton,
    BaseForm,
  },

  watch: {
    pageOffset() { this.refetching = true; },
  },

  data() {
    return {
      subjects: null,

      loading: true,
      refetching: false,

      isAddingSubject: false,

      standardErrors: null,
      requestErrors: null,

      addSubjectStandardErrors: null,
      addSubjectRequestErrors: null,

      subjectChanges: {},

      allSubjectCount: 0,

      numberOfEntryPerPage: 10,
      searchInput: '',
      pageOffset: 0,
    };
  },

  apollo: {
    subjects: {
      query: SUBJECTS_QUERY,
      throttle: 2000,
      debounce: 2000,

      variables() {
        return {
          limit: this.numberOfEntryPerPage,
          offset: this.pageOffset,
        };
      },

      error(errors) { this.requestErrors = errors; },
      result({ networkStatus }) {
        if (networkStatus === 8) {
          this.standardErrors = [{ key: 'network', message: 'unresolved' }];
        }

        this.loading = false;
        this.refetching = false;
      },
    },

    allSubjectCount: {
      query: ADMIN_ALL_SUBJECT_COUNT_QUERY,
      throttle: 2000,
      debounce: 2000,
    },
  },

  computed: {
    tableTitleMapper() {
      return [{
        fieldName: 'field',
        fieldNameRemap: 'Subject Field',
        customFieldTransform: (dataField, reactiveMapper, data) => {
          if (reactiveMapper[data.id]) {
            return reactiveMapper[data.id];
          }

          return dataField;
        },
        sortable: true,
        isSorted: null,
        onSortBy: null,
      }];
    },

    dataActions() {
      return [{
        element: BaseButton,
        elementProps: {
          label: 'Remove',
          bgColor: 'bg-red',
          textColor: 'text-white',
          isDebounce: true,
        },
        callback: this.openRemoveSubjectModal,
      }, {
        element: BaseButton,
        elementProps: {
          label: 'Edit',
          bgColor: 'bg-blue',
          textColor: 'text-white',
        },
        callback: this.openSubjectEditModal,
      }];
    },
  },

  methods: {
    openModal({ contentComponent, contentProps }) {
      this.$store.commit('openModal', {
        contentComponent,
        contentProps,
        closeOnOutsideClick: true,
        clearModalContentOnInit: true,
      });
    },

    openRemoveSubjectModal(subject) {
      this.openModal({
        contentComponent: 'BaseModalConfirmDialog',
        contentProps: {
          onConfirm: async () => {
            try {
              const { data } = await this.$apollo.mutate({
                mutation: REMOVE_SUBJECT_MUTATION,
                throttle: 2000,
                debounce: 2000,
                variables: { id: subject.id },
              });

              if (data.removeSubject) {
                if (data.removeSubject.ok) {
                  this.$toasted.success('Successfully removed subject', {
                    duration: 3000,
                    singleton: true,
                  });
                } else if (data.removeSubject.errors) {
                  console.log(data.removeSubject.errors);
                }
              }
            } catch (errors) {
              console.log(errors);
            }
          },
          confirmMessage: `Confirm to remove ${subject.field}?`,
        },
      });
    },

    openSubjectEditModal(subject) {
      this.addSubjectStandardErrors = null;
      this.addSubjectRequestErrors = null;

      this.openModal({
        contentComponent: BaseForm,
        contentProps: {
          formFields: [{
            label: 'Subject Field',
            type: 'text',
            name: 'field',
            value: subject.field,
          }],
          submitButtonLabel: 'Save',
          onSubmit: values => this.saveSubjectEdit(subject.id, values),
          isVerticalStyling: true,
          isShowTitleLineBreak: false,
          isShowErrorOnInput: true,
          standardErrors: this.addSubjectStandardErrors,
          requestErrors: this.addSubjectRequestErrors,
        },
      });
    },

    async saveSubjectEdit(subjectId, { field }) {
      this.addSubjectStandardErrors = null;
      this.addSubjectRequestErrors = null;

      try {
        const { data } = await this.$apollo.mutate({
          mutation: UPDATE_SUBJECT_MUTATION,
          throttle: 2000,
          debounce: 2000,
          variables: { id: subjectId, field },
        });

        if (data.updateSubject) {
          if (data.updateSubject.ok) {
            this.subjectChanges[subjectId] = field;

            this.$toasted.success('Successfully updated subject', {
              duration: 3000,
              singleton: true,
            });
          } else if (data.updateSubject.errors) {
            this.addSubjectStandardErrors = data.updateSubject.errors;
          }
        }
      } catch (errors) {
        this.addSubjectRequestErrors = errors;
      }
    },

    async addSubject({ field }) {
      this.isAddingSubject = true;
      this.addSubjectStandardErrors = null;
      this.addSubjectRequestErrors = null;

      try {
        const { data } = await this.$apollo.mutate({
          mutation: ADD_SUBJECT_MUTATION,
          throttle: 2000,
          debounce: 2000,
          variables: { field },
        });

        if (data.addSubject && data.addSubject.field) {
          this.allSubjectCount += 1;

          this.$toasted.success('Successfully added new subject', {
            duration: 3000,
            singleton: true,
          });
        }
      } catch (errors) {
        this.addSubjectRequestErrors = errors;
      }

      this.isAddingSubject = false;
    },

    onPageIndexChange: _.debounce(function (index) {
      if (!this.refetching) {
        this.pageOffset = index * this.numberOfEntryPerPage;
      }
    }, 1000),

    openAddSubjectModal() {
      this.addSubjectStandardErrors = null;
      this.addSubjectRequestErrors = null;

      this.openModal({
        contentComponent: BaseForm,
        contentProps: {
          formFields: [{
            label: 'Subject Field',
            type: 'text',
            name: 'field',
          }],
          submitButtonLabel: 'Add',
          onSubmit: this.addSubject,
          isVerticalStyling: true,
          isShowErrorOnInput: true,
          isShowTitleLineBreak: false,
          standardErrors: this.addSubjectStandardErrors,
          requestErrors: this.addSubjectRequestErrors,
        },
      });
    },
  },
};
</script>

<style scoped>
.admin-all-subjects {padding: 20px;}
.admin-add-subject-button {bottom: 10px; right: 10px;}
</style>
