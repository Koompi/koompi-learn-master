<template>
  <div
    class="admin-all-field-study flex size-calc-spacing-include
    justify-center align-center relative"
  >
    <div
      v-if="loading"
      class="flex column-align justify-center align-center"
    >
      <MoveBlockLoader/>
      <p class="margin-vertical-10px">Loading all field studies</p>
    </div>

    <BaseTable
      v-if="fieldStudies"
      :data="fieldStudies"
      :numberOfEntry="allFieldStudyCount"
      :numberOfEntryPerPage="numberOfEntryPerPage"
      :titleMapper="tableTitleMapper"
      :onPageIndexChange="onPageIndexChange"
      :dataActions="dataActions"
      :reactiveDataMapper="fieldStudyChanges"
      :loading="refetching"
    >
      <template
        slot-scope="slotProps"
        slot="subjects"
      >
        <div class="admin-all-field-study-subjects flex flex-wrap">
          <span
            v-for="({ field }, index) in
              studyFieldSubjectChangesObserver(
                slotProps.slotData.dataField,
                slotProps.slotData.reactiveDataMapper,
                slotProps.slotData.data
              )
            "
            class="admin-all-field-study-subjects-field bg-gray2 text-white"
            :key="index"
          >
            {{ field }}
          </span>
        </div>
      </template>
    </BaseTable>

    <GraphQLErrorParser
      v-if="standardErrors || requestErrors"
      :stantardErrors="standardErrors"
      :requestErrors="requestErrors"
    />

    <BaseButton
      label="+ Field Study"
      bgColor="bg-blue"
      textColor="text-white"
      className="absolute admin-add-field-study-button"
      :onClick="openAddFieldStudyModal"
      :loading="isAddingFieldStudy"
    />
  </div>
</template>

<script>
/*
  eslint max-lines: 0
*/
import _ from 'lodash';
import {
  MoveBlockLoader,
  GraphQLErrorParser,
  BaseButton,
  BaseTable,
  BaseForm,
} from '@/components';
import {
  ADMIN_ALL_FIELD_STUDY_COUNT_QUERY,
  FIELD_STUDIES_QUERY,
  SUBJECTS_QUERY,
} from '@/queries';
import {
  UPDATE_FIELD_STUDY_MUTATION,
  ADD_FIELD_STUDY_MUTATION,
  REMOVE_FIELD_STUDY_MUTATION,
} from '@/mutations';

