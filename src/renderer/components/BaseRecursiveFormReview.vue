<template>
  <div
    class="base-recursive-form-review max-width
    bg-white size-calc-spacing-include"
    v-if="!isEmptyObject(filteredObject)"
    :class="className"
  >
    <p v-if="headerTitle">{{ headerTitle }}</p>

    <div
      class="base-recursing"
      v-for="(value, key, index) in filteredObject"
      :key="index"
    >
      <div
        v-if="value && (typeof value === 'string' || value.isRenderCustomTag)"
        class="grid base-recursing-list no-scroll"
      >
        <p>{{ stringCapitalize(key) }}</p>
        <p v-if="!value.tagToRender">
          {{ value }}
        </p>
        <img
          v-else-if="value.tagToRender === 'img'"
          :src="value.customValue"
          class="base-recursive-form-review-image"
        />
        <video
          v-else-if="value.tagToRender === 'video'"
          controls
          class="base-recursive-form-review-video"
        >
          <source :src="value.customValue" />
        </video>
      </div>

      <div
        v-else-if="value.list &&
        value.list.length &&
        value.isRenderAsList"
        class="grid base-recursing-item-listing"
      >
        <p>{{ stringCapitalize(value.renderAsListPropertyLabel) }}</p>
        <div class="grid base-recursing-item-list">
          <p
            v-for="(val, index) in value.list"
            :key="index"
            class="base-recursing-item-list-item bg-gray3 text-white"
          >
            {{ val[value.propertyOfValueForRenderAsList] }}
          </p>
        </div>
      </div>

      <div v-else-if="renderAsFlattenList && value.length">
        <BaseRecursiveFormReview
          v-for="(vals, index) in value"
          :key="index"
          :data="vals"
          className="base-form-recurse-nested-bracket margin-vertical-10px"
        />
      </div>

      <div
        v-else-if="!isEmptyObject(value)"
        class="base-form-recurse-nested"
      >
        <BaseRecursiveFormReview
          v-for="(val, index) in value"
          :key="index"
          v-bind="val"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

function recursiveDataObjectValidator(object) {
  if (!object || object === null) {
    return true;
  }

  const keys = Object.keys(object || {});

  if (!keys.length) {
    return true;
  }

  let isValid = true;
  let index = 0;

  for (; index < keys.length; index += 1) {
    const element = object[keys[index]];

    if (typeof element === 'object' && keys[index] !== 'list') {
      isValid = recursiveDataObjectValidator(element);
    }
  }

  if (keys.indexOf('isRenderAsList') > -1) {
    if (
      keys.indexOf('propertyOfValueForRenderAsList') < 0 ||
      keys.indexOf('list') < 0 ||
      !object.list ||
      object.renderAsListPropertylabel !== 'string'
    ) {
      isValid = false;
    }
  } else if (keys.indexOf('renderAsFlattenList') > -1) {
    if (!object.data.list) {
      isValid = false;
    }
  }

  return isValid;
}

export default {
  name: 'BaseRecursiveFormReview',

  props: {
    data: {
      type: Object,
      validator: recursiveDataObjectValidator,
      required: true,
    },

    renderAsFlattenList: {
      type: true,
      default: false,
    },

    headerTitle: {
      type: String,
      default: '',
    },

    className: {
      type: String,
      default: '',
    },

    isRenderCustomTag: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    filteredObject() {
      if (this.data) {
        const keys = Object.keys(this.data);
        const filteredData = {};

        keys.forEach((key) => {
          if (this.data[key]) {
            filteredData[key] = this.data[key];
          }
        });

        return filteredData;
      }

      return null;
    },
  },

  methods: {
    stringCapitalize(str) {
      return str[0].toUpperCase() + str.substring(1);
    },

    isEmptyObject(object) {
      return _.isEmpty(object);
    },
  },
};
</script>

<style scoped>
.base-recursive-form-review {
  padding: 10px;
}
.base-form-recurse-nested {
  border: 1px solid #ccc;
  margin-top: 10px;
}
.base-form-recurse-nested,
.base-recursive-form-review {
  border-radius: 6px;
}
.base-recursing-list, .base-recursing-item-listing {
  grid-template-columns: 30% 70%;
  border-bottom: 1px solid #ccc;
  padding: 10px 0px;
}
.base-form-recurse-nested-bracket {border: 1px solid #ccc;}

.base-recursing-list,
.base-recursing-item-listing,
.base-recursing-item-list {
  grid-gap: 10px;
}
.base-recursing-item-list-item {
  padding: 6px 10px; width: max-content; border-radius: 2px;
}
.base-recursive-form-review-image,
.base-recursive-form-review-video {height: 300px; width: 100%;}

.base-recursive-form-review-image {object-fit: cover;}
</style>
