
<template>
  <div
    class="base-modal absolute max-width max-height"
    :class="{active: $store.state.modal.isOpen}"
    @click="overlayOnClick"
  >
    <div class="base-modal-content absolute">
      <ModalContentComponent
        :contentComponent="$store.state.modal.contentComponent"
        :contentProps="$store.state.modal.contentProps"
      />
    </div>
  </div>
</template>

<script>
import ModalContentComponent from './ModalContentComponent';

export default {
  name: 'BaseModal',

  components: { ModalContentComponent },

  methods: {
    overlayOnClick(event) {
      const { commit, state: { modal } } = this.$store;

      if (
        modal.closeOnOutsideClick &&
        event.target.classList.contains('base-modal')
      ) {
        commit('closeModal');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.base-modal, .base-modal::after {
  z-index: 2;
  opacity: 0;
  visibility: hidden;
  transition: .2s;
  will-change: opacity, visibility;
}

.base-modal::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  background-color: black;
}

.base-modal-content {
  border-radius: 1%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0%);
  background-color: white;
  transition: .4s;
  will-change: transform;
}

.base-modal.active {
  visibility: visible;
  opacity: 1;

  &::after {
    visibility: visible;
    opacity: .6;
  }
}

.base-modal.active .base-modal-content {
  transform: translate(-50%, -50%);
}
</style>
