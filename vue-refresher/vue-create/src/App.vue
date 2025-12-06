<script setup>
  import { ref } from 'vue';
  const name = ref("Haseeb");
  const status = ref("pendindg");
  const tasks = ref(['task1', 'task2', 'task3']);
  const task = ref("");
  const clickMe = () => {
    if(status.value == "pending") status.value = "active";
    else if(status.value == "active") status.value = "pending";
    else status.value = "active";
  }
  const addTask = () => {
    tasks.value.push(task.value);
    task.value="";
  }
  const deleteTask = (index) => {
    tasks.value.splice(index, 1);
  } 
</script>

<template>
  <h1>** Vue TODO **</h1> <br />
  <h2>-- Created By {{ name }}!</h2> <br/>
  
  <!-- Status -->
  <p v-if="status == 'active'" style="color: green;"><em>✅ {{ status }} right now!</em></p>
  <p v-else-if="status == 'pending'" style="color: yellow;"><em>💡 {{ status }} right now!</em></p>
  <p v-else style="color: red;">🚨 User is Inactive</p> <br>
  <form @submit.prevent="addTask">
    <label>Enter Task:</label>
    <input type="text" v-model="task">
    <button>Add Task!</button>
  </form>
  <br></br>
  <ol>
    <li v-for="t in tasks" :key="t">
      <span>To work on {{t}}!  &nbsp; </span>
      <button @click="deleteTask(index)"> XDeleteX</button>
    </li>
  </ol> 
  <br> <br> <br></br>
  <!-- <button v-on:click="clickMe">Click Me!</button> -->
  <button @click="clickMe">Change Status!</button>

</template>

<style>

</style>