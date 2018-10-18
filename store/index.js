import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      data: {}
    },
    mutations: {
      setData: (state, data) => {
        state.data = data
      }
    },
    actions: {
      async getData({ commit, store }, payload) {
        let data = await this.$axios.$get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants&location=${
            payload.lat
          },${payload.lng}&radius=${
            payload.radius
          }&key=AIzaSyDx1D1aXY5B8dH-gS4lzg8w_pXUo9LjZD8`
        )
        commit('setData', data)
      }
      //   async nuxtServerInit({ commit }, { app }, payload) {
      //     let data = await app.$axios.$get(
      //       `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants&location=${
      //         payload.lat
      //       },${payload.lng}&radius=${
      //         payload.radius
      //       }&key=AIzaSyDx1D1aXY5B8dH-gS4lzg8w_pXUo9LjZD8`
      //     )
      //     commit('setData', data)
      //   }
    }
  })
}

export default createStore
