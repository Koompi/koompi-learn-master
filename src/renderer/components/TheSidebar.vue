
<template>
  <div
    id="sidebar"
    class="bg-gray4 text-gray1 no-scroll"
  >
    <div
      class="flex text-white bg-white relative
      align-center no-interaction header-tablinks"
      style="height: 50px;"
    >
      <i
        class="fas fa-chevron-left cursor-pointer text-gray2"
        style="font-size: 23px"
        @click="goBack"
      />
      <img
        class="max-height absolute sidebar-koompi-logo cursor-pointer"
        :src="koompiLogo"
        @click="goHome"
      />
    </div>
    <div
      class="flex text-white align-center
      no-interaction header-tablinks"
    >
      <i class="fas fa-th" />
      <span>{{ headerTitle }}</span>
    </div>

    <div
      v-if="loading"
      class="flex
      justify-center align-center max-width max-height column-align"
    >
      <MoveBlockLoader bgColor="bg-gray1" />
      <p class="margin-vertical-10px">Fetching all subjects</p>
    </div>

    <div class="scroll-y sidebar-wrapper">
      <SidebarTabComponent
        v-if="!loading"
        v-for="(tab, index) in tabs"
        :key="tab.label"
        :label="tab.label"
        :value="tab.value"
        :onClick="tab.onClick"
        :childTabs="tab.childTabs"
        :isInitiallyCollapsed="tab.isCollapsed"
        :setSelectedTab="setSelectedTab"
        :selectedElement="selectedTab"
        :tabIndex="index"
      />
    </div>
  </div>
</template>

<script>
import staticImages from '@/utils/staticImages';

export default {
  name: 'TheSidebar',

  components: {
    async SidebarTabComponent() {
      const Component = await import('@/components');
      return Component.SidebarTabComponent;
    },

    async MoveBlockLoader() {
      const Comp = await import('@/components');
      return Comp.MoveBlockLoader;
    },
  },

  props: {
    headerTitle: {
      type: String,
      default: null,
    },

    tabs: {
      type: Array,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    activeControlledByProps: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedTab: null,
    };
  },

  computed: {
    ...staticImages,
  },

  methods: {
    setSelectedTab(event, callback) {
      if (!this.activeControlledByProps) {
        if (this.selectedTab) {
          this.selectedTab.classList.remove('text-blue');
        }

        this.selectedTab = event.target;
        this.selectedTab.classList.add('text-blue');
      }

      callback();
    },

    goHome() { this.$router.push({ name: 'koompi-learn' }); },

    goBack() { this.$router.back(); },
  },
};
</script>

<style lang="scss" scoped>
$headerTitleHeight: 30;
$verticalPadding: 10;

#sidebar {
  grid-area: sidebar;
}
.header-tablinks {
  background-color: #979595;
  font-size: 16px;
  padding: #{$verticalPadding}px 20px;
  border: 1px solid #979595;
  transition: .3s;
  // height: #{$headerTitleHeight}px;
  height: 18px;
}
.fas.fa-th{
  margin-right: 5px;
}

.sidebar-wrapper {
  // max-height: calc(100% - #{$headerTitleHeight + $verticalPadding * 2}px);
  height: calc(100% - 112px);
}
.sidebar-koompi-logo {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 38px;
}
</style>
