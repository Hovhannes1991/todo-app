<template>
  <svg viewBox="0 0 0 0" class="svg-for-animation">
    <defs>
      <linearGradient id="boxGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="25" y2="25">
        <stop offset="0%" :stop-color="stop_color1"/>
        <stop offset="100%" :stop-color="stop_color2"/>
      </linearGradient>
      <linearGradient id="lineGradient">
        <stop offset="0%" :stop-color="stop_color1"/>
        <stop offset="100%" :stop-color="stop_color2"/>
      </linearGradient>
      <path id="todo__line" stroke="url(#lineGradient)" d="M21 12.3h168v0.1z"></path>
      <path id="todo__box" stroke="url(#boxGradient)"
            d="M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4"></path>
      <path id="todo__check" stroke="url(#boxGradient)" d="M10 13l2 2 5-5"></path>
      <circle id="todo__circle" cx="13.5" cy="12.5" r="10"></circle>
    </defs>
  </svg>

  <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 200 25"
      class="todo__icon"
  >
    <use xlink:href="#todo__line" class="todo__line"></use>
    <use xlink:href="#todo__box" class="todo__box"></use>
    <use xlink:href="#todo__check" class="todo__check"></use>
    <use xlink:href="#todo__circle" class="todo__circle"></use>
  </svg>
</template>

<script>
export default {
  name: 'TodoListItemAnimatedCheckbox',
  data() {
    return {
      stop_color1: '#104758',
      stop_color2: '#0fc0f5'
    }
  }
}
</script>

<style scoped lang="scss">
:root {
  --blue: blue;
}

.svg-for-animation {
  position: absolute;
  z-index: -1;
  opacity: 0;
  height: 0;
  width: 0;
  pointer-events: none;
}

.todo__icon {
  pointer-events: none;
}


.todo__icon {
  position: absolute;
  left: 0;
  width: 90%;
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.todo__line,
.todo__box,
.todo__check {
  transition: stroke-dashoffset 0.4s cubic-bezier(0.9, 0, 0.5, 1);
}

.todo__circle {
  stroke: var(--blue);
  stroke-dasharray: 1 6;
  stroke-width: 0;
  transform-origin: 13.5px 12.5px;
  transform: scale(0.4) rotate(0deg);
  animation: none 0.8s linear;
}

@keyframes explode {
  30% {
    stroke-width: 3;
    stroke-opacity: 1;
    transform: scale(0.8) rotate(40deg);
  }
  100% {
    stroke-width: 0;
    stroke-opacity: 0;
    transform: scale(1.1) rotate(60deg);
  }
}

.todo__box {
  stroke-dasharray: 56.1053, 56.1053;
  stroke-dashoffset: 0;
  transition-delay: 0.16s;
}

.todo__check {
  stroke-dasharray: 9.8995, 9.8995;
  stroke-dashoffset: 9.8995;
  transition-duration: 0.32s;
}

.todo__line {
  stroke-dasharray: 168, 1684;
  stroke-dashoffset: 168;
}

.todo__circle {
  animation-delay: 0.56s;
  animation-duration: 0.56s;
}

.todo-item__checkbox {

}

.todo-item__checkbox-checked ~ .todo__text {
  transition-delay: 0s;
  color: #108bb1;
  opacity: 0.6;
}

.todo-item__checkbox-checked ~ .todo__icon .todo__box {
  stroke-dashoffset: 56.1053;
  transition-delay: 0s;
}

.todo-item__checkbox-checked ~ .todo__icon .todo__line {
  stroke-dashoffset: -8;
}

.todo-item__checkbox-checked ~ .todo__icon .todo__check {
  stroke-dashoffset: 0;
  transition-delay: 0.48s;
}

.todo-item__checkbox-checked ~ .todo__icon .todo__circle {
  animation-name: explode;
}

@media only screen and (max-width: 580px) {
  .main {
    width: 90%;
  }
  .buttons {
    margin-bottom: 0;
  }
}
</style>