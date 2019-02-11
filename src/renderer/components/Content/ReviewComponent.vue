<template>
  <div
    class="relative"
    id="review-section"
  >
    <AllCourseTitle title="Review" />
    <div class="review-star bg-white justify-space-between">
      <StarRating
        class="justify-center"
        :increment="0.5"
        :border-width="5"
        border-color="#565252"
        :rounded-corners="true"
        active-color="#565252"
        :read-only="true"
        :rating="stars"
        :star-size="40"
        text-class="rating-class"
      >
      </StarRating>
    </div>
    <div
      class="review-content flex justify-space-between"
      v-for="rate in rates"
      :key="rate.username"
      v-show="rate.isShow || showAll"
    >
      <div class="review-avatar">
        <img
          :src=" '/static/' + rate.image"
          v-show="rate.image != ''"
        />
        <i
          class="far fa-user-circle text-gray3"
          v-show="rate.image == ''"
        >
        </i>
      </div>
      <div class="review-text text-gray2">
        <h4>{{ rate.username }}</h4>
        <StarRating
          :increment="0.5"
          class="margin-vertical-10px text-gray1"
          :border-width="3"
          border-color="#565252"
          active-color="#565252"
          :rounded-corners="true"
          :read-only="true"
          :rating="rate.rated"
          :star-size="25"
          text-class="star-rating-class"
        >
        </StarRating>
        <p>
          {{ rate.message }}
        </p>
      </div>
    </div>
    <div class="flex justify-center align-center margin-vertical-10px">
      <button
        class="button text-gray1 cursor-pointer"
        @click="showAll = !showAll"
      >
        Load more
      </button>
    </div>
  </div>
</template>
<script>
import StarRating from 'vue-star-rating';
export default {
  name: 'InstructorComponent',

  components: {
    StarRating,
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },
  },

  data() {
    return {
      stars: 4.5,
      showAll: false,
      rates: [
        {
          username: 'CHAN Chhunleng',
          isShow: true,
          image: 'ninja.png',
          rated: 4.5,
          message: 'Bootstrap-Vue does not include form validation' +
            'by default, we leave that up to the many existing form' +
            'validation plugins. Below are some examples of plugins' +
            'and how they may be integrated.',
        },
        {
          username: 'MAO Vannakpanha',
          isShow: true,
          image: '',
          rated: 4.5,
          message: 'Bootstrap-Vue does not include form validation' +
            'by default, we leave that up to the many existing form' +
            'validation plugins. Below are some examples of plugins' +
            'and how they may be integrated.',
        },
        {
          username: 'MAO Piseth',
          isShow: false,
          image: '',
          rated: 4.5,
          message: 'Bootstrap-Vue does not include form validation' +
            'by default, we leave that up to the many existing form' +
            'validation plugins. Below are some examples of plugins' +
            'and how they may be integrated.',
        },
      ],
    };
  },

};
</script>
<style scoped>

.review-star {
  padding: 5px;
  margin-top: 20px;
  border: 1px solid #979595;
  border-radius: 5px;
}

.review-content {
  margin-top: 20px;
  padding: 15px;
  border-bottom: 2px solid #979595;
}

.review-avatar {
  text-align: center;
  width: 100px;
}

.review-avatar img {
  max-width: 80px;
}

.review-avatar .fa-user-circle{
  font-size: 80px;
}

.review-text {
  width: calc(100% - 100px);
  padding-left: 20px;
}

.review-text p {
  line-height: 1.4em;
  margin-bottom: 10px;
  font-size: 14px;
}

</style>
<style>
.rating-class::after {
  content: " Rating";
}
.star-rating-class::after {
  content: " Stars";
}
.rating-class {
  font-size: 20px;
}
.star-rating-class {
  font-size: 18px;
}
</style>

