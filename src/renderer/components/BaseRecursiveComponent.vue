<template>
  <div
    :class="className"
    class="base-recursive-component max-width bg-white"
  >
    <component
      v-if="
        data.objectList &&
        typeof data.objectList === 'object' &&
        data.objectList.length
      "
      v-for="(obj, index) in data.objectList"
      v-bind="obj"
      :key="genRandomKey(index)"
      :is="obj.customComponent || customComponent"
    />

    <template v-if="data.recursive">
      <BaseRecursiveComponent
        v-if="data.recursive.data"
        :className="data.recursive.className"
        :recursiveDepth="recursiveDepth + 1"
        :data="data.recursive.data"
        :customComponent="data.recursive.customComponent || customComponent"
      />

      <BaseRecursiveComponent
        v-if="
          data.recursive.dataArray &&
          data.recursive.dataArray.length > 0
        "
        v-for="(r, index) in data.recursive.dataArray"
        :className="data.recursive.className"
        :recursiveDepth="recursiveDepth + 1"
        :key="genRandomKey(index)"
        :data="r"
        :customComponent="data.recursive.customComponent || customComponent"
      />
    </template>
  </div>
</template>

<script>
import shortid from 'shortid';

export default {
  name: 'BaseRecursiveComponent',

  props: {
    className: {
      type: String,
      default: '',
    },

    data: {
      type: Object,
      default: () => ({}),
    },

    dataArray: {
      type: Array,
      default: () => [],
    },

    customComponent: {
      type: Object,
      required: true,
    },

    recursiveDepth: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    genRandomKey() {
      return shortid.generate();
    },
  },
};
</script>

<style scoped>
.base-recursive-component {border-radius: 6px;}
</style>
