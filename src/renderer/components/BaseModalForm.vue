<template>
  <div class="base-modal-form max-width relative size-calc-spacing-include">
    <div class="base-modal-form-header flex align-center justify-space-between">
      <h3 class="base-modal-form-header-title">{{ formTitle }}</h3>
      <i
        class="fas fa-times cursor-pointer"
        @click="formOnClose"
      />
    </div>

    <form
      class="base-modal-form-content"
      :id="uniqueFormName"
      @submit.prevent="onSubmit"
    >
      <BaseLabelInput
        v-for="(field, index) in processedFields"
        :key="index"
        v-bind="field"
      />

      <div
        class="flex
        base-modal-form-content-footer align-center justify-space-between"
      >
        <span
          class="cursor-pointer"
          @click="leftButtonOnClickCallback"
        >
          {{ leftButtonLabel }}
        </span>

        <BaseButton
          bgColor="bg-blue"
          textColor="text-white"
          class="base-modal-submit-button"
          type="submit"
          isDebounce
          :fontSize=15
          :label="submitButtonLabel"
          :isDisabled="isSubmitting"
          :isLoading="isSubmitting"
        />
      </div>
    </form>

    <div>
      <p
        v-if="!isShowErrorOnInput"
        class="margin-vertical-10px"
        v-for="(error, index) in fieldErrors"
        :key="index"
      >
        <span class="text-red">{{ error.key }}</span>: {{ error.message }}
      </p>

      <GraphQLErrorParser
        v-if="!isShowErrorOnInput || standardErrors || requestErrors"
        :standardErrors="standardErrors"
        :requestErrors="requestErrors"
      />
    </div>
  </div>
</template>

<script>
import {
  BaseLabelInput,
  BaseButton,
} from '@/components';
import _ from 'lodash';
import formPropsValidator from '@/utils/formPropsValidator';
import formValueSerialize from '@/utils/formValueSerialize';
import addErrorToSchemaFields from '@/utils/addErrorToSchemaFields';

export default {
  name: 'BaseLoginForm',

  components: {
    BaseLabelInput,
    BaseButton,
    async GraphQLErrorParser() {
      const Comp = await import('@/components');

      return Comp.GraphQLErrorParser;
    },
  },

  props: {
    fields: {
      type: Array,
      validator: formPropsValidator,
      default: [],
      required: true,
    },
    submitButtonLabel: {
      type: String,
      default: 'Submit',
    },
    onCloseCallback: {
      type: Function,
      default: () => {},
    },
    onSubmitCallback: {
      type: Function,
      default: () => {},
    },
    requestErrors: {
      type: Error,
      default: null,
    },
    standardErrors: {
      type: Array,
      default: null,
    },
    isShowErrorOnInput: {
      type: Boolean,
      default: false,
    },
    uniqueFormName: {
      type: String,
      default: 'uniqueBaseModalForm',
    },
    formTitle: {
      type: String,
      default: 'Form Title',
    },
    leftButtonLabel: {
      type: String,
      default: '',
    },
    leftButtonOnClickCallback: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      isSubmitting: false,

      fieldErrors: null,
    };
  },

  computed: {
    processedFields() {
      if (this.fieldErrors && this.fieldErrors.length) {
        const newFields =
          addErrorToSchemaFields(_.cloneDeep(this.fields), this.fieldErrors);
        return newFields;
      }
      return this.fields;
    },
  },

  methods: {
    formOnClose() {
      this.$store.commit('closeModal');

      this.fieldErrors = [];

      this.onCloseCallback(document.getElementById(this.uniqueFormName));
    },

    async onSubmit(event) {
      this.isSubmitting = true;
      this.fieldErrors = null;

      const { elements } = event.target;
      const { values, errors } = formValueSerialize(elements, this.fields);

      this.fieldErrors = errors;

      if (!this.fieldErrors || !this.fieldErrors.length) {
        await this.onSubmitCallback(
          { ...values },
          elements,
        );
      }

      this.isSubmitting = false;
    },
  },
};
</script>

<style scoped>
.base-modal-form {
  padding: 20px;
  width: 350px;
}
.base-modal-submit-button {width: 100px;}
.base-modal-form-header {border-bottom: 1px solid gray;}
.base-modal-form-header-title, .base-modal-form-header .fa-times {
  margin-bottom: 10px;
}
.base-modal-form-footer, .base-modal-form-content-footer {min-height: 60px;}
.parsed-errors{ padding-top: 5px; border-top: 1px solid gray; }
.parsed-errors p.margin-vertical-10px{ font-size: 14px !important;}
@media only screen and (max-width: 375px) {
  .base-modal-form {
    width: auto;
  }
}
</style>
