<template>
  <div
    class="relative"
    id="overview-section"
  >
    <AllCourseTitle title="Overview" />
    <div class="overview-content text-gray2">
      <h4>What is {{ title }}?</h4>
      <p>
        {{ description }}
      </p>
      <h4>
        Advantages of Bootstrap:
      </h4>
      <ul>
        <li>
          Easy to use: Anybody with just basic knowledge
          of HTML and CSS can start using Bootstrap.
        </li>
        <li>
          Responsive features: Bootstrap's responsive CSS
          adjusts to phones, tablets, and desktops.
        </li>
        <li>
          Mobile-first approach: In Bootstrap 3, mobile-first
          styles are part of the core framework.
        </li>
        <li>
          Browser compatibility: Bootstrap is compatible with
          all modern browsers (Chrome, Firefox, Internet
          Explorer, Edge, Safari, and Opera).
        </li>
      </ul>
      <h4>Where to Get Bootstrap?</h4>
      <p>
        There are two ways to start using Bootstrap on your
        own web site.
      </p>
      <p>
        You can:
      </p>
      <ul>
        <li>
          Download Bootstrap from getbootstrap.com
        </li>
        <li>
          Include Bootstrap from a CDN
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OverviewComponent',

  props: {
    description: {
      type: String,
      default: '',
    },

    title: {
      type: String,
      default: '',
    },
  },

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },
  },
};
</script>
<style scoped>

.overview-content {
  margin-top: 20px;
  padding: 15px;
  background: #ffffff;
  border: 1px solid #979595;
  border-radius: 5px;
}

.overview-content h4 {
  line-height: 1.7em;
}
.overview-content p {
  line-height: 1.5em;
  font-size: 14px;
}

.overview-content ul {
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 1.5em;
}
</style>
