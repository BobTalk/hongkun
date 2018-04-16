<template>
  <div class="flowsub-container">
    <el-menu :default-active="activeIndex" class="flowsub-el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">流程审批</el-menu-item>
      <el-menu-item index="2">{{$route.query.entiId | pathFilter}}</el-menu-item>
    </el-menu>
    <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <Back></Back>
  </div>
</template>
<script>
  import Back from './public-component/back.vue';
  export default {
    name: "FlowSubWrapper",
    data(){
      return {
        activeIndex: "2",
      }
    },
    methods: {
      handleSelect(key){
        if( key === "1" ){
          this.$router.push({path: "/workflow/approval", query: this.$route.query});
        }
      }
    },
    filters: {
      pathFilter(type){
        const typeConfig = {
          "10102": "项目信息升级版本",
          "10103": "分期信息升级版本",
          "10104": "价格升级版本",
          "10105": "面积升级版本",
          "10106": "成本升级版本",
          "10107": "供货升级版本",
          "10108": "签约升级版本",
          "10109": "回款升级版本"
        }
        return typeConfig[type] || "参数缺失";
      }
    },
    components: {
      Back
    }
  }
</script>
<style scoped>
  .flowsub-container {
    width: 96%;
    margin: 10px auto 0;
  }
  .flowsub-container .el-menu-item {
    line-height: 30px;
    height: 30px;
  }
  .flowsub-el-menu {
    border-bottom: 1px solid #e6e6e6 !important;
    margin-bottom: 10px;
  }
</style>


