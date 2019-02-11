
<template>
  <Component
    :is="contentComponent"
    v-bind="contentProps"
  />
</template>

<script>
export default {
  name: 'ModalContentComponent',

  components: {
    async BaseSignUpForm() {
      const { BaseSignUpForm } = await import('@/components');

      return BaseSignUpForm;
    },

    async BaseLoginForm() {
      const { BaseLoginForm } = await import('@/components');

      return BaseLoginForm;
    },

    async TheFileUploadProgressDialog() {
      const { TheFileUploadProgressDialog } = await import('@/components');

      return TheFileUploadProgressDialog;
    },

    async UserProfileContainer() {
      const { UserProfileContainer } = await import('@/components');

      return UserProfileContainer;
    },

    async EnrollConfirmDialog() {
      const { EnrollConfirmDialog } = await import('@/components');

      return EnrollConfirmDialog;
    },

    async BaseModalForm() {
      const { BaseModalForm } = await import('@/components');

      return BaseModalForm;
    },

    async BaseModalConfirmDialog() {
      const { BaseModalConfirmDialog } = await import('@/components');

      return BaseModalConfirmDialog;
    },

    async BaseForgotPasswordModal() {
      const { BaseForgotPasswordModal } = await import('@/components');

      return BaseForgotPasswordModal;
    },

    async BaseResetChangePasswordModalForm() {
      const { BaseResetChangePasswordModalForm } =
        await import('@/components');

      return BaseResetChangePasswordModalForm;
    },
  },

  props: {
    contentComponent: {
      type: [String, Object],
      required: true,
    },

    contentProps: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
};
</script>

