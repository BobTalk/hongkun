<template>
  <div><span class="user-name">{{userName}}</span><a href="javascript:;" class="quit" @click.prevent="handleQuit">退出</a>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';

  export default {
    /*属性值*/
    data() {
      return {
        userNameImg: {src: require("../public/images/userName.png")}
      }
    },
    /*组件引用*/
    components: {},
    /*属性值实时计算*/
    computed: {
      ...mapGetters([
        'userInfo',
      ]),
      userName() {
        return this.userInfo.userName || "";
      },
    },
    mounted() {
      this.getUserInfo();
    },
    /*函数体*/
    methods: {
      ...mapActions(['logout', 'getUserInfo']),
      /*退出函数*/
      handleQuit() {
        this.$confirm('您确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.logout();
          this.$router.push({
            path: '/login',
          });
        }).catch(() => {

        });
      }
    },
    // //检测属性变化
    // watch: {
    //   'attr': function (newValue, oldValue) {
    //     console.log('name has changed ', newValue, oldValue);
    //   }
    // },
    // //创建前状态
    // beforeCreate: function () {
    //   console.log("beforeCreate");
    // },
    // /*创建完成*/
    // created: function () {
    //   console.log("created");
    // },
    // /*挂载前*/
    // beforeMount: function () {
    //   console.log("beforeMount");
    // },
    // /*挂载完成*/
    // mounted: function () {
    //   console.log("mounted");
    // },
    // /*更新前*/
    // beforeUpdate: function () {
    //   console.log("beforeUpdate");
    // },
    // //更新完成状态
    // updated: function () {
    //   console.log("updated");
    // },
    // /*组件激活时调用*/
    // activated: function () {
    //   console.log("activated");
    // },
    // /*组件移除时调用*/
    // deactivated: function () {
    //   console.log("deactivated");
    // },
    // /*销毁前*/
    // beforeDestory: function () {
    //   console.log("beforeDestory");
    // },
    // /*销毁完成*/
    // destoryed: function () {
    //   console.log("destoryed");
    // }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .user-name {
    display: inline-block;
    font-size: 13px;
    font-weight: 500;
    background-image: url(../public/images/userName.png);
    background-repeat: no-repeat;
    background-position: left center;
    padding-left: 20px;
  }

  .quit {
    color: #fff;
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
  }
</style>
