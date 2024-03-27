import { defineStore } from 'pinia'

type State = {
  id: string
  name: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): State => {
    return {
      id: '',
      name: '',
    }
  },
  actions: {
    setId(id: string) {
      this.id = id || ''
    },

    load() {
      return Promise.resolve({
        id: '432',
        name: 'Grill Vogel',
      }).then((user) => {
        this.id = user.id
        this.name = user.name
      })
    },
  },
  getters: {
    isLoggedIn: (state): boolean => {
      return !!state.id
    },
  },
})
