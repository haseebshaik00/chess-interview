<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <center>
          <RouterLink to="/">Home</RouterLink> &nbsp; | &nbsp;
          <RouterLink to="/about">About</RouterLink>
        </center>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
.wrapper{
  font-size: 2rem;
}
</style>
