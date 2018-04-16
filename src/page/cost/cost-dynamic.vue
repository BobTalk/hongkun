<template>
  <el-table
    :data="dynamic"
    border
    style="width: 98%;white-space:nowrap;border:solid 1px #ebeef5;text-align:left">
    <el-table-column
      prop="subjectName"
      label="科目"
      >
    </el-table-column>
    <el-table-column
      prop="landVersion"
      label="土地版"
      
      width="100">
    </el-table-column>
    <el-table-column
      prop="programVersion"
      label="方案版"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="chartVersion"
      label="施工图版"
      width="100">
    </el-table-column>
    <el-table-column
      prop="tzVersion"
      label="调整版"
      width="100">
    </el-table-column>
    <el-table-column
      prop="dyVersion1"
      label="动态版1季度"
      width="120">
    </el-table-column>
    <el-table-column
      prop="dyVersion2"
      label="动态版2季度"
      width="120">
    </el-table-column>
    <el-table-column
      prop="dyVersion3"
      label="动态版3季度"
      width="120">
    </el-table-column>
    <el-table-column
      prop="dyVersion4"
      label="动态版4季度"
      width="120">
    </el-table-column>
  </el-table>
</template>

<script>
    export default {
        name: "cost-dynamic",
        props: ['dynamic'],
    }
</script>

<style scoped>

</style>
