import {createStore} from 'vuex'
import {user} from './user'
import {authority} from './authority'
import {utils} from './utils'
import { valveInfo } from './valveInfo'

export const store = createStore({
  modules: {
    user,
    authority,
    utils,
    valveInfo
  },
})
