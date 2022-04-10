<template>
  <transition-group name="fade">
    <Component
        :is="modal.component"
        v-for="(modal, index) in activeModals"
        :key="modal.id"
        v-bind="modal.props"
        @close="removeModal(index)"
    />
  </transition-group>
</template>

<script lang="ts" setup>
import { useModalRoot } from "@/utils/modal";

const { activeModals, removeModal } = useModalRoot();
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
