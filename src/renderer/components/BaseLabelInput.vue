
<template>
  <label
    class="labeled-input flex column-align"
    :class="className"
  >
    <h4
      v-if="label"
      class="labeled-input-label text-gray2 margin-vertical-10px"
    >
      {{ label }}
      <span class="text-red">
        {{ isRequired ? '*' : '' }}
      </span>
    </h4>

    <input
      v-if="isRenderInputTag"
      v-bind="contentProps"
      v-model="dataValue"
      class="max-width
      no-outline labeled-input-field size-calc-spacing-include"
      :class="{ 'border-red': validationErrorMessage }"
      :type="type"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :id="uniqueId"
      @input="inputOnChange"
    />

    <select
      v-else-if="isRenderSelectTag"
      v-bind="contentProps"
      v-model="dataValue"
      class="max-width
      no-outline labeled-input-field size-calc-spacing-include bg-white"
      :class="{ 'border-red': validationErrorMessage }"
      :name="name"
      :id="uniqueId"
      @input="inputOnChange"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :selected="option.selected === option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <textarea
      v-else-if="isRenderTextAreaTag"
      v-model="dataValue"
      v-bind="contentProps"
      class="max-width
      no-outline labeled-input-field size-calc-spacing-include"
      :class="{ 'border-red': validationErrorMessage }"
      :name="name"
      :placeholder="placeholder"
      :id="uniqueId"
      :style="{ height: textAreaHeight }"
      @input="textAreaOnChagne"
    />

    <BaseLabelMediaInput
      v-else-if="isRenderMediaInput"
      v-bind="contentProps"
      :name="name"
      :type="type"
      :uniqueId="uniqueId"
      :url="url || null"
      :onChange="customInputOnChange"
    />

    <BaseLabelTagInput
      v-else-if="isRenderSelectTagInput"
      v-bind="contentProps"
      :options="options"
      :placeholder="placeholder"
      :values="values"
      :name="name"
      :uniqueId="uniqueId"
      :onChange="customInputOnChange"
    />

    <div
      v-else-if="isRenderRadio"
      class="flex"
    >
      <div
        v-for="(option, index) in options"
        :class="{ 'margin-horizontal-10px': index % 2 !== 0 }"
        :key="index"
      >
        <input
          type="radio"
          :key="index"
          :name="name"
          :value="option.value"
          :checked="dataValue === option.value"
        />
        {{ option.label }}
      </div>
    </div>

    <span
      class="text-red flex align-center"
      :class="{'labled-input-validation-error-message': validationErrorMessage}"
    >
      {{ validationErrorMessage }}
    </span>
  </label>
</template>

<script>
/*
  eslint max-lines: [0], prefer-arrow-callback: [0]
*/
import _ from 'lodash';

export default {
  name: 'BaseLabelInput',

  components: {
    async BaseLabelMediaInput() {
      const { BaseLabelMediaInput } = await import('@/components');

      return BaseLabelMediaInput;
    },
    async BaseLabelTagInput() {
      const { BaseLabelTagInput } = await import('@/components');

      return BaseLabelTagInput;
    },
  },

  props: {
    label: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      validator(value) {
        return [
          'select',
          'text',
          'password',
          'number',
          'email',
          'textarea',
          'image',
          'video',
          'tag',
          'radio',
        ].indexOf(value) > -1;
      },
      required: true,
    },

    value: {
      type: [String, Number],
      default: '',
    },

    values: {
      type: Array,
      default: () => [],
    },

    validationErrorMessage: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: '',
    },

    options: {
      type: Array,
      default: () => [],
    },

    className: {
      type: String,
      default: '',
    },

    onChange: {
      type: Function,
      default: () => {},
    },

    url: {
      type: String,
      default: '',
    },

    contentProps: {
      type: Object,
      default: () => ({}),
    },

    uniqueId: {
      type: String,
      default: null,
    },

    isRequired: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    let textAreaHeight = 'auto';

    if (this.type === 'textarea') {
      const elem = document.getElementsByName(this.name)[0];

      if (elem) {
        textAreaHeight = 'auto';
        textAreaHeight = `${elem.scrollHeight}px`;
      }
    }

    return {
      dataValue: this.value,

      textAreaHeight,
    };
  },

  computed: {
    isRenderInputTag() {
      return ['text', 'password', 'number', 'email'].indexOf(this.type) > -1;
    },

    isRenderSelectTag() { return this.type === 'select'; },

    isRenderTextAreaTag() { return this.type === 'textarea'; },

    isRenderSelectTagInput() { return this.type === 'tag'; },

    isRenderRadio() { return this.type === 'radio'; },

    isRenderMediaInput() {
      return ['video', 'image'].indexOf(this.type) > -1;
    },
  },

  methods: {
    textAreaOnChagne(event) {
      this.inputOnChange(event);

      event.target.style.cssText = 'height: auto';
      event.target.style.cssText = `height: ${event.target.scrollHeight}px`;
    },

    inputOnChange: _.debounce(function (event) {
      const val = this.type === 'number' ?
        parseInt(event.target.value, 10) : event.target.value;

      this.onChange(val);
    }, 500),

    customInputOnChange: _.debounce(function (value) {
      this.onChange(value);
    }, 500),
  },
};
</script>

<style scoped>
.labeled-input-field {
  min-height: 40px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  resize: none;
  transition: .3s;
  font-size:16px;
}
.labled-input-validation-error-message {
  height: 25px;
  font-size: 14px;
}
</style>
