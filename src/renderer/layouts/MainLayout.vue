
<template>
  <div
    id="main-layout"
    :style="{
      'grid-template-columns': `${sidebarWidth}px 1fr`,
      'grid-template-rows': `${topbarHeight}px 1fr`,
    }"
    class="grid max-height justify-center relative"
  >
    <TheSidebar
      headerTitle="Browse by Subjects"
      :tabs="tabs"
      :loading="loading"
    />

    <TheTopbar
      v-if="$route.currentRoute !== '/course-section-video'"
    />

    <div
      id="main-content"
      class="no-scroll margin-horizontal-auto max-width"
    >
      <router-view />
    </div>

    <BaseModal/>
  </div>
</template>

<script>
import appLayout from '@/utils/appLayout';
import { FIELD_STUDIES_QUERY } from '@/queries';
import {
  TheSidebar,
  TheTopbar,
  BaseModal,
  BaseRecursiveFormReview,
} from '@/components';

export default {
  name: 'MainLayout',

  components: {
    TheSidebar,
    TheTopbar,
    BaseModal,
    BaseRecursiveFormReview,
  },

  data() {
    return {
      fieldStudies: [],
      tabs: [],
      loading: true,
    };
  },

  computed: {
    ...appLayout,
  },

  apollo: {
    fieldStudies: {
      query: FIELD_STUDIES_QUERY,
      throttle: 1000,
      debounce: 2000,

      result({ networkStatus, data }) {
        if (networkStatus === 8) {
          console.log('Network Unresolved');
        } else if (data.fieldStudies) {
          const { fieldStudies } = data;
          const { params: { courseSubject } } = this.$route;

          const length = fieldStudies && fieldStudies.length ?
            fieldStudies.length : 0;

          const self = this;
          let isChildTabSelected = false;
          let isFirstCollapsed = false;

          this.tabs = fieldStudies.reduce((accumulator, elem, index) => {
            isChildTabSelected = false;

            accumulator[index] = {
              value: elem.field,
              label: elem.field,
              childTabs: elem.subjects.reduce((acc, el, index) => {
                acc[index] = {
                  value: el.field,
                  label: el.field,
                  callback(courseSubject) {
                    self.$router.push({
                      name: 'search',
                      params: { courseSubject },
                    });
                  },
                  isSelected: courseSubject === el.field,
                };

                if (acc[index].isSelected) {
                  isChildTabSelected = acc[index].isSelected;
                }

                return acc;
              }, new Array(elem.subjects.length)),
            };

            if (isChildTabSelected && !isFirstCollapsed) {
              accumulator[index].isCollapsed = true;
              isFirstCollapsed = true;
            }

            return accumulator;
          }, new Array(length));
        }

        this.loading = false;
      },
    },
  },
};
</script>

<style scoped>
#main-layout {
  grid-template-areas: 'sidebar topbar' 'sidebar maincontent';
  background: #eee;
  overflow: hidden;
  z-index: 0;
}

#main-content {
  grid-area: maincontent;
  max-width: 1360px;
}

.container {
  max-width: 1420px;
  margin: 0 auto;
}
</style>
