<template>
  <div v-if="ProjectAreaQuotaData.gridData.length >1" id="projectBox">
    <h2>
      <span class="title">{{target}}</span>
    </h2>
    <el-table :data="ProjectAreaQuotaData.gridData" border style="width: 100%" align="center" max-height="350"
              :highlight-current-row="false">
      <el-table-column
        v-for="(title,index) in ProjectAreaQuotaData.titleInfo"
        :key="'area'+index"
        :label="title.name"
        :prop="title.field ? title.field : ''"
        :fixed="index===0"
        min-width="200"
      >
        <el-table-column
          v-for="(item, keys) in title.children"
          :key="'cl'+keys"
          :label="item.name"
          :prop="item.field"
          min-width="160"
        >
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
  <!--<div v-else class="nodata">    -->
  <!--</div>-->
</template>
<script>
  export default {
    data() {
      return {
        target: "面积指标"
      };
    },
    props: ["ProjectAreaQuotaData"]
  };
</script>
<style lang="less" rel="stylesheet/less" scoped>
  h2 {
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom: 2px solid #F9F9F9;
    margin-top: 10px;
    text-align: left;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 20px;
    .title {
      border-bottom: 2px solid #4478e8;
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

  .projectViewCon {
    width: 50px;
  }

  table tr {
    display: flex;
  }

  table tr td {
    flex: 1;
    text-align: center;
  }

  .projectBox {
    white-space: normal;
    width: 100%;
    .areatitle {
      width: 100%;
      height: 50px;
      border: 1px solid #000;
      td {
        border: 1px solid #000;
        .areatitletow {
          width: 100%;
          td {
            border: 1px solid #000;
          }
        }
      }
    }
  }

  .nodata {
    width: 100%;
    margin: 0 auto;
  }
</style>

