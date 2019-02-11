<template>
  <div
    class="base-form-wizard no-scroll relative max-height"
    :class="{
      'flex align-center justify-center vertical-wizard': isVerticalStyling,
      'horizontal-wizard': !isVerticalStyling,
    }"
  >
    <div
      class="base-form-wizard-steps relative flex justify-space-between"
      :class="{ 'margin-horizontal-auto': !isVerticalStyling }"
      :style="wizardStepElementSize"
    >
      <div
        v-if="isVerticalStyling"
        class="wizard-vertical-bar bg-gray1 max-height absolute bg-gray4"
      />
      <hr
        v-else
        class="absolute wizard-horizontal-bar"
      />

      <div
        class="wizard-step-progress cursor-pointer
        bg-gray3 size-calc-spacing-include"
        v-for="(step, index) in steps"
        :key="index"
        :class="{ 'bg-blue': index === $store.state.formWizard.index }"
        @click="() => setStep(index)"
      >
        <span class="wizard-step-progress-label absolute no-interaction">
          {{ step.label }}
        </span>
      </div>
    </div>

    <div
      class="max-width relative
      wizard-form-content-wrapper scroll-y"
    >
      <Component
        :is="formComponent"
      />

      <BaseButtonGroup
        :buttons="navigateButtons"
        className="margin-horizontal-auto base-wizard-nav-btn-group"
      />
    </div>
  </div>
</template>

<script>
/*
  eslint max-lines: [0]
*/

export default {
  name: 'BaseWizard',

  components: {
    async AddCourseForm() {
      const { AddCourseForm } = await import('@/components');

      return AddCourseForm;
    },

    async BaseButtonGroup() {
      const { BaseButtonGroup } = await import('@/components');

      return BaseButtonGroup;
    },
  },

  mounted() {
    this.$store.commit('setMaxWizardStep', this.steps.length);
  },

  props: {
    formComponent: {
      type: String,
      required: true,
    },

    steps: {
      type: Array,
      required: true,
    },

    isAllowSetStep: {
      type: Boolean,
      default: false,
    },

    isVerticalStyling: {
      type: Boolean,
      default: false,
    },

    onSubmit: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    nextStep() { this.$store.commit('nextFormWizardStep'); },

    prevStep() { this.$store.commit('prevFormWizardStep'); },

    setStep(index) {
      if (this.isAllowSetStep) {
        this.$store.commit('setFormWizardStep', index);
      }
    },

    clearForm(formClearingMutation) {
      this.$store.commit(formClearingMutation);
    },

    onSubmission() {
      switch (this.formComponent) {
        case 'AddCourseForm': {
          const { getters: { newCourseForm } } = this.$store;

          this.onSubmit({
            values: { ...newCourseForm },
            clear: () => this.clearForm('clearNewCourseFormContent'),
          });

          break;
        }

        default: {
          this.onSubmit(null);

          break;
        }
      }
    },
  },

  computed: {
    wizardStepElementSize() {
      const size = this.steps.length * 30 * 4;

      if (this.isVerticalStyling) {
        return { height: `${size}px` };
      }

      return { width: `${size}px` };
    },

    navigateButtons() {
      const { state: { formWizard }, commit } = this.$store;

      const isLastStep = formWizard.index === formWizard.maxIndex - 1;

      return [{
        label: 'Back',
        bgColor: 'bg-blue',
        isDisabled: formWizard.index < 1,
        textColor: 'text-white',
        fontSize: 15,
        onClick: () => commit('prevFormWizardStep'),
      }, {
        label: isLastStep ? 'Submit' : 'Next',
        isDebounce: isLastStep,
        bgColor: 'bg-blue',
        isDisabled: this.submissionButtonState,
        textColor: 'text-white',
        fontSize: 15,
        className: 'left-gap-10px',
        onClick: !isLastStep ?
          () => commit('nextFormWizardStep') : this.onSubmission,
      }];
    },

    submissionButtonState() {
      const { state: { formWizard, newCourse } } = this.$store;

      if (newCourse.isSavingToServer) {
        return true;
      }

      if (formWizard.index > formWizard.maxIndex - 1) {
        return true;
      }

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
$wizard-progress-size: 30;
$horizontal-wizard-steps-margin-bottom: 20;

.horizontal-wizard .base-form-wizard-steps {
  height: #{$wizard-progress-size + 25}px;
  margin-bottom: #{$horizontal-wizard-steps-margin-bottom}px;
}

.horizontal-wizard .base-form {
  margin: 0px auto;
}
.vertical-wizard .base-form-wizard-steps {
  width: 260px;
  flex-direction: column;
}

.wizard-step-progress-label {width: max-content;}

.horizontal-wizard .wizard-step-progress-label {
  bottom: 0;
}
.vertical-wizard .wizard-step-progress-label {
  left: #{$wizard-progress-size + 8}px;
}

.horizontal-wizard .wizard-step-progress {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wizard-step-progress {
  height: #{$wizard-progress-size}px;
  width: #{$wizard-progress-size}px;
  border-radius: #{$wizard-progress-size / 2}px;
  border: 6px solid #ccc;
  will-change: background-color, border-color;
  transition: .2s;
}
.wizard-vertical-bar {
  width: 2px;
  left: #{$wizard-progress-size / 2}px;
  z-index: -1;
}
.wizard-horizontal-bar {z-index: -1; width: 99%; top: 7px;}
.wizard-form-content-wrapper {
  height: calc(
    100% - #{
      $horizontal-wizard-steps-margin-bottom +
      $wizard-progress-size +
      25 + 11
    }px
  );
}
.base-wizard-nav-btn-group {max-width: 600px; margin-top: 10px;}
</style>
