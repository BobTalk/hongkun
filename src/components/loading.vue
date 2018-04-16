<template>
  <div id="loading">
  </div>
</template>

<script>
  import {message} from '../utils';
  import WrapperButton from './wrapper-button.jsx';
  import {mapState, mapGetters, mapActions} from 'vuex';
  import "./left-tree.less";

  export default {
    name: 'Loading',
    data() {
      return {}
    },
    components: {
    },
    computed: {},
    methods: {},
    created() {},
    watch: {},
  }

</script>
<style scoped>
  #loading {
    background: url("../assets/tu2.jpg");
    background-size:cover;
    /*background-repeat: no-repeat;*/
    width: 98%;
    height: 100%;
  }
</style>
