<template>
  <div
    class="base-label-tag-input
    relative bg-white max-width size-calc-spacing-include"
  >
    <div
      class="base-label-tag-input-tag-container cursor-pointer
      max-height relative flex-wrap"
      :name="name"
      :id="uniqueId"
      @click="toggleTagOption"
    >
      <span
        class="base-label-tag-input-tag text-white hover-bg-gray3
        flex justify-center align-center bg-gray4 no-interaction"
        v-for="(tag, index) in selectedTags"
        :key="index"
        :class="{
          [`tag-${uniqueId || name}`]: true,
          'bg-blue': isDeleteTag === 1 && (index === selectedTags.length - 1),
        }"
        :data-value="JSON.stringify(tag) || tag"
        @click="(event) => removeTag(tag)"
      >
        {{ tag[labelProperty] }}
      </span>

      <input
        type="text"
        class="base-label-tag-text-input no-outline"
        @input="inputTextOnChange"
        @keydown="inputTextKeyDown"
      />

      <i
        class="fas fa-caret-down absolute"
        :class="{ active: isTagOptionOpen }"
      />
    </div>

    <div
      class="base-label-tag-input-options size-calc-spacing-include
      absolute flex column-align max-width bg-white scroll-y"
      :class="{ active: isTagOptionOpen }"
    >
      <span
        class="base-label-tag-input-option flex align-center
        hover-bg-gray3 hover-text-white cursor-pointer no-interaction"
        v-for="(tag, index) in filterTagOptions()"
        :key="index"
        :class="{'target-on-tag bg-gray3 text-white': index === targetOnIndex}"
        @click="() => selectTag(tag)"
      >
        {{ tag[labelProperty] }}
      </span>
    </div>
  </div>
</template>

<script>
/*
  eslint max-lines: [0]
*/
export default {
  name: 'BaseLabelTagInput',

  props: {
    options: {
      type: Array,
      required: true,
    },

    labelProperty: {
      type: String,
      required: true,
    },

    placeholder: {
      type: String,
      default: '',
    },

    values: {
      type: Array,
      default: () => [],
    },

    isKeepSelectedOption: {
      type: Boolean,
      default: false,
    },

    uniqueId: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: '',
    },

    onChange: {
      type: Function,
      default: () => {},
    },
  },

  watch: {
    selectedTags(newChanges) {
      this.onChange(newChanges);
    },
  },

  data() {
    return {
      selectedTags: [...this.values],

      tagOptions: this.options,

      isTagOptionOpen: false,

      isDeleteTag: 0,

      targetOnIndex: 0,
    };
  },

  computed: {
    backspaceKey() { return 8; },
    deleteKey() { return 46; },
    upArrowKey() { return 38; },
    downArrowKey() { return 40; },
    escapeKey() { return 27; },
    enterKey() { return 13; },
  },

  methods: {
    toggleTagOption(event) {
      if (
        event.target.nodeName === 'SPAN' ||
        event.target.nodeName === 'INPUT'
      ) {
        return;
      }

      this.isTagOptionOpen = !this.isTagOptionOpen;
    },

    filterTagOptions() {
      if (this.isKeepSelectedOption) {
        return this.tagOptions;
      }

      return (
        this.tagOptions.filter(elem =>
          !this.selectedTags.filter(
            el => el[this.labelProperty] === elem[this.labelProperty],
          ).length,
        )
      );
    },

    removeTag(tag) {
      this.selectedTags =
        this.selectedTags.filter(elem => elem !== tag);
    },

    selectTag(tag) { this.selectedTags.push(tag); },

    inputTextOnChange(event) {
      if (!this.isTagOptionOpen) {
        this.isTagOptionOpen = true;
      }

      const query = event.target.value;

      if (query) {
        this.tagOptions = this.tagOptions.filter(
          elem => elem[this.labelProperty].includes(query),
        );
      } else {
        this.tagOptions = this.options;
      }
    },

    inputTextKeyDown(event) {
      const { keyCode, target: { value } } = event;

      switch (keyCode) {
        case this.backspaceKey:
        case this.deleteKey: {
          if (!value && this.isDeleteTag < 1) {
            this.isDeleteTag += 1;
          } else if (!value) {
            this.isDeleteTag = 0;
            this.selectedTags.pop();
          }
          break;
        }

        case this.downArrowKey: {
          if (!this.isTagOptionOpen) {
            this.isTagOptionOpen = true;
          }

          if (this.targetOnIndex < this.filterTagOptions().length - 1) {
            this.targetOnIndex += 1;
          }
          break;
        }

        case this.upArrowKey: {
          if (!this.isTagOptionOpen) {
            this.isTagOptionOpen = true;
          }

          if (this.targetOnIndex > 0) {
            this.targetOnIndex -= 1;
          }
          break;
        }

        case this.escapeKey: {
          this.isDeleteTag = 0;
          this.targetOnIndex = 0;
          this.isTagOptionOpen = false;
          break;
        }

        case this.enterKey: {
          this.isDeleteTag = 0;

          if (this.isTagOptionOpen) {
            const tags = this.filterTagOptions();

            if (tags.length) {
              this.selectedTags.push(tags[this.targetOnIndex]);
            }
          }

          break;
        }

        default: {
          this.targetOnIndex = 0;
          this.isDeleteTag = 0;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$tag-height: 26;
$base-label-tag-input-border-radius: 6;
$base-label-tag-input-padding: 6;
$base-label-tag-input-box-padding: 5;
$base-label-tag-input-container-padding: $base-label-tag-input-padding;

.base-label-tag-input {
  display: inline-block;
  border-radius: #{$base-label-tag-input-border-radius}px;
  // padding: #{$base-label-tag-input-padding}px;
}

.base-label-tag-text-input {
  max-width: 100px;
  border-bottom: 1px solid #ccc;
}

.base-label-tag-input-tag {
  z-index: 1;
  min-width: 50px;
  height: #{$tag-height}px;
  border: 1px solid #ccc;
  padding: 0px 5px;
  border-radius: 2px;
  margin: 2px;
  will-change: background-color;
  transition: .2s;
}

.base-label-tag-input-tag-container {
  display: flex;
  width: auto;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px 30px 5px 5px;
  min-height: #{$tag-height}px;
}

.fa-caret-down {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  will-change: transform;
  transition: .2s;
}

.fa-caret-down.active { transform: translateY(-50%) rotateZ(180deg); }

.base-label-tag-input-options {
  opacity: 0;
  border: 1px solid #ccc;
  border-top: 0px;
  visibility: hidden;
  will-change: opacity, visibility;
  left: 0;
  max-height: 200px;
  padding: #{$base-label-tag-input-container-padding}px;
  border-radius:
    0px 0px
    #{$base-label-tag-input-border-radius}px
    #{$base-label-tag-input-border-radius}px;
  z-index: 1;
  transition: .2s;
}
.base-label-tag-input-options.active {
  visibility: visible;
  opacity: 1;
}
.base-label-tag-input-option {transition: .2s; height: 30px; flex-shrink: 0;}
</style>
