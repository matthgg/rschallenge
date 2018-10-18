import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDx1D1aXY5B8dH-gS4lzg8w_pXUo9LjZD8',
    libraries: 'places, geometry'
  }
})
