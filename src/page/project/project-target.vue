<template>
  <div>
    <h2>
      <span class="title">{{target}}</span>
    </h2>
    <div class="projectVLeft" id="targetbox">
      <table class="projectVTable" border="1" cellspacing="1">
        <tbody>
        <tr>
          <td class="projectViewTitle" v-for="(item, key) in projectTargetTitle" :key="key+'title'">
            <span v-if="item.name != '项目经营目标' && item.name !='投决会指标'"><span class="required">*</span>{{item.name}}</span>
            <span v-else>{{item.name}}</span>
          </td>
        </tr>
        <tr v-for="(targetinfo,index) in projectTargetData" :key="index+'data'">
          <td class="projectViewTitle" style="white-space:nowrap;text-align:left;padding-left:5px">
            {{targetinfo.MANAGEMENTOBJECTIVES}}
          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                v-model="targetinfo.VOTINGMEETING"
                type="month"
                :disabled="projectShow"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                :controls=false
                v-model="targetinfo.VOTINGMEETING"
                @focus="focus"
                @blur="filterUnNumber($event, 'VOTINGMEETING', targetinfo['MANAGEMENTOBJECTIVES'])"
                :disabled="(index == 0 || index == 3|| index == 4 || index == 7)? true :projectShow ?true:false">
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>
          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                v-model="targetinfo.FIRSTYEARQUOTA"
                type="month"
                :disabled="projectShow"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                v-model="targetinfo.FIRSTYEARQUOTA"
                @focus="focus"
                @blur="filterUnNumber($event, 'FIRSTYEARQUOTA', targetinfo['MANAGEMENTOBJECTIVES'])"
                :disabled="(index == 0 || index == 3|| index == 4 || index == 7)? true :projectShow ?true:false">
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>
          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                v-model="targetinfo.LAUNCHMEETING"
                type="month"
                :disabled="projectShow"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                v-model="targetinfo.LAUNCHMEETING"
                @focus="focus"
                @blur="filterUnNumber($event, 'LAUNCHMEETING', targetinfo['MANAGEMENTOBJECTIVES'])"
                :disabled="(index == 0 || index == 3|| index == 4 || index == 7)? true :projectShow ?true:false">
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>
          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                v-model="targetinfo.SECONDYEARQUOTA"
                type="month"
                :disabled="projectShow"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                v-model="targetinfo.SECONDYEARQUOTA"
                @focus="focus"
                @blur="filterUnNumber($event, 'SECONDYEARQUOTA', targetinfo['MANAGEMENTOBJECTIVES'])"
                :disabled="(index == 0 || index == 3|| index == 4 || index == 7)? true :projectShow ?true:false">
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>
          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                v-model="targetinfo.THIRDYEARQUOTA"
                type="month"
                :disabled="projectShow"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                v-model="targetinfo.THIRDYEARQUOTA"
                @focus="focus"
                @blur="filterUnNumber($event, 'THIRDYEARQUOTA', targetinfo['MANAGEMENTOBJECTIVES'])"
                :disabled="(index == 0 || index == 3|| index == 4 || index == 7)? true :projectShow ?true:false">
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>
          </td>
          <td class="projectViewCon viewcon">
            <div v-if="index == 5">
              <el-date-picker
                v-model="targetinfo.OVERALLPOSTEVALUATION"
                type="month"
                :disabled="projectShow"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div v-else>
              <el-input
                required="required"
                v-model="targetinfo.OVERALLPOSTEVALUATION"
                @focus="focus"
                @blur="filterUnNumber($event, 'OVERALLPOSTEVALUATION', targetinfo['MANAGEMENTOBJECTIVES'])"
                :disabled="(index == 0 || index == 3|| index == 4 || index == 7)? true :projectShow ?true:false">
                <i slot="suffix">{{index | suffixFilter}}</i>
              </el-input>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>  
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import "./project.less";
  export default {
    name: 'project-target',
    data() {
      return {
        target: '项目经营目标'
      }
    },
    computed: {
      ...mapGetters(['projectShow'])
    },
    props: ['projectTargetTitle', 'projectTargetData'],
    filters: {
      suffixFilter(val){
        const suffixConfig = {
          '1': '%',
          '2': '%',
          '8': '%'
        }
        return suffixConfig[val];
      }
    },
    methods: {
      focus(event,name,index){
        event.currentTarget.select();
      },
      filterUnNumber(evt, name, typeName) {
        let val = '';
        if( !isNaN(Number(evt.target.value)) ){
          val = evt.target.value;
        }
        const data = JSON.parse(JSON.stringify(this.projectTargetData));
        const newData = data.map( item => {
          for( const key in item ){
            if( item['MANAGEMENTOBJECTIVES'] === typeName ){
              item[name] = val;
            }
          }
          return item;
        });
        this.$emit('update:projectTargetData', newData);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  table {
    border: 1px solid #ebeef5;
    thead tr th, tbody tr td {
       border: 1px solid #ebeef5;
    }
  }
  h2 {
    width: 100%;
    height: 30px;
    background: inherit;
    border-bottom: 2px solid #F9F9F9;
    margin-top: 10px;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    .title {
      border-bottom: 2px solid dodgerblue;
      width: 100px;
      display: block;
      text-align: center;
    }
  }

  .shrink {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid #4caaf4;
    text-align: center;
    line-height: 25px;
    color: #4caaf4;
    margin-right: 40px;
  }

  .projectVTable {
    width: 100%;
    margin-top: 20px;
    border: none;
    .projectViewTitle, .projectViewCon {
      height: 30px;
      color: #676768;
      //border-color: #ebeef5;
      text-align: center;
    }
    .projectViewTitle {
      background: #fbfdff;
    }
  }

  .viewcon > div {
    padding: 3px;
    width: 96% !important;
    height: 100% !IMPORTANT;
    /*div{*/
    /*height:95%!IMPORTANT;*/
    /*}*/
  }

  i {
    font-style: normal;
    color:#727273!important;
    line-height: 24px;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{-moz-appearance:textfield;}
</style>
