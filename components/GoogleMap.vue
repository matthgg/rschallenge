<template>
  <section class="section">
    <div>
      <GmapMap
        ref="myMap"
        :center="center"
        :zoom="17"
        style="width: 100%; height: 1000px"
      >
        <GmapMarker 
          :position="center"
          :icon="{ url: require('../assets/images/home.png') }"
        />

        <GmapMarker 
          v-for="( item, index ) in nearbyPlaces"
          :key="index"
          :position="item.geometry.location"
        />

        <GmapCircle 
          :center="center"
          :radius="radius"
          :options="{ fillColor: 'red' }"
        />

      </GmapMap>
    </div>

    <div class="inputBox">
      <div class="field is-grouped">
        <p class="control is-expanded">
          <GmapAutocomplete
            class="input"
            @place_changed="change"/>
        </p>
        <p class="control">
          <a 
            class="button is-info"
            @click="move"
          >
            Change
          </a>
          <!-- <a 
            class="button is-info"
            @click="geolocate(getData())"
          >
            Get Current Location
          </a> -->
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <div class="columns">
          <div class="column">
            <h1 class="title">Nearby Restaurant</h1>
          </div>
          <div class="column">
            <div class="select">
              <select v-model="sortby">
                <option 
                  disabled 
                  value="">Please select one</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>
          <div class="column">
            <div class="select">
              <select v-model="orderR">
                <option 
                  disabled 
                  value="">Please select one</option>
                <option value="asc">ASC</option>
                <option value="desc">DESC</option>
              </select>
            </div>
          </div>
        </div>

        <div class="columns is-mobile">
          <div class="column">
            <h1 class="title">Name</h1>
          </div>
          <div class="column">
            <h1 class="title">Rating</h1>
          </div>
          <div class="column">
            <h1 class="title">Distance</h1>
          </div>
        </div>
        
        <div 
          v-for="( item, index ) in order" 
          :key="index" 
          class="columns is-mobile" >
          <div class="column">
            {{ item.name }}
          </div>
          <div class="column">
            {{ item.rating }}
          </div>

          <div class="column">
            {{ item.distance }}km
          </div>
        </div>

      </div>
    </section>

  </section>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      center: { lat: 0, lng: 0 },
      radius: 500,
      requestedPlace: null,
      sortby: '',
      orderR: '',
      nearbyPlaces: [],
      display: []
    }
  },

  computed: {
    order() {
      return _.orderBy(this.display, this.sortby, this.orderR)
    }
  },

  mounted() {
    this.geolocate()
    // this.getData()
  },

  methods: {
    // Getting current location
    geolocate() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.getDataInit(position.coords.latitude, position.coords.longitude)

        this.$refs.myMap.$mapPromise.then(() => {
          this.$refs.myMap.$mapObject.panTo(this.center)
        })
      })
    },

    // get nearby restaurants
    getDataInit(lat, lng) {
      this.$gmapApiPromiseLazy().then(() => {
        let service = new google.maps.places.PlacesService(
          this.$refs.myMap.$mapObject
        )

        let request = {
          location: new google.maps.LatLng(lat, lng),
          radius: this.radius,
          type: ['restaurant']
        }

        service.nearbySearch(request, (results, status) => {
          this.nearbyPlaces = []
          this.display = []
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            results.map(result =>
              service.getDetails(
                {
                  placeId: result.place_id,
                  fields: ['name', 'price_level', 'rating', 'geometry']
                },
                (results, status) => {
                  if (status == google.maps.places.PlacesServiceStatus.OK) {
                    this.nearbyPlaces.push(results)

                    let a = new google.maps.LatLng(
                      result.geometry.location.lat(),
                      result.geometry.location.lng()
                    )
                    let b = new google.maps.LatLng(
                      this.center.lat,
                      this.center.lng
                    )

                    let dist =
                      google.maps.geometry.spherical.computeDistanceBetween(
                        a,
                        b
                      ) / 1000

                    this.display.push({
                      distance: dist.toFixed(2),
                      name: results.name,
                      rating: results.rating
                    })
                  }
                }
              )
            )
          }
        })
      })
    },

    // Change location as requested
    change(place) {
      this.requestedPlace = place
    },

    // Move to current
    move() {
      if (this.requestedPlace != null && this.requestedPlace.geometry != null) {
        this.center = {
          lat: this.requestedPlace.geometry.location.lat(),
          lng: this.requestedPlace.geometry.location.lng()
        }
        this.getDataInit(
          this.requestedPlace.geometry.location.lat(),
          this.requestedPlace.geometry.location.lng()
        )
        // this.$store.dispatch({
        //   type: 'getData',
        //   lat: this.requestedPlace.geometry.location.lat(),
        //   lng: this.requestedPlace.geometry.location.lng(),
        //   radius: this.radius
        // })
        // console.log(this.$store.state.data)
      } else {
        alert('Please Enter a valid address')
      }

      // this.$refs.myMap.$mapPromise.then(() => {
      //   this.$refs.myMap.$mapObject.panTo({
      //     lat: 22.427252,
      //     lng: 114.209694
      //   })
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  width: 100%;
  display: block;
  margin: 0 auto;
  position: relative;

  .inputBox {
    margin: 3% auto;
    .input {
      width: 100%;
    }
  }
}
</style>
