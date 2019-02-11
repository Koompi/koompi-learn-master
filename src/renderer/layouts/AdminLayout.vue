<template>
  <div class="admin-layout grid max-width max-height">
    <TheSidebar
      headerTitle="Admin Panel"
      :tabs="sidebarOptions"
    />

    <div class="admin-layout-content scroll-y">
      <router-view />
    </div>

    <BaseModal/>
  </div>
</template>

<script>
import { TheSidebar, BaseModal } from '@/components';
import { IS_MY_ROLE_QUERY } from '@/queries';

export default {
  name: 'AdminLayout',

  components: { TheSidebar, BaseModal },

  data() {
    return {
      loading: true,

      standardErrors: null,
      requestErrors: null,
    };
  },

  apollo: {
    isMyRole: {
      query: IS_MY_ROLE_QUERY,

      throttle: 3000,
      debounce: 3000,

      variables() { return { role: 'admin' }; },

      result({ data, networkStatus }) {
        if (networkStatus === 8) {
          this.standardErrors = [{
            key: 'Network',
            message: 'Unresolved',
          }];
        } else if (!data.isMyRole) {
          this.$router.push({ name: 'search' });
          this.$toasted.error('Unauthorized access', {
            duration: 2000,
          });
        }

        this.loading = false;
      },
    },
  },

  computed: {
    sidebarOptions() {
      return [{
        label: 'All Courses',
        value: 'all-courses',
        childTabs: [],
        onClick: () => this.goToPage('admin-all-courses'),
      }, {
        label: 'All Users',
        value: 'all-users',
        childTabs: [],
        onClick: () => this.goToPage('admin-all-users'),
      }, {
        label: 'All Subjects',
        value: 'all-subjects',
        childTabs: [],
        onClick: () => this.goToPage('admin-all-subjects'),
      }, {
        label: 'All Field of Study',
        value: 'all-field-study',
        childTabs: [],
        onClick: () => this.goToPage('admin-all-field-study'),
      }];
    },
  },

  methods: {
    goToPage(name, params) {
      this.$router.push({ name, params });
    },
  },
};
</script>

<style scoped>
.admin-layout {
  grid-template-columns: 260px 1fr;
  grid-template-areas: 'sidebar content';
}
.admin-layout-content {
  grid-area: content;
}
</style>
