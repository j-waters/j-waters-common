<template>
  <suspense>
    <transition-group name="fade">
      <Component
        :is="modal.component"
        v-for="(modal, index) in activeModals"
        :key="modal.id"
        v-bind="modal.props"
        @close="removeModal(index)"
      />
    </transition-group>
  </suspense>
</template>

<script lang="ts" setup>
import { useModalRoot } from "@/utils/modal";

const { activeModals, removeModal } = useModalRoot();

console.log("hello");
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
