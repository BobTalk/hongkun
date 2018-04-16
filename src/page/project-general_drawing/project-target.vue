<template>
  <input type="text">
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>
</template>

<script>
  export default {
    /*属性值*/
    data(){
      return {
        title: [
          {label: "日期", props: "date"},
          {label: "姓名", props: "name"},
          {label: "地址", props: "address"}
        ],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    /*组件引用*/
    components: {},
    /*属性值实时计算*/
    computed: {},
    /*函数体*/
    methods: {},
    //创建前状态
    beforeCreate: function () {
      console.log("beforeCreate");
    },
    /*创建完成*/
    created: function () {
      console.log("created");
    },
    /*挂载前*/
    beforeMount: function () {
      console.log("beforeMount");
    },
    /*挂载完成*/
    mounted: function () {
      console.log("mounted");
    },
    /*更新前*/
    beforeUpdate: function () {
      console.log("beforeUpdate");
    },
    //更新完成状态
    updated: function () {
      console.log("updated");
    },
    /*组件激活时调用*/
    activated: function () {
      console.log("activated");
    },
    /*组件移除时调用*/
    deactivated: function () {
      console.log("deactivated");
    },
    /*销毁前*/
    beforeDestory: function () {
      console.log("beforeDestory");
    },
    /*销毁完成*/
    destoryed: function () {
      console.log("destoryed");
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .el-table--enable-row-hover {
    .el-table__body {
      tr {
        &:hover{
          td{
            background-color: #fff !important;
          }
        }
      }
    }
  }
</style>
