<template>
  <div class="area-upversion">
    <h2 v-if="isDelete" class="del_container">当前版本已被删除</h2>
    <div v-else>
      <div class="crumbs">
        <ul>
          <li v-for="(item, index) in IGetStep" :key="'area' + index" :class="{active: item.guid == step}" :style="{zIndex: IGetStep.length-index}">
            <span :class="item.className"></span>
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="btn_container">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="整体指标" name="first">
            <el-row class="land_total">
                <el-col  v-for="(item, index) in IGetAreaPlanInfo" :xs="12" :sm="item['colspan'] == 0 ? 8 : item['colspan']*2" :md="item['colspan'] == 0 ? 8 : item['colspan']*2" :lg="item['colspan'] == 0 ? 8 : item['colspan']*2" :key="'land' + index" class="grid-content">
                    <div class="land_total_item">
                        <label><span v-if="item.edit =='+w'" class="area_require">*</span>{{item.label}} {{item.unit ? `(${item.unit})` : "" }}：</label>
                        <el-input class="land_total_item_i"
                            disabled
                            :value="item.val">
                        </el-input>
                    </div>
                </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="按楼栋" name="seconds" v-if="stepType !== 'Vote'">
            <div class="land_total">
              <div class="table_container">
                <el-table :data="IGetAreaListInfo.areadataInfo"  :row-class-name="changeRowName" max-height="500" border style="width: 100%" align="center">
                  <el-table-column
                    v-for="(title,index) in IGetAreaListInfo.titleInfo"
                    :fixed="index===0"
                    :align="index===0 ? 'left' : 'center'"
                    :key="'area'+index"
                    :label="title.name"
                    :prop="title.field ? title.field : ''"
                    min-width="200"
                    >
                    <el-table-column
                      v-for="(item, keys) in title.children"
                      :key="item.field +keys"
                      :label="item.name"
                      :prop="item.field ? item.field : ''"
                      min-width="160"
                    >
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="业态查看" name="thirds">
            <div class="land_total">
              <div class="table_container">
                <el-table :data="IGetAreaListInfo.areadataInfo" max-height="500" stripe border style="width: 100%" align="center">
                  <el-table-column
                    v-for="(title,index) in IGetAreaListInfo.titleInfo"
                    :fixed="index===0"
                    :align="index===0 ? 'left' : 'center'"
                    :key="'area'+index"
                    :label="title.name"
                    :prop="title.field ? title.field : ''"
                    min-width="200"
                    >
                    <el-table-column
                      v-for="(item, keys) in title.children"
                      :key="item.field +keys"
                      :label="item.name"
                      :prop="item.field ? item.field : ''"
                      min-width="160"
                    >
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
import {message, fetchUtils} from '../../utils';
export default {
  data() {
    return {
      step: 1,
      activeName: "first",
      stageVersionId: "",
      searchContent: '',
      newDataInfo: [],
      stepType: "Vote",
      dataType: "Area",
      projectLevel: "Stage",
      descType: "ProductType",
      IGetStep: [],
      IGetAreaPlanInfo: [],
      IGetAreaListInfo: {},
      IGetSearchInfo: {},
      isDelete: false,
    };
  },
  methods: {
    changeRowName(row, key){
      if( row['row']['PARENTID'] === '0' ){
        return "building-first-row"
      }else{
        return "building-row"
      }
    },
    handleClick(tab) {
      if( tab.name === "first" ) return;
      const tabConfig = {
        seconds: "Building",
        thirds: "ProductType"
      }
      this.descType = tabConfig[tab.name];
      this.getPlanData();
    },
    getInitData(){
      const versionId = this.$route.query.dataKey;
      this.stageVersionId = versionId;
      fetchUtils.post("/Common/IGetVersionInfoByID", {
        id: versionId
      }).then( res => {
        if( res.rows == null ){
          return Promise.reject({isDelete: true});
        };
        this.step = res.rows['STEP'];
        if( res.rows['STEP'] > 1){
          this.projectLevel = "Building";
        }
        return fetchUtils.post("/COMMON/IGetStepByVersionID", {stepType: 'area', versionId});
      }).then( res => {
          this.IGetStep = res;
          const _res = res.filter( item => {
            return item['guid'] == this.step;
          })
          this.stepType = _res[0]['code'];
          this.getLandData();
      }).catch( err => {
        if( typeof err == 'object' && err.isDelete ){
          return this.isDelete = true;
        }
        message.error(err);
      });
    },
    getLandData(){
      fetchUtils.post("/AreaInfo/IGetAreaPlanInfo", {
        step: this.stepType,
        versionId: this.stageVersionId,
        dataType: this.dataType
      }).then( res => {
        this.IGetAreaPlanInfo = res.rows;
      })
    },
    getPlanData(){
      this.IGetAreaListInfo = {};
      fetchUtils.post("/AreaInfo/IGetAreaListInfo", {
        step: this.stepType,
        projectLevel: this.projectLevel,
        versionId: this.stageVersionId,
        descType: this.descType
      }).then( res => {
        this.IGetAreaListInfo = this.transfomTableData(res.rows);
      })
    },
    transfomTableData(data){
      //转换业态表体数据顺序
      const titleInfo = data.titleInfo;
      const tableData = data.areadataInfo;
      if( tableData.length === 0 ) return data;
      //取出表头数据
      let tableTitleField = [];
      titleInfo.forEach( item => {
        if( item.children == null ){
          tableTitleField.push(item.field);
        }else{
          const _field = item.children.map( list => {
            return list['field'];
          });
          tableTitleField = tableTitleField.concat(_field);
        }
      });
      //取出对应的表体里面数据
      let areadataInfo = tableData.map( () => {
        return {};
      });
      tableTitleField.forEach( id => {
        tableData.forEach( (dataList, index) => {
          for( let key in dataList ){
            if( id === key){
              areadataInfo[index][id] = dataList[id];
            }
          };
          areadataInfo[index]['PARENTID'] = dataList['PARENTID'];
        });
      })
      return { titleInfo, areadataInfo };
    }
  },
  created(){
    this.getInitData();
  }
};
</script>

