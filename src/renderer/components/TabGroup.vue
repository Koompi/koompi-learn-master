
<template>
  <div class="tab flex justify-center align-center color-gray1">
    <TabComponent
      v-for="tab in tabs"
      :key="tab.value"
      :label="tab.label"
      :value="tab.value"
      :onClick="tab.onClick"
    />

    <TabComponent
      :onClick="() => $router.push({ name: 'search', params: '' })"
      class="fas fa-th"
    />
  </div>
</template>

<script>
export default {
  name: 'TabGroup',

  components: {
    async TabComponent() {
      const Component = await import('@/components');
      return Component.TabComponent;
    },
  },

  data() {
    return {
    };
  },

  props: {
    tabs: {
      type: Array,
      validator(arrObj) {
        let isValidatePass = false;

        arrObj.map((obj) => {
          isValidatePass =
            typeof obj.label === 'string' &&
            typeof obj.value === 'string';

          return isValidatePass;
        });

        return isValidatePass;
      },
    },
  },
};
</script>


<style scoped>
</style>
