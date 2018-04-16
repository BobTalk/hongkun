<template>
  <div id="groundTempBox">
    <p class="ground-temp-title">土地块{{groundId+1}}</p>
    <div class="stageVLeft">
      <table class="stageVTable" border="1" cellspacing="1">
        <tbody>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="土地获取日期"></el-input>
          </td>
          <td class="stageViewCon">
            <el-date-picker
              v-model="item.gainDate"
              @change="groundTempEvent"
              :disabled="showList"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="土地证起始日期"></el-input>
          </td>
          <td class="stageViewCon">
            <el-date-picker
              v-model="item.landCertificate"
              @change="groundTempEvent"
              :disabled="showList"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="土地性质"></el-input>
          </td>
          <td class="stageViewCon">
            <el-select v-model="value" :placeholder="item.landProperty" :disabled="showList" @change="groundTempEvent"
                       placeholder="请选择">
              <el-option
                v-for="item in groundOptions"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="规划用途"></el-input>
          </td>
          <td class="stageViewCon">
            <el-select v-model="item.landPlanUse" :disabled="showList" @change="groundTempEvent" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="stageViewTitle">
            <el-input :disabled="true" value="土地使用年限"></el-input>
          </td>
          <td class="stageViewCon">
            <el-input v-model="item.LANDUSERYEAR" :disabled="showList" placeholder="请输入内容"></el-input>
          </td>
          <td class="stageViewTitle">
            <el-input :disabled="true" value=""></el-input>
          </td>
          <td class="stageViewCon">
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  export default{
    name: "groundTemp",
    props: ["groundId", "item"],
    data(){
      return {
        groundOptions: [
          {
            value: "01",
            label: '合作开发'
          },
          {
            value: "02",
            label: '企业开发'
          }
        ],
        options: [
          {
            label: '工业'
          },
          {
            label: '住宅'
          },
          {
            label: '商业'
          }
        ],
        groundListData: {},
        value: null
      }
    },
    computed: {
      ... mapGetters(["stageVLandListInfoData", "showList"]),
    },
    mounted(){
//      console.log(this.value);
    },
    methods: {
      groundTempEvent(){
        this.item.landProperty = this.value;
        // console.info(JSON.stringify(this.stageVLandListInfoData, null, 2))
      }
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  #groundTempBox {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: auto;
    }
  }

  #groundButton {
    font-size: 16px;
    margin-right: 20px;
  }

  .ground-temp-title {
    line-height: 30px;
    font-size: 14px;
    text-align: left;
    padding-left: 30px;
  }
</style>
