<template>
  <div class="course-navigation popover">
    <span class="bg-gray5 text-gray1 flex label">
      {{ label }}
      <i class="fas iconClass fa-angle-down"></i>
    </span>
    <div class="bg-gray5 popover-content cursor-pointer">
      <p
        class="popover-message"
        v-for="sublabel in subLabels"
        :key="sublabel.name"
      >
        <router-link
          class="max-width max-height"
          tag="a"
          :to="sublabel.link"
          exact
        >
          {{ sublabel.name }}
        </router-link>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CourseNavigation',

  props: {
    label: String,
    subLabels: Array,
  },

  data() {
    return {
    };
  },
};
</script>
<style scoped>

.label {
  padding: 8px 18px;
  margin-right: 8px;
  font-size: 14px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid #565252;
}

.label:hover {
  background: #C4C4C4;
}

.iconClass {
  margin-left: 10px;
}

.popover-content {
  top: 62px;
  left: -58px;
}
.popover-content:before {
  right: calc(15% - 5px);
  top: -11px;
  border-width: 0 10px 11px 10px;
}

</style>
