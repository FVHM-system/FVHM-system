export const valveInfo = {
    namespaced: true,
    state: {
      valveInfo:[]
    },
    mutations: {
      setValveInfo(state, data) {
        state.valveInfo = data
      },
    },
    actions: {
      getValveInfo({commit},data){
          commit('setValveInfo',data)
      }
    },
  }
  