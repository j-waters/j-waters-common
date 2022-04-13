<template>
  <div class="modal modal-open" @click.self="emit('close')">
    <div class="modal-box" :class="extraClass">
      <p><slot >{{bodyText}}</slot></p>
      <div v-if="$slots.footer" class="modal-action">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";

const props = withDefaults(defineProps<{
  extraClass?: string
  bodyText?: string;
}>(), {extraClass: ''})

const emit = defineEmits<{
  (e: "close"): void;
}>();

const show = ref(false);

onMounted(() => nextTick(() => (show.value = true)));
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
