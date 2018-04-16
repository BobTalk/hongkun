<template>
  <div>
      <span style="float: right;margin:5px 60px 5px 0;">
        <label class="version">当前版本:</label>
        <el-select v-model="costVersionCode" placeholder="请选择" class="input_style" @change="changeVersion" id="select_input" style="width: 80px;">
          <el-option
            style="height: 30px"
            v-for="item in costversion"
            :key="item.costVersionId"
            :label="item.versionCode"
            :value="item.versionCode">
          </el-option>
        </el-select>
        <label>状态:</label>
        <span>{{currentStausName}}</span>
      </span>
  </div>
</template>

<script>
    export default {
        name: "cost-version",
        props: ['costversion', 'costVersionId', 'costStausName','costLatestVersion','costVersionCode'],
        data(){
          return{
            // mycostVersionCode:this.costVersionCode,
            // currentStausName:''
          }
        },
        created(){
          // console.info(this.mycostVersionCode)
          // ES6语法,深拷贝props传入的costStausName,避免向直接修改该值
          // this.currentStausName = Object.assign({}, this.costStausName )
          // console.log(this.currentStausName)
        },
        methods:{
          changeVersion(val) {
            console.info(val)
            let self = this
            this.costversion.forEach(function(item){
              if (item.versionCode == val) {
                val = item.versionId
                self.currentStausName = item.statusName
              }
            })
            this.currentStausName=JSON.stringify(this.currentStausName)
            this.$emit('changeVersion', val);
          }
        }
    }
</script>

<style scoped>

</style>
