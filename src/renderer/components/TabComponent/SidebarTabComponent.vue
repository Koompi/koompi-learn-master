<template>
  <div
    class="grid"
  >
    <span
      class="parent-tablink tablinks cursor-pointer no-interaction"
      active-class="active"
      @click="parentTabClick"
      exact
    >
      {{ label }}
      <i
        class="fas fa-angle-right float-right"
        v-show="childTabs.length"
      />
    </span>
    <div
      v-show="showCollapse"
      v-if="childTabs.length"
      class="max-width grid"
    >
      <span
        class="childTab cursor-pointer no-interaction"
        v-for="childTab in childTabs"
        :class="{
          'text-blue': !selectedElement && childTab.isSelected,
        }"
        :key="childTab.label"
        @click="
          event =>
            setSelectedTab(event, () => childTab.callback(childTab.value))
        "
      >
        {{ childTab.label }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SidebarTabComponent',

  props: {
    label: String,
    value: String,
    childTabs: Array,

    onClick: {
      type: Function,
      default: () => {},
    },

    isInitiallyCollapsed: {
      type: Boolean,
      default: false,
    },

    setSelectedTab: {
      type: Function,
      default: () => {},
    },

    selectedElement: {
      type: HTMLSpanElement,
      default: null,
    },

    tabIndex: {
      type: Number,
      default: 0,
    },
  },

  mounted() {
    const element =
        document.getElementsByClassName('parent-tablink')[this.tabIndex];

    if (element) {
      if (this.showCollapse && !element.classList.contains('active-link')) {
        element.classList.add('active-link');
      } else {
        element.classList.remove('active-link');
      }
    }
  },

  watch: {
    showCollapse() {
      const element =
        document.getElementsByClassName('parent-tablink')[this.tabIndex];

      if (element) {
        if (this.showCollapse && !element.classList.contains('active-link')) {
          element.classList.add('active-link');
        } else {
          element.classList.remove('active-link');
        }
      }
    },

    childTabs(newChildTabs) {
      newChildTabs.map((ct) => {
        if (ct.isSelected) {
          this.showCollapse = true;
        }

        return ct;
      });
    },
  },

  data() {
    return {
      showCollapse: this.isInitiallyCollapsed,

      parentTabElement: null,
    };
  },

  methods: {
    parentTabClick() {
      if (this.childTabs.length) {
        this.showCollapse = !this.showCollapse;
      } else {
        this.onClick();
      }
    },
  },
};
</script>
<style scoped>
.tablinks {
  padding: 10px 20px;
  background-color: inherit;
  font-size: 18px;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-color: #979595;
  transition: .3s;
  will-change: background-color;
}

.tablinks:hover {
  background-color: #979595;
}

.parent-tablink .fa-angle-right {
  transform: rotate(0deg);
  will-change: transform;
  transition: .3s;
}

.parent-tablink.active-link .fa-angle-right {transform: rotate(90deg);}

.tablinks:last-child{
  border-bottom: 1px solid #979595;
}

.childTab {
  padding: 10px 20px;
  background-color: #eee;
  font-size: 18px;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-color: #979595;
  transition: .3s;
}

</style>

