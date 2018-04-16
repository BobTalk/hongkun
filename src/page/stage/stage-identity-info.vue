<template>
  <div style="position: relative" v-if="stageStageIdentityInfoData !=null" id="identityBox">
    <p class="indentity-annotate">注:页面灰色部分为取值，不可编辑。页面白色部分为填写项。</p>
    <table class="stageVTable" border="1" cellspacing="1">
      <tbody>
      <tr>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="分期名称"></el-input>
        </td>
        <td class="stageViewCon">
          <el-input v-model="stageStageIdentityInfoData.stageName" placeholder="请输入内容"
                    :disabled="showList" @change="identityEvent"></el-input>
        </td>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="分期编号"></el-input>
        </td>
        <td class="stageViewCon">
          <el-input
            placeholder="请输入内容"
            v-model="stageStageIdentityInfoData.stageCode"
            @change="identityEvent"
            :disabled="true">
          </el-input>
        </td>
      </tr>
      <tr>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="分期建立日期"></el-input>
        </td>
        <td class="stageViewCon">
          <el-date-picker
            v-model="stageStageIdentityInfoData.stageCreateDate"
            @change="identityEvent"
            type="date"
            :disabled="showList"
            placeholder="选择日期">
          </el-date-picker>
        </td>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="分期项目负责人"></el-input>
        </td>
        <td class="stageViewCon">
          <el-input
            placeholder="请输入内容"
            v-model="stageStageIdentityInfoData.principal"
            @change="identityEvent"
            :disabled="showList">
          </el-input>
        </td>
      </tr>
      <tr>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="开发方式"></el-input>
        </td>
        <td class="stageViewCon">
          <el-select v-model="value" :disabled="showList" @change="identityEvent"
                     placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </td>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="投资公司名称"></el-input>
        </td>
        <td class="stageViewCon">
          <el-button type="text" :disabled="showList" @click="addCompanny">{{stageInvestmentCompanney.COMPANNYNAME}}
          </el-button>
        </td>
      </tr>
      <tr>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="项目公司名称"></el-input>
        </td>
        <td class="stageViewCon">
          <el-button type="text" :disabled="showList" @click="addCompanny">{{stageProjectCompanney.COMPANNYNAME}}
          </el-button>
          <el-dialog :title="titleShow" :visible.sync="dialogVisible" width="30%">
            <el-row>
              <el-col :span="20">
                <div class="grid-content bg-purple">
                <span v-for="(item,index) in stageBtBuildUnitLisInfoData">
                <IdentityTemp :item="item" :index="index"/>
              </span>
                </div>
              </el-col>
              <el-col :span="4" :push="1">
                <div class="grid-content bg-purple-light">
                  <i class="el-icon-plus" @click="infoAddButton"></i>
                  <i class="el-icon-delete" @click="infoDelButton"></i>
                </div>
              </el-col>
            </el-row>

            <!--<span v-for="(item,index) in stageBtBuildUnitLisInfoData">
                <IdentityTemp :item="item" :index="index"/>
              </span>
            <span id="identityButton">
                <WrapperButton type="icon" size="mini" icon="el-icon-plus" @click="infoAddButton"/>
                <WrapperButton type="icon" size="mini" icon="el-icon-delete" @click="infoDelButton"/>
              </span>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </span>
          </el-dialog>
        </td>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="公司权益比例(%)"></el-input>
        </td>
        <td class="stageViewCon">
          <el-input placeholder="请输入内容" :disabled="showList" @change="identityEvent"
                    v-model="stageStageIdentityInfoData.companyProportion"></el-input>
        </td>
      </tr>
      <tr>
        <td class="stageViewTitle">
          <el-input :disabled="true" value="施工总承包单位"></el-input>
        </td>
        <td class="stageViewCon">
          <el-input placeholder="请输入内容" :disabled="showList" @change="identityEvent"
                    v-model="stageStageIdentityInfoData.projectCompanyName"></el-input>
        </td>
        <td class="stageViewTitle">
          <el-input :disabled="true" value=""></el-input>
        </td>
        <td class="stageViewCon"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import {InforGather, WrapperButton} from "../../components"
  import IdentityTemp from "./identity-temp.vue"
  import {mapState, mapGetters, mapActions} from 'vuex';
  import moment from "moment";
  export default{
    data(){
      return {
        stageCreateDateValue: "",
        addInputFlage: true,
        options: [
          {
            value: '01',
            label: '开发方式'
          },
          {
            value: '02',
            label: '开发方式02'
          }],
        value: "02",
        dialogVisible: false,
        titleShow: ""
      }
    },
    computed: {
      ...mapGetters(["showList", "stageStageIdentityInfoData", "stageBtBuildUnitLisInfoData", "stageInvestmentCompanney", "stageProjectCompanney"]),
    },
    methods: {
      infoAddButton(){
        if (this.titleShow == "投资公司名称") {
          this.$store.state.stage.stageInfo.BtBuildUnitList.push({
            ISDEL: this.stageInvestmentCompanney.ISDEL,
            ID: this.stageInvestmentCompanney.ID,
          })
        } else {
          this.$store.state.stage.stageInfo.BtBuildUnitList.push({
            ISDEL: this.stageProjectCompanney.ISDEL,
            ID: this.stageProjectCompanney.ID,
          })
        }
      },
      infoDelButton(){
        this.$store.state.stage.stageInfo.BtBuildUnitList.pop({})
      },
      addCompanny(e){
        if (this.addInputFlage) {
          this.infoAddButton();
        }
        this.addInputFlage = false;
        this.dialogVisible = true;
        var nodeE = e.target.parentNode.parentNode.previousSibling;
        if (nodeE != "1") {
          this.titleShow = nodeE.previousSibling.innerText;
        } else {
          this.titleShow = nodeE.innerText;
        }
      },
      identityEvent(){
        this.stageStageIdentityInfoData.developmentModel = this.value
      },
    },
    components: {
      WrapperButton,
      IdentityTemp
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  #identityBox {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: auto;
    }
  }

  .indentity-annotate {
    line-height: 30px;
    color: #ff3e3f;
    text-align: left;
  }

  .grid-content {
    .el-icon-plus, .el-icon-delete {
      font-size: 14px;
      font-weight: bold;
      padding: 5px;
      margin-top: 10px;
      user-select: none;
    }
  }

  .input-w {
    margin-top: 10px;
    width: 80%;
  }

  #identityButton {
    font-size: 20px !important;
    font-weight: bold;
    user-select: none;
  }
</style>
