import {fetchUtils, message} from '../../utils';

const types = {
  SET_COST_DYNAMIC:'SET_COST_DYNAMIC'
}


const state = {
  costpaymentdata:''
}


const actions ={
  getCostPayment({commit},stageId) {
     return fetchUtils.post('/Cost/GetPayMentVersionList', {
       stageId: stageId
    }).then(res => {
      console.log(res)
      return res.rows
    })
  },
}

const mutations = {
  [types.SET_COST_DYNAMIC](state, costpayment){
    state.costpayment = costpayment;
  },
}

const getters = {
  costpayment:state =>{
    return state.costpayment
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
