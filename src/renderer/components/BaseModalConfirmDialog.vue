<template>
  <div
    class="base-modal-confirm-dialog flex column-align justify-space-between"
  >
    <p>
      {{ confirmMessage }}
    </p>

    <div class="flex justify-end">
      <BaseButton
        isDebounce
        label="Confirm"
        bgColor="bg-blue"
        textColor="text-white"
        :onClick="onConfirmClick"
      />

      <BaseButton
        label="Cancel"
        bgColor="bg-red"
        textColor="text-white"
        className="base-modal-confirm-cancel-btn"
        :onClick="closeModal"
      />
    </div>
  </div>
</template>

<script>
import { BaseButton } from '@/components';

export default {
  name: 'BaseModalConfirmDialog',

  components: { BaseButton },

  props: {
    confirmMessage: {
      type: String,
      default: 'Are you sure to do this?',
    },

    onConfirm: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    onConfirmClick() {
      this.onConfirm();

      this.closeModal();
    },

    closeModal() { this.$store.commit('closeModal'); },
  },
};
</script>

<style scoped>
.base-modal-confirm-dialog {
  padding: 10px; max-width: 380px; min-height: 82px;
}
.base-modal-confirm-cancel-btn {margin-left: 10px;}
</style>

