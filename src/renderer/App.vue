<template>
  <div
    v-if="loading"
    class="flex justify-center align-center max-height max-width column-align"
  >
    <MoveBlockLoader color="bg-gray1"/>
    <p class="margin-vertical-10px">Loading</p>
  </div>

  <router-view v-else-if="!loading"/>
</template>

<script>
/*
  eslint prefer-arrow-callback: [0]
*/
import { SUBJECTS_QUERY, ME_QUERY } from '@/queries';
import { MoveBlockLoader } from '@/components';
import mainWindowEvent from '@/utils/mainWindowEvent';

export default {
  name: 'KompiLearn',

  components: { MoveBlockLoader },

  async created() {
    try {
      const response = await this.$apollo.query({
        query: SUBJECTS_QUERY,

        throttle: 1000,
        debounce: 1000,
      });
      const { data: { subjects } } = response;

      this.$store.commit('setSubjects', subjects);

      const meResponse = await this.$apollo.query({
        query: ME_QUERY,

        throttle: 1000,
        debounce: 1000,
      });

      const { data: { me } } = meResponse;

      if (!me) {
        this.$store.commit('clearToken');
      }
    } catch (error) {
      this.$store.commit('clearToken');
    }

    this.loading = false;
  },

  mounted() {
    this.$electron.ipcRenderer.send(mainWindowEvent.checkForUpdateEvent);
    this.$electron.ipcRenderer.on(
      mainWindowEvent.updateNotify,
      (event, data) => {
        if (data.isUpdateAvailable) {
          this.$toasted.info('Update avaiable, downloading update...', {
            duration: 5000,
            singleton: true,
            theme: 'primary',
            position: 'bottom-right',
          });
        }

        if (data.isUpdateReady) {
          this.$toasted.info('Update ready, close app and install?', {
            singleton: true,
            theme: 'primary',
            position: 'bottom-right',
            action: [{
              text: 'Close app and update',
              onClick: () =>
                this.$electron.ipcRenderer.send(mainWindowEvent.confirmUpdate),
            }, {
              text: 'Update later on the next open',
              onClick: (e, toast) => {
                console.log(e);
                this.$electron.ipcRenderer.send(
                  mainWindowEvent.updateOnNextOpen,
                );
                toast.goAway(0);
              },
            }],
          });
        }
      },
    );
  },

  data() {
    return {
      loading: true,
    };
  },
};
</script>

<style>
</style>
