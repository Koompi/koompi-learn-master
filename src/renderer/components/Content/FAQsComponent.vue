<template>
  <div
    class="relative"
    id="faq-section"
  >
    <AllCourseTitle title="FAQs" />
    <div
      class="faq-content"
    >
      <div
      class="grid faq-area"
      v-for="faq in faqs"
      :key="faq.title"
      >
        <span
          class="faq-tablinks cursor-pointer bg-gray5"
          @click="faq.showCollapse = !faq.showCollapse"
        >
          {{ faq.title }}
        </span>
        <span
          class="childTab text-gray2"
          v-show="faq.showCollapse"
        >
          {{ faq.message }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'SidebarTabComponent',

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },
  },

  props: {
  },

  data() {
    return {
      faqs: [
        {
          title: 'What is a Teach-Out?',
          showCollapse: true,
          message: 'Responsive web design is about creating' +
            'web sites which automatically adjust themselves to' +
            'look good on all devices,from small phones to large desktops.',
        },
        {
          title: 'What is Responsive Web Design?',
          showCollapse: true,
          message: 'Responsive web design is about creating' +
            'web sites which automatically adjust themselves to' +
            'look good on all devices,from small phones to large desktops.',
        },
        {
          title: 'What is Responsive Web Design2?',
          showCollapse: false,
          message: 'Responsive web design is about creating' +
            'web sites which automatically adjust themselves to' +
            'look good on all devices,from small phones to large desktops.',
        },
      ],
    };
  },
};
</script>
<style scoped>

.faq-content {
  margin-top: 20px;
}

.faq-area {
  border: 1px solid #979595;
  border-radius: 6px;
  background: #ffffff;
}

.faq-tablinks,.btn-tablinks {
  padding: 10px 20px;
  font-size: 18px;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #979595;
  transition: .3s;
  will-change: background-color;
  text-decoration: none;
}
.faq-tablinks:first-child{ border-radius: 5px 5px 0 0;
  background: #C4C4C4;
}
.faq-tablinks:last-child{
  border: none;
}
.childTab {
  padding: 10px 20px;
  font-size: 14px;
}

</style>

