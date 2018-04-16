<template>
    <h2>
        <span class="title">{{title}}</span>
        <!-- <span>
            <span class="shrink"><i class="el-icon-arrow-right"></i></span>
        </span> -->
    </h2>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="less" scoped rel="stylesheet/less">
h2 {
  width: 98%;
  height: 30px;
  background: inherit;
  border-bottom: 2px solid #f9f9f9;
  padding-top: 20px;
  text-align: left;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  padding-right: 10px;
  .title {
    border-bottom: 2px solid dodgerblue;
    width: 100px;
    display: block;
    text-align: center;
  }
  span {
    margin-right: 30px;
    span {
      position: relative;
      right: 0px;
      bottom: 3px;
      padding: 4px 8px;
      font-weight: 300;
      cursor: pointer;
      background: #4caaf4;
      color: #fff;
      border-radius: 3px;
      font-size: 13px;
      margin: 0px 5px 0 0;
    }
  }
}
.shrink{
    width:20px;
    height:20px;
    border-radius:50%;
    background: #fff;
    border: 1px solid #4caaf4;
    text-align: center;
    line-height:20px;
    color:#4caaf4;
}
</style>


