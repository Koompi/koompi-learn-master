<template>
  <Component
    :is="renderAddCourseFormPage"
    v-bind="contentProps"
  />
</template>

<script>
import FormPageOne from './FormPageOne.vue';
import FormPageTwo from './FormPageTwo.vue';
import FormPageThree from './FormPageThree.vue';

export default {
  name: 'AddCourseForm',

  components: { FormPageOne, FormPageTwo, FormPageThree },

  props: {
    contentProps: {
      type: Object,
      default: null,
    },
  },

  destroyed() {
    this.$store.commit('setCourseIntroVideoFile', null);
    this.$store.commit('setCourseIntroImageFile', null);
    this.$store.commit('clearAllCourseSectionVideoFile');
    this.$store.commit('setSavingNewCourseToServer', false);
  },

  data() {
    return {
    };
  },

  computed: {
    renderAddCourseFormPage() {
      const { index } = this.$store.state.formWizard;

      switch (index) {
        case 0: return 'FormPageOne';

        case 1: return 'FormPageTwo';

        case 2: return 'FormPageThree';

        default: return 'FormPageOne';
      }
    },
  },
};
</script>

<style scoped>
</style>
