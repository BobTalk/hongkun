<template>
  <div id="app" v-loading.fullscreen="globalLoading" element-loading-background="rgba(0, 0, 0, 0.3)">
    <div v-show="commonImageStatus" class="iframe-wrapper">
      <iframe id="imageframe" width="100%" height="100%" border="none" :src="commonIframeUrl" frameborder="0"
              style="position: relative;z-index: 999"></iframe>
    </div>
    <!--登录视图-->
    <div v-if="viewName=='login'" class="collagen bk">
      <router-view/>
    </div>
    <!--非登录视图-->
    <div class="main top" v-else>
      <el-row>
        <el-col>
          <div>
            <TopMenu></TopMenu>
          </div>
        </el-col>
      </el-row>
      <!--包含左侧树的视图-->
      <div class="clear" id="box" style="width: 100%;height:100%;" v-if="viewName=='hasLeftTree'">
        <div class="fl collagen fl-tree" style="border: 1px solid #ebeff2;">
          <LeftTree/>
        </div>
        <div class="content fr">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </div>
      <!--不包含左侧树的视图-->
        <div class="clear" style="width: 100%;height: calc(100% - 120px); overflow-y: auto;"
             v-if="viewName=='noLeftTree'">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import {LeftTree, TopMenu} from './components';

  var imageTimer;
  export default {
    name: 'App',
    data: function () {
      return {}
    },
    components: {
      LeftTree,
      TopMenu,
    },
    computed: {
      ...mapGetters([
        'globalLoading',
        'commonImageStatus',
        'stageImageStatus',
        'commonIframeUrl'
      ]),
      viewName() {
        // if (this.commonImageStatus) {
        //   return "image";
        // }
        const path = this.$route.path;
        if (/^\/login/i.test(path)) {
          //登录视图
          return "login";
        } else if (/^\/(project|stage|company|group|projectAdd)/i.test(path) && path != '/stage/assessment' && path != '/stage/rate') {
          //有左侧树的视图
          return "hasLeftTree";
        } else {
          //没有左侧树的视图
          return "noLeftTree";
        }
      },
    },
    methods: {
      ...mapActions(['commonSetImageStatus']),
      reLoadPicture(){
        const path = this.$route.path;
        const pathOn = {
          "/project": {
            typeinfo: '1',
            versionId: sessionStorage.getItem('projectVersionId')
          },
          "/stage/info": {
            typeinfo: '2',
            versionId: this.$store.state.fenqi.stageCurrentVersion
          }
        }
        this.$store.commit('SET_IFRAME_URL', {
          typeinfo: pathOn[path]['typeinfo'],
          versionId: pathOn[path]['versionId']
        });
      },
      getRoleAuthroity(){
        //用户权限按钮设置
        const path = this.$route.name;
        const filterPath = {
          'company': 'company',
          'project': 'project',
          'stageInfo': 'stage',
          'area': 'area',
          'price': 'price',
          'supply': 'supply',
          'sign': 'sign',
          'payment': 'back',
          'cost': 'pay',
          'rate':'rate'
        };
        if (!filterPath[path]) return;
        this.$store.dispatch("commonChangeRoleAuthority", filterPath[path]);
      }
    },
    created(){
      this.getRoleAuthroity()
    },
    mounted() {
      //监听message
      window.addEventListener('message', ({data}) => {
        if (data == 'image=back') {
          this.commonSetImageStatus({status: false});
          this.reLoadPicture();
        }
      })
    },
    watch: {
      '$route': 'getRoleAuthroity'
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  body {
    width: 100%;
    height: 100%;
  }

  #app {
    /* font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #box {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .top {
    height: 100%;
  }

  .iframe-wrapper {
    height: 100%;
  }

  .content {
    width: calc(100% - 240px);
    background: #fff;
    padding: 0 20px;
    box-sizing: border-box;
    overflow: auto;
    height: 86%;
    //overflow-x: hidden;
  }

  .el-col {
    height: 100%;
  }

  .bk {
    background-color: #094C8D;
  }

  .fl-tree {
    height: 100%;
    width: 240px;
    overflow: hidden;
    float: left;
    /*display: inline;*/
    /*    background-image: url(./public/images/index_02.jpg);
        background-repeat: repeat-y;*/
  }

  .el-textarea__inner {
    border-radius: 0px;
  }

  .tabs .el-table th {
    background: #f5f5f5;
    text-align: center;
    height: 20px;
    padding: 10px 8px;
    color: #5b5b5b;
    font-size: 14px;
  }

  .el-table thead.is-group th {
    background: #f5f7fa;
    padding-top: 0;
    padding-bottom: 0;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #000;
  }

  .el-form-item__label {
    font-size: 12px;
  }

  .el-input__inner {
    border-radius: 0;
    font-size: 12px !important;
  }

  .el-dialog__body {
    padding: 16px;
  }

  .el-dialog__header {
    padding: 13px 16px;
    border-bottom: 1px solid #e9e9e9;
    text-align: left;
  }

  .el-dialog__title {
    font-size: 14px;
    font-weight: 700;
  }

  .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    height: 50px;
    padding: 5px 16px 5px;
  }

  .dialog-footer {
    float: right;
  }

  .el-table th, .el-table tr {
    padding: 10px 8px;
    text-align: center;
  }

  .el-steps--simple {
    padding: 0px 2%;
    border-radius: 0;
  }

  .el-step.is-simple .el-step__title {
    font-size: 12px;
    line-height: 30px;
  }

  .el-step__title:hover {
    cursor: pointer;
  }

  .el-input {
    outline: none !important;
    border: none !important;
    width: auto !important;
    height: 100% !important;
  }

  .el-input input:focus {
    border: 1px solid #c0c4cc !important;
    appearance: none;
  }

  #formItem {
    .el-input__inner {
      height: 30px !important;
    }
    .el-form-item {
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
    }
  }

  #mt10 {
    margin-top: 10px !important;
  }

  #stageProjectTartTable {
    .el-table__row {
      padding: 0 0 0 0 !important;
      td {
        margin: 0 !important;
      }
    }
    .el-table__row:first-child .el-input__inner {

    }
    .el-table__row {
      .el-table_7_column_37 {
        .el-input__inner {
          text-align: left !important;
        }
      }
    }
  }

  .el-table {
    .cell {
      padding-left: 0 !important;
      padding-right: 0 !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  #caozuo {
    .el-input__inner {
      height: 25px !important;
    }
  }

  #gridContent {
    .el-input__inner, .el-button {
      height: 30px !important;
    }
    .el-button--mini {
      padding: 5px 15px;
    }
  }

  .el-input__inner {
    height: 100% !important;
    padding-left: 10px;
    box-sizing: border-box;
  }

  .el-form-item {
    margin-bottom: 0 !important;
  }

  .el-icon-date {
    line-height: 25px !important;
  }

  #area_dialog {
    .el-table th {
      padding: 0px !important;
    }
    /* .el-select {
       padding: 3px !important;
     }*/
    .el-button {
      padding: 5px 10px !important;
    }
  }

  #pane-first {

  }

  #targetStage {
    .el-input__inner {
      border: none !important;
      padding: 0 !important;
      font-size: 13px !important;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: none !important;
    }
    .el-icon-circle-close {
      line-height: 25px !important;
    }
  }

  #ytmjtz {
    .el-table td, .el-table th {
      padding: 3px !important;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: none !important;
    }
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }

  .el-table td, .el-table th {
    padding: 0;
  }

  .el-button {
    padding: 6px 10px !important;
  }

  .el-input.is-disabled .el-input__inner {
    color: #2c3e50 !important;
  }

  #programBox {
    .el-input.is-disabled .el-input__inner {
      color: #2c3e50 !important;
      text-align: right !important;
    }
  }

  .el-input-number {
    width: 100% !important;
    height: 100% !important;
  }

  #operateBox {
    text-align: center !important;
    .el-input__inner {
      border: none !important;
    }
  }

  #programBox {
    .el-input-number {
      line-height: normal !important;
    }
  }

  .el-icon-circle-close:before {
    content: "" !important;
  }

  input, textarea, select, button {
    font-style: normal !important;
    font-family: "\5FAE\8F6F\96C5\9ED1", Helvetica, sans-serif !important;
    font-weight: normal !important;
    font-size: 12px;
  }

  /*tab默认样式*/
  .el-tabs__content {
    overflow: visible !important;
  }
  body {
    font-size: 14px !important;
  }
  .el-table__fixed, .el-table__fixed-right {
    box-shadow: none !important;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{-moz-appearance:textfield;}

  .version_width {
    width:145px !important;
  }
</style>

