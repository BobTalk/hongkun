<template>
  <div>
    <h2>
      <span class="title">土地列表</span>
    </h2>
    <div  v-if="projectLand.length> 0">
      <div class="landlist" v-for="(landlist, index) in projectLand" :key="'land' + index">
        <h3>{{landlist.stageName}}</h3>
        <div v-for="(landdata, index) in landlist.landInfo" :key="'landlist'+index">
          <p class="land-title-name">地块{{index+1}}</p>
          <table class="projectVTable" border="1" cellspacing="1">
            <tbody>
            <tr>
              <td class="projectViewTitle">获取日期</td>
              <td class="projectViewCon viewcon right">
                <el-date-picker
                  v-model="landdata.GAINDATE"
                  type="date"
                  :disabled="true"
                  placeholder="选择日期">
                </el-date-picker>
              </td>
              <td class="projectViewTitle">土地证起始日期</td>
              <td class="projectViewCon viewcon right">
                <el-date-picker
                  v-model="landdata.LANDCERTIFICATE"
                  type="date"
                  :disabled="true"
                  placeholder="选择日期">
                </el-date-picker>
              </td>
            </tr>
            <tr>
              <td class="projectViewTitle">土地性质</td>
              <td class="projectViewCon viewcon">
                <el-input
                  v-model="landdata.LANDPROPERTY"
                  :disabled="true"
                ></el-input>
              </td>
              <td class="projectViewTitle">规划用途</td>
              <td class="projectViewCon viewcon">
                <el-input
                  v-model="landdata.LANDPLANUSE"
                  :disabled="true"
                ></el-input>
              </td>
            </tr>
            <tr>
              <td class="projectViewTitle">土地使用年限</td>
              <td class="projectViewCon viewcon right">
                <el-input
                  v-model="landdata.LANDUSERYEAR"
                  :disabled="true"
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
    </div>
    <div v-else>
      <span class="nodata">暂无数据</span>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import moment from 'moment';
    export default {
        name: "project-land",
        data(){
          return {
            flage:true
          }
        },
        filters: {
          formatDate(time) {
            var date = new Date(time);
            return formatDate(date, "yyyy-MM");
          }
        },
        computed: {
          ...mapGetters([
            'projectShow'
          ])
        },
        props:['projectLand'],
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  table {
    border: 1px solid #ebeef5;
    thead tr th, tbody tr td {
       border: 1px solid #ebeef5;
    }
  }
  h2{
    width: 100%;
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
  .land-title-name {
      margin-left: 30px;
      display: inline-block;
      height:30px;
      line-height: 30px;
  }
  .projectVTable {
    width: 100%;
    border: none !important;
    .projectViewTitle{
      text-align:left!important;
      padding-left:5px;
    }
    .projectViewTitle, .projectViewCon {
      height: 30px;
      color: #676768;
      //border-color: #ebeef5;
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
    height:90%!important;
  }
  .projectViewTitle {
    background: #fbfdff;
    width:15%;
  }
  .nodata{
    display: inline-block;
    width:100%;
    margin: 20px auto;
  }
</style>
