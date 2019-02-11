<template>
  <div class="base-table max-height">
    <BaseTableHeader
      :onInputSearch="onSearchInput"
      :loading="loading"
    />

    <table
      class="base-table-content margin-vertical-10px relative"
      :class="{ 'base-table-loading': loading }"
    >
      <div
        class="base-table-loading-cover-overlay max-width
        max-height absolute"
      />

      <MoveBlockLoader
        color="bg-white"
        className="base-table-loading-overlay absolute max-width max-height"
      />

      <tr>
        <th
          class="no-interaction"
          v-for="(tm, index) in titleMapperWithAction"
          :key="index"
          :class="{
            'base-table-content-row-column-right-border':
              index != maxTitleMapperIndex,
            'cursor-pointer': tm.sortable,
            'margin-horizontal-10px':
              index % 2 === 0,
          }"
          @click="() => tm.onSortBy()"
        >
          {{ tm.fieldNameRemap }}
          <i
            v-if="tm.sortable"
            class="fas fa-sort-amount-up"
            :class="{ 'sorting-active': tm.isSorted }"
          />
        </th>
      </tr>

      <tr
        v-for="(d, index) in data"
        :key="index"
        :class="{ 'base-table-tr-gray-strap': index % 2 === 0 }"
      >
        <th
          class="base-table-content-th"
          v-for="(tm, index) in titleMapper"
          :key="index"
          :class="{
            'base-table-content-row-column-right-border':
              index != maxTitleMapperIndex,
            'margin-horizontal-10px':
              index % 2 === 0,
          }"
        >
          <slot
            :name="tm.fieldName"
            v-bind:slotData="{
              reactiveDataMapper,
              dataField: d[tm.fieldName],
              data: d
            }"
          >
            {{
              tm.customFieldTransform ?
                tm.customFieldTransform(d[tm.fieldName], reactiveDataMapper, d)
                :
                d[tm.fieldName]
            }}
          </slot>
        </th>

        <th
          v-for="(action, index) in dataActions"
          :key="index + maxTitleMapperIndex + 1"
        >
          <component
            :is="action.element"
            v-bind="applyCallbackValueToElementProps(
              d,
              action.elementProps,
              action.callback,
              action.customTransformer
            )"
          />
        </th>
      </tr>
    </table>

    <BaseTableFooter
      :numberOfEntry="numberOfEntry"
      :numberOfEntryPerPage="numberOfEntryPerPage"
      :onPageIndexChange="onPageIndexChange"
      :loading="loading"
    />
  </div>
</template>

<script>
/*
  eslint max-lines: 0, max-len: 0
*/
import BaseTableHeader from './BaseTableHeader.vue';
import BaseTableFooter from './BaseTableFooter.vue';

export default {
  name: 'BaseTable',

  components: {
    BaseTableHeader,
    BaseTableFooter,
    async MoveBlockLoader() {
      const { MoveBlockLoader } = await import('@/components');

      return MoveBlockLoader;
    },
  },

  props: {
    numberOfEntry: {
      type: Number,
      validator(value) {
        return value >= 0;
      },
      required: true,
    },

    numberOfEntryPerPage: {
      type: Number,
      validator(value) {
        return value >= 0;
      },
      default: 1,
    },

    data: {
      type: Array,
      default: () => [],
    },

    reactiveDataMapper: {
      type: [Array, Object],
      default: null,
    },

    dataActions: {
      type: Array,
      validator(values) {
        const propToValidate = [
          'element',
          'elementProps',
          'callback',
        ];
        let isValid = true;
        let keys = null;

        values.map((v) => {
          keys = Object.keys(v);

          if (
            keys.indexOf(propToValidate[0]) < 0 ||
            keys.indexOf(propToValidate[1]) < 0
          ) {
            isValid = false;
          }

          return v;
        });

        return isValid;
      },
      default: () => [],
    },

    titleMapper: {
      type: Array,
      validator(values) {
        const propToValidate = [
          'fieldName',
          'fieldNameRemap',
          'sortable',
          'customFieldTransform',
        ];
        const secondaryPropToValidate = [
          'onSortBy',
          'isSorted',
        ];
        let isValid = true;
        let keys = null;

        values.map((v) => {
          keys = Object.keys(v);

          if (
            keys.indexOf(propToValidate[0]) < 0 ||
            keys.indexOf(propToValidate[1]) < 0 ||
            keys.indexOf(propToValidate[2]) < 0 ||
            keys.indexOf(propToValidate[3]) < 0
          ) {
            isValid = false;
          }

          if (
            keys.indexOf(propToValidate[2]) >= 0 &&
            v[propToValidate[2]]
          ) {
            if (
              keys.indexOf(secondaryPropToValidate[0]) < 0 ||
              keys.indexOf(secondaryPropToValidate[1]) < 0
            ) {
              isValid = false;
            }
          }

          return v;
        });

        return isValid;
      },
      default: () => [{}],
    },

    loading: {
      type: Boolean,
      default: true,
    },

    onPageIndexChange: {
      type: Function,
      default: () => {},
    },

    onSearchInput: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      isSeachTyping: false,
      searchString: '',
    };
  },

  computed: {
    titleMapperWithAction() {
      return [...this.titleMapper, {
        fieldName: '',
        fieldNameRemap: 'Action',
        sortable: false,
      }];
    },

    maxTitleMapperIndex() { return this.titleMapper.length; },
  },

  methods: {
    applyCallbackValueToElementProps(
      value,
      elementProps,
      callback,
      customTransformer = null,
    ) {
      elementProps.onClick = () => callback(value);

      if (customTransformer) {
        return customTransformer(elementProps, value, this.reactiveDataMapper);
      }

      return elementProps;
    },
  },
};
</script>

<style scoped>
.base-table-content {border-collapse: collapse;}
.base-table-loading-cover-overlay{
  content: "";
  top: 0;
  left: 0;
  background-color: gray;
  opacity: 0;
  z-index: 2;
  visibility: hidden;
  transition: .2s;
  will-change: opacity, visibility;
}
.base-table-content.base-table-loading .base-table-loading-cover-overlay {
  opacity: .5;
  visibility: visible;
}
.base-table-loading-overlay {
  z-index: 5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
}
.base-table-content.base-table-loading .base-table-loading-overlay {
  opacity: 1;
  visibility: visible;
}

.base-table-tr-gray-strap {background-color: #ccc;}
.base-table-content-th {font-weight: lighter;}
.base-table-content .fa-sort-amount-up.sorting-active {color: lightseagreen;}
</style>
