<template>
  <div class="stage-wrapper">
    <div class="stage-module" v-if='$route.name !== "team" && $route.name !== "assessment" && $route.name !== "rate"'>
      <el-menu :default-active="activeIndex" active-text-color="#5786EA" class="el-menu-demo"
               mode="horizontal">
        <el-menu-item v-if="isShowMeun || (menu.index=='1_1')" :index="menu.index" @click="handleClick(menu.Url,menu.index)" v-for="(menu,index) in cardMenu" :key="index">{{menu.Title}}</el-menu-item>
        <!--<el-menu-item index="1_1" @click="handleClick('/stage/info','1_1')">-->
          <!--<i style="width: 4px;height: 4px;border-radius: 50%"></i>分期身份证-->
        <!--</el-menu-item>-->
        <!--<el-menu-item v-if="isShowMeun" index="2_2" @click="handleClick('/stage/area','2_2')">面积管理</el-menu-item>-->
        <!--<el-menu-item v-if="isShowMeun" index="3_3" @click="handleClick('/stage/price','3_3')">价格管理</el-menu-item>-->
        <!--<el-menu-item v-if="isShowMeun" index="4_4" @click="handleClick('/stage/supply','4_4')">供货</el-menu-item>-->
        <!--<el-menu-item v-if="isShowMeun" index="5_5" @click="handleClick('/stage/sign','5_5')">签约</el-menu-item>-->
        <!--<el-menu-item v-if="isShowMeun" index="6_6" @click="handleClick('/stage/payment','6_6')">回款</el-menu-item>-->
        <!--<el-menu-item v-if="isShowMeun" index="7_7" @click="handleClick('/stage/cost','7_7')">成本和支付</el-menu-item>-->
      </el-menu>
    </div>
    <keep-alive style="height: 100%">
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  import "./stage.less";
  import {mapState, mapGetters, mapActions} from 'vuex';
  export default {
    name: "StageWrapper",
    data: function () {
      return {
        src: require("../../public/images/icon1.png"),
        msg: "分期信息外包装",
        cardInfo:JSON.parse(localStorage.getItem('topMenus'))[1].Child
      };
    },
    computed:{
      ...mapGetters(['activeIndex','isShowMeun']),
      cardMenu:function () {
          let cardMenu = this.cardInfo;
        cardMenu.forEach(function (item,index) {
          item.index = (index+1)+'_'+(index+1)
          switch (item.Title){
            case "分期身份证":
              item.Url = "/stage/info"
              break;
            case "面积管理":
              item.Url = "/stage/area"
              break;
            case "价格管理":
              item.Url = "/stage/price"
              break;
            case "供货":
              item.Url = "/stage/supply"
              break;
            case "签约":
              item.Url = "/stage/sign"
              break;
            case "回款":
              item.Url = "/stage/payment"
              break;
            case "成本和支付":
              item.Url = "/stage/cost"
              break;
            default:
          }
        })
          return cardMenu;
      }
    },
    methods: {
      ...mapActions(['initActiveIndex']),
      handleClick(path,index) {
        this.initActiveIndex({index:index})
        const param = this.$route.query || {};
       /* console.log(path);*/
        this.$router.push({
          path,
          query: {...param}
        });
      },
    },

  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  #stageBox {
    width:100%;
    height:100%;
    /*margin-bottom:80px;*/
    .el-menu--horizontal > .el-menu-item.is-active {
      border-bottom: none;
    }
    .el-menu {
      /*border-bottom: 2px solid #F4F6F9 !important;*/
      box-sizing: border-box;
    }
    .el-menu-item {
      list-style-type: disc !important;
      padding-left: 5px;
      margin-left: 20px;
    }
  }

  .stage-wrapper {
    /*width:100%;
    height: 100%;*/
    a, a:link, a:hover {
      position: relative;
      width: 115px;
      font-size: 14px;
      font-weight: 400;
      display: inline-block;
      padding: 5px 5px;
      cursor: pointer;
      color: #181714;
      background-color: #D7D7D7;
      text-align: center;
    }
  }

  .el-icon-arrow-right {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    color: #FFF;
    font-size: 44px;
    font-weight: bold;
  }

  .stage-module {
    text-align: left;
    font-size: 0;
    overflow: hidden;
    position:fixed;
    top:60px;
    background: #fff!important;
    z-index: 99;
    width:79%;
  }

  .el-menu--horizontal>.el-menu-item {
    height: 50px;
    padding: 0;
    margin-right: 40px;
  }
</style>
