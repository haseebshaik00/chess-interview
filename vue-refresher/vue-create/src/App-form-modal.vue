<script setup>
  import { ref, onMounted } from 'vue';
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

  onMounted(async () => {
    try{
      const response = await fetch("https://jsonplaceholder.typicode.com/todos");
      const data = await response.json();
      tasks.value = data.map((task) => task.title);
    }
    catch(error){
      console.log("Error in Fetch!", error);
    }
  });
</script>

<template>
  <h1>** Vue TODO **</h1> <br />
  <h2>-- Created By {{ name }}!</h2> <br/>
  
  <!-- Status -->
  <button @click="clickMe">Change Status!</button> <br>
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
    <li v-for="(t, index) in tasks" :key="index">
      <span>To work on {{t}}!  &nbsp; </span>
      <button @click="deleteTask(index)"> XDeleteX</button>
    </li>
  </ol> 
  <br> <br> <br></br>
  <!-- <button v-on:click="clickMe">Click Me!</button> -->
  

</template>

<style>

</style>