<template>
  <section class="section">
    <h1 class="title"> Google map for rschallenge </h1>
    <GoogleMap />
  </section>
</template>

<script>
import GoogleMap from '../components/GoogleMap'

export default {
  components: {
    GoogleMap
  }
  // data() {
  //   return {
  //     center: { lat: '', lng: '' }
  //   }
  // },
  // mounted() {
  //   this.geolocate()
  // },
  // methods: {
  //   geolocate() {
  //     navigator.geolocation.getCurrentPosition(position => {
  //       this.center = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       }
  //     })
  //     console.log(this.center)
  //   }
  // }
}
</script>


<style lang='scss' scoped>
.section {
  .title {
    color: red;
  }
}
</style>
