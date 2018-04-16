import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user';
import common from './modules/common';
import project from './modules/project'
import stage from './modules/stage'
import area from './modules/area'
import price from './modules/price'
import fenqi from './modules/fenqi'
import cost from './modules/cost'
import {fetchUtils} from "../utils";
import team from './modules/team'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    common: {},
    project: {},
    area: {},
    price: {},
    fenqi: {},
    team: {},
    cost: {}
  },
  modules: {
    user,
    common,
    project,
    area,
    price,
    fenqi,
    team,
    cost
  }
})
