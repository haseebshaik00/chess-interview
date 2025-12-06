<script>
export default{
  data(){
    return{
      name: "Haseeb",
      status: "pending",
      tasks: ['task1', 'task2', 'task3'],
      googleLink: "https://www.google.com"
    }
  },
  methods: {
    clickMe(){
      console.log("Button Clicked!");
    }
  }
};
</script>

<template>
  <h1>-- Vue Jobs --</h1> <br />
  <h2>- Created By {{ name }}!</h2> <br/>
  
  <p v-if="status == 'active'" style="color: green;"><em>-- {{ status }} right now!</em></p>
  <p v-else-if="status == 'pending'" style="color: yellow;"><em>-- {{ status }} right now!</em></p>
  <p v-else style="color: red;">|User is Inactive|</p> <br>
  <ol>
    <li v-for="t in tasks" :key="t">To work on {{t}}!</li>
  </ol> <br>
  <!-- <a v-bind:href="googleLink">Goto Google!</a> -->
  <a :href="googleLink">Goto Google!</a> <br/>
  <button v-on:click="clickMe">Click Me!</button>
  <button @click="clickMe">Click Me!</button>
</template>

<style>

</style>