<template>
  <div class="home">
    <img
      src="@/images/logo.png"
      alt="logo"
    >
    <h1>{{ title }}</h1>
    <button @click="count++">
      count is: {{ count }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const title = 'Vue.js From LegoFlow'

const count = ref(0)
</script>

<style scoped lang="scss">
.home {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: auto;
}

h1 {
  width: 100%;
  margin-top: 20px;
  color: #39485c;
  text-align: center;
}

img {
  max-width: 150px;
}

button {
  padding: 2px 5px;
  border: 1px solid #eee;
  cursor: pointer;
}
</style>
