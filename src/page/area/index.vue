<template>
  <div class="area" id="area">
    <div class="indentity-title clear">
      <p class="fl" style="font-size: 15px;border-bottom: 2px solid #4478E8;margin-top: -2px;font-weight: 800">面积管理</p>
      <span class="fr" id="spanbox" style="padding-right: 10px;position: relative;">
        <span class="savebtn" style="margin-top: -5px;">
          状态:{{this.currentVersionText}}
        </span>
        <span class="savebtn" style="color:#4caaf4;margin-top: -3px;">
          当前版本:
        <el-select :value="currentVersion" class="edition" placeholder="请选择" size="mini" @change="setVersion">
        <el-option
          v-for="item in versionListByBusinessldData"
          :key="item.versionId"
          :label="item.showName"
          :value="item.versionId">
        </el-option>
        </el-select>
        </span>
        <span  v-if="isSP &&  commonPathRoleAuthority.indexOf('btn_approval') > -1" class="savebtn fqsp" @click="flow"><i class="el-icon-share"></i>发起审批</span>
        <span  v-if="commonPathRoleAuthority.indexOf('btn_delete') > -1 && btn[4]" class="savebtn del" @click="delFrom"><i class="el-icon-delete"></i>删除</span>
        <span class="savebtn ytwh" @click="ldClick" v-if="isShow[0] && btn[3] && tabBS =='third' && (commonPathRoleAuthority.indexOf('btn_edit') > -1 || commonPathRoleAuthority.indexOf('btn_add') > -1)"><i class="el-icon-edit-outline"></i>楼栋/业态维护</span>
        <span class="savebtn wh" @click="ytClick" v-if="isShow[1] && btn[2] && tabBS =='second' && (commonPathRoleAuthority.indexOf('btn_edit') > -1 || commonPathRoleAuthority.indexOf('btn_add') > -1)"><i class="el-icon-edit-outline"></i>业态维护</span>
        <span  v-if="commonPathRoleAuthority.indexOf('btn_edit') > -1 && btn[1]" class="savebtn save" @click="saveFrom"><i class="el-icon-tickets"></i>保存</span>
        <span  v-if="commonPathRoleAuthority.indexOf('btn_add') > -1 && area_HightCurrentVersion==currentVersion && area_HightCurrentVersion !=''" class="savebtn scxb" @click="createVersionClick"><i class="el-icon-plus"></i>生成新版本</span>
        <span  v-if="commonPathRoleAuthority.indexOf('btn_add') > -1 && btn[0]" class="savebtn scxb" @click="createVersionClick"><i class="el-icon-plus"></i>生成新版本</span>
      </span>
    </div>
    <div class="highlight-button" style="margin-left: 20px;">
      <ul class="clear">
        <li><i class="legend-white"></i>未编制</li>
        <li><i class="legend-blue"></i>编制中</li>
        <li><i class="legend-yellow"></i>审批中</li>
        <li><i class="legend-green"></i>审批通过</li>
      </ul>
    </div>
    <div id="crumbs">
      <ul>
        <li v-for="(item,index) in stageData" :key="index" @click="mbxClick(item)"
            :style="{zIndex: stageData.length-index}">
          <i :class="item.className"></i>
          <a href="#" :class="item.active">{{item.name}}</a>
        </li>
      </ul>
    </div>

    <div class="contentA">
      <el-tabs v-model="activeCard" type="card" @tab-click="handleCardClick">
        <div class="search_Table" v-if="tabBS =='third'">
          <label>楼栋:</label>
          <el-input placeholder="请输入楼栋" v-model="searchLD" class="input-with-select" clearable>
          </el-input>
        </div>
        <div  class="searchTable" v-if="tabBS =='third'">
          <label>类型:</label>
          <el-input placeholder="请输入" v-model="searchYT" class="input-with-select">
          <el-select v-model="selectYT" slot="prepend" placeholder="请选择">
            <el-option label="业态名称" value="PRODUCTNAME"></el-option>
            <el-option label="所属组团" value="GROUPNAME"></el-option>
            <el-option label="所属批次" value="BATCHNAME"></el-option>
            <el-option label="层高属性" value="STOREYHEIGHTNAME"></el-option>
            <el-option label="产权属性" value="ISHAVEPROPERTYNAME"></el-option>
            <el-option label="精装属性" value="ISDECORATIONNAME"></el-option>
          </el-select>
          <el-button slot="append" @click="searchClick">查询</el-button>
          </el-input>
        </div>

        <el-tab-pane label="整体指标" name="first">
          <div id="formItem" v-if="currentVersion">
            <el-form label-width="120px" status-icon :rules="rules2" ref="ruleForm2">
              <el-form-item  :required="(item.edit =='+w'? true: false) && ((item.id !='SOFTSCENERY') && (item.id !='ANTISEISMICCAPACITY') && (item.id !='HARDSCENERY'))" :label="item.label+(item.unit && item.id != 'PLOTRATIO'?' ('+(item.unit)+')':'')"
                            v-for="(item,index) in proposalInfoData" :key="index">
                  <div v-if="item.label=='地区名称'">
                    <el-input v-model="item.val" :disabled="currentVersionText == '审批中' || currentVersionText == '审批通过'? true:false"
                              class="inputString"></el-input>
                  </div>
                  <div v-else>
                    <div v-if="item.id !='GIFTRATE' &&  item.id !='GREENRATE'">
                      <div v-if="item.id =='SALEBUILDRATE' ||  item.id =='PARKINGPROPORTION'">
                        <el-input v-if="item.edit =='+r'" size="small" disabled="disabled"   @blur="changeNumberStr($event,item)"
                                  v-model="item.val"></el-input>
                        <el-input :disabled="currentVersionText == '审批中' || currentVersionText == '审批通过' ? true:false"  v-else size="small"
                                  v-model="item.val"   @blur="changeNumberStr($event,item)"  ></el-input>
                      </div>
                      <div v-else>
                        <el-input v-if="item.edit =='+r'" size="small" :min="0" :max="999999999" :controls="iscontrols"
                                  @blur="changeNumber($event,item)"            disabled="disabled"
                                  v-model="item.val"></el-input>
                        <el-input :disabled="currentVersionText == '审批中' || currentVersionText == '审批通过' ? true:false"  v-else size="small" :min="0" :max="999999999" :controls="iscontrols"
                                  @blur="changeNumber($event,item)"           v-model="item.val"></el-input>
                      </div>

                    </div>
                    <div v-else>
                      <el-input v-if="item.edit =='+r'" size="small" :min="0" :max="999999999" :controls="iscontrols"
                                @blur="changeNumber($event,item)"     disabled="disabled"
                                v-model="item.val"><i slot="suffix">%</i></el-input>
                      <el-input :disabled="currentVersionText == '审批中' || currentVersionText == '审批通过' ? true:false"  v-else size="small" :min="0" :max="999999999" :controls="iscontrols"
                                @blur="changeNumber($event,item)"  v-model="item.val"><i slot="suffix">%</i></el-input>
                    </div>
                  </div>
              </el-form-item>
            </el-form>
          </div>

        </el-tab-pane>
        <el-tab-pane label="按业态" name="second" v-if="currentStep.code =='Vote'">
          <div v-if="currentVersion">
            <el-table :data="areaListInfo.areadataInfo" stripe border style="width: 100%" align="center" height="500!important">
              <div v-for="(title,index) in areaListInfo.titleInfo" :key="index" class="tabTitle">
                <div v-if="title.field == 'PRODUCTNAME'">
                  <el-table-column :label="title.name"  fixed="left" width="100">
                    <template slot-scope="scope">
                      <span class="currentLink" @click="searchTypeClick(scope.row)">{{scope.row[title.field]}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-else>
                  <el-table-column v-if="!title.children" :prop="title.field" :label="title.name" >
                    <template slot-scope="scope">
                      <span>{{scope.row[title.field]}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="title.name" v-else>
                    <el-table-column :prop="subTitle.field" :label="subTitle.name"
                                     v-for="subTitle in title.children" :key="subTitle.name"
                                     ></el-table-column>
                  </el-table-column>
                </div>
              </div>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按楼栋" name="third" v-if="currentStep.code !='Vote'">
          <div class="heightTable" v-if="currentVersion">
            <el-table :data="buildingInfoData.areadataInfo" stripe border style="width: 100%" align="center" empty-text
                      :row-class-name="tableRowClassName"   height="500">
              <div v-for="title in buildingInfoData.titleInfo" :key="title.name" class="tabTitle">
                <div v-if="title.name == '业态/楼栋'">
                  <el-table-column :label="title.name" width="200" fixed="left">
                    <template slot-scope="scope">
                      <span class="currentLink alignLeft" @click="currentLinkClick(scope.row)"
                            v-if="scope.row.PARENTID =='0' ">{{scope.row[title.field]}}</span>
                      <span class="currentLink alignCenter" @click="currentLinkClick(scope.row)" v-else>{{scope.row[title.field]}}</span>
                    </template>
                  </el-table-column>
                </div>
                <div v-else>
                  <el-table-column v-if="!title.children" :prop="title.field" :label="title.name" width="150">
                  </el-table-column>
                  <el-table-column :label="title.name" v-else>
                    <el-table-column :prop="subTitle.field" :label="subTitle.name"
                                     v-for="subTitle in title.children" :key="subTitle.name"
                                     width="150"></el-table-column>
                  </el-table-column>
                </div>
              </div>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="业态查看" name="fourth" v-if="currentStep.code !='Vote'">
          <div v-if="currentVersion">
            <el-table :data="type.areadataInfo"  stripe border style="width: 100%" align="center"  height="500">
              <el-table-column v-if="!title.children"
                v-for="(title,index) in type.titleInfo"
                :fixed="index===0"
                :align="index===0 ? 'left' : 'center'"
                :key="'area'+index"
                class="tabTitle"
                :label="title.name"
                :prop="title.field ? title.field : ''"
                min-width="200"
              >
              </el-table-column>
              <el-table-column :label="title.name" v-else>
                <el-table-column
                v-for="(item, keys) in title.children"
                :key="item.field +keys"
                :label="item.name"
                :prop="item.field"
                min-width="160"
                >
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-dialog title="业态维护" :visible.sync="outerVisible" id="area_dialog" :close-on-click-modal="closeModel"
                 :show-close="showClose" width="70%">
        <el-dialog width="30%" title="属性选择" :visible.sync="innerVisible" append-to-body
                   :close-on-click-modal="closeModel" :show-close="showClose">
          <el-form label-width="80px" id="areaFrom">
            <el-form-item label="产权属性">
              <el-select class="cqsx" v-model="attrData.ishaveproperty" placeholder="请选择活动区域">
                <el-option :label="item.label" :value="item.val"
                           v-for="(item,index) in selectData.selectOptions[0].selectOption" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeSelect">取 消</el-button>
            <el-button type="primary" @click="trueSelect">确定</el-button>
          </div>
        </el-dialog>
        <el-row id="gridContent">
          <el-col :span="7">
            <div class="grid-content">
              住宅
              <el-select class="yt-select" v-model="typeInfo.residence" placeholder="请选择">
                <el-option
                  v-for="item in selectData.serchList[0].typelist"
                  :key="item.val"
                  :label="item.lable"
                  :value="item.val"
                  @click.native="selectAttr($event,item.val,'residence')"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <div class="grid-content">
                公建
                <el-select class="yt-select"  v-model="typeInfo.commercial" placeholder="请选择">
                  <el-option
                    v-for="item in selectData.serchList[1].typelist"
                    :key="item.val"
                    :label="item.lable"
                    :value="item.val"
                    @click.native="selectAttr($event,item.val,'commercial')"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <div class="grid-content">
                其他
                <el-select class="yt-select" v-model="typeInfo.parkandsupport" multiple @remove-tag="rTClick"  placeholder="请选择">
                  <el-option
                    v-for="item in selectData.serchList[2].typelist"
                    :key="item.val"
                    :label="item.lable"
                    :value="item.val"
                    @click.native="selectAttr($event,item.val,'parkandsupport')"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="createYT" size="mini">生成业态</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row id="areaSelect">
          <el-table :data="searchList_Data" border style="width: 100%" class="formatClass" height="300">
            <el-table-column prop="producttypename" label="业态" width="400">
            </el-table-column>
            <el-table-column label="产权属性" width="220">
              <template slot-scope="scope">
                <span v-if="scope.row.ishaveproperty>0">{{selectData.selectOptions[0].selectOption[scope.row.ishaveproperty].label}}</span>
                <!--<el-select v-model="scope.row.ishaveproperty+''" placeholder="请选择" disabled="disabled">-->
                  <!--<el-option label="仅包含有产权" value='1'></el-option>-->
                  <!--<el-option label="仅包含无产权" value='2'></el-option>-->
                  <!--<el-option label="仅包含无产权和有产权" value='3'></el-option>-->
                <!--</el-select>-->
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteFormat($event,scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="qxcreateformat">取 消</el-button>
          <el-button type="primary" @click="qrcreateformat" :disabled="qdscyt">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="ytmjtz">
      <el-dialog title="业态面积调整" :visible.sync="YTMJTZ" :close-on-click-modal="closeModel" :show-close="showClose"
                 width="80%">
        <el-table :data="AreaEditDataProductTypeDataInfo" stripe border style="width: 100%" align="center" height="300"
                  class="yttables">
          <div v-for="title in areaEditData.productTypeTitleInfo" :key="title.name" class="tabTitle">
            <div v-if="title.field == 'PRODUCTNAME'">
              <el-table-column :prop="title.field" :label="title.name" width="200" fixed="left">
              </el-table-column>
            </div>
            <div v-else>
              <el-table-column v-if="!title.children" :prop="title.field" :label="title.name" width="150">
              </el-table-column>
              <el-table-column :label="title.name" v-else>
                <el-table-column :prop="subTitle.field" :label="subTitle.name"
                                 v-for="subTitle in title.children" :key="subTitle.name" width="150">
                  <template slot-scope="scope">
                    <!--(scope.row,subTitle.field)-->
                    <el-input :disabled="true" v-if="subTitle.field =='TOTALBUILDINGAREA' || subTitle.field =='TOTALRENTALSALEAREA'" v-model="scope.row[subTitle.field]"></el-input>
                    <el-input-number v-else size="mini" :min="0" :max="999999999" :controls="iscontrols"
                             @blur="changeNumber2($event,scope.row,subTitle.field)"        v-model="scope.row[subTitle.field]"  :disabled="(currentVersionText =='审批通过')"></el-input-number>
                  </template>
                </el-table-column>
              </el-table-column>
            </div>
          </div>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="YTMJTZ = false">取 消</el-button>
          <el-button type="primary" @click="editYt">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="ytld">
      <el-dialog title="业态/楼栋维护" :visible.sync="outerLDVisible" :close-on-click-modal="closeModel"
                 :show-close="showClose" width="70%">
        <el-dialog width="30%" title="属性选择" :visible.sync="innerLDVisible" append-to-body
                   :close-on-click-modal="closeModel" :show-close="showClose">
          <el-form label-width="80px" id="formAttr">
            <el-form-item label="产权属性">
              <el-select class="ldwh" v-model="attrData.ishaveproperty" placeholder="请选择活动区域">
                <el-option :label="item.label" :value="item.val"
                           v-for="(item,index) in selectData.selectOptions[0].selectOption" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="精装属性" v-if="currentStep.code !='Vote'">
              <el-select class="ldwh" v-model="attrData.isdecoration" placeholder="请选择活动区域">
                <el-option :label="item.label" :value="item.val"
                           v-for="(item,index) in selectData.selectOptions[1].selectOption" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="层高属性" v-if="currentStep.code !='Vote'">
              <el-select class="ldwh" v-model="attrData.storeyheight" placeholder="请选择活动区域">
                <el-option :label="item.label" :value="item.val"
                           v-for="(item,index) in selectData.selectOptions[2].selectOption" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeLDSelect">取 消</el-button>
            <el-button type="primary" @click="trueLDSelect">确定</el-button>
          </div>
        </el-dialog>
        <el-row class="textms">
          <p>
            1. 楼栋可输入连续号【~】连接号【、，】分段楼号。如：1号楼~10号楼[指1号楼至10号楼]；1号楼、10号楼[指1号楼和10号楼]
          </p>
          <p>
            2.【车库】应作为单独楼栋进行创建，所有车位归属到【车库】楼栋下，按交付时间或组团进行【车库】楼栋的划分。 例如；车库楼栋的名称可填写为【车库】、【XX号车库】、【XX组团车库】等
          </p>
          <p>
            3. 请将不能划入楼栋或车位的配套业态，单独创建楼栋，楼栋名称必须为【配套】，不能更改为其他楼栋名称
          </p>
          <p>
            4. 鼠标点击业态行可以更改组团
          </p>
        </el-row>
        <el-row id="floor">
          <el-col :span="6">
            <div class="grid-content">
              楼号
              <el-input v-model="ldTypeInfo.wb"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              组团
              <el-select v-model="ldTypeInfo.zt" placeholder="请选择" ref="groupId">
                <el-option
                  v-for="(item,index) in selectData.GroupAndBatch"
                  :key="item.ID"
                  :label="item.GROUPNAME"
                  :value="item.ID"
                  @click.native="subSelect(index,item)"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              批次
              <el-select v-model="ldTypeInfo.pc" placeholder="请选择">
                <!---->
                <el-option
                  v-for="item in selectData.GroupAndBatch[index].CHILDREN"
                  :key="item.ID"
                  :label="item.BATCHNAME"
                  :value="item.ID"
                  @click.native="subsSelect(item)"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <el-button class="produce-status" @click="createLDYT" size="mini">生成业态</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row id="zhuzai">
          <el-col :span="6">
            <div class="grid-content">
              住宅
              <el-select class="zz" width="185px" v-model="ldTypeInfo.residence" placeholder="请选择" :disabled="!((ldTypeInfo.pc !='') && (ldTypeInfo.zt !='') && (ldTypeInfo.wb !=''))">
                <el-option
                  v-for="item in selectData.serchList[0].typelist"
                  :key="item.val"
                  :label="item.lable"
                  :value="item.val"
                  @click.native="subLDSelect($event,item.val,'residence')"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              公建
              <el-select v-model="ldTypeInfo.commercial" placeholder="请选择" :disabled="!((ldTypeInfo.pc !='') && (ldTypeInfo.zt !='') && (ldTypeInfo.wb !=''))">
                <el-option
                  v-for="item in selectData.serchList[1].typelist"
                  :key="item.val"
                  :label="item.lable"
                  :value="item.val"
                  @click.native="subLDSelect($event,item.val,'commercial')"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content" id="ss">
              <span>其他</span>
              <el-select v-model="ldTypeInfo.parkandsupport" multiple  @remove-tag="removeTag" class="oneSelect" placeholder="请选择" :disabled="!((ldTypeInfo.pc !='') && (ldTypeInfo.zt !='') && (ldTypeInfo.wb !=''))">
                <el-option
                  v-for="item in selectData.serchList[2].typelist"
                  :key="item.val"
                  :label="item.lable"
                  :value="item.val"
                  @click.native="subLDSelect($event,item.val,'parkandsupport')"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row id="infoArea">
          <el-table :data="searchList_Data" border style="width: 100%" class="formatClass" height="300" @row-click="selectBatch">
            <el-table-column prop="producttypename" label="业态" width="150" fixed="left">
            </el-table-column>
            <el-table-column prop="ishaveproperty" label="产权属性" width="150">
              <template slot-scope="scope">
                    <span v-if="scope.row.ishaveproperty>0">{{selectData.selectOptions[0].selectOption[scope.row.ishaveproperty].label}}</span>
                <!--<el-select disabled="disabled" v-if="scope.row.ishaveproperty>0"-->
                           <!--v-model="scope.row.ishaveproperty.toString()" placeholder="请选择活动区域">-->
                  <!--<el-option :label="item.label" :value="item.val"-->
                             <!--v-for="(item,index) in selectData.selectOptions[0].selectOption" :key="index"></el-option>-->
                <!--</el-select>-->
              </template>
            </el-table-column>
            <el-table-column prop="isdecoration" label="精装属性" width="100">
              <template slot-scope="scope">
                    <span v-if="scope.row.isdecoration>0">{{selectData.selectOptions[1].selectOption[scope.row.isdecoration].label}}</span>
                <!--<el-select disabled="disabled" v-if="scope.row.ishaveproperty>0"-->
                           <!--v-model="scope.row.isdecoration.toString()" placeholder="请选择活动区域">-->
                  <!--<el-option :label="item.label" :value="item.val"-->
                             <!--v-for="(item,index) in selectData.selectOptions[1].selectOption" :key="index"></el-option>-->
                <!--</el-select>-->
              </template>
            </el-table-column>
            <el-table-column prop="storeyheight" label="层高属性" width="100">
              <template slot-scope="scope">
                    <span v-if="scope.row.storeyheight>0">{{selectData.selectOptions[2].selectOption[scope.row.storeyheight].label}}</span>
                <!--<el-select disabled="disabled" v-if="scope.row.ishaveproperty>0"-->
                           <!--v-model="scope.row.storeyheight.toString()" placeholder="请选择活动区域">-->
                  <!--<el-option :label="item.label" :value="item.val"-->
                             <!--v-for="(item,index) in selectData.selectOptions[2].selectOption" :key="index"></el-option>-->
                <!--</el-select>-->
              </template>
            </el-table-column>
            <el-table-column prop="groupId" label="组团" width="100">
              <template slot-scope="scope">
                    <span v-if="scope.row.groupId">{{scope.row.groupName}}</span>
                <!--<el-select  v-model="scope.row.groupId" v-if="scope.row.groupId" placeholder="请选择" @click="selectBatch(scope.row)"-->
                           <!--ref="groupId">-->
                  <!--<el-option-->
                    <!--v-for="(item,index) in selectData.GroupAndBatch"-->
                    <!--:key="item.ID"-->
                    <!--:label="item.GROUPNAME"-->
                    <!--:value="item.ID"-->
                    <!--@click.native="subSelect(index,item,scope.row)"-->
                  <!--&gt;-->
                  <!--</el-option>-->
                <!--</el-select>-->
              </template>
            </el-table-column>
            <el-table-column prop="batchId" label="批次" width="100">
              <template slot-scope="scope">
                    <span v-if="scope.row.batchId">{{scope.row.batchName}}</span>
                <!--<el-select  v-model="scope.row.batchId" v-if="scope.row.batchId" placeholder="请选择">-->
                  <!--<el-option-->
                    <!--v-for="item in selectData.GroupAndBatch[index>0?index:parseInt(scope.row.SortNumber)-1].CHILDREN"-->
                    <!--:key="item.ID"-->
                    <!--:label="item.BATCHNAME"-->
                    <!--:value="item.ID"-->
                    <!--@click.native="subsSelect(item)"-->
                  <!--&gt;-->
                  <!--</el-option>-->
                <!--</el-select>-->
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteFormat($event,scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="qxcreateLDformat">取 消</el-button>
          <el-button type="primary" @click="qrcreateLDformat" :disabled="qdscyt">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog width="80%" title="楼栋·业态面积调整" :visible.sync="outerLD" :close-on-click-modal="closeModel"
                 :show-close="showClose">
        <el-dialog width="30%" title="批量选择楼栋" :visible.sync="innerLD" append-to-body :close-on-click-modal="closeModel"
                   id="moreFlor"
                   :show-close="showClose">
          <el-row>
            <label>楼栋列表</label>
            <el-checkbox v-model="checkedNum" @change="changeCheckBox">全部选择</el-checkbox>
          </el-row>
          <el-row>
            <label>可选楼栋</label>
            <el-checkbox-group v-model="currentSelect">
              <el-checkbox :disabled="item.isCurrentBuild" :label="item.buildName"
                           v-for="(item,index) in editBuildSelectListData.enableList" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-row>
            <label>不可选楼栋</label>
            <el-checkbox-group v-model="currentSelect2">
              <el-checkbox disabled :label="item.buildName" v-for="(item,index) in editBuildSelectListData.disableList"
                           :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="plxzldqx">取 消</el-button>
            <el-button type="primary" @click="plxzldqd">确定</el-button>
          </div>
        </el-dialog>
        <el-row id="seleAA" v-show="!isShow_">
          <input v-model="currentSelect.join(',')" disabled="disabled"/>
          <el-button size="mini" @click="ldxzClick">选择楼栋</el-button>
        </el-row>
        <el-row>
        </el-row>
        <el-row id="ytmjtable">
          <el-table :data="editProdutTypeListDataAreadataInfo" stripe border style="width: 100%" align="center"
                    height="300"
                    class="produtType">
            <div v-for="title in editProdutTypeListData.titleInfo" :key="title.name" class="tabTitle">
              <div v-if="title.name == '业态/楼栋'">
                <el-table-column fixed="left" :label="title.name" width="200">
                  <template slot-scope="scope">
                    <span>{{scope.row[title.field]}}</span>
                  </template>
                </el-table-column>
              </div>
              <div v-else>
                <!--(scope.row,title.field)-->
                <el-table-column v-if="!title.children" :prop="title.field" :label="title.name" width="150">
                  <template slot-scope="scope">
                    <el-input v-if="(title.field == 'ISHAVEPROPERTYNAME') || (title.field == 'ISDECORATIONNAME') || (title.field == 'STOREYHEIGHTNAME') || (title.field == 'GROUPNAME') || (title.field == 'BATCHNAME')" :disabled="(title.edit == '+w'? false: true)" v-model="scope.row[title.field]"></el-input>
                    <el-input v-if="(title.field == 'PRODUCTSERIES')" v-model="scope.row[title.field]" :disabled="(currentVersionText =='审批通过')"></el-input>
                    <el-input v-else size="mini" :disabled="(currentVersionText =='审批通过') || (title.edit == '+w'? false: true)"
                                     @blur="changeNumber2($event,scope.row,title.field)"   :value="scope.row[title.field]"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="title.name" v-else>
                  <el-table-column :prop="subTitle.field" :label="subTitle.name"
                                   v-for="(subTitle,index) in title.children" :key="subTitle.name" width="150">
                    <template slot-scope="scope">
                      <!--(scope.row,subTitle.field)-->
                      <el-input v-if="(subTitle.field == 'ISHAVEPROPERTYNAME') || (subTitle.field == 'ISDECORATIONNAME') || (subTitle.field == 'STOREYHEIGHTNAME') || (subTitle.field == 'GROUPNAME') || (subTitle.field == 'BATCHNAME')" :disabled="(subTitle.edit == '+w'? false: true)" v-model="scope.row[subTitle.field]"></el-input>
                      <el-input v-else size="mini" :disabled="(currentVersionText =='审批通过') || (subTitle.edit == '+w'? false: true)"
                                       @blur="changeNumber2($event,scope.row,subTitle.field)"     :value="scope.row[subTitle.field]"></el-input>
                    </template>
                  </el-table-column>
                </el-table-column>
              </div>
            </div>
          </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerLD = false">取 消</el-button>
          <el-button type="primary" @click="submitInfo">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="设置"  :visible.sync="dialog_Visible" width="30%" :close-on-click-modal="closeModel" :show-close="showClose">
        <el-row id="s_s">
        <el-col :span="12">
          <div class="grid-content">
            组团
            <el-select v-model="dialog_zt" placeholder="请选择">
              <el-option
                v-for="(item,index) in selectData.GroupAndBatch"
                :key="item.ID"
                :label="item.GROUPNAME"
                :value="item.ID"
                @click.native="sub_Select(index,item)"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            批次
            <el-select v-model="dialog_pc" placeholder="请选择">
              <!---->
              <el-option
                v-for="item in selectData.GroupAndBatch[selectIndex].CHILDREN"
                :key="item.ID"
                :label="item.BATCHNAME"
                :value="item.ID"
                @click.native="sub_Sel(item)"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="select_cancel">取 消</el-button>
          <el-button type="primary" @click="select_queding">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import "./area.less"
  export default {
    name: "Area",
    data() {
      return {
        current_select_item: '',
        dialog_zt_name: '',
        dialog_pc_name: '',
        selectIndex: 0,
        dialog_zt:'',
        dialog_pc:'',
        dialog_Visible: false,
        searchLD: '', // 楼栋查询关键字
        searchYT: '',// 业态选择
        selectYT: 'PRODUCTNAME',
        tabBS: 'first',
        searchText:'',
        btn:[true,false,false,false,false],
        dom:"",
        bj: '',
        isShow_: false,
        GROUPID_: '',
        BATCHID_: '',
        checkedNum: false,
        currentSelect2: [],
        currentSelect: [],
        ldxz: false,
        rules2: {},
        iscontrols: false,
        outerLD: false,
        innerLD: false,
        index: 0,
        YTMJTZ: false,
        argsArr: [],
        argsArrLD: [],
        descType: 'Building',
        attrData: {
          isdecoration: '',
          storeyheight: '',
          ishaveproperty: '',
          wb: '',
          zt: '',
          pc: '',
        },
        typeInfo: {
          COVER: '',
          PROPERTY: '',
          parkandsupport: []
        },
        ldTypeInfo: {
          COVER: '',
          PROPERTY: '',
          parkandsupport: [],
          zt: '',
          pc: '',
          wb: '',
          cg: '',
          residence: '',
          commercial: '',
        },
        groupObj: {},
        batchObj: {},
        currentId: '',
        ldCurrent: '',
//        searchListData: [],
        yt: {},
        stepType: 'area',
        dataKey: sessionStorage.getItem('nodeId'),
        isShow: [false, true],
        showClose: false,
        closeModel: false,
        productTypeId: '',
        currentStep: {
          "guid": 1,
          "name": "拿地版",
          "code": "Vote",
          "className": null,
          "status": 0,
          "statusCode": null
        },
        activeCard: 'first',
        outerVisible: false,
        innerVisible: false,
        outerLDVisible: false,
        innerLDVisible: false,
        buildId: [],
        LevelId: '',
        qdscyt: true,
        isSP: false,
        currentCode: 'Vote',
      }
    },
    created() {
      this.$store.dispatch("setVersion", '');
      this.$store.dispatch("setVersionText", '');
      this.getStageData({stepType: this.stepType, stageID: this.dataKey})
      this.getVersionListByBusinessldData({
        dataKey: this.dataKey,
        step: this.currentStep.code,
        projectLevel: 'Stage',
        dataType: 'Area'
      })
      this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
      this.getAreaListInfo({
        step: this.currentStep.code,
        projectLevel: 'Stage',
        versionId: this.currentVersion,
        productTypeId: '',
        descType: 'ProductType'
      })
      this.getSelectData({step: this.currentStep.code, projectLevel: 'Stage', ProjectStageId: this.dataKey})
    },
    computed: {
      ...mapGetters(['area_HightCurrentVersion','searchList_Data', 'areaDataInfo', 'editBuildListData', 'editProdutTypeListData', 'areaListInfo', 'createFormat', 'editBuildSelectListData', 'selectData', 'stageData', 'currentVersionText', 'versionListByBusinessldData', 'proposalInfoData', 'areaEditData', 'createVersion', 'currentVersion', 'buildingInfoData', 'type', 'commonPathRoleAuthority']),
      AreaEditDataProductTypeDataInfo: function () {
        let data = this.areaEditData.productTypeDataInfo
        if (data) {
          data.forEach(function (item) {
            item.TOTALBUILDINGAREA = Number(item.UPPERBUILDINGAREA + item.UNDERBUILDINGAREA).toFixed(1) || 0
            item.TOTALRENTALSALEAREA = Number(item.UPPERRENTALSALEAREA + item.UNDERRENTALSALEAREA).toFixed(1) || 0

          })
        }

        return data
      },
      editProdutTypeListDataAreadataInfo: function () {
        let data = this.editProdutTypeListData.areadataInfo
        if (data) {
          data.forEach(function (item) {
            item.TOTALBUILDINGAREA = (Number(item.UPPERBUILDINGAREA) + Number(item.UNDERBUILDINGAREA)).toFixed(1) || 0
            item.TOTALRENTALSALEAREA = (Number(item.UPPERRENTALSALEAREA) + Number(item.UNDERRENTALSALEAREA)).toFixed(1) || 0
            item.TOTALGIFTAREA = (Number(item.UPPERGIFTAREA) + Number(item.UNDERGIFTAREA)).toFixed(1) || 0
            item.GROUPNAME = item.GROUPID
            item.BATCHNAME = item.BATCHID
          })
        }
        return data
      },
    },
    methods: {
      ...mapActions(['setVersionText','getSearchListData', 'saveEditBuild', 'getAreaEditBuildList', 'getAreaEditProdutTypeList', 'saveAreaEditData', 'getAreaListInfo', 'saveProductType', 'deleteCreateFormat', 'getCreateFormat', 'deleteVersion', 'getAreaEditBuildSelectList', 'getSelectData', 'getStageData', 'setVersion', 'getVersionListByBusinessldData', 'getProposal', 'savePlanData', 'getAreaEditData', 'createVersions', 'getBuilding', 'getType']),
      sub_Select(index,item){
          this.selectIndex = index
          this.dialog_pc = item.CHILDREN[0].ID
          this.dialog_pc_name = item.CHILDREN[0].BATCHNAME
          this.dialog_zt = item.ID
          this.dialog_zt_name = item.GROUPNAME
          this.qdscyt = false
      },
      sub_Sel(item){
        this.dialog_pc = item.ID
        this.dialog_pc_name = item.BATCHNAME
        this.qdscyt = false
      },
      select_cancel(){
        this.selectIndex = 0
        this.dialog_pc = ""
        this.dialog_zt = ""
        this.dialog_zt_name = ""
        this.dialog_pc_name =""
        this.current_select_item = ""
        this.dialog_Visible = false
      },
      select_queding(){
        this.dialog_Visible = false
        this.current_select_item.groupId = this.dialog_zt
        this.current_select_item.groupName = this.dialog_zt_name
        this.current_select_item.batchId = this.dialog_pc
        this.current_select_item.batchName = this.dialog_pc_name
        this.current_select_item.SortNumber = this.selectIndex + 1
        this.select_cancel()
      },
      selectBatch (item){
        if(!item.producttypeid){
              return false
        }
        this.dialog_Visible = true
        this.current_select_item = item
        this.dialog_zt  = item.groupId
        this.dialog_pc  = item.batchId
        this.dialog_zt_name = item.groupName
        this.dialog_pc_name =item.batchName
        this.selectIndex = item.SortNumber-1
      },
      setActive () {
          let self = this
        this.stageData.forEach(function (sub) {
          if (self.currentStep.code === sub.code) {
            sub.active = 'apply'
          } else {
            sub.active = ' '
          }
        })
      },
      mbxClick (item) {
          let self = this
        this.stageData.forEach(function (sub) {
          self.currentCode =item.code
          if (item.code === sub.code) {
            sub.active = 'apply'
          } else {
            sub.active = ' '
          }
        })
        this.currentStep = item
        this.activeCard = 'first'
        this.tabBS = 'first'
        this.$store.dispatch("setVersion", '');
        window.setTimeout(function () {
          self.getVersionListByBusinessldData({
            dataKey: self.dataKey,
            step: self.currentStep.code,
            projectLevel: 'Stage',
            dataType: 'Area'
          })
        },1000)

        if (item.code != 'Vote') {
          this.isShow = [true, false]
          this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
          this.getBuilding({
            step: this.currentStep.code,
            projectLevel: 'Building',
            versionId: this.currentVersion,
            descType: this.descType
          })
          this.getType({
            step: this.currentStep.code,
            projectLevel: 'Building',
            versionId: this.currentVersion,
            descType: this.descType
          })

        } else {
          this.isShow = [false, true]
//          this.getVersionListByBusinessldData({
//            dataKey: this.dataKey,
//            step: this.currentStep.code,
//            projectLevel: 'Stage',
//            dataType: 'Area'
//          })
          this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
          this.getAreaListInfo({
            step: this.currentStep.code,
            projectLevel: 'Stage',
            versionId: this.currentVersion,
            productTypeId: '',
            descType: this.descType
          })
        }
      },
      refreshView () {
          let self = this
        if (this.currentStep.code == 'Vote') {
          this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
          this.getAreaListInfo({
            step: this.currentStep.code,
            projectLevel: 'Stage',
            versionId: this.currentVersion,
            productTypeId: '',
            descType: 'ProductType'
          })
        } else {
          this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
          this.getBuilding({
            step: this.currentStep.code,
            projectLevel: 'Building',
            versionId: this.currentVersion,
            descType: this.descType
          })
          this.getType({
            step: this.currentStep.code,
            projectLevel: 'Building',
            versionId: this.currentVersion,
            descType: this.descType
          })
        }

      },
      // 生成新版本
      createVersionClick () {
        let self = this
        if (this.currentVersionText == '编制中' || this.currentVersionText == '审批中') {
            this.$message({
              message: '审核通过才可创建新版本!',
              type: 'warning'
            });
            return false
        }
        if (this.currentStep.code == 'Vote') {
          this.createVersions({step: this.currentStep.code, dataKey: this.dataKey, projectLevel: 'Stage', vm: this})
        } else {
          this.createVersions({step: this.currentStep.code, dataKey: this.dataKey, projectLevel: 'Building', vm: this})
        }
        window.setTimeout(function () {
          self.getStageData({stepType: self.stepType, stageID: self.dataKey})
          self.getVersionListByBusinessldData({
            dataKey: self.dataKey,
            step: self.currentStep.code,
            projectLevel: 'Stage',
            dataType: 'Area'
          })
        }, 500)
        window.setTimeout(function () {
          self.setActive()
        },1000)
        this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
      },
      // 保存方案指标数据
      saveFrom () {
        let data = []
        this.proposalInfoData.forEach(function (item) {
          data.push({id: item.id, val: item.val, label: item.label, valueId: item.valueId})
        })
        this.savePlanData({
          step: this.currentStep.code,
          versionId: this.currentVersion,
          detaileData: JSON.stringify(data),
          vm: this
        })
        this.isSP = true
      },
      // 删除当前版本
      delFrom () {
          let self = this
        this.$confirm('您确定要删除当前面积版本吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deleteVersion({
            paramsdata: self.dataKey,
            step: self.currentStep.code,
            versionId: self.currentVersion,
            projectLevel: 'Stage',
            vm: self
          })
          window.setTimeout(function () {
            self.$store.dispatch("setVersion", '');
            self.getStageData({stepType: self.stepType, stageID: self.dataKey})
//          self.getStageData({stepType: self.stepType, stageVersionId: ''})
            self.getVersionListByBusinessldData({
              dataKey: self.dataKey,
              step: self.currentStep.code,
              projectLevel: 'Stage',
              dataType: 'Area'
            })
            self.getProposal({step: self.currentStep.code, versionId: self.currentVersion, dataType: 'Area'})
            self.getAreaListInfo({
              step: self.currentStep.code,
              projectLevel: 'Stage',
              versionId: self.currentVersion,
              productTypeId: '',
              descType: 'ProductType'
            })
          }, 1500)
          window.setTimeout(function () {
            self.setActive()
          },2000)
        }).catch(() => {
        });



      },
      // 非拿地板业态创建
      ldClick () {
        if (!this.currentVersion) {
          this.$message({
            message: '请先创建版本',
            type: 'warning'
          });
          return false
        }
        this.getSelectData({step: this.currentStep.code, projectLevel: 'Stage', ProjectStageId: this.dataKey})
        this.getSearchListData({step: this.currentStep.code, projectLevel: 'Building', versionId: this.currentVersion})
        this.outerLDVisible = true

      },
      // 拿地板 业态创建
      ytClick () {
        if (!this.currentVersion) {
          this.$message({
            message: '请先创建版本',
            type: 'warning'
          });
          return false
        }
        this.typeInfo = {
          residence: '',
          commercial: '',
          parkandsupport: [],
        }
        this.getSelectData({step: this.currentStep.code, projectLevel: 'Stage', ProjectStageId: this.dataKey, vm: this})
        this.getSearchListData({step: this.currentStep.code, projectLevel: 'Stage', versionId: this.currentVersion})
        this.outerVisible = true
      },
      // 设置版本
      setVersion: function (value) {
          let self = this
        this.$store.dispatch("setVersion", value);
        this.refreshView()
      },
      // 生成业态
      createYT: function () {
        if ((this.typeInfo.residence == '') && (this.typeInfo.commercial == '') && (this.typeInfo.parkandsupport.length<1)) {
          this.$message({
            message: '至少选择一项',
            type: 'warning'
          });
          return false
        }
        this.getCreateFormat({buildingNo: '', conditionData: this.argsArr, productTypeList: this.searchList_Data})
        this.typeInfo = {
          residence: '',
          commercial: '',
          parkandsupport: [],
        }
        this.bj = ''
        this.argsArr = []
        this.qdscyt = false
      },
      // 生成非拿地板业态
      createLDYT: function () {
        if(this.ldTypeInfo.wb == ''){
          this.$message({
            message: '请填写楼号',
            type: 'warning'
          });
          return false
        }
        if(this.ldTypeInfo.zt == ''){
          this.$message({
            message: '请选择组团',
            type: 'warning'
          });
          return false
        }
        if(this.ldTypeInfo.pc == ''){
          this.$message({
            message: '请选择批次',
            type: 'warning'
          });
          return false
        }
        if ((this.ldTypeInfo.residence == '') && (this.ldTypeInfo.commercial == '') && (this.ldTypeInfo.parkandsupport.length<1)) {
          this.$message({
            message: '住宅/公建/其它,至少选择一项.',
            type: 'warning'
          });
          return false
        }
        this.getCreateFormat({
          buildingNo: this.ldTypeInfo.wb,
          conditionData: this.argsArrLD,
          productTypeList: this.searchList_Data
        })
        this.ldTypeInfo = {
          COVER: '',
          PROPERTY: '',
          parkandsupport: [],
          zt: '',
          pc: '',
          wb: '',
          cg: '',
          residence: '',
          commercial:'',
        }
        this.argsArrLD = []
        this.qdscyt = false
      },
      // option 的点击事件
      selectAttr: function (ev,val,bj) {
        let even = ev || window.event
        this.bj = bj
        this.currentId = val
        this.innerVisible = true
        this.dom =  even.target.parentNode.parentNode.parentNode.parentNode.parentNode;
        if(this.dom.tagName == 'BODY'){
          let num = this.dom.children;
          for(var i in num){
            if(num[i].getAttribute('class') == "el-select-dropdown el-popper is-multiple"){
              num[i].style = "display:none"
            }
          }
        }
        if(this.dom.getAttribute('class') == "el-select-dropdown el-popper is-multiple"){
          this.dom.style="display:none"
        }
      },
      // 确认选择属性
      trueSelect: function () {
          if((this.attrData.ishaveproperty =='') || (this.attrData.ishaveproperty ==0)){
            this.$message({
              message: '请选择',
              type: 'warning'
            });
              return false
          }
        this.argsArr.push({id: this.currentId, ishaveproperty: this.attrData.ishaveproperty})
        this.currentId = ''
        this.attrData = {
          isdecoration: '',
          storeyheight: '',
          ishaveproperty: ''
        },
          this.innerVisible = false
      },
      // 取消选择属性
      closeSelect: function () {
          if (this.bj == 'parkandsupport') {
            this.typeInfo[this.bj] = []
          }else {
            this.typeInfo[this.bj] = ''
          }

        this.currentId = ''
        this.attrData = {
          isdecoration: '',
          storeyheight: '',
          ishaveproperty: ''
        },
//          this.typeInfo = {
//            COVER: '',
//            PROPERTY: '',
//            parkandsupport: ''
//          },
          this.innerVisible = false
      },
      deleteFormat (evt,row) {
          let event = evt || window.event
         event.stopPropagation();
        let self = this

        this.$confirm('您确定要删除当前业态吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.qdscyt = false
          if (row.producttypeid) {
            let arr = []
            self.searchList_Data.forEach(function (item) {
              if (row.id != item.id) {
                arr.push(item)
              }
            })
            self.deleteCreateFormat(arr)
          } else {
            let arr = []
            self.searchList_Data.forEach(function (item) {
              if (row.buildName != item.buildName) {
                arr.push(item)
              }
            })
            self.deleteCreateFormat(arr)
          }
        }).catch(() => {
        });
      },
      // 确认提交创建的业态数据
      qrcreateformat () {
        let self = this
        this.saveProductType({
          step: this.currentStep.code,
          projectLevel: 'Stage',
          versionId: this.currentVersion,
          dataKey: this.dataKey,
          formData: this.searchList_Data,
          vm: this
        })
        this.outerVisible = false
        window.setTimeout(function () {
          self.getVersionListByBusinessldData({
            dataKey: self.dataKey,
            step: self.currentStep.code,
            projectLevel: 'Stage',
            dataType: 'Area'
          })
          self.getAreaListInfo({
            step: self.currentStep.code,
            projectLevel: 'Stage',
            versionId: self.currentVersion,
            productTypeId: '',
            descType: 'ProductType'
          })
          self.qdscyt = true
        }, 500)

      },
      // 取消创建的业态数据
      qxcreateformat () {
        this.typeInfo = {
          residence: '',
          commercial: '',
          parkandsupport: [],
        }
        this.outerVisible = false
        this.qdscyt = true
      },
      // 确认创建 非 拿地板的业态数据
      qrcreateLDformat () {
        let self = this
        this.saveProductType({
          step: this.currentStep.code,
          projectLevel: 'Building',
          versionId: this.currentVersion,
          dataKey: this.dataKey,
          formData: this.searchList_Data,
          vm: this
        })
        this.outerVisible = false
        this.outerLDVisible = false
        window.setTimeout(function () {
          self.getBuilding({
            step: self.currentStep.code,
            projectLevel: 'Building',
            versionId: self.currentVersion,
            descType: 'Building'
          })
          self.getType({
            step: self.currentStep.code,
            projectLevel: 'Building',
            versionId: self.currentVersion,
            descType: 'Building'
          })
          self.qdscyt = true
        }, 500)
      },
      // 取消创建 非拿地板的业态数据
      qxcreateLDformat() {
        this.outerLDVisible = false
        this.ldTypeInfo = {
          COVER: '',
          PROPERTY: '',
          parkandsupport: [],
          zt: '',
          pc: '',
          wb: '',
          cg: '',
          residence: '',
          commercial:'',
        }
        this.argsArrLD = []
        this.qdscyt = true
      },
      // 编辑拿地板业态信息
      searchTypeClick (row) {
        this.getAreaEditData({
          step: this.currentStep.code,
          projectLevel: 'Stage',
          versionId: this.currentVersion,
          productTypeId: row.KEY
        })
        this.YTMJTZ = true
      },
      // 保存业态数据
      editYt () {
        let arrData = [], self = this
        this.areaEditData.productTypeDataInfo.forEach(function (item) {
          for (let arr in item) {
            if ((arr == 'TOTALBUILDINGAREA') || (arr == 'UPPERBUILDINGAREA') || (arr == 'UNDERBUILDINGAREA') || (arr == 'TOTALRENTALSALEAREA') || (arr == 'UPPERRENTALSALEAREA') || (arr == 'UNDERRENTALSALEAREA')) {
              arrData.push({
                id: item.KEY,
                versionId: self.currentVersion,
                quotaId: arr,
                quotaValue: item[arr],
                projectLevel: 'Stage'
              })
            }
          }
        })
        this.saveAreaEditData({paramsData: arrData, vm: this})
        this.YTMJTZ = false
        window.setTimeout(function () {
          self.getVersionListByBusinessldData({
            dataKey: self.dataKey,
            step: self.currentStep.code,
            projectLevel: 'Stage',
            dataType: 'Area'
          })
          self.getAreaListInfo({
            step: self.currentStep.code,
            projectLevel: 'Stage',
            versionId: self.currentVersion,
            productTypeId: '',
            descType: 'ProductType'
          })
          self.getProposal({step: self.currentStep.code, versionId: self.currentVersion, dataType: 'Area'})
          self.getAreaListInfo({
            step: self.currentStep.code,
            projectLevel: 'Stage',
            versionId: self.currentVersion,
            productTypeId: '',
            descType: 'ProductType'
          })

        }, 500)
      },
      // 非拿地板级联
      subSelect(index, name,row) {
        if(row){
          row.batchId = name.CHILDREN[0].ID
        }
        this.index = index
        this.groupObj = name
        this.qdscyt = false
      },
      subsSelect (name) {
        this.batchObj = name
        this.qdscyt = false
      },
      subLDSelect(ev,val,bj) {
        let even = ev || window.event
        this.ldCurrentId = val
        this.bj = bj
        this.innerLDVisible = true
          this.dom =  even.target.parentNode.parentNode.parentNode.parentNode.parentNode;
        if(this.dom.tagName == 'BODY'){
          let num = this.dom.children;
          for(var i in num){
            if(num[i].getAttribute('class') == "el-select-dropdown el-popper is-multiple"){
              num[i].style = "display:none"
            }
          }
        }
        if(this.dom.getAttribute('class') == "el-select-dropdown el-popper is-multiple"){
          this.dom.style="display:none"
        }

      },
      // 非拿地板 业态创建 属性选择
      trueLDSelect() {
//          if(this.bj =='parkandsupport'){
//            this.dom.style = "display:block"
//          }
        let self = this
        if ((this.attrData.isdecoration == 0) || (this.attrData.storeyheight == 0) || (this.attrData.ishaveproperty == 0)) {
          this.$message({
            message: '都为必填项,请选择!',
            type: 'warning'
          });
          return false
        }
        this.argsArrLD.push({
          groupId: this.groupObj.ID, batchId: this.batchObj.ID, buildName: this.ldTypeInfo.wb, id: this.ldCurrentId,
          ishaveproperty: this.attrData.ishaveproperty,
          storeyheight: this.attrData.storeyheight,
          isdecoration: this.attrData.isdecoration,
          standardfloorheight: 0,
        })
        this.attrData = {
          isdecoration: '',
          storeyheight: '',
          ishaveproperty: '',
        }
        this.ldCurrentId = ''
        this.attrData = {
          isdecoration: '',
          storeyheight: '',
          ishaveproperty: '',

        },
          this.innerLDVisible = false
      },

      currentLinkClick (row) {
        this.isShow_ = row.PARENTID == '0' ? false : true
        this.outerLD = true
        this.buildId = [row.BUILDID]
        this.currentSelect = []
        this.currentSelect.push(row.BUILDNAME)
        this.levelId = row.LevelId
        this.productTypeId = row.PRODUCTTYPEID ? row.PRODUCTTYPEID : ''
        this.getAreaEditBuildSelectList({
          buildId: this.buildId,
          productTypeId: this.productTypeId,
          versionId: this.currentVersion,
          descType: 'Building'
        })
        this.getAreaEditProdutTypeList({
          versionId: this.currentVersion,
          productTypeId: row.PRODUCTTYPEID ? row.PRODUCTTYPEID : '',
          buildId: row.BUILDID,
          descType: this.descType,
          isDecoration: row.ISDECORATION,
          isHaveProperty: row.ISHAVEPROPERTY,
          storeyHeight: row.STOREYHEIGHT
        })

      },

      handleCardClick (tab, event) {
        this.isSP = false
        this.tabBS = tab.name
        switch (tab.name) {
          case 'third':
            this.descType = 'Building'
            this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
            this.getBuilding({
              step: this.currentStep.code,
              projectLevel: 'Building',
              versionId: this.currentVersion,
              descType: 'Building'
            })
            this.getType({
              step: this.currentStep.code,
              projectLevel: 'Building',
              versionId: this.currentVersion,
              descType: 'Building'
            })
            break;
          case 'fourth':
            this.descType = 'ProductType'
            this.getProposal({step: this.currentStep.code, versionId: this.currentVersion, dataType: 'Area'})
            this.getBuilding({
              step: this.currentStep.code,
              projectLevel: 'Building',
              versionId: this.currentVersion,
              descType: 'ProductType'
            })
            this.getType({
              step: this.currentStep.code,
              projectLevel: 'Building',
              versionId: this.currentVersion,
              descType: 'ProductType'
            })
            break;
          case 'second':
            this.getVersionListByBusinessldData({
              dataKey: this.dataKey,
              step: this.currentStep.code,
              projectLevel: 'Stage',
              dataType: 'Area'
            })
            this.getAreaListInfo({
              step: this.currentStep.code,
              projectLevel: 'Stage',
              versionId: this.currentVersion,
              productTypeId: '',
              descType: 'ProductType'
            })
            break;

          default:
        }
      },
      closeLDSelect () {
        if (this.bj == 'parkandsupport') {
//          this.dom.style = "display:block"
          this.ldTypeInfo[this.bj] = []
        }else {
          this.ldTypeInfo[this.bj] = ''
        }
        this.attrData = {
          isdecoration: '',
          storeyheight: '',
          ishaveproperty: '',
        }

//        this.ldTypeInfo = {
//          COVER: '',
//          PROPERTY: '',
//          parkandsupport: [],
//          cg: '',
//          residence: '',
//          commercial:'',
//        }
        this.innerLDVisible = false
      },
      submitInfo() {
        let productTypeData = [], self = this, attrs = []
        this.editProdutTypeListData.titleInfo.forEach(function (item) {
          if (item.children) {
            item.children.forEach(function (sub) {
              if (sub.edit == '+w') {
                attrs.push(sub.field)
              }
            })
          } else {
            if (item.edit == '+w') {
              attrs.push(item.field)
            }
          }

        })
        this.editProdutTypeListData.areadataInfo.forEach(function (item) {
          for (let arr in item) {
            if (attrs.indexOf(arr) != -1) {
              productTypeData.push({
                id: item.KEY,
                versionId: self.currentVersion,
                quotaId: arr,
                quotaValue: item[arr] || 0
              })
            }

          }
        })
        let _buildIds = []
        this.editBuildSelectListData.enableList.forEach(function (item) {
          if (self.currentSelect.indexOf(item.buildName) != -1) {
            _buildIds.push(item.key)
          }
        })
        this.saveEditBuild({
          buildIds: _buildIds,
          singleProductType: {},
          levelId: 2,
          buildData: [],
          productTypeData: productTypeData
        })
        this.buildId = []
        this.levelId = ''
        this.outerLD = false

        window.setTimeout(function () {

          self.getBuilding({
            step: self.currentStep.code,
            projectLevel: 'Building',
            versionId: self.currentVersion,
            descType: 'Building'
          })
          self.getType({
            step: self.currentStep.code,
            projectLevel: 'Building',
            versionId: self.currentVersion,
            descType: 'Building'
          })
          self.getProposal({step: self.currentStep.code, versionId: self.currentVersion, dataType: 'Area'})
        }, 1000)
      },
      flow() {
        let isSave = true,self = this
        this.proposalInfoData.forEach(function (item) {

            if((item.val<1) && (item.edit != '+r') && (item.id !='SOFTSCENERY') && (item.id !='ANTISEISMICCAPACITY') && (item.id !='HARDSCENERY')){
            if(item.id == 'REGIONNAME'){
              if(!item.val || item.val.length <1){
                isSave = false
              }
            }else {
              isSave = false
            }
          }
        })
        if(!isSave) {
          this.$message({
            message: '请填写必填项!',
            type: 'warning'
          });
          return false
        }
        //发起审批
        const len = this.versionListByBusinessldData.length;
        let _data = {
          entiId: '10105',
          dataKey: this.currentVersion
        }
        this.$store.dispatch("commonIsFirstApproval")
          .then(res => {
            if (res.rows.length === 1 && res.rows[0].versionStatus === '0') {
            }
          }).then(res => {
          return this.$store.dispatch("commonStartApproval", _data);
        }).then(res => {
          this.$message.success("提交审批成功");

          self.getStageData({stepType: self.stepType, stageID: self.dataKey})
          self.getVersionListByBusinessldData({
            dataKey: self.dataKey,
            step: self.currentStep.code,
            projectLevel: 'Stage',
            dataType: 'Area'
        })
          window.setTimeout(function () {
            self.stageData.forEach(function (sub) {
              if (self.currentCode == sub.code) {
                sub.active = 'apply'
              } else {
                sub.active = ' '
              }
            })
          },1500)

        }).catch(err => {
          this.$message.error(err);
        })
        this.isSP = false
      },
      // 非那地板等楼栋选择
      ldxzClick() {
        let self = this
        this.innerLD = true
      },
      // 取消楼栋选择
      ldHandleClose() {
        this.innerLD = false
      },
      changeCheckBox () {
        let self = this
        self.currentSelect = []
        if (self.checkedNum) {
          self.editBuildSelectListData.enableList.forEach(function (item) {
            self.currentSelect.push(item.buildName)
          })
        } else {
          self.currentSelect = []
          self.editBuildSelectListData.enableList.forEach(function (item) {
            if (item.isCurrentBuild) {
              self.currentSelect.push(item.buildName)
            }
          })
        }
      },
      plxzldqx (){
        this.checkedNum = false
        let self = this
        this.currentSelect = []
        this.innerLD = false
        this.editBuildSelectListData.enableList.forEach(function (item) {
          if (item.isCurrentBuild) {
            self.currentSelect.push(item.buildName)
          }
        })

      },
      plxzldqd(){
          this.checkedNum = true
        this.innerLD = false
      },
      // 校验
      checkInput (item) {
        if(item.val == null){
            return false
        }
        let model = /^\d+:\d$/,self = this
        let isCheck = model.test(item.val)
        if(!isCheck){
          self.$message({
            message: '格式请参照(1:1)',
            type: 'warning'
          });
          item.val = ''
        }

      },
      tableRowClassName ({row, rowIndex}) {
        if(row.PARENTID == '0'){
           return 'tableRowClass'
        }
        return ''
      },
      rTClick(val){
        let arr = []
        this.argsArr.forEach(function (item){
            if(item.id != val){
              arr.push(item)
            }
        })
        this.argsArr = arr
      },
      removeTag (val) {
        let arr = []
        this.argsArrLD.forEach(function (item) {
            if(item.id != val){
              arr.push(item)
            }
        })
        this.argsArrLD = arr
      },
      changeNumber (evt,item) {
        let even =  evt || window.event
            if(isNaN(Number(even.target.value))){
              item.val = ''
            }else{
              item.val = Number(even.target.value).toFixed(1)
          }
      },
      changeNumberStr (evt,item) {
        let even =  evt || window.event
        let val = even.target.value
        if(val == ''){
            return false
        }
        if(isNaN(Number(val))){
          let reg = /^[0-9]*(：|:)[0-9]*$/
          if(!reg.test(val)){
            item.val = ''
          }else{
            item.val = val
          }
        }else{
          item.val = Number(val).toFixed(1)
        }

      },
      changeNumber2 (ev,row,attr) {
        let even = ev ||  window.event
        if(isNaN(Number(even.target.value))){
          row[attr] = ""
          return false
        }
        row[attr] = Number(even.target.value).toFixed(1)
      },
      searchClick () {
        let arr = [],self = this,isTrue = false
          self.getBuilding({
            step: self.currentStep.code,
            projectLevel: 'Building',
            versionId: self.currentVersion,
            descType: self.descType
          })
        window.setTimeout(function () {
          if(self.searchLD != '' && self.searchYT == ''){
            self.buildingInfoData.areadataInfo.forEach(function(item){
              if(item.BUILDNAME.indexOf(self.searchLD) != -1){
                arr.push(item)
              }
            })
            self.buildingInfoData.areadataInfo = arr
          }else if(self.searchLD != '' && self.searchYT != ''){
            self.buildingInfoData.areadataInfo.forEach(function(item){
              if((item.BUILDNAME.indexOf(self.searchLD) != -1 && !item.PRODUCTTYPEID) || (item.BUILDNAME.indexOf(self.searchLD) != -1 && item[self.selectYT] && item[self.selectYT].indexOf(self.searchYT) != -1)){
                arr.push(item)
              }
            })
            self.buildingInfoData.areadataInfo = arr
          }else if(self.searchLD == '' && self.searchYT != ''){
            let bj = []
            self.buildingInfoData.areadataInfo.forEach(function(item){
              if(item[self.selectYT] && item[self.selectYT].indexOf(self.searchYT) != -1){
                bj.push(item.BUILDNAME);
              }
            })
            self.buildingInfoData.areadataInfo.forEach(function(item){
              if((!item.PRODUCTTYPEID && bj.indexOf(item.BUILDNAME) !=-1) || (item[self.selectYT] && item[self.selectYT].indexOf(self.searchYT) != -1)){
                arr.push(item)
              }
            })
            self.buildingInfoData.areadataInfo = arr
          }else {
            self.getBuilding({
              step: self.currentStep.code,
              projectLevel: 'Building',
              versionId: self.currentVersion,
              descType: self.descType
            })
          }

        },1000)


      }

    },
    watch: {
      currentVersion: function (oldHeightVersion, newHeightVersion) {
        this.setVersion(oldHeightVersion)
        sessionStorage.setItem('currentVersion', oldHeightVersion)
        this.refreshView()
      },
      // 监听 状态 动态设置 按钮权限
      currentVersionText: function (oldBtn,newBtn) {
          switch (oldBtn){
            case '未编制':
              this.btn = [true,false,false,false,false]
              break;
            case '编制中':
              this.btn = [true,true,true,true,true]
              break;
            case '审批中':
              this.btn = [false,false,false,false,false]
                break;
            case '审批通过':
              this.btn = [false,false,false,false,false]
                break;
            case '驳回':
              this.btn = [true,true,true,true,true]
                break;
            default:

          }
      },
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  #s_s .el-select{
    width: 70% !important;
  }
  .formatClass {
    margin-top: 10px;
  }

  #crumbs {
     margin-top: 5px;
    float: left;
  }

  #crumbs ul li {
    position: relative;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 3px;
    box-sizing: border-box;
    margin-left: 2px;
  }

  #crumbs ul li a {
    display: block;
    float: left;
    min-width: 95px;
    height: 30px;
    line-height: 30px;
    background: #4c72a4;
    text-align: center;
    position: relative;
    padding: 0 20px 0 40px;
    text-decoration: none;
    color: #fff;
    font-size: 12px;
    box-sizing: border-box;
  }

  #crumbs ul li a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 15px solid #4c72a4;
    position: absolute;
    right: -15px;
    top: 0;
    z-index: 5;
  }

  #crumbs ul li a:before {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 15px solid #fff;
    position: absolute;
    left: 0;
    top: 0;
  }

  #crumbs ul li:first-child a:before {
    display: none;
  }

  #crumbs ul li a:hover {
    background: #f1a118;
  }

  #crumbs ul li a:hover:after {
    border-left-color: #f1a118;
  }

  .contentA {
    margin-top: 50px;
    width: 100%;
  }

  .saveFrom {
    display: inline-block;
    float: right;
    padding-right: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    color: white;
  }

  .caozuo {
    display: inline-block;
    float: right;
  }

  .fr {
    display: inline-block;
    float: right;
  }

  .currentLink {
    color: #108ee9;
    cursor: pointer;
  }

  #formItem .el-form-item {
    margin-bottom: 22px;
    float: left;
    width: 25%;
    .el-input__inner {
      width: 40%;
    }
  }

  .saveFrom1 {
    cursor: pointer;
    margin: 0 1px;
  }

  #caozuo {
    position: relative;
    .el-icon-plus, .el-icon-edit-outline, .el-icon-delete {
      font-size: 12px;
      padding: 5px;
      font-weight: bolder;
    }
  }

  .special-btn {
    position: absolute;
    right: 3px;
    top: 0;
  }

  .btn-wrapper {
    position: absolute;
    right: 3px;
    top: 25px;
  }

  .edition {
    width: 60px;
    margin-right: 10px;
  }

  .edition option {
    height: 20px;
  }

  .content {
    padding-top: 20px;
  }

  .el-select-dropdown__item {
    padding-top: 0px;
    height: 24px !important;
    line-height: 24px !important;
  }

  .el-select-dropdown__item span {
    padding-top: 0px;
    line-height: 24px !important;
  }

  .savebtn {
    display: inline-block;
    float: right;
    margin-right: 10px;
    cursor: pointer;
    font-size: 12px;
  }

  #ytmjtz {
    .bascInfo {
      display: inline-block;
      float: left;
      text-align: left;
    }
  }

  #ytmjtz .yttables {
    margin-top: 20px;
  }

  #formItem {
    .el-input {
      height: 25px !important;
      .el-input__inner {
        height: 25px !important;
      }
    }
  }

  .indentity-title {
    width: 100%;
    height: 36px;
    line-height: 36px;
    border-bottom: 2px solid #F4F6F9;
    box-sizing: border-box;
  }

  .el-select {
    width: 40%;
  }

  #ytld {
    .el-select-dropdown__item {
      line-height: 30px !important;
      height: 30px;
    }
    .el-dialog__header{
      padding: 4px 16px;
    }
    .el-dialog__body {
      padding: 4px 16px !important;
    }
  }

  .el-input-number--small {
    width: 70% !important;
    float: left !important;
    line-height: 40px !important;
  }

  .inputString {
    height: 25px !important;
    width: 100% !important;
  }

  .heightTable {
  }

  .apply {
    background: #f1a118 !important;

  }

  .apply:after {
    border-left: 15px solid #f1a118 !important;
  }

  #seleAA {
    margin: 8px 0;
  }

  #seleAA input {
    width: 80px !important;
    height: 25px !important;
    border: #f4f6f9;
    border-radius: 3px;
    text-align: center;
    background: #ebeced;
    margin-right: 5px;
  }

  // lb添加样式
  #gridContent .el-select {
    margin-left: 5px;
  }

  #stageBox .el-input--suffix .el-input__inner {
    text-align: center !important;
  }

  .yt-select {
    width: 82%;
    text-align: left !important;
  }

  .edition {
    margin-left: 10px;
    width: 60px;
  }

  .cqsx {
    width: 250px;
  }

  .el-table_2_column_12 > .cell > .el-select > .is-disabled > .el-input__inner {
    border: none !important;
  }

  .ldwh {
    width: 250px;
  }

  .zz input {
    width: 185px;
  }

  .el-form-item__label {
    font-size: 13px !important;
  }

  .produce-status {
    font-size: 14px !important;
  }

  #spanbox {
    .el-input .el-input--mini .el-input--suffix {
      width: 80px !important;
      height: 25px !important;
    }
    .el-input__inner {
      width: 50px;
      height: 30px;
    }
  }

  .alignCenter {
  }

  .alignLeft {
    padding-left: 10px !important;
    display: block;
    text-align: left !important;
  }
  .textms p {
    line-height: 16px;
    font-size: 12px;
    color: red;
  }
  .textms p:last-child {
   margin-bottom: 10px;
  }
  .el-select .el-tag{
    margin: 0;
    white-space: nowrap;
    margin-right: 2px;

  }
  #crumbs ul li .active.back-yellow{
    background: yellow;
  }
  #crumbs ul li .active {
    position: absolute;
    width: 14px;
    height: 14px;
    background: #fff;
    top: 50%;
    left: 40px;
    transform: translate(-18px, -50%);
    z-index: 4;
    border-radius: 50%;
  }

  .legend-white {
    background: #fff !important;
    border: 1px solid #ccc;
  }

  .legend-blue {
    background: #2979ff !important;
    border: 1px solid #ccc;
  }

  .legend-yellow {
    background: #FFFF00 !important;
    border: 1px solid #ccc;
  }

  .legend-green {
    background: #00e676 !important;
    border: 1px solid #ccc;
  }
  .searchTable {
    margin-left: 20px;
    // margin-bottom: 10px;
    display: inline-block;
  }
  .search_Table {
    // margin-bottom: 10px;
    display: inline-block;
  }
  .searchTable .titleTable {
    display: inline;
    float: left;
  }
  .searchTable .el-select{
    width: 100px;
  }
  #area .searchTable .el-input-group>.el-input__inner {
    vertical-align: middle;
    display: inline-block !important;
}
  .settingColor {
    font-size: 12px !important;
    font-weight: 500 !important;
    color: darkviolet !important;
  }
</style>
