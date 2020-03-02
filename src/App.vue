<template>
  <v-app>
    <v-content>
      <router-view/>
      <loading/> 
    </v-content>
      <bottomNav/> 
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import bottomNav from './components/public/bottomNav';
import loading from './components/public/RequestLoading'

export default {
  name: 'App',

  components: {
    bottomNav,
    loading
  },

  data: () => ({
    //
  })
}
</script>
