<template>
  <div>
    <el-input placeholder="请输入内容" :value="item.COMPANNYNAME" :disabled="false" class="input-w"
              @change="changeVal(index)"></el-input>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import {InforGather, WrapperButton} from "../../components"
  export default {
    props: ["item", "index"],
    /*属性值*/
    data(){
      return {}
    },
    /*组件引用*/
    components: {WrapperButton},
    /*属性值实时计算*/
    computed: {
      ...mapGetters(["stageBtBuildUnitLisInfoData"]),
    },
    /*函数体*/
    methods: {
      changeVal(data){
//        console.log(this.stageBtBuildUnitLisInfoData);
        for (var i = 0, len = this.stageBtBuildUnitLisInfoData.length; i < len; i++) {
          if (data == i) {
            this.stageBtBuildUnitLisInfoData[i].COMPANNYNAME = this.value
          }
        }
      }
    },

    //创建前状态
    beforeCreate: function () {
    },
    /*创建完成*/
    created: function () {
    },
    /*挂载前*/
    beforeMount: function () {
    },
    /*挂载完成*/
    mounted: function () {
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .input-w {
    margin-top: 10px;
  }
</style>
