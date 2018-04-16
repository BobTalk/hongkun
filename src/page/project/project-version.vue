<template>
    <div>
      <span style="float: right;margin:5px 25px 5px 0;">
        <label class="version">当前版本:</label>
        <el-select :value="projectVersionId" placeholder="请选择" class="input_style" @change="changeVersion" id="select_input" style="width: 120px;height: 27px!important;">
          <el-option
            style="height: 30px"
            v-for="item in projectVersionData"
            :key="item.versionId"
            :label="item.showName"
            :value="item.versionId">
          </el-option>
        </el-select>
        <label style="padding-left :10px">状态：{{projectStausName}}</label>
      </span>
    </div>
</template>

<script>
  import './project.less'
    export default {
        name: "project-version",
        props: ['projectVersionData', 'projectVersionId', 'projectStausName'],
        methods:{
          changeVersion(val) {
            this.$emit('changeVersion', val);
          }
        }
    }
</script>

<style scoped>
  #select_input{
    width:50px!important;
    height:30px!important;
    border-radius:3px;
  }
  .version{
    color:#4caaf4;
  }
</style>
