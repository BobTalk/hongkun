<template>
  <div class="collagen">
    11111
  </div>
</template>

<script>
  export default {
    name: "Base",
    data: function () {
      return {

      };
    },
    components: {

    },
    created() {
    },
    computed: {

    },
    methods: {

    },
    watch: {
      '$route': function () {
        if( this.$route.query.mode === 'base' ){
            console.info(1111)
        }
      },
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .content {
    width: calc(100% - 240px);
    height: 100%;
    background-color: #FFF;
  }

  h1 {
    font-weight: 300;
    font-size: 12px;
    width: 100%;
    line-height: 40px;
  }

  h2 {
    width: 98%;
    height: 30px;
    background: inherit;
    border-bottom: 2px solid #F9F9F9;
    margin-top: 5px;
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
      /*margin-right: 30px;*/
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

  .shrink {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #4caaf4;
    text-align: center;
    line-height: 20px;
    color: #4caaf4;
  }

  .projectbox {
    display: flex;
    .projectright {
      width: 50%;
    }
  }

  .projecttitle {
    text-align: left;
    font-size: 14px;
    font-weight: 300;
    padding: 5px 0;
  }

  .projectcont {
    /*height: 100%;*/
    // overflow-y: scroll;
    /*overflow-x: hidden;*/
    margin-bottom: 200px;
  }

  .collagen-title {
    text-align: center;
    margin: 20px;
    font-weight: normal;
    font-size: 20px;
  }
</style>
