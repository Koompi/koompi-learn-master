<template>
  <div>
    <div
      class="card-layout size-calc-spacing-include cursor-pointer"
      v-for="course in courses"
      :key="course.title"
    >
      <div class="card">
        <div class="margin-vertical-auto relative overflow-hidden">
          <router-link
            class="link"
            :to="{ name: 'course-detail', params: { courseId: course.id } }"
            exact
            tag="a"
          >
            <img
              :src="course.introImageUrl || koompiLaptopImage"
              alt="Avatar"
              class="feature-image"
            >
            <img
              :src="playIcon"
              alt="Avatar"
              class="play-background absolute"
            >
          </router-link>
        </div>
        <div class="container">
          <p>
            <span class="span float-left text-gray2">
              Name
            </span>
            <span class="span float-right text-gray2">
              {{ course.insertedAt }}
            </span>
          </p>
          <p class="clearfix"/>
          <h3 class="clearfix card-title text-gray1">{{ course.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import staticImages from '@/utils/staticImages';

export default {
  name: 'CategoryCard',

  props: {
    courses: {
      validator(value) {
        let index = 0;

        for (; index < value.length; index += 1) {
          if (
            typeof value[index].title === 'string' &&
            typeof value[index].id === 'string' &&
            typeof value[index].insertedAt === 'string' &&
            typeof value[index].introImageUrl
          ) {
            return true;
          }
        }

        return false;
      },
      default: [],
    },
  },

  data() {
    return {
    };
  },

  computed: {
    ...staticImages,
  },
};
</script>

<style scoped>
.card-layout {
  float: left;
  width: calc(100% / 3);
  padding: 10px;
}
.card {
  background: #ffffff;
  box-shadow: 2px 2px 3px 0px rgba(0,0,0,0.4);
  transition: .3s;
  will-change: transform, box-shadow;
}

.card .feature-image{
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.card:hover {
  box-shadow: 3px 3px 3px 0 rgba(0,0,0,0.5);
}

.card:hover .play-background {
  transform: scale(1.1);
  transform-origin: center;
  opacity: 1;
}

.container {
  padding: 10px 10px 25px;
}

.container .span {
  font-size: 14px;
}

.card-title {
  display: block;
  display: -webkit-box;
  margin-top: 15px;
  font-size: 18px;
  line-height: 1.5;
  width: 100%;
  height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.play-background {
  width: 25%;
  left: 35%;
  top: 35%;
  opacity: 0;
  transition: .3s;
  will-change: opacity;
}

.link{
  text-decoration: none;
}

@media only screen and (max-width: 1260px) {
  .card-layout {
    padding: 10px;
  }
  .card .feature-image{
    height: 150px;
  }
  .container span {
    font-size: 11px;
  }
  .card-title {
    font-size: 15px;
  }
}
</style>

