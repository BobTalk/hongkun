<template>
  <el-table
    :data="formerData"
    :row-class-name="changeRowName"
    stripe
    max-height="250"
    style="width: 100%">
    <el-table-column 
      v-for="(item, index) in titleInfo"
      :key="'header' + index"
      :label="item['name']"
      :prop="item['field']"
      :fixed="index===0 && formerData.length !==0"
      align="left"
      min-width="200">
        <template slot-scope="scope" v-if="scope.row.show">
          <button v-if="scope.row.hasChildren" type="primary" class="has_border"  @click="selectChange(scope.row.ID)"  :style="{marginLeft: scope.row.LEVELS * 10 + 'px'}"><i :class="{'el-icon-plus': !scope.row.expand, 'el-icon-minus': scope.row.expand }"></i></button>
          <button v-else class="no_border" :style="{marginLeft: scope.row.LEVELS * 10 + 'px'}"><i class="el-icon-plus"></i></button>
          &nbsp;{{scope.row[scope.column.property]}}  
        </template>  
        <el-table-column
          v-for="(list, keys) in item.children"
          :key="list['field'] +keys"
          :label="list['name']"
          :prop="list['field']"
          min-width="160"
          align="center">
          <template slot-scope="scope" v-if="scope.row.show">
            <div v-if="editState && !scope.row.hasChildren && scope.row.show && list['edit'] === '+w'">
              <input class="edit_input" :min="0" :max="999999999" type="number" v-model="scope.row[scope.column.property]" placeholder="请输入内容">
            </div>
            <span v-else>{{scope.row[scope.column.property]}}</span>
          </template> 
        </el-table-column>
      </el-table-column>
  </el-table>
</template>

<script>
export default {
  data(){
    return {
      formerData: [],
      stageVersionId: "",
      editTitleData: [],
      level: ''
    }
  },  
  props: ['initData', 'titleInfo', 'editState', 'saveState'],
  methods: {
    transformData(data){
      if( data.length === 0 ) return;
      let expand = false;
      let show = false;
      let firstProject = 0;     
      //获取 第一层展开节点的最后一个 + 1
      const unExpandKey =this.getFirstExpandKey(data);
      const newData = data.map( (item, index) => {
        let hasChildren = true;
        for(const key in item){
          //以P结尾的 转换金额
          if( /.*P$/.test(key) ){
            item[key] = parseInt(item[key]/10000);
          }
        }
        if( item['PARENTID'] === '' ){
          ++firstProject;
          show = true;
          expand = false;
          if( firstProject === 1 && this.saveState ){
            expand = true;
          }
        }else{
          show = false;
          expand = false;
          if( firstProject === 1 && this.saveState && index < unExpandKey){
            expand = true;
            show = true;
          }
          if( firstProject === 1 && this.saveState && item['LEVELS'] == 2){
            show = true;
          }
        }
        item['LEVELS'] == this.level ? hasChildren = false : hasChildren = true;
        item['expand'] = expand;
        item['show'] = show;
        item['hasChildren'] = hasChildren;
        return item;
      })
      this.stageVersionId = newData[0]['STAGE_VERSIONID'];
      this.formerData = newData;
    },
    getFirstExpandKey(data){
      let _arr = data.map( item => {
        return item['LEVELS'];
      })
      const findKey = (key) => {
        if( _arr[key] === this.level ){
          return findKey(++key)
        }else{
          return key
        }
      }
      return findKey( _arr.findIndex( item => item == this.level ) + 1);
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
        if( item['PARENTID'] === id && !item['show'] ){
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
          if( item['PARENTID'] === id ){
            _arr.push(index);
            if( item['LEVELS'] !== this.level ){
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
    saveData(){
      //可编辑的数据
      const editData = this.formerData.filter( item => {
        return item['LEVELS'] === this.level;
      });
      //值的处理
      const filterValue = (t, val) => {
        val = isNaN(Number(val)) ? 0 : Number(val);
        if( t === 'P' ){
          val = val * 10000;
        }
        return val;
      }
      //传给后台的结果
      const endData = [];
      editData.forEach( item => {
        const PRODUCTTYPEID = item['PRODUCT_ID'] || '';
        const GROUPID = item['GROUP_ID'] || '';
        const BATCHID = item['BATCH_ID'] ||'';
        this.editTitleData.forEach( dataChild => {
          const t = dataChild['QUTAID'];  //获取field 名字
          const title = t.charAt(t.length-1); 
          const obj = {
            QUTAID: title,
            QUTAVALUE: filterValue(title, item[t]),
            PRODUCTTYPEID,
            GROUPID,
            BATCHID,
            YEAR: dataChild['YEAR'],            
            MONTH: dataChild['MONTH'],            
          };
          endData.push(obj);          
        })
      })
      return endData;
    },
    getVersionId(){
      return this.stageVersionId;
    },
    transformTitleData(){
      const data = [];
      this.titleInfo.forEach( (item, index) => {
        const len = item['field'].length;
        if(len > 8 && !!item.children){
          const childData = item.children;
          childData.forEach( list => {
            if( list['edit'] === '+w' ){
              const obj = {};
              obj.YEAR = item['name'].substring(0, 4);
              obj.MONTH = this.filterMonth(item['name']);
              obj.QUTAID = list['field'];
              data.push(obj);
            }
          })
        }
      })
      this.editTitleData = data;
    },
    filterMonth(yearName){
      const monthIndex = ['年1月','年2月','年3月','年4月','年5月','年6月','年7月','年8月','年9月','年10月','年11月','年12月','1季','2季','3季','4季','上','下','后'];
      const monthVal = [1,2,3,4,5,6,7,8,9,10,11,12,1,4,7,10,1,7,1];
      return monthVal[monthIndex.findIndex( item => {return yearName.indexOf(item) > -1})]
    }    
  },
  created(){
    this.level = this.initData.level || '';
    this.transformData(this.initData.data);
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
    if( this.saveState ){
      this.transformTitleData();
    }
  },
  watch: {
    'initData': function(newVal){
      this.level = newVal.level || '';
      this.transformData(newVal.data);
      document.getElementsByClassName('el-table__body-wrapper')[1].scrollLeft=0;
      if( this.saveState ){
        this.transformTitleData();
      }
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
  .edit_input {
    width: 98%;
    text-align: center;
    font-size: 14px;
  }
</style>
