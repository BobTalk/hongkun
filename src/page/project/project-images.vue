<template>
  <div>
    <div class="projectimg">
      <span class="enlarge" @click="enlargeIframe">
        <img src="../../public/images/enlarge.png" alt="">
      </span>
      <iframe width="100%" height="100%" border="none" :src="iframeUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
  export default {
    name: "project-images",
    data: function () {
      return {
        //iframeUrl: ""
      }
    },
    props: ['iframeUrl'],
    methods: {
      enlargeIframe() {
        window.open(this.iframeUrl);
      }
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .imagestop {
    padding: 13px;
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    span {
      em, em > i {
        font-style: normal;
      }
    }
  }

  .projectimg {
    position: relative;
    border: 1px solid #c0c4cc;
    height: 370px;
    margin-top: 20px;

    .enlarge {
      width: 30px;
      height: 30px;
      font-size: 40px;
      position: absolute;
      color: white;
      bottom: 5px;
      right: 10px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .input_style {
    height: 10px !important;
    width: 100px !important;

  }
</style>
