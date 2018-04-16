<template>
  <div class="price-upversion">
    <h2 v-if="isDelete" class="del_container">当前版本已被删除</h2>
    <div v-else>
      <div class="crumbs">
        <ul>
          <li v-for="(item, index) in IGetStep" :key="'price' + index" :class="{active: index+1 == step}" :style="{zIndex: IGetStep.length-index}">
            <span :class="item.className"></span>
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="btn_container">
        <el-table v-if="step === 1" :data="rowUnVoteData" max-height="500" border style="width: 100%" align="center">
          <el-table-column
            v-for="(title,index) in title"
            :fixed="index===0"
            :key="'price'+index"
            :label="title.name"
            :prop="title.field"
            min-width="200"
            >
          </el-table-column>          
        </el-table>
        <div class="table_container" v-if="step > 1">
          <el-table :data="rowUnVoteData"  :row-class-name="changeRowName" max-height="500" border style="width: 100%" align="center">
            <el-table-column
              v-for="(title,index) in title"
              :fixed="index===0"
              :key="'price'+index"
              :label="title.name"
              :prop="title.field"
              min-width="200"
              >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {message, fetchUtils} from '../../utils';
export default {
  data() {
    return {
      step: 0,
      stageVersionId: "",
      IGetStep: [],
      title: [],
      rowUnVoteData: [],
      isDelete: false,
    };
  },
  methods: {
    changeRowName(row, key){
      if( row['row']['LEVELS'] == 1 ){
        return "building-first-row"
      }else{
        return "building-row"
      }
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
        return fetchUtils.post("/COMMON/IGetStepByVersionID", {stepType: 'price', versionId});
      }).then( res => {
          this.IGetStep = res;
          this.getData();
      }).catch( err => {
        if( typeof err == 'object' && err.isDelete ){
          return this.isDelete = true;
        }
        message.error(err);
      });
    },
    getData(){
      fetchUtils.post("/Price/IGetPriceList", {
        priceVersionId: this.stageVersionId,
      }).then( res => {
        console.log(res);
        //this.title = res.rows.title;
        this.step = res.rows.step;
        const _endTitle = res.rows.title.filter( item => {
          return item['field'] !== 'KEY' && item['field'] !== 'GROUPID' && item['field'] !== 'BATCHID'
        })
        this.title = _endTitle;
        if( res.rows.step > 1 ){
          this.rowUnVoteData = res.rows.rowUnVoteData || [];
        }else{
          //step 1 的时候取rowVoteData里面的数据
          this.rowUnVoteData = res.rows.rowVoteData || [];
        }
      })
    },
  },
  created(){
    this.getInitData();
  }
};
</script>

<style lang="less" rel="stylesheet/less">
.price-upversion .el-table thead tr th {
  color: #555;
  font-size: 14px;
  font-weight: normal;
  background: #f5f7fa;
  padding: 8px 0;
}
.price-upversion .el-table tbody tr td {
  padding: 2px 0;
  color: #777 !important;
}
.price-upversion tr td:first-child .cell {
  padding-left: 8px !important;
}
.price-upversion .crumbs {
  margin-left: -4px;
}
.price-upversion .crumbs ul li {
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
.price-upversion .crumbs ul li span {
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
.price-upversion .legend-white {
  background: #fff !important;
}
.price-upversion .legend-blue {
  background: #2979ff !important;
}
.price-upversion .legend-yellow {
  background: #FFFF00 !important;
}
.price-upversion .legend-green {
  background: #00e676 !important;
}
.price-upversion .crumbs ul li:nth-child(n)::after {
  position: absolute;
  top: 0;
  right: -14px;
  z-index: 20;
  content: "";
  border-left: #4c72a4 solid 15px;
  border-bottom: transparent solid 15px;
  border-top: transparent solid 15px;
}
.price-upversion .crumbs ul li:nth-child(n + 2)::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0px;
  z-index: 20;
  border-left: #fff solid 15px;
  border-bottom: transparent solid 15px;
  border-top: transparent solid 15px;
}
.price-upversion .crumbs ul li:hover {
  background: #f1a118;
}
.price-upversion .crumbs ul li:hover:after {
  border-left-color: #f1a118;
}
.price-upversion .crumbs ul li.active::after {
  border-left-color: #f1a118;
}
.price-upversion .crumbs ul li.active {
  background: #f1a118;
}
.price-upversion .btn_container {
  margin: 20px 0;
}

.price-upversion .table_container {
  margin: 0 auto;
}
.price-upversion .building-first-row {
  background: #ecf5ff;
  td:first-child {
    text-align: left;
    margin-left: 4px;
  }
}
.price-upversion .del_container {
  font-size: 16px;
  text-align: center;
  color: #333;
  font-weight: normal;
  margin-top: 40px;
}
</style>

