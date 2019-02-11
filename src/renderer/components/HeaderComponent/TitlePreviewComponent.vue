<template>
    <div
      class="banner relative flex column-align justify-space-between"
      :style="{ backgroundImage: `url(${bannerCover})`}"
    >
      <h2 class="title">
        {{ title }}
      </h2>

      <div class="archive flex justify-space-between">
        <h4 class="sub-title">
          {{ transformDate }} ago, {{ enrollCounts }} enrolled.
        </h4>
        <div>
          <img :src="starIcon"/>
          <img :src="starIcon"/>
          <img :src="starIcon"/>
          <img :src="starIcon"/>
          <img :src="starIcon"/>
        </div>
      </div>
      <div class="header-image absolute max-width max-height"/>
    </div>
</template>
<script>
import moment from 'moment';
import staticImages from '@/utils/staticImages';

export default {
  name: 'TitlePreviewComponent',

  props: {
    title: String,

    insertedAt: {
      type: String,
      default: '',
    },

    enrollCounts: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    ...staticImages,

    transformDate() {
      if (this.insertedAt) {
        return moment(new Date()).from(this.insertedAt, true);
      }

      return '';
    },
  },
};
</script>
<style scoped>
.banner {
  height: 200px;
  background-size: cover;
}
.header-image{
  background: linear-gradient(to right,
  rgba(0,0,0,.6) 60%,
  rgba(0,0,0,.4) 80%,
  rgba(0,0,0,.2) 100%);
}
.title {
  font-size: 36px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 30px;
  margin-top: 30px;
  z-index: 1;
}
.archive{
  margin: 20px 30px;
}
.sub-title {
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
  z-index: 1;
}
</style>
