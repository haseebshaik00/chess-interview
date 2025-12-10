<script setup lang="ts">
  import { useCounterStore } from '@/stores/counter';
  const storeCounter = useCounterStore();
</script>

<template>
  <div>
    <h1 class="about">About</h1>
    <center>
      <button class="count">{{ storeCounter.count }}</button>
    </center>
  </div>
</template>

<style scoped>
  .about{
    font-size: 5rem;
    text-align: center;
  }
  .count{
    font-size: 5rem;
    text-align: center;
  }
</style>
