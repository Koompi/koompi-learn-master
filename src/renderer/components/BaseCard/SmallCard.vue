<template>
  <div>
    <div class="relative">
      <AllCourseTitle :title="courseTitle" />
    </div>

    <div>
      <div
        class="card-layout max-width size-calc-spacing-include cursor-pointer"
        v-for="course in courses"
        :key="course.id"
      >
        <div class="card">
          <div class="margin-vertical-auto relative overflow-hidden">
            <router-link
              class="link"
              tag="a"
              :to="{ name: 'course-detail', params: { courseId: course.id } }"
              replace
              exact
            >
              <img
                :src="course.introImageUrl || koompiLaptopImage"
                alt="Avatar"
                class=" feature-image max-height max-width"
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
                {{
                  instructor ? instructor.username : course.instructor.username
                }}
              </span>
              <span class="span float-right text-gray2">
                {{ course.insertedAt }}
              </span>
            </p>
            <p class="clearfix"/>
            <h3
              @click="goToCourseDetail(course.id)"
              class="clearfix card-title text-gray1">{{ course.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import staticImages from '@/utils/staticImages';

export default {
  name: 'SmallCard',

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },
  },

  props: {
    courseTitle: String,

    courses: {
      type: Array,
      validator(value) {
        let index = 0;

        for (; index < value.length; index += 1) {
          if (
            typeof value[index].title === 'string' &&
            typeof value[index].id === 'string' &&
            typeof value[index].insertedAt === 'string' &&
            typeof value[index].introImageUrl === 'string'
          ) {
            return true;
          }
        }

        return false;
      },
      default: () => [],
    },

    instructor: {
      type: Object,
      validator(value) {
        if (typeof value.username === 'string') {
          return true;
        }

        return false;
      },
    },
  },

  data() {
    return {

    };
  },

  computed: {
    ...staticImages,
  },

  methods: {
    goToCourseDetail(courseId) {
      this.$router.replace({ name: 'course-detail', params: { courseId } });
    },
  },
};
</script>

<style scoped>

.card-layout {
  margin-top: 20px;
  float: left;
  width: 32%;
}
.card {
  background: #ffffff;
  box-shadow: 2px 2px 3px 0px rgba(0,0,0,0.4);
  transition: .3s;
  will-change: transform, box-shadow;
}
.card-layout:nth-child(2){
  margin: 20px 2% 0px 2%;
}

.card .feature-image{
  height: 220px;
  width: 100%;
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

.play-background {
  width: 30%;
  left: 35%;
  top: 35%;
  opacity: 0;
  transition: .3s;
  will-change: opacity;
}

.container {
  background: #ffffff;
  padding: 10px 10px 25px;
}

.container .span {
  font-size: 14px;
}

.card-title {
  display: block;
  display: -webkit-box;
  margin-top: 15px;
  font-size: 15px;
  line-height: 1.5;
  width: 100%;
  height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.link{
  text-decoration: none;
}

@media only screen and (max-width: 1260px) {
  .card{
    height: 120px;
  }
}
</style>

