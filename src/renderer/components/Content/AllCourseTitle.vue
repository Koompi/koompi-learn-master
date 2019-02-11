<template>
  <div class="title">
    <h3>{{ title }}</h3>
    <div class="absolute border-only max-width relative" />
  </div>
</template>
<script>
export default {
  name: 'AllCourseTitle',

  props: {
    title: String,
  },
};
</script>
<style scoped>
.title h3 {
  padding-bottom: 5px;
}
</style>
