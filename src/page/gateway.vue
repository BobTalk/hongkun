<template>
  <div>
  </div>
</template>

<script>
  import {fetchUtils, message} from '../utils';
  import {mapState, mapGetters, mapActions} from 'vuex';
  export default {
    name: "gateway",
    data: function () {
      return {}
    },
    created () {
      let args = this.$route.params;
//      this.ssoReq({})
      localStorage.setItem('token', args.token);
      this.sso({userInfo:{userName:args.userName,userId:''},token:args.token,vm:this})
    },
    methods:{
    ...mapActions(['sso']),
    }
  }
</script>

<style scoped>

</style>
