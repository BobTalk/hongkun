<template>
  <div>
    <Title :title="title"></Title>
    <div v-if="stageIdentityInfo.vLandList.length !== 0">
      <div class="landlist" v-for="(item, index) in stageIdentityInfo.vLandList" :key="'list' + index">
        <div class="land_area">
          <div>地块{{index+1}}</div>
        </div>
        <table class="projectVTable" border="1" cellspacing="1">
          <tbody>
          <tr>
            <td class="projectViewTitle">获取日期</td>
            <td class="projectViewCon viewcon">
              <el-date-picker
                :value="item.GAINDATE"
                type="date"
                disabled
                placeholder="选择日期">
              </el-date-picker>
            </td>
            <td class="projectViewTitle">土地证起始日期</td>
            <td class="projectViewCon viewcon">
              <el-date-picker
                :value="item.LANDCERTIFICATE"
                type="date"
                disabled
                placeholder="选择日期">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">土地性质</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="item.LANDPROPERTY"
                disabled
              ></el-input>
            </td>
            <td class="projectViewTitle">规划用途</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="item.LANDPLANUSE"
                disabled
              ></el-input>
            </td>
          </tr>
          <tr>
            <td class="projectViewTitle">土地使用年限</td>
            <td class="projectViewCon viewcon">
              <el-input
                :value="item.LANDUSERYEAR"
                disabled
              ></el-input>
            </td>
            <td class="projectViewTitle"></td>
            <td class="projectViewCon viewcon">
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
  </div>
</template>

<script>
  import Title from '../title.vue';
  export default {
      name: "project-land",
      data(){
        return {
          title: "土地列表"
        }
      },
      components: {
        Title
      },
      // filters: {
      //   formatDate(time) {
      //     var date = new Date(time);
      //     return formatDate(date, "yyyy-MM");
      //   }
      // },

      props:['stageIdentityInfo'],
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
    border-bottom:2px solid dodgerblue;
    width:100px;
    display:block;
    text-align: center;
  }
  }
  h3{
    text-align: left;
    height: 25px;
    margin-top:5px;
    line-height:30px;
  }
  .projectVTable {
    width: 95%;
    border: none;
    p{
      margin-left: 30px;
      display: inline-block;
      height:30px;
      line-height: 30px;
      font-weight: 800;
    }
    .projectViewTitle{
      text-align:left!important;
      padding-left:5px;
    }
    .projectViewTitle, .projectViewCon {
      height: 30px;
      color: #676768;
      border-color: #f4f6f9;
      text-align: center;
      div {
        width: 100%;
      }
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
  .viewcon>div{
    margin-top:0.5%;
    width:98%!important;
    height:90%!IMPORTANT;
  }
  .projectViewTitle {
    background: #fbfdff;
    width:15%;
  }
  .nodata{
    text-align:center;
  }
  .land_area {
    div {
      display:inline-block;
      padding: 10px;
      border: 1px solid #F9F9F9;
      margin: 10px 0;
    }
  }
</style>