export default {
  name: 'AdminAllFieldStudy',

  components: {
    MoveBlockLoader,
    GraphQLErrorParser,
    BaseButton,
    BaseTable,
    BaseForm,
  },

  watch: {
    pageOffset() { this.refetching = true; },
  },

  data() {
    return {
      refetching: false,
      loading: true,
      isAddingFieldStudy: false,

      subjects: null,

      fieldStudies: null,
      standardErrors: null,
      requestErrors: null,
      addFieldStudyStandardErrors: null,
      addFieldStudyRequestErrors: null,

      fieldStudyChanges: {},

      allFieldStudyCount: 0,
      numberOfEntryPerPage: 10,
      pageOffset: 0,
    };
  },

  apollo: {
    fieldStudies: {
      query: FIELD_STUDIES_QUERY,
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

    allFieldStudyCount: {
      query: ADMIN_ALL_FIELD_STUDY_COUNT_QUERY,
      throttle: 2000,
      debounce: 2000,
    },

    subjects: {
      query: SUBJECTS_QUERY,
      throttle: 2000,
      debounce: 2000,
    },
  },

  computed: {
    tableTitleMapper() {
      return [{
        fieldName: 'field',
        fieldNameRemap: 'Field of Study',
        customFieldTransform: null,
        sortable: false,
      }, {
        fieldName: 'subjects',
        fieldNameRemap: 'Subjects',
        customFieldTransform: (dataField, reactiveMapper, data) => {
          if (reactiveMapper[data.id]) {
            return reactiveMapper[data.id].subjects;
          }

          return dataField;
        },
        sortable: false,
      }];
    },

    dataActions() {
      return [{
        element: BaseButton,
        elementProps: {
          label: 'Remove',
          bgColor: 'bg-red',
          textColor: 'text-white',
        },
        callback: this.openRemoveFieldStudyConfirmModal,
      }, {
        element: BaseButton,
        elementProps: {
          label: 'Edit',
          bgColor: 'bg-blue',
          textColor: 'text-white',
        },
        callback: this.openEditFieldStudyModal,
      }];
    },
  },

  methods: {
    onPageIndexChange: _.debounce(function (index) {
      if (!this.refetching) {
        this.pageOffset = index * this.numberOfEntryPerPage;
      }
    }, 1000),

    openModal({ contentComponent, contentProps }) {
      this.$store.commit('openModal', {
        contentComponent,
        contentProps,
        closeOnOutsideClick: true,
        clearModalContentOnInit: true,
      });
    },

    async onSaveNewFieldStudy(values) {
      const { field } = values;
      const subjects = values.subjects.reduce((acc, subj, index) => {
        acc[index] = (JSON.parse(subj)).id || null;

        return acc;
      }, new Array(values.subjects.length));

      try {
        const { data } = await this.$apollo.mutate({
          mutation: ADD_FIELD_STUDY_MUTATION,
          throttle: 2000,
          debounce: 2000,
          variables: { field, subjects },
        });

        if (data.addFieldStudy) {
          if (data.addFieldStudy.ok) {
            this.$toasted.success('Successfully add new field study', {
              duration: 3000,
              singleton: true,
            });
          } else if (data.addFieldStudy.errors) {
            this.addFieldStudyStandardErrors =
              data.addFieldStudyStandardErrors;
          }
        }
      } catch (errors) {
        this.addFieldStudyRequestErrors = errors;
      }
    },

    async onSaveEditFieldStudy(values, fieldStudyId) {
      const { field } = values;
      const subjectsLabel = new Array(values.subjects.length);
      const subjects = values.subjects.reduce((acc, subj, index) => {
        acc[index] = (JSON.parse(subj)).id || null;

        subjectsLabel[index] = { field: (JSON.parse(subj)).field };

        return acc;
      }, new Array(values.subjects.length));

      try {
        const { data } = await this.$apollo.mutate({
          mutation: UPDATE_FIELD_STUDY_MUTATION,
          throttle: 2000,
          debounce: 2000,
          variables: { field, subjects, id: fieldStudyId },
        });

        if (data.updateFieldStudy) {
          if (data.updateFieldStudy.ok) {
            this.fieldStudyChanges = {
              ...this.fieldStudyChanges,
              [fieldStudyId]: { field, subjects: subjectsLabel },
            };

            this.$toasted.success('Successfullly updated field study', {
              duration: 3000,
              singleton: true,
            });
          } else if (data.updateFieldStudy.errors) {
            console.log(data.updateFieldStudy.errors);
          }
        }
      } catch (errors) {
        console.log(errors);
      }
    },

    openRemoveFieldStudyConfirmModal(dataField) {
      this.openModal({
        contentComponent: 'BaseModalConfirmDialog',
        contentProps: {
          onConfirm: async () => {
            try {
              const { data } = await this.$apollo.mutate({
                mutation: REMOVE_FIELD_STUDY_MUTATION,
                throttle: 2000,
                debounce: 2000,
                variables: { id: dataField.id },
              });

              if (data.removeFieldStudy) {
                if (data.removeFieldStudy.ok) {
                  this.$toasted.success('Successfully removed field study', {
                    duration: 3000,
                    singleton: true,
                  });
                } else if (data.removeFieldStudy.errors) {
                  console.log(data.removeFieldStudy.errors);
                }
              }
            } catch (errors) {
              console.log(errors);
            }
          },
          confirmMessage: `Confirm to remove ${dataField.field}?`,
        },
      });
    },

    openEditFieldStudyModal(data) {
      this.openModal({
        contentComponent: BaseForm,
        contentProps: {
          formFields: [{
            label: 'Field Study',
            type: 'text',
            name: 'field',
            value: data.field,
          }, {
            label: 'Related Subjects',
            type: 'tag',
            name: 'subjects',
            options: [...this.subjects],
            values: data.subjects,
            contentProps: {
              labelProperty: 'field',
            },
            getFromDataValue: true,
            uniqueId: 'fieldStudyRelatedSubjects',
          }],
          submitButtonLabel: 'Save',
          isVerticalStyling: true,
          isNoSubmitOnEnter: true,
          isShowTitleLineBreak: false,
          onSubmit: values => this.onSaveEditFieldStudy(values, data.id),
          isShowErrorOnInput: true,
          standardErrors: this.addFieldStudyStandardErrors,
          requestErrors: this.addFieldStudyRequestErrors,
        },
      });
    },

    openAddFieldStudyModal() {
      this.addFieldStudyStandardErrors = null;
      this.addFieldStudyRequestErrors = null;

      this.openModal({
        contentComponent: BaseForm,
        contentProps: {
          formFields: [{
            label: 'Field Study',
            type: 'text',
            name: 'field',
          }, {
            label: 'Related Subjects',
            type: 'tag',
            name: 'subjects',
            options: [...this.subjects],
            contentProps: {
              labelProperty: 'field',
            },
            getFromDataValue: true,
            uniqueId: 'fieldStudyRelatedSubjects',
          }],
          submitButtonLabel: 'Save',
          isVerticalStyling: true,
          isNoSubmitOnEnter: true,
          isShowTitleLineBreak: false,
          onSubmit: this.onSaveNewFieldStudy,
          isShowErrorOnInput: true,
          standardErrors: this.addFieldStudyStandardErrors,
          requestErrors: this.addFieldStudyRequestErrors,
        },
      });
    },

    studyFieldSubjectChangesObserver(dataField, reactiveMapper, data) {
      if (reactiveMapper[data.id] && reactiveMapper[data.id].subjects) {
        return reactiveMapper[data.id].subjects;
      }

      return dataField;
    },
  },
};
</script>

<style scoped>
.admin-add-field-study-button {bottom: 0px; left: 10px}
.admin-all-field-study-subjects-field {padding: 10px; margin: 5px;}
.admin-all-field-study {padding: 10px;}
</style>
