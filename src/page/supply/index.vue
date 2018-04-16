<template>
  <div class="supply">
    <div class="active-container">
      <h2>
        <span class="title">{{title1}}</span>
        <div class="button-cpntainer">
          <span style="margin-left: 5px;">
            <label class="version">当前版本:</label>
            <el-select :value="preVersionId" placeholder="请选择" class="input_style version_width" @change="changeVersion" id="select_input">
              <el-option
                style="height: 30px"
                v-for="item in versionData"
                :key="item.versionId"
                :label="item.showName"
                :value="item.versionId">
              </el-option>
            </el-select>
          </span>
        </div>
      </h2>
      <div class="supply-container">
        <supply-table :initData="preData"></supply-table>
      </div> 
    </div>
    <div class="active-container">
      <h2>
        <span class="title">{{title2}}</span>
        <div class="button-container">
          <el-button size="small" type="primary" @click="openDialog" v-if="moduleCode != '1' && (supplyStatus == '-1' || supplyStatus == '0' || supplyStatus == '99')  && commonPathRoleAuthority.indexOf('btn_edit') > -1"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button size="small" type="primary" @click="startApproval" v-if="(supplyStatus == '-1' || supplyStatus == '0' || supplyStatus == '99') && approvalState && commonPathRoleAuthority.indexOf('btn_approval') > -1"><i class="el-icon-share"></i>发起审批</el-button>
          <span v-if="supplyStatus=='1'"  class="approval-state">状态：审批中</span>
        </div>
      </h2>
      <div class="supply-container">
        <supply-table :initData="activeData"></supply-table>  
      </div> 
    </div>
    <el-dialog
      title="按楼栋供货"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
      class="dialog-container"
      >
      <div class="select-container">
        <label>组团：</label>
        <el-select v-model="GROUPNAMEValue" placeholder="请选择" @change="changeSelect">
          <el-option
            v-for="item in GROUPNAMEDATA"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>  
        <label>批次：</label>
        <el-select v-model="BATCHNAMEValue" placeholder="请选择" @change="changeSelect">
          <el-option
            v-for="item in BATCHNAMEDATA"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>  
        <label>楼栋：</label>
        <el-select v-model="BUILDINGNAMEValue" placeholder="请选择" @change="changeSelect">
          <el-option
            v-for="item in BUILDINGNAMEDATA"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>  
        <label>业态：</label>
        <el-select v-model="PRODUCTTYPENAMEValue" placeholder="请选择" @change="changeSelect">
          <el-option
            v-for="item in PRODUCTTYPENAMEDATA"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>          
      </div>
      <el-table
        :data="showData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="GROUPNAME"
          min-width="80"
          label="组团"
          >
        </el-table-column>
        <el-table-column
          prop="BATCHNAME"
          min-width="80"
          label="批次">
        </el-table-column>
        <el-table-column
          prop="BUILDINGNAME"
          min-width="80"
          label="楼栋">
        </el-table-column>
        <el-table-column
          prop="PRODUCTTYPENAME"
          min-width="130"
          label="业态">
        </el-table-column>
        <el-table-column
          prop="TOTALAREA"
          label="可售面积（㎡）"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="TOTALPRICE"
          label="可售货值（万元）"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="PALNDATE"
          label="计划首开预售许可证时间"
          min-width="140">
            <template slot-scope="scope">
              {{ scope.row.PALNDATE ? scope.row.PALNDATE : '无'}}
            </template>
        </el-table-column>
        <el-table-column
          prop="SUPPLY_DATE"
          label="设置供货日期"
          min-width="140">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.SUPPLY_DATE"
              size="large"
              type="date"
              :disabled="scope.row.ISMY === 0 ? false : true"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>              
          </template>  
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="medium">取 消</el-button>
        <el-button type="primary" @click="save" size="medium">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import SupplyTable from './supply-table'
  import { message, fetchUtils } from '@/utils'
  export default {
    name: "Supply",
    data: function () {
      return {
        dialogVisible: false,
        title1: "预算版",
        title2: "动态实施版",
        stageId: "",    //当前分期ID
        activeData: {
          dataSource: [],
          headerData: []
        },
        preData: {
          dataSource: [],
          headerData: []
        },
        supplyStatus: "-10",  //
        preVersionId: '',   //预算版当前的id
        versionId: '',      //当前动态实施版本的id
        versionData: [],    //当前预算版的所有版本
        GROUPNAMEValue: 0,
        GROUPNAMEDATA: [],
        GROUPNAME: new Set(),
        BATCHNAMEValue: 0,
        BATCHNAMEDATA: [],
        BATCHNAME: new Set(),
        BUILDINGNAMEValue: 0,
        BUILDINGNAMEDATA: [],
        BUILDINGNAME: new Set(),
        PRODUCTTYPENAMEValue: 0,
        PRODUCTTYPENAMEDATA: [],
        PRODUCTTYPENAME: new Set(),
        tableData: [],      // 真正的数据
        showData: [],    // 显示的可筛选的数据
        showDatakey: [], //存储筛选过后的tableData当中的key值
        moduleCode: '1',
        approvalState: false
      };
    },
    computed: {
      commonPathRoleAuthority(){
          return this.$store.state.common.commonPathRoleAuthority
      }
    }, 
    methods: {
      startApproval(){
        //发起审批
        const _data = {
          //entiId: len>=1 && this.projectVersionData[len-1]["versionStatus"] == "99" && "10102" || "10101",
          entiId: '10107',
          dataKey: this.versionId
        };
        this.$store.dispatch("commonStartApproval", _data)
          .then(res => {
            message.success("提交审批成功");
            this.getInitData(true);
          }).catch(err => {
            message.error(err);
          })        
      },
      save(){
        //将筛选后 对操作数据的更改修改到 对应的tableData上
        const selectDate = this.showData.map( item => {
          return item['SUPPLY_DATE'];
        });
        this.showDatakey.forEach( item => {
          this.tableData[item]['SUPPLY_DATE'] = selectDate.splice(0, 1)[0];
        });          
        //保存
        const data = {
          STAGEVERSIONID: this.stageId,
          SupplyVERSIONID: this.versionId,
          SupplyStatus: this.supplyStatus,
          DataSource: this.tableData
        };
        fetchUtils.post('/Supply/ISaveInfo', {paramsData: JSON.stringify(data)})
          .then( res => {
            if( res.message && res.message === '成功' ){
              message.success('保存成功！');
            }
            this.handleClose();
            this.getInitData(true);
            this.approvalState = true;
          }).catch( err => {
            message.error(err);
          })
      },
      handleClose(){
        //关闭dialog时候清空数据
        this.tableData = [];
        this.showData = [];
        this.showDatakey = [];
        const _arr = ['GROUPNAME', 'BATCHNAME', 'BUILDINGNAME', 'PRODUCTTYPENAME'];
        _arr.forEach( item => {
          this[item + 'Value'] = 0;
          this[item + 'DATA'] = [];
          this[item] = new Set();
        })
        this.dialogVisible = false;
      },
      getSelectData(data){
        //筛选数据内对应的 组团 楼栋 批次 业态 放置对应的下拉框内
        const _arr = ['GROUPNAME', 'BATCHNAME', 'BUILDINGNAME', 'PRODUCTTYPENAME'];
        const _arrName = ['全部组团', '全部批次', '全部楼栋', '全部业态'];
        _arr.forEach( (item, index) => {
          this[item].add(_arrName[index]);
        });// 循环添加初始数据
        data.forEach( item => {
          for( const key in item ){
            if( _arr.indexOf(key) > -1 ){
              if( item[key] ){
                this[key].add(item[key]);
              }
            }
          }
        });
        _arr.forEach( item => {
          let i = 0;
          for( const key of this[item] ){
            var obj = {
              label: key,
              value: i++
            };
            this[item + 'DATA'].push(obj);
          }
        })
      },
      openDialog(){
        this.dialogVisible = true;
        fetchUtils.post('/Supply/IGetSupplySelectList', {stageId: this.stageId})
          .then( res => { 
            this.tableData = JSON.parse(JSON.stringify(res.rows));
            this.showData = JSON.parse(JSON.stringify(res.rows));
            this.showDatakey = Object.keys( Array.from({length: res.rows.length}) ) ;
            this.getSelectData(res.rows);
          })  
      },
      changeVersion(id){
        this.preVersionId = id;
        this.preData = {
          dataSource: [],
          headerData: []
        };
        this.getPreData()
      },
      changeSelect(){
        //将当前对应的showData内的date赋值给tableData
        this.showData.forEach( (item, index) => {
          this.tableData[this.showDatakey[index]]['SUPPLY_DATE'] = item['SUPPLY_DATE'];
        });
        //value 是 对应的data的键 
        this.showDatakey = [];
        const _arr = ['GROUPNAME', 'BATCHNAME', 'BUILDINGNAME', 'PRODUCTTYPENAME'];
        const _endSelectValue = []; //取出当前所选项
        _arr.forEach( item => {
          let _res = this[item + 'DATA'].filter( list => {
            return list['value'] === this[item + 'Value'];
          });
          _endSelectValue.push( 
            {
              value: _res[0]['label'],
              label: item
            }
          );
        });
        // 全部按钮转换为空
        const _endRes = _endSelectValue.map( item => {
          if( item['value'].indexOf('全部') > -1){
            item['value'] = "";
          }
          return item;
        })  
        //对tableData 做筛选
        const endTable = this.tableData.filter( (item, index) => {
          let bool = true;
          for( let i=0, len=_endRes.length; i<len; i++ ){
            if( _endRes[i]['value'] !== "" ){
              if( item[_endRes[i]['label']] !== _endRes[i]['value'] ){
                //判断不相等 过滤此条数据
                bool = false;
                break;
              }
            }
          };
          if (bool) {
            // 添加此条筛选后的数据
            this.showDatakey.push(index);
            return item;
          }
        });
        this.showData = endTable;
      },
      getInitData(bool){
        if (bool) {
          this.activeData = {
            dataSource: [],
            headerData: []
          };
          this.preData = {
            dataSource: [],
            headerData: []
          };
        }
        //获得基本信息
        const stageId = this.stageId;
        fetchUtils.post('/Supply/IGetSupplyBaseInfo', {stageId})
          .then( res => {
            if( !!res.rows.Error ){
              return Promise.reject({msg: res.rows.Error});
            }
            this.versionId = res.rows.ID;
            this.supplyStatus = res.rows.SupplyStatus;
            if( res.rows.VersionList && res.rows.VersionList.length !== 0 ){
              this.preVersionId = res.rows.VersionList[0]['versionId'];
              this.versionData = res.rows.VersionList;
              this.getPreData();
            }
            return fetchUtils.post('/Supply/IGetSupplyTreeDY', {stageId, supplyVersionid: this.versionId,  supplyStatus: this.supplyStatus});
          }).then( res => {
            this.moduleCode = res.rows['dataSource'][0] && res.rows['dataSource'][0]['MODULE_CODE'] || '-300';
            this.activeData = res.rows;
          }).catch( err => {
            if( typeof err === 'object' ){
              return message.error(err.msg);
            }
            message.error(err);
          });
      },
      getPreData(){
        const stageId = this.stageId;
        const supplyVersionid = this.preVersionId;
        fetchUtils.post('/Supply/IGetSupplyTreeYS', {stageId, supplyVersionid})
          .then( res => {
            this.preData = res.rows;
          }).catch( err => {
            console.log(err);
          })
      },
    },
    components: {
      SupplyTable
    },
    created(){
      this.stageId = this.$route.query.nodeId;
      this.getInitData();
    }
  }
