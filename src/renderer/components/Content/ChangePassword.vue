<template>
  <div>
    <div class="relative">
      <AllCourseTitle title="Change Password" />
    </div>
    <div class="content">
      <form>
        <div class="form-group float-left size-calc-spacing-include">
          <label
            class="text-gray1"
            for="oldPassword"
          >
            Old Password
          </label>
          <input
            type="password"
            name="oldPassword"
          >
        </div>
        <div class="form-group float-left size-calc-spacing-include">
          <label
            class="text-gray1"
            for="newPassword"
          >
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
          >
        </div>
        <div class="form-group float-left size-calc-spacing-include">
          <label
            class="text-gray1"
            for="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
          >
        </div>
        <p class="clearfix"/>
        <div class="flex max-width">
          <button
            class="button bg-blue cursor-pointer text-white"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChangePassword',

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },
  },
};
</script>
<style scoped>
  .content {
    margin-top: 20px;
    padding: 15px;
    background: #ffffff;
    border: 1px solid #979595;
    border-radius: 5px;
  }
  .form-group {
    width: 50%;
    padding-right: 5%;
  }
  input[type=password] {
    margin: 10px 20px 10px 0px;
    font-size: 18px;
    width: 100%;
    padding: 10px;
    border: 1px solid #979595;
    border-radius: 5px;
  }
  input[type=password]:focus {
    background-color: #E5E5E5;
    outline: none;
  }

  .button {
    width: 150px;
    margin-left: calc(90% - 80px);
  }

</style>
