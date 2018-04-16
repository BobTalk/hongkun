<template>
  <div>
    <Title :title="title"></Title>
    <div class="projectVLeft" id="operatebox">
      <el-table :data="planGroupTask.data" border class-name="tableheight"  v-if="planGroupTask.rowTitle.length>1">
        <el-table-column v-for="(title, keys) in planGroupTask.rowTitle" :prop="title.field" :key="title.field"
                         :label="title.name"
                         width="150" height="30">
            <template slot-scope="scope">
              <div v-if="keys%2 == 1" :class="'project_operate_cell'">
                <span :class="'cell_status'+scope.row[scope.column.property]"></span>
              </div>
              <span v-else>{{scope.row[scope.column.property]}}</span>
            </template>
        </el-table-column>
      </el-table>
     <div v-else class="nodata">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
  import Title from '../title.vue';
  export default {
    data(){
      return {
        title:"项目运营节奏",
      }
    },
    props:['planGroupTask'],
    components: {
        Title
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  h2{
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom:2px solid #F9F9F9;
    margin-top: 10px;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size:15px;
    .title{
      border-bottom:2px solid  #4478e8;
      width:100px;
      display:block;
      text-align: center;
    }
  }
  .shrink{
    width:25px;
    height: 25px;
    border-radius:50%;
    border: 1px solid #4caaf4;
    text-align: center;
    line-height:25px;
    color:#4caaf4;
    margin-right:40px;
  }
  .projectcon{
    display: flex;
    .projectright{
      width:50%;
    }
  }
  .projectVLeft{
    width:100%;
    margin-top:20px;
  }
  .nodata{
    width:100%;
    margin: 0 auto;
  }
  #operatebox .el-table__header-wrapper tr{
    height: 30px!important;
  }
  .project_operate_cell > span {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .cell_status1 {
    background: #ccc;
  }
  .cell_status2 {
    background: #9dcc5c;
  }
  .cell_status3 {
    background: #eaea5c;
  }
  .cell_status4 {
    background: #f59696;
  }
  .nodata{
    text-align: center;
  }
</style>
