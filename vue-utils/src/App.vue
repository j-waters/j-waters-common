<template>
  <ModalRoot/>
</template>

<script setup lang="ts">
import ModalRoot from "@/components/modal/ModalRoot.vue";
import {useModal} from "@/utils/modal";
import ModalComponent from "@/components/modal/ModalComponent.vue";

useModal(ModalComponent)({bodyText: "bleh"})
</script>


<style>

</style>
