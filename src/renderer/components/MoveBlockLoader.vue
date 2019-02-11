
<template>
  <div
    class="move-block-loader no-scroll relative flex align-end"
    :class="className"
  >
    <span
      class="block1"
      :class="color"
    />
    <span
      class="block2"
      :class="color"
    />
    <span
      class="block3"
      :class="color"
    />
    <span
      class="block4"
      :class="color"
    />
    <span
      class="block5"
      :class="color"
    />
    <span
      class="block6"
      :class="color"
    />
    <span
      class="block7"
      :class="color"
    />
    <span
      class="block8"
      :class="color"
    />
    <span
      class="block9"
      :class="color"
    />
    <span
      class="block10"
      :class="color"
    />
  </div>
</template>

<script>
export default {
  name: 'MoveBlockLoader',

  props: {
    color: {
      type: String,
      validator(value) {
        const allowed = ['bg-gray1', 'bg-gray2', 'bg-gray3', 'bg-white'];

        return allowed.indexOf(value) !== -1;
      },
      default: 'bg-gray1',
    },

    className: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes waveFlow {
  0% {transform: scaleY(0); opacity: 1;}

  50% {transform: scaleY(15); opacity: .6;}

  100% {transform: scaleY(30); opacity: 1;}
}

.move-block-loader {
  height: 30px;
  width: 60px;
}

.block1, .block2, .block3, .block4, .block5,
.block6, .block7, .block8, .block9, .block10 {
  animation: waveFlow linear infinite;
  height: 1px;
  animation-duration: .5s;
  flex: 1;
  transform-origin: bottom;
  animation-direction: alternate;
}

@for $i from 1 to 11 {
  .block#{$i} {
    animation-delay: #{$i * 0.1}s;
  }
}
</style>
