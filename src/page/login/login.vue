<template>
  <div class="login">
    <div class="header">
      <div class="logo fl">
        <img :src="img.src" alt="logo" title="鸿坤集团">
      </div>
      <div class="xtName fl">鸿坤集团运营管理平台</div>
    </div>
    <div class="loginSammlBox">
      <h3 class="loginLogo">登录 | Login</h3>
      <div class="form">
        <p><!--账号:--><input type="text" class="userBoxStyle" placeholder="账号..." v-model.trim="name"></p>
        <p><!--密码:--><input type="password" class="userBoxStyle" placeholder="密码..." v-model.trim="pwd"></p>
        <input class="userButton" @click="handleLogin" value="登录" type="button"/>
      </div>

    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import {message} from '../../utils';

  export default {
    name: "Login",
    data() {
      return {
        name: '',
        pwd: '',
        img: {src: require("../../public/images/logo.png")}
      }
    },
    methods: {
      ...mapActions(['login']),
      handleLogin() {
        if (!this.name) {
          message.error("请填写用户名!");
          return;
        }
        if (!this.pwd) {
          message.error("请填写密码!");
          return;
        }

        this.login({name: this.name, pwd: this.pwd,})
          .then(() => {
            this.$router.push({
              path: '/index',
            });
          })
          .catch(error => {
            message.error("账号或密码错误, 请重新登录!")
          })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .login {
    .header {
      height: 60px;
      width: 100%;
      border-bottom: 1px solid #efd4a5;
      padding: 0 10px;
      background: url(../../public/images/index_01.png) #094c8e;
      box-sizing: border-box;
      vertical-align: middle;
      .logo {
        height: auto;
        width: 152px;
        img {
          margin-top: 7px;
          vertical-align: middle;
        }
      }

      .xtName {
        height: 60px;
        line-height: 60px;
        color: #EFD4A5;
        font-size: 18px;
      }
    }
    .loginSammlBox {
      position: absolute;
      top: 150px;
      left: 50%;
      height: 300px;
      padding: 20px 0;
      width: 450px;
      margin-left: -225px;
      background: rgba(0, 0, 0, .5);
      box-sizing: border-box;
      .loginLogo {
        height: 40px;
        line-height: 40px;
        width: 100%;
        font-size: 20px;
        color: #fff;
        text-align: center;
      }
      .form {
        padding: 40px 50px;
        .userBoxStyle {
          display: block;
          height: 40px;
          line-height: 40px;
          width: 100%;
          border: 1px solid #ddd;
          margin-bottom: 20px;
          padding: 4px 10px;
          border-radius: 3px;
          box-sizing: border-box;
        }
        .userButton {
          display: inline-block;
          height: 40px;
          width: 100%;
          border: 0;
          background: #06C;
          color: #fff;
          font-size: 14px;
          border-radius: 3px;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
