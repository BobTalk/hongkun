<template>
  <div id="workflow-container">
    <div class="breadcrunb-container" v-if="$route.path !== '/workflow/approval'">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>流程审批</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.path | breadcrumbFilter }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: "WorkFlowWrapper",
  filters: {
    breadcrumbFilter(path){
      const pathConfig = {
        "/workflow/todo": "我的待办",
        "/workflow/apply": "我的申请",
        "/workflow/history": "审批历史",
        "/workflow/draft": "我的草稿",
        "/workflow/approval": "审批流程"
      }
      return pathConfig[path] || " ";
    }
  }
};
</script>

<style scoped>
  #workflow-container {
    width: 96%;
    margin: 10px auto 0;
  }
  #workflow-container .el-breadcrumb {
    border: 1px solid #ebeef5;
    padding: 8px;
    margin-bottom: 10px;
    background: none;
    color: #555;
  }
</style>

