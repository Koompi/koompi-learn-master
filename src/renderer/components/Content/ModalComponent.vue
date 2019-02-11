<template>
  <div class="modal-container relative">
  <input
    id="modal-toggle"
    type="checkbox"
  >
  <label
    class="button modal-btn cursor-pointer text-white
    bg-blue flex justify-center align-center"
    for="modal-toggle"
  >
    Enroll Now
  </label>
  <label
    class="modal-backdrop cursor-pointer overflow-hidden"
    for="modal-toggle"
  >
  </label>
  <div class="modal-content cursor-pointer overflow-hidden">
    <div class="modal-header">
      <label
        class="modal-close cursor-pointer absolute text-gray3"
          for="modal-toggle"
      >
        &#x2715;
      </label>
      <h2>{{ name }}</h2>
    </div>
    <div class="modal-body">
      <EnrollComponent />
    </div>
    <div class="modal-footer flex justify-center align-center cursor-pointer">
      <div class="connect-with-fb">
        <img src="/static/facebook.png">
        <span class="float-left">
          Connect with facebook
        </span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'ModalComponent',

  components: {
    async EnrollComponent() {
      const Component = await import('@/components');
      return Component.EnrollComponent;
    },
  },

  data() {
    return {
      name: 'Sign Up',
    };
  },
  methods: {
  },
};
</script>
<style scoped>

  .connect-with-fb{
    color: #3b5898;
    border: 2px solid #3b5898;
    border-radius: 10px;
    height: 48px;
  }

  .connect-with-fb img {
    height: 48px;
    float: left;
  }

  .connect-with-fb span {
    padding: 13px 20px;
    margin: 0 auto;
  }

  .modal-container {
    margin: 10px 20px;
    width: 90%;
  }
  .modal-btn {
    padding: 20px 30px;
    text-align: center;
  }
  .modal-btn:hover {
    background: #979595;
    transition: .3s;
  }
  .modal-content,
  .modal-backdrop {
    height: 0;
    width: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in;
  }
  .modal-close {
    right: 15px;
    top: 18px;
    font-size: 18px;
    text-align: center;
  }
  .modal-close:hover { color: #565252; }
  .modal-header, .modal-body {
    border-bottom: 1px solid #797878;
    padding: 15px;
  }
  .modal-footer {
    height: 70px;
  }
  #modal-toggle {
    display: none;
  }
  #modal-toggle.active ~ .modal-backdrop,
  :checked ~ .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9;
    visibility: visible;
    opacity: 1;
    transition: opacity 0.2s ease-in;
  }
  #modal-toggle.active ~ .modal-content,
  :checked ~ .modal-content {
    opacity: 1;
    background-color: #fff;
    width: 600px;
    height: auto;
    position: fixed;
    left: calc(50% - 300px);
    top: 12%;
    border-radius: 5px;
    z-index: 999;
    pointer-events: auto;
    cursor: auto;
    visibility: visible;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);
  }

  @media only screen and (max-width: 1260px) {
    .modal-container {
      width: 100%;
      margin: 0px;
    }
  }

</style>
