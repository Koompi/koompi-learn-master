<template>
  <div
    class="base-form"
    :class="className"
  >
    <h3 v-if="formTitle">{{ formTitle }}</h3>

    <hr
      v-if="isShowTitleLineBreak"
      class="breakline-v1 breakline-bg"
    />

    <form
      class="base-form-fields max-width size-calc-spacing-include"
      ref="base-form"
      @submit.prevent="onFormSubmit"
    >
      <div :class="formContentClass">
        <BaseLabelInput
          v-for="(field, index) in processedFields"
          :key="index"
          v-bind="field"
          className="base-form-input"
        />
      </div>

      <div class="flex max-width column-align base-form-footer">
        <div
          class="base-form-btn-group
          flex justify-space-between margin-vertical-10px"
        >
          <span />

          <BaseButton
            v-if="isShowSubmitButton"
            bgColor="bg-blue"
            textColor="text-white"
            :type="isNoSubmitOnEnter ? 'button' : 'submit'"
            :fontSize=15
            :label="submitButtonLabel"
            :isDisabled="isSubmiting"
            :isLoading="isSubmiting"
            :onClick="isNoSubmitOnEnter ? submissionProcess : () => {}"
          />
        </div>

        <hr
          class="max-width margin-zero"
          v-if="standardErrors || requestErrors || fieldErrors"
        />

        <GraphQLErrorParser
          v-if="
            (!isShowErrorOnInput && !customErrorComponent) ||
            standardErrors || requestErrors
          "
          :standardErrors="standardErrors || fieldErrors"
          :requestErrors="requestErrors"
        />
      </div>
    </form>
  </div>
</template>

<script>
/*
  eslint object-shorthand: [0], max-lines: [0]
*/
import formPropsValidator from '@/utils/formPropsValidator';
import formValueSerialize from '@/utils/formValueSerialize';
import {
  BaseLabelInput,
  BaseButton,
} from '@/components';
import addErrorToSchemaFields from '@/utils/addErrorToSchemaFields';

export default {
  name: 'BaseForm',

  components: {
    BaseLabelInput,
    BaseButton,
    async GraphQLErrorParser() {
      const { GraphQLErrorParser } = await import('@/components');

      return GraphQLErrorParser;
    },
  },

  props: {
    formFields: {
      type: Array,
      validator: formPropsValidator,
      required: true,
    },

    onSubmit: {
      type: Function,
      default: () => {},
    },

    formTitle: {
      type: String,
      default: '',
    },

    className: {
      type: String,
      default: '',
    },

    standardErrors: {
      type: Array,
      default: null,
    },

    requestErrors: {
      type: Error,
      default: null,
    },

    customErrorComponent: {
      type: Boolean,
      default: false,
    },

    isShowErrorOnInput: {
      type: Boolean,
      default: false,
    },

    submitButtonLabel: {
      type: String,
      default: 'Submit',
    },

    isVerticalStyling: {
      type: Boolean,
      default: false,
    },

    isShowTitleLineBreak: {
      type: Boolean,
      default: true,
    },

    isNoSubmitOnEnter: {
      type: Boolean,
      default: false,
    },

    isShowSubmitButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isSubmiting: false,

      fieldErrors: [],
    };
  },

  computed: {
    processedFields() {
      if (this.fieldErrors && !this.isNoSubmitOnEnter) {
        const newFields =
          addErrorToSchemaFields(this.formFields, this.fieldErrors);

        return newFields;
      }

      return this.formFields;
    },

    formContentClass() {
      return !this.isVerticalStyling ? 'base-form-grid-field grid' : '';
    },
  },

  methods: {
    onFormSubmit() {
      if (!this.isNoSubmitOnEnter) {
        this.submissionProcess();
      }
    },

    async submissionProcess() {
      this.isSubmiting = true;

      const elements = this.$refs['base-form'];

      const { values, errors } = formValueSerialize(elements, this.formFields);

      this.fieldErrors = errors;

      if (!this.fieldErrors.length) {
        await this.onSubmit({ ...values });
      }

      this.isSubmiting = false;
    },
  },
};
</script>

<style scoped>
.breakline-bg {
  background-color: #ccc;
}
.breakline-bg::after {
  background-color: black;
}
.base-form-fields {
  background-color: white;
  padding: 10px;
  border-radius: 6px;
}
.base-form-grid-field { grid-template-columns: 1fr 1fr; grid-gap: 10px; }
</style>
