<script setup lang="ts">
  import { useCounterStore } from '@/stores/counter';
  const storeCounter = useCounterStore();
</script>

<template>
  <div>
    <h1 class="home">Home</h1>
    <h1 class="count">{{ storeCounter.count }}</h1>
    <center>
      <h3 style="color: green;">The counter is : {{ storeCounter.oddOrEven }}!</h3>
      <button @click="storeCounter.decreaseCount">-</button>
      <button @click="storeCounter.increaseCount">+</button>
      <br>
      <!-- Two Way Binding -->
      <label for="Initial Value">Initial Value:</label>
      <input type="number" v-model="storeCounter.count"/>
    </center>
  </div>
</template>

<style scoped>
  .home{
    font-size: 5rem;
    text-align: center;
  }
  .count{
    font-size: 5rem;
    text-align: center;
  }
  button{
    font-size: 5rem;
    padding: 20px;
    margin: 10px;
    text-align: center;
    align-items: center;
  }
</style>
