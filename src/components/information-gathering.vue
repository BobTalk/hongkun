<template>
  <div class="form">
    <div ref="formBox">
      <label class="form-name">{{addCompanny.name}}</label>
      <div class="form-info clear" id="infoButton">
        <div ref="form" :data-source="addCompanny.value">
          <div style="width: 180px; height: 30px;border: 1px solid red;overflow: hidden" class="fl">
            <input type="text" class="form-content"
                   style="-webkit-appearance: none;width: 100%;height: 100%;">
          </div>
          <div class="form-info" v-for="(item,index) in htmlEle" v-html="item"></div>
          <WrapperButton type="icon" size="mini" icon="el-icon-plus" @click="infoAddButton"/>
          <WrapperButton type="icon" size="mini" icon="el-icon-delete" @click="infoDelButton"/>
        </div>

      </div>
    </div>
    <div class="form-button">
      <input type="button" @click="submit" class="form-submit-button" value="确定">
      <input type="button" @click="reset" class="form-reset-button" value="取消">
    </div>
  </div>
</template>

<script>
  import WrapperButton from "./wrapper-button.jsx"
  import "./information-gathering.less"
  export default {
    props: ["addCompanny"],
    name: "InformationGathering",
    /*属性值*/
    data(){
      return {
        htmlEle: [],
        str: `
              <div style="width: 180px; height: 30px;border: 1px solid red;overflow: hidden" class="fl">
                <input type="text" class="form-content" style="-webkit-appearance: none;width: 100%;height: 100%;">
              </div>
            `,
        inputArr: []
      }
    },
    /*组件引用*/
    components: {WrapperButton},
    /*属性值实时计算*/
    computed: {},
    /*函数体*/
    methods: {
      /*添加按钮*/
      infoAddButton(){
        if (this.htmlEle.length < 5) {
          this.htmlEle.push(this.str);
        }
      },
      /*删除按钮*/
      infoDelButton(){
        if (this.htmlEle.length > 0) {
          this.htmlEle.pop();
        }
      },
      submit(){
        var stageProjectName = this.$refs.form.getAttribute("data-source");
        console.log(stageProjectName);
        var inputVal = this.$refs.form.getElementsByTagName("input");
        var arr = [];
        for (var i = 0, len = inputVal.length; i < len; i++) {
          arr.push(inputVal[i].value);
        }
        this.inputArr = [...arr, stageProjectName];
        console.log(this.inputArr)
      },
      reset(e){
        this.$emit('changFlag', e);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .form {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 170px;
    padding: 10px;
    border: 1px solid #6f7180;
    text-align: left;
    background: #ffffff;
    .form-name {

    }
    .form-info {
      padding-left: 20px;
      margin-top: 10px;
      .form-content {
        display: inline-block;
        height: 25px;
        padding: 0 5px;
      }
    }
    .form-button {
      position: absolute;
      right: 10px;
      bottom: 10px;
      text-align: right;
      .form-submit-button, .form-reset-button {
        padding: 5px 10px;
        border-radius: 5px;
        background-color: #169BD5;
        color: #fff;
        border: none;
      }
    }
  }

  .form-add {
    width: 180px;
    height: 30px;
    border: 1px solid red;
    margin-top: 10px;
    overflow: hidden;
    .form-add-inp {
      outline: none;
      width: 100%;
      height: 100%;
      border: none
    }
  }
</style>
