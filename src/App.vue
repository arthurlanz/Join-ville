<script setup>
import CadastroComponent from './components/CadastroComponent.vue';
import CarrosselComponent from './components/CarrosselComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';

</script>
<script>
export default {
  name: 'App'
}
</script>
<template class= "joinville">
  <div id="app">
    <HeaderComponent />
    <CarrosselComponent />
    <router-view />
    <CadastroComponent />
    <FooterComponent />
  </div>
</template>



<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f7f7f7;
  color: #333;
}

#app {
  min-height: 100vh;
}
</style>
