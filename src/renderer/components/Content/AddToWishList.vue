<template>
  <div class="modal-container relative">
  <input
    id="wishlist-toggle"
    type="checkbox"
  >
  <label
    class="button modal-btn cursor-pointer text-white
     bg-red flex justify-center align-center"
    for="wishlist-toggle"
  >
    Add to Wishlist
  </label>
  <label
    class="modal-backdrop cursor-pointer overflow-hidden"
    for="wishlist-toggle"
  >
  </label>
  <div class="modal-content cursor-pointer overflow-hidden">
    <label
      class="modal-close cursor-pointer absolute text-gray3"
        for="wishlist-toggle"
    >
      &#x2715;
    </label>
    <div class="modal-body text-blue">
      <span class="flex justify-center align-center">
        <i class="far fa-check-circle"></i>
      </span>
      <h3 class="flex align-center justify-center margin-vertical-10px">
        You have added a course to wishlist!
      </h3>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'AddToWishList',

  components: {
  },

  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
<style scoped>

  .modal-container {
    margin: 10px 20px;
    width: 90%;
  }
  .modal-btn {
    padding: 20px 10px;
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

  .modal-body{
    padding: 20px;
  }

  .fa-check-circle{
    font-size: 250px;
  }

  #wishlist-toggle {
    display: none;
  }
  #wishlist-toggle.active ~ .modal-backdrop,
  :checked ~ .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    visibility: visible;
    opacity: 1;
    transition: opacity 0.2s ease-in;
  }
  #wishlist-toggle.active ~ .modal-content,
  :checked ~ .modal-content {
    opacity: 1;
    background-color: #fff;
    width: 500px;
    height: auto;
    position: fixed;
    left: calc(50% - 250px);
    top: 25%;
    border-radius: 5px;
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
