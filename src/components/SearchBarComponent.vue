<template>
  <div class="search-bar-component" style="background: #f7f7f7; padding: 1rem;">
    <div class="search">
      <span class="icon">🔍</span>
      <input
        type="text"
        v-model="query"
        placeholder="Buscar eventos..."
        @keyup.enter="goToResults"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const query = ref('')
const router = useRouter()

const goToResults = () => {
  if (query.value.trim()) {
    router.push({ path: "/search", query: { q: query.value } })
  }
}
</script>

<style scoped>
.search {
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  background: #f7f7f7;
}
.search input {
  border: none;
  outline: none;
  flex: 1;
  margin-left: 0.5rem;
  background: #f7f7f7;
}
</style>
