<script setup>
import Header from './components/icons/HeaderComponent.vue'
import MainContent from './components/icons/MainComponent.vue'
import Footer from './components/icons/FooterComponent.vue'
</script>

<template>
  <div class="app">
    <Header />
    <MainContent />
    <Footer />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Istok+Web:wght@400;700&family=Inter:wght@400;600;700&display=swap');

.app {
  background-color: #FFFCEE;
  color: #11508E;
  font-family: 'Inter', sans-serif;
}
</style>
