<template>
  <span
    class="tablinks flex justify-center align-center cursor-pointer
    border-gray3 bg-gray5"
    :class="{ 'color-blue': isSelected }"
    @click="onTabClick"
  >
    <i
      :class="iconClass"
      :if="iconClass"
    />
    {{ label }}
  </span>
</template>
<script>
export default {
  name: 'TabComponent',

  props: {
    label: String,
    value: String,
    iconClass: String,
    isSelected: {
      type: Boolean,
      default: false,
    },

    onClick: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    onTabClick() {
      this.onClick(this.value);
    },
  },
};
</script>
<style scoped>
.tablinks {
  font-size: 14px;
  padding: 0px 20px;
  border-width: 1px 1px 1px 0px;
  border-style: solid;
  height: 35px;
  transition: .3s;
  will-change: background-color;
}

.tablinks:first-child {
  border-width: 1px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.tablinks:last-child{
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.tablinks:hover {
  background-color: #979595;
}

.tablinks.active {
  background-color: #979595;
}
</style>

