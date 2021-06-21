<template>
  <div class="home">
    <img src="@/images/logo.png" alt="logo"/>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Vue.js From LegoFlow'
    }
  }
}
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
</style>
