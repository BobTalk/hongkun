<template>
  <div class="back_container" @click="back">
    <img :src="imgUrl" alt="返回" title="返回">
  </div>
</template>

<script>
import backIcon from '@/assets/back.png'
export default {
  data(){
    return {
      imgUrl: backIcon
    }
  },
  methods: {
    back(){
      const path = sessionStorage.getItem('approvalPath') || '/workflow/history';
      this.$router.push({path});
    }
  }
}
</script>

<style scoped rel="stylesheet/css">
  .back_container {
    width: 50px;
    height: 50px;
    background: #3698dc;
    border-radius: 50%;
    position: fixed;
    z-index: 1;
    right: 20px;
    bottom: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
  }
  img {
    display: inline-block;
    width: 90%;
    height: 90%;
  }
</style>