</script>

<style lang="less" rel="stylesheet/less" >
  .supply {
    height: 100%;
    margin-top: 60px;
  }
  .supply .approval-state {
    font-size: 12px;
  }
  .supply .input_style {
    input {
      border-radius: 5px;
      font-size: 12px;
      padding: 4px 0;
      padding-left: 4px;
    }
  }
  .supply .el-input__inner {
    font-size: 14px;
  }
  .supply .active-container h2 {
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom: 2px solid #f9f9f9;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 10px;
    font-weight: normal;
    .title {
      border-bottom: 2px solid dodgerblue;
      display: block;
      text-align: center;
    }
  }
  .supply .active-container .version {
    font-size: 12px;
    color: #409EFF;
  }
  .supply .active-container .supply-container {
    width: 98%;
    margin-top:10px;
  }
  .supply .active-container {
    margin-top: 20px;
  }
  .supply .active-container .dialog-title {
    width: 1000px;
  }
  .supply .active-container .span-title {
    display: inline-block;
    padding: 0 6px;
  }
  .supply .select-container {
    margin-bottom: 30px;
    & > label {
      margin-left: 20px;
    }
    & > label:first-child {
      margin-left: 0;
    }
  }
  .supply .select-container .el-input__inner {
    padding: 4px 35px 4px 10px;
  }
  .supply .dialog-container th .cell, .supply .active-container th .cell {
    color: #2c3e50 !important;
    line-height: 30px !important;
    font-size: 14px !important;
    font-weight: normal !important;
    white-space: normal;
    text-overflow: visible;
  }
  .supply .dialog-container td .cell {
    line-height: 24px !important;
  }
  .supply .dialog-container th {
    background: #f5f7fa
  }
  .supply .el-table  .no_expand td  {
    border-bottom: none !important;
  }
  .supply .button-container > span {
    font-size: 12px;
  }
</style>
