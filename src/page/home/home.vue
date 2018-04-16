<template>
  <div class="home-wrapper">
    <h2>{{msg}}</h2>
    <div class="home-line">
      全局统一消息:
      <WrapperButton type="primary" @click="success('123456','567890')" text="成功"></WrapperButton>
      <WrapperButton type="primary" @click="warning" text="警告"></WrapperButton>
      <WrapperButton type="primary" @click="info" text="消息"></WrapperButton>
      <WrapperButton type="primary" @click="error" text="错误"></WrapperButton>
    </div>
    <div class="home-line">
      异步请求方式:
      <WrapperButton type="primary" @click="testGet" text="GET请求"></WrapperButton>
      <WrapperButton type="primary" @click="testPost" text="POST请求"></WrapperButton>
    </div>
    <div class="home-line">
      按钮级别权限:
      <WrapperButton type="primary"
                     permission="project.add,project.edit,project.delete" text="按钮级别权限">
      </WrapperButton>
    </div>
    <div class="home-line">
      通用图形组件:
      <!--添加-->
      <WrapperButton type="primary" size="mini" icon="el-icon-plus"></WrapperButton>
      <!--编辑-->
      <WrapperButton type="primary" size="mini" icon="el-icon-edit"></WrapperButton>
      <!--删除-->
      <WrapperButton type="primary" size="mini" icon="el-icon-delete"></WrapperButton>
      <WrapperButton type="icon" icon="el-icon-plus"/>
      <WrapperButton type="icon" icon="el-icon-edit"/>
      <WrapperButton type="icon" icon="el-icon-delete"/>
    </div>
    <div class="home-line">
      通用封装组件:
      <WrapperButton type="primary" text="我是封装后的按钮"></WrapperButton>
      <WrapperButton type="icon" icon="el-icon-plus"></WrapperButton>
    </div>
  </div>
</template>
<script>
  import {message, fetchUtils} from '../../utils';
  import {WrapperButton} from '../../components';

  export default {
    name: 'Home',
    data() {
      return {
        msg: '欢迎来到鸿坤集团项目门户系统'
      }
    },
    components: {
      WrapperButton,
    },
    methods: {
      success(...args) {
        console.log("参数:", args);
        message.success("我是成功信息")
      },
      warning() {
        message.warning("我是警告")
      },
      info() {
        message.info("我是消息")
      },
      error() {
        message.error("我是错误")
      },
      testGet() {
        fetchUtils.get('/Account/ILogin', {id: "12345678"}).then(
          res => {
            console.log("res", res);
          }
        )
          .catch(error => {
            console.error(error);
          })
      },
      testPost() {
        fetchUtils.post('/Account/ILogin', {UserName: "everyone", UserPwd: "1"}).then(
          res => {
            console.log("res", res);
          }
        )
          .catch(error => {
            console.error(error);
          })
      }
    }
  }

</script>

<style>
  .home-wrapper {
    background-color: white;
    padding-top: 10px;
    padding-bottom: 50px;
  }

  .home-wrapper .home-line {
    text-align: left;
    font-size: 14px;
    padding-top: 5px;
    padding-left: 50px;
  }
</style>

