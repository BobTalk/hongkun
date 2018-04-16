<template>
  <div class="TopNav clear">
    <div class="header clear">
      <div class="fl">
        <div class="logo fl">
          <img :src="img.src" alt="logo" title="鸿坤集团">
        </div>
        <div class="xtName fl">鸿坤地产运营管理平台—项目门户系统</div>
      </div>
      <div class="header-nav fl">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="rgba(60, 115, 227, 1)"
          text-color="#fff"
          :default-active="nowIndex"
          active-text-color="#fff">
          <el-menu-item
            v-for="(item, index) in navData"
            v-if="!item['Child'].length"
            :key="'top'+index"
            :index="item['Url']">
            <i :class="{'el-icon-menu': index==0,  'el-icon-tickets': index==1, }" style="font-size: 20px;"></i>{{item['Title']}}
          </el-menu-item>
          <el-submenu
            v-for="(item, index) in navData"
            :key="'subtop' + index"
            v-if="item['Child'].length > 0"
            :index="item['Url']">
              <template slot="title"><i :class="{'el-icon-goods': index==2, 'el-icon-edit-outline': index==3}" style="font-size: 20px;"></i>{{item['Title']}}</template>
              <el-menu-item
                v-for="(subItem, subIndex) in item['Child']"
                :key="'subIndex' + subIndex"
                :index="subItem['Url']"
                >
                {{subItem['Title']}}&ensp;{{subItem['Url'] == '/workflow/todo' ? getTodoNumber : ''}}{{subItem['Url'] == '/workflow/history' ? getHistoryNumber : ''}}
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="userLogin fr">
        <Quit/>
      </div>
    </div>
  </div>
</template>

<script>
  import Quit from '../components/quit.vue';
  import fetchUtils from "@/config/app-config.js"
  import './top-menu.less'
  import { mapGetters, mapActions } from 'vuex';
  export default {
    name: "TopMenu",
    data() {
      return {
        img: {src: require("../public/images/logo-2.png")},
        navData: [],
        nowIndex: '/workflow/todo'
      };
    },
    components: {
      Quit
    },
    computed: {
      getTodoNumber(){
        return this.$store.state.common.workNumber[0]["Value"];
      },
      getHistoryNumber(){
        return this.$store.state.common.workNumber[1]["Value"];
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        const pathConfig = {
          '/project': '/project',
          '/workflow/todo': '/workflow/todo',
          '/workflow/history': '/workflow/history',
          '/role': '/role',
          '/currency': '/currency',
          '/manage': '/manage',
          '/stage/team': '/stage/team',
          '/group': '/group',
          '/report': '/report',
          '/assess': '/stage/assessment',
          '/rate': '/stage/rate',
        }
        const path = pathConfig[key];
        const token = localStorage.getItem('token')
        if( path ){
          switch(path){
            case '/role':
              window.open(fetchUtils.menu+'/Common/MenuAct/?token='+token+'&What=/VIEW/SystemManager/JobAuthorize.html?LoginStr={0}');
              break;
            case '/currency':
              window.open(fetchUtils.menu+'/Common/MenuAct/?token='+token+'&What=/VIEW/SystemManager/Commonjobs.html?LoginStr={0}');
              break;
            case '/manage':
              window.open(fetchUtils.menu+'/Common/MenuAct/?token='+token+'&What=/VIEW/SystemManager/Systemmenus.html?LoginStr={0}');
              break;
            default:
              this.$router.push({path: pathConfig[key]});
              if( path === '/group' ) {
                this.$store.dispatch('commonGetTreeData');
              }
          }
        }
      },
      role(){
        let token = localStorage.getItem('token')
        window.open(fetchUtils.menu+'/Common/MenuAct/?token='+token+'&What=/VIEW/SystemManager/JobAuthorize.html?LoginStr={0}')
          },
      currency(){
        let token = localStorage.getItem('token')
        window.open(fetchUtils.menu+'/Common/MenuAct/?token='+token+'&What=/VIEW/SystemManager/Commonjobs.html?LoginStr={0}')
      },
      manage(){
        let token = localStorage.getItem('token')
        window.open(fetchUtils.menu+'/Common/MenuAct/?token='+token+'&What=/VIEW/SystemManager/Systemmenus.html?LoginStr={0}')
      }
    },
    filters: {
      workFilter(val, type){
        const res = val.filter( item => {
          return item["Key"] = type;
        });
        return res[0].Value;
      }
    },
    created(){
      //获取工作流数据
      this.$store.dispatch("commonSetWorkNumber");
      let topMenus = localStorage.getItem('topMenus');
      //生成导航列表
      if( topMenus ){
        let topData = JSON.parse(topMenus);
        let topDataFilter = []
        topData.forEach(function (item){
            if(item.Title != '信息填报'){
              topDataFilter.push(item)
            }
        })
        this.navData = topDataFilter
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .header {
    height: 60px;
    width: 100%;
    border-bottom: 1px solid #efd4a5;
    padding: 0 10px;
    background: url(../public/images/backg.png) center;
    box-sizing: border-box;
    vertical-align: middle;
    .logo {
      height: auto;
      width: 126px;
      img {
        margin-top: 7px;
        vertical-align: middle;
      }
    }

    .xtName {
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      color: #fff;
    }
    .el-icon-menu, .el-icon-tickets ,.el-icon-goods, .el-icon-edit-outline{
      color: #c2d5f5;
      vertical-align: text-bottom;
    }
    .userLogin {
      position: relative;
      padding-right: 10px;
      height: 60px;
      line-height: 62px;
      z-index: 99;
      color: #fff;
      .userName {
        position: relative;
        display: inline-block;
        font-size: 14px;
        padding-left: 20px;
        background-image: url(../public/images/userName.png);
        background-repeat: no-repeat;
        background-position: left center;
      }
    }
  }

  .header-nav {
    position: absolute;
    left: 460px;
    width: calc(100% - 400px);
    margin-left: 10px;
  }
</style>
