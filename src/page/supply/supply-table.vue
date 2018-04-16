<template>
  <el-table
    :data="formerData"
    :row-class-name="changeRowName"
    max-height="250"
    style="width: 100%">
    <el-table-column 
      v-for="(item, index) in headerData"
      :key="'header' + index"
      :label="item['name']"
      :prop="item['field']"
      :fixed="index===0 && formerData.length != 0 ? true : false"
      align="left"
      min-width="220">
          <template slot-scope="scope" v-if="scope.row.show">
            <button v-if="scope.row.hasChildren" type="primary" class="has_border"  @click="selectChange(scope.row.ID)"  :style="{marginLeft: scope.row.level * 10 + 'px'}"><i :class="{'el-icon-plus': !scope.row.expand, 'el-icon-minus': scope.row.expand }"></i></button>
            <button v-else class="no_border" :style="{marginLeft: scope.row.level * 10 + 'px'}"><i class="el-icon-plus"></i></button>
            &nbsp;{{scope.row[scope.column.property]}}  
          </template>  
          <el-table-column
          v-for="(list, keys) in item.children"
          :key="list['field'] +keys"
          :label="list['name']"
          :prop="list['field']"
          min-width="160">
            <template slot-scope="scope" v-if="scope.row.show">
                {{scope.row[scope.column.property]}}  
            </template> 
            <el-table-column
              v-for="(listData, ind) in list.children"
              :key="listData['field'] +ind"
              :label="listData['name']"
              :prop="listData['field']"
              min-width="160">
                <template slot-scope="scope" v-if="scope.row.show">
                    {{scope.row[scope.column.property]}}  
                </template> 
            </el-table-column>
          </el-table-column>
      </el-table-column>
  </el-table>
</template>

<script>
export default {
  data(){
    return {
      formerData: [],
      headerData: []
    }
  },  
  props: ['initData'],
  methods: {
    transformData(defaultData){
      const data = defaultData.dataSource;
      if( data.length === 0 ){
        this.formerData = [];
        return this.headerData = defaultData['headerData'];
      }
      const _newData = [];
      const formerData = function(data, PID, level){
        const t = ++level
        for(var i=0; i<data.length; i++){
          const obj = {};
          for( const key in data[i] ){
            obj[key] = data[i][key];
          };
          obj['level'] = level;    
          obj['expand'] = false;
          if( PID ){
            //非顶级
            obj['show'] = false;
            obj['PID'] = PID;        
          }else{
            //顶级
            obj['show'] = true;
            obj['PID'] = null;  
          };
          if( obj['children'].length !== 0 ){
            obj['hasChildren'] = true;
            _newData.push( obj );
            formerData(obj['children'], obj['ID'], t);
          }else{
            obj['hasChildren'] = false;
            _newData.push( obj );
          }
        }
      };
      formerData(data, null, 1);
      this.formerData = this.clearChidlrenData(_newData);
      this.headerData = defaultData['headerData'];
    },
    selectChange(id){
      const operateData = JSON.parse(JSON.stringify(this.formerData));
      let isExpand = false;
      const newData = operateData.map( (item, index) => {
        if( item['ID'] === id ){
          item['expand'] = !item['expand'];
          isExpand = item['expand'];
        };
        //改变显示状态
        if( item['PID'] === id && !item['show'] ){
          item['show'] = true;
        }
        if( !isExpand ){
          const childArr = this.findChild(id, operateData); //找到当前ID下的所有子集
          if( childArr.indexOf(index) > -1 ){
            item['show'] = false;
            item['expand'] = false;
          }
        }
        return item;
      });
      this.formerData = newData;
    },
    findChild(id, data){
      const _arr = [];
      const finds = (id) => {
        data.forEach( (item, index) => {
          if( item['PID'] === id ){
            _arr.push(index);
            if( item['hasChildren'] ){
              finds(item['ID']);
            }
          };
        })
      };
      finds(id);
      return _arr;
    },
    changeRowName(row){
      if( !row['row']['show'] ){
        return 'no_expand';
      }else{
        return 'has_expand'
      }
    },
    clearChidlrenData(data){
      return data.map( item => {
        item['children'] = '';
        return item;
      })
    }
  },
  created(){
    this.transformData(this.initData);
  },
  mounted(){
    const dom = document.getElementsByClassName('el-table__body-wrapper');
    dom[0].addEventListener('scroll', (e) => {
      let scrollLeft = e.srcElement.scrollLeft
      dom[1].scrollLeft = scrollLeft;
    });
    dom[1].addEventListener('scroll', (e) => {
      let scrollLeft = e.srcElement.scrollLeft
      dom[0].scrollLeft = scrollLeft;
    });
  },
  watch: {
    'initData': function(newVal){
      this.transformData(newVal);
    }
  }
  
}
</script>

<style rel="stylesheet/css" scoped>
  .no_border {
    background: none;
    border:1px solid #ccc;
    padding: 0 1px;
    opacity: 0;
  }
  .has_border {
    background: none;
    border:1px solid #ccc;
    padding: 0 1px;
    cursor: pointer;
  }
</style>
