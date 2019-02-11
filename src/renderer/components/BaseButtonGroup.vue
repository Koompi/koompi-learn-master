<template>
  <div
    class="base-button-group align-center"
    :class="[className, ...alignmentClasses]"
  >
    <BaseButton
      v-for="(button, index) in buttons"
      :key="index"
      v-bind="button"
    />
  </div>
</template>

<script>
import { BaseButton } from '@/components';

export default {
  name: 'BaseButtonGroup',

  components: { BaseButton },

  props: {
    buttons: {
      type: Array,
      required: true,
    },

    className: {
      type: String,
      default: '',
    },

    uniformDistributeGap: {
      type: Number,
      default: 10,
    },

    alignment: {
      type: String,
      validator(value) {
        return [
          'right',
          'left',
          'center',
          'space-between',
          'uniformly-distribute',
        ].indexOf(value) > -1;
      },
      default: 'right',
    },
  },

  computed: {
    alignmentClasses() {
      switch (this.alignment) {
        case 'right': return ['justify-end', 'flex'];

        case 'center': return ['justify-center', 'flex'];

        case 'space-between': return ['justify-space-between', 'flex'];

        case 'uniformly-distribute': return [
          'grid',
          'base-button-group-distribute-uniformly',
        ];

        default: return [];
      }
    },
  },
};
</script>

<style scoped>
.base-button-group-distribute-uniformly {
  grid-gap: 10px;
  grid-template-columns: repeat(auto, minmax(100px, auto));
}
</style>