<style lang="less" rel="stylesheet/less">
.area-upversion .el-table thead tr th {
  color: #555;
  font-size: 14px;
  font-weight: normal;
  background: #f5f7fa;
  padding: 2px 0;
}
.area-upversion .el-table tbody tr td {
  color: #777;
}
.area-upversion tr td:first-child .cell {
  padding-left: 8px !important;
}
.area-upversion .crumbs {
  margin-left: -4px;
}
.area-upversion .crumbs ul li {
  position: relative;
  top: 0;
  left: 0;
  display: inline-block;
  margin-left: 5px;
  color: #333;
  margin-right: 0;
  height: 30px;
  min-width: 95px;
  text-align: left;
  padding-left: 20px;
  padding-right: 10px;
  line-height: 30px;
  color: #fff;
  font-size: 12px;
  background: #4c72a4;
  cursor: pointer;
}
.area-upversion .crumbs ul li span {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: #ccc solid 1px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
  margin-top: -4px;
  background: #fff;
}
.area-upversion .legend-white {
  background: #fff !important;
}
.area-upversion .legend-blue {
  background: #2979ff !important;
}
.area-upversion .legend-yellow {
  background: #FFFF00 !important;
}
.area-upversion .legend-green {
  background: #00e676 !important;
}
.area-upversion .crumbs ul li:nth-child(n)::after {
  position: absolute;
  top: 0;
  right: -14px;
  z-index: 20;
  content: "";
  border-left: #4c72a4 solid 15px;
  border-bottom: transparent solid 15px;
  border-top: transparent solid 15px;
}
.area-upversion .crumbs ul li:nth-child(n + 2)::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0px;
  z-index: 20;
  border-left: #fff solid 15px;
  border-bottom: transparent solid 15px;
  border-top: transparent solid 15px;
}
.area-upversion .crumbs ul li:hover {
  background: #f1a118;
}
.area-upversion .crumbs ul li:hover:after {
  border-left-color: #f1a118;
}
.area-upversion .crumbs ul li.active::after {
  border-left-color: #f1a118;
}
.area-upversion .crumbs ul li.active {
  background: #f1a118;
}
.area-upversion .btn_container {
  margin: 20px 0;
}
.area-upversion .grid-content {
  min-height: 40px;
  padding: 0 10px;
}
.area-upversion .land_total, .area-upversion .land_item {
  border: 1px solid #e5e5e5;
  border-top: none;
  background: #fefefe;
  padding: 20px 0;
  margin-top: -14px;
  position: relative;
}
.area-upversion .land_total_item {
  display: flex;
  align-items: center;
  justify-content: center;
  & > label {
    flex: 0 0 180px;
    text-align: right;
    margin-right: 4px;
  }
  & > .land_total_item_i {
    flex: 1;
  }
  & > span {
    flex: 0 0 30px;
    text-align: left;
    margin-left: 4px;
  }
  & > .land_total_item_i input {
    padding: 4px;
  }
}
.area-upversion .land_total_item.flex-left {
  justify-content: flex-start;
}
.area-upversion .search_title {
  color: #606266;
  margin: 0 0 20px 20px;
   font-size: 14px;
  & > label {
    line-height: 20px;
  }
  & > input {
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    line-height: 1;
    margin: 0 6px;
    height: 26px;
  }
  & > input:focus {
    border: 1px solid #409EFF;
    transition: all .5s;
  }
  & > button {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 15px;
    height: 28px;
    line-height: 1;
    background: none;
    outline: none;
    cursor: pointer;
  }
  & > button:hover {
    color: #409EFF;
    border: 1px solid #409EFF;
    transition: all .5s;
  }
}
.area-upversion .table_container {
  margin: 0 16px;
}
.area-upversion .building-first-row {
  background: #ecf5ff;
}
.area-upversion .del_container {
  font-size: 16px;
  text-align: center;
  color: #333;
  font-weight: normal;
  margin-top: 40px;
}
.area-upversion .area_require {
  color: #F56C6C;
}
</style>

