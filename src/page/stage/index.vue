<template>
  <div style="padding-right: 20px;" id="stageBox">
    <!--版本信息-->
    <div class="indentity-title clear">
      <p class="fl" style="font-size: 15px !important;border-bottom: 2px solid #4478E8;font-weight: bold">分期信息</p>
      <div class="grid-content bg-purple-light fr" id="selectBox"
           style="display: inline-block;font-size: 12px;text-align: right">
        <span style="padding-right: 10px;">
        <el-button size="mini" @click="save" v-if="!stageEdit && commonPathRoleAuthority.indexOf('btn_edit') > -1"
                   style="background-color: rgb(76, 170, 244);color: #fff;padding: 1px 10px !important;border-radius: 5px;">
          <i class="el-icon-document" style="color: #fff !important;font-size: 14px;">{{stageVersionStatus !='审批通过' ? '保存' : '升版'}}</i>
        </el-button>
         <i class="el-icon-arrow-right" style="display: none;"></i>
          <!--<el-button size="mini" @click="edit">编辑</el-button>-->
      </span>
        <span
          v-if="commonPathRoleAuthority.indexOf('btn_approval') > -1 && $route.query.nodeId && stageVersionStatus !='审批中' && stageVersionStatus !='审批通过'"
          style="padding: 5px 8px;cursor: pointer;background: #4caaf4;color: #fff;border-radius: 5px"
          @click="startApproval">
          发起审批
        </span>
        <span style="color: #4caaf4;margin-left: 10px;">当前版本:</span>
        <span id="version" style="display: inline-block">
            <el-select :value="stageCurrentVersion" @change="stageChangeVersion" placeholder="" class="version_width">
              <el-option
                v-for="(item, index) in stageVersion"
                :key="index"
                :label="item.showName"
                :value="item.versionId">
              </el-option>
            </el-select>
         </span>
        <span style="margin-left: 30px;">状态: {{stageVersionStatus}}</span>
      </div>
    </div>
    <!--分期身份信息-->
    <div id="identityBox">
      <div style="width: calc(100%)">
        <p class="indentity-annotate" v-if="false">注:页面灰色部分为取值，不可编辑。页面白色部分为填写项。</p>
        <table class="stageVTable" border="1" cellspacing="1" width="100%" bordercolor="#f4f6f9">
          <tbody>
          <tr>
            <td class="stageViewTitle">
              <span class="required">*</span>分期名称
            </td>
            <td class="stageViewCon">
              <el-input v-model="stageIdentityInfo.vStageIdentityInfo.stageName" placeholder=""
                        :disabled="(stageVersionStatus=='审批通过')|| stageEdit"></el-input>
            </td>
            <td class="stageViewTitle">
              分期编号
            </td>
            <td class="stageViewCon">
              <el-input v-model="stageIdentityInfo.vStageIdentityInfo.stageCode" placeholder=""
                        readonly :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td class="stageViewTitle">
              分期建立日期
            </td>
            <td class="stageViewCon" id="indentityDate">
              <!-- <el-input v-model="stageIdentityInfo.vStageIdentityInfo.stageCreateDate " placeholder=""
                         :disabled="true">
               </el-input>-->
              <el-date-picker id="IdentityDate"
                              v-model="stageIdentityInfo.vStageIdentityInfo.stageCreateDate"
                              type="date"
                              :disabled="true">
              </el-date-picker>
              <!--  <el-date-picker v-if="!stageEdit" v-model="stageIdentityInfo.vStageIdentityInfo.stageCreateDate"
                                type="date" format="yyyy-MM-dd"
                                placeholder="选择日期" :disabled="stageEdit">
                </el-date-picker>
               -->
            </td>
            <td class="stageViewTitle">
              <span class="required">*</span>分期项目负责人
            </td>
            <td class="stageViewCon">
              <!--<el-input v-model="stageIdentityInfo.vStageIdentityInfo.principal" placeholder=""-->
              <!--:disabled="stageEdit"></el-input>-->
              <el-input :disabled="stageEdit" v-model="stageIdentityInfo.vStageIdentityInfo.principal" :readonly="true"
                        suffix-icon="el-icon-edit-outline" @click.native="setting()"></el-input>
            </td>
          </tr>
          <tr>
            <td class="stageViewTitle">
              <span class="required">*</span>开发方式
            </td>
            <td class="stageViewCon" id="development">
              <el-select :value="stageIdentityInfo.vStageIdentityInfo.developmentId" placeholder=""
                         :disabled="stageEdit" @change="mode">
                <el-option
                  v-for="(item,index) in stages"
                  :key="index"
                  :label="item.landProperty"
                  :value="item.landPropertyId">
                </el-option>
              </el-select>
            </td>
            <td class="stageViewTitle">
              <span class="required">*</span>公司权益比例(%)
            </td>
            <td class="stageViewCon" id="identityComp">
              <el-input v-model="stageIdentityInfo.vStageIdentityInfo.companyProportion"
                        placeholder="" :disabled="stageEdit">
                <i slot="suffix" class="hundred">%</i>
              </el-input>

            </td>
          </tr>
          <tr>
            <td class="stageViewTitle">
              <span class="required">*</span>投资公司名称
            </td>
            <td class="stageViewCon" style="position: relative">
              <div style="width: 99.5%;height: 100%;position: relative;border: 1px solid #dcdfe6; height: 25px;"
                   :class="stageEdit ? 'active':''" @click="setCompannyName({'name':'投资公司名称'},$event)">
                  <span v-for="(item,index) in stageIdentityInfo.InverstBuildUnit" :key="'stage_a' + index"
                        style="padding-left: 10px;padding-right: 10px;"
                        v-if="item.COMPANNYNAME != null && item.COMPANNYNAME != ''">
                     <input
                       type="button"
                       v-model="item.COMPANNYNAME"
                       :id="item.ID"
                       :name="item.COMPANNYNAME"
                       placeholder=""
                       :disabled="stageEdit"
                     />

                      <span v-if="index != (stageIdentityInfo.InverstBuildUnit.length-1)">,</span>



                  </span>
              </div>
              <div v-if="stageEdit" class="mask"
                   style="position: absolute;left: 0;top: 0; width: 100%;height: 100%;cursor: not-allowed"></div>
              <el-dialog :title="titleDialog" :visible.sync="addCompannyName" :show-close="false" width="30%">
                <el-row>
                  <el-col :span="20">
                    <div v-for="(item,index) in InverstMiddle" :key="index" style="height:30px;margin-top: 10px;">
                      <el-input placeholder="" v-model="item && item.COMPANNYNAMEMiddle"
                                :disabled="false" class="input-w">
                      </el-input>
                    </div>
                  </el-col>
                  <el-col :span="4" :push="1" style="line-height: 45px">
                    <!--<div class="grid-content bg-purple-light">-->
                    <i class="el-icon-plus" @click="infoAddButton(titleDialog)"></i>
                    <i class="el-icon-delete" @click="infoDelButton(titleDialog)"></i>
                    <!-- </div>-->
                  </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                <el-button @click="canleDialogEvent({'name':'投资公司名称'},$event)">取 消</el-button>
                <el-button type="primary" @click="submitDialogEvent({'name':'投资公司名称'},$event)">确 定</el-button>
              </span>
              </el-dialog>
            </td>
            <td class="stageViewTitle">
              <span class="required">*</span>施工总承包单位
            </td>
            <td class="stageViewCon" style="position: relative">
              <div style="width: 99.5%;height: 100%;border: 1px solid #dcdfe6; height: 25px;"
                   :class="stageEdit ? 'active':''" @click="setCompannyName({'name':'施工总承包单位'},$event)">
                <span v-for="(item,index) in stageIdentityInfo.ProjectBuildUnit" :key="'stage_c' + index"
                      style="padding-left: 10px" v-if="item.COMPANNYNAME != null && item.COMPANNYNAME != ''">
                   <input type="button"
                          v-model="item.COMPANNYNAME"
                          :id="item.ID"
                          :name="item.COMPANNYNAME"
                          placeholder=""
                          :disabled="stageEdit"
                   />
                  <span v-if="index != (stageIdentityInfo.ProjectBuildUnit.length-1)">,</span>
                </span>
              </div>
              <div v-if="stageEdit" class="mask"
                   style="position: absolute;left: 0;top: 0; width: 99.5%;height: 100%;cursor: not-allowed"></div>
              <el-dialog :title="titleDialog" :visible.sync="addCompannyNameProject" :show-close="false" width="30%">
                <el-row>
                  <el-col :span="20">
                    <div v-for="(item,index) in ProjectMiddle" :key="index"
                         style="height:30px" id="mt10">
                      <el-input placeholder="" v-model="item && item.COMPANNYNAMEMiddle" :disabled="false"
                                class="input-w">
                      </el-input>
                    </div>
                  </el-col>
                  <el-col :span="4" :push="1" style="line-height: 57px">
                    <!--<div class="grid-content bg-purple-light">-->
                    <i class="el-icon-plus" @click="infoAddButton(titleDialog)"></i>
                    <i class="el-icon-delete" @click="infoDelButton(titleDialog)"></i>
                    <!-- </div>-->
                  </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">

                  <el-button @click="canleDialogEvent({'name':'施工总承包单位'},$event)">取 消</el-button>
                <el-button type="primary" @click="submitDialogEvent({'name':'施工总承包单位'},$event)">确 定</el-button>
                  <!--<el-button @click="addCompannyNameProject = false">取 消</el-button>
                  <el-button type="primary" @click="addCompannyNameProject = false">确 定</el-button>-->
              </span>
              </el-dialog>
            </td>
          </tr>
          <tr>
            <td class="stageViewTitle">
              <span class="required">*</span>项目公司名称
            <td class="stageViewCon">
              <el-input v-model="stageIdentityInfo.vStageIdentityInfo.projectCompanyName" placeholder=""
                        :disabled="stageEdit"></el-input>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--土地规划指标 map-->
    <div id="groundBox">
      <el-row>
        <div class="clear"
             style="line-height: 36px;padding:0 10px 0 0; box-sizing: border-box;border-bottom: 2px solid #f4f6f9">
          <div class="fl" style="border-bottom: 2px solid #4478E8">
            <p style="font-size: 15px !important;font-weight: bold">土地规划指标</p>
          </div>
          <div class="fr" @click="mapEvent" style='position: relative'>
            <a href="javascript:;" class="el-icon-circle-plus-outline"
               style="padding:6px; border-radius:3px;border: 1px solid #4caaf4;color: #4eabf5;">上传总图</a>
            <div style="position: absolute;left: 0;top:0;width: 100%;height: 100%;" v-if="!stageEdit"></div>
          </div>
        </div>
        <div style="margin-top: 15px;">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div id="programBox">
                <div class="stageVLeft">
                  <table class="stageVTable" border="1" cellspacing="1" width="100%">
                    <tbody>
                    <tr>
                      <td class="stageViewTitle">
                        <span class="required">*</span>项目用地面积(㎡)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols" title="只能输入数字"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.projectArea"
                                         :disabled="stageEdit"
                                         placeholder="">
                        </el-input-number>
                      </td>
                      <td class="stageViewTitle">
                        <span class="required">*</span> 建筑面积(㎡)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.buildArea" :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                    </tr>
                    <tr>
                      <td class="stageViewTitle">
                        <span class="required">*</span>土地出让金(万元)
                      <td class="stageViewCon">
                        <el-input :maxlength="9"
                                  @change="landGrantEvent(stageIdentityInfo.vStageIdentityInfo,'landGrant')"
                                  v-model="stageIdentityInfo.vStageIdentityInfo.landGrant" :disabled="stageEdit">
                        </el-input>
                      </td>
                      <td class="stageViewTitle">
                        <span class="required">*</span>容积率
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.plotratio" :disabled="stageEdit"
                                         placeholder="">
                        </el-input-number>
                      </td>
                    </tr>
                    <tr>
                      <td class="stageViewTitle">
                        <span class="required">*</span>绿地率(%)
                      </td>
                      <td class="stageViewCon">
                        <el-input @change="landGrantEvent(stageIdentityInfo.vStageIdentityInfo,'greenRate')"
                                  v-model="stageIdentityInfo.vStageIdentityInfo.greenRate" :disabled="stageEdit"
                                  style="text-align: right!important;"
                                  placeholder="">
                          <i slot="suffix" class="hundred" style="line-height: 27px;">%</i>
                        </el-input>
                      </td>
                      <td class="stageViewTitle">
                        <span class="required">*</span>建筑密度
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.buildDensity"
                                         :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                    </tr>
                    <tr>
                      <td class="stageViewTitle">
                        <span class="required">*</span>住户总数(户)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.houseNum" :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                      <td class="stageViewTitle">
                        <span class="required">*</span>建筑限高(m)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.buildLimit"
                                         :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                    </tr>
                    <tr>
                      <td class="stageViewTitle">
                        <span class="required">*</span>人防面积(㎡)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.defenceArea"
                                         :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                      <td class="stageViewTitle">
                        <span class="required">*</span>公共设施配套面积(m²)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.publiceArea"
                                         :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                    </tr>
                    <tr>
                      <td class="stageViewTitle">
                        <span class="required">*</span>停车位配比
                      </td>
                      <td class="stageViewCon">
                        <el-input v-model="stageIdentityInfo.vStageIdentityInfo.parkRatio" :disabled="stageEdit"
                                  @blur="changeNumberStr($event,stageIdentityInfo.vStageIdentityInfo)"        placeholder=""></el-input>
                      </td>
                      <td class="stageViewTitle">
                        车位数(个)
                      </td>
                      <td class="stageViewCon">
                        <!--v-model="stageIdentityInfo.vStageIdentityInfo.totle"-->
                        <el-input-number :min="0" :max="999999" :controls="iscontrols"
                                         :value="carSunNum" :disabled="true" placeholder="">
                        </el-input-number>
                      </td>
                    </tr>
                    <tr>
                      <td class="stageViewTitle">
                        <span class="required">*</span>地上车位(个)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="99999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.upParkSpace"
                                         :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                      <td class="stageViewTitle">
                        <span class="required">*</span>地下车位(个)
                      </td>
                      <td class="stageViewCon">
                        <el-input-number :min="0" :max="99999999" :controls="iscontrols"
                                         v-model="stageIdentityInfo.vStageIdentityInfo.underParkSpace"
                                         :disabled="stageEdit"
                                         placeholder=""></el-input-number>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="11" :offset="1">
            <!--<div class="grid-content bg-purple-light">
             <div class="clear">
               <div class="fr"
                    style="width:100%;min-height: 370px;overflow: hidden;border: 1px solid #b5b1b1; position: relative">
                 <div @click="mapEventSmall"
                      style="position: absolute;width: 30px;height: 30px;color: #fff;font-weight: bold;font-size: 20px;bottom: 10px;right: 10px;cursor: pointer">
                   <img :src="fullScreenIcon" alt="全屏" style="width: 100%;height: 100%;">
                 </div>
                 <iframe :src="commonStageIframeUrl" width="100%" height="100%;" border="none" frameborder="0"></iframe>

               </div>
             </div>
           </div>-->
            <div style="height: 370px; width: 100%; border:1px solid #c0c4cc;position: relative"
                 v-loading="commonIframeLoading"
                 element-loading-background="#fff">
              <div @click="mapEventSmall"
                   style="position: absolute;width: 30px;height: 30px;color: #fff;font-weight: bold;font-size: 20px;bottom: 10px;right: 10px;cursor: pointer">
                <img :src="fullScreenIcon" alt="全屏" style="width: 100%;height: 100%;">
              </div>
              <iframe v-if="commonIframeHasPicture" :src="commonStageIframeUrl" width="100%" height="100%;"
                      border="none" frameborder="0"></iframe>
              <div v-else class="img_container">
                <img :src="commonStageIframeUrl" alt="">
              </div>
            </div>
          </el-col>
        </div>

      </el-row>
    </div>
    <!--土地列表-->
    <div id="groundList">
      <div class="ground-box clear" style="box-sizing: border-box;">
        <p class="fl" style="border-bottom: 2px solid #4478e8;font-size: 15px !important;font-weight: bold">土地列表</p>
        <span class="fr" v-if="!stageEdit">
          <i class="el-icon-plus" @click="addLandGround"></i>
          <i class="el-icon-delete" v-if="stageIdentityInfo.vLandList.length>1" @click="delLandGround"></i>
        </span>
      </div>
      <div v-for="(item,index) in stageIdentityInfo.vLandList" :key="index" style="margin-top: 10px;">
        <p class="ground-temp-title" style="font-size: 14px;">土地块{{++index}}</p>
        <div class="stageVLeft">
          <table class="stageVTable" border="1" cellspacing="1" width="100%">
            <tbody>
            <tr>
              <td class="stageViewTitle">
                <span class="required">*</span>土地获取日期
              </td>
              <td class="stageViewCon">
                <el-date-picker
                  v-model="item.GAINDATE"
                  :disabled="stageEdit"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </td>
              <td class="stageViewTitle">
                <span class="required">*</span>土地证起始日期
              </td>
              <td class="stageViewCon">
                <el-date-picker
                  v-model="item.LANDCERTIFICATE"
                  :disabled="stageEdit"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </td>
            </tr>
            <tr>
              <td class="stageViewTitle">
                <span class="required">*</span>土地性质
              </td>
              <td class="stageViewCon" id="landProperty">
                <el-select v-model="item.LANDPROPERTY" :disabled="stageEdit" id="groundSel"
                           placeholder="" @change="landPropertyVal"
                >
                  <el-option
                    v-for="(sub, index) in landPropertys"
                    :key="index"
                    :label="sub.DICNAME"
                    :value="sub.ID">
                  </el-option>
                </el-select>
              </td>
              <td class="stageViewTitle">
                <span class="required">*</span>规划用途
              </td>
              <td class="stageViewCon" style="height: 30px;overflow: hidden;white-space: nowrap" id="groundUse">
                <el-select v-model="item.LANDPLANUSEID" multiple :disabled="stageEdit" placeholder="">
                  <el-option
                    v-for="(plan,index) in landPlanUses"
                    :key="index"
                    :label="plan.DICNAME"
                    :value="plan.ID">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="stageViewTitle">
                <span class="required">*</span>土地使用年限
              </td>
              <td class="stageViewCon" v-if="item.LANDPLANUSEID" id="groundDate">
                <el-select v-model="item.LANDPLANUSEID" :value="item.landPlanUse" multiple :disabled="stageEdit"
                           id="groundYear" placeholder="">
                  <el-option
                    v-for="(yeas,index) in landPlanUses"
                    :key="index"
                    :label="yeas.DICVALUE"
                    :value="yeas.ID">
                  </el-option>
                </el-select>
              </td>

            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!--项目经营目标-->
    <!-- <div id="targetStage">
       <el-row>
         <el-col :span="24">
           <div class="grid-content bg-purple-dark">
             <div style="width: 100%;" id="targetBox">
               <p class="indentity-title clear" style="text-align: left;">
                 <span style="border-bottom: 2px solid #0068b7;padding-bottom: 6px; font-size: 14px;font-weight: bold">项目经营目标</span>
               </p>
               <div class="stageVLeft" style="margin-top: 30px;">
                 <el-table :data="stageProjectTart" border style="width: 100%" empty-text="暂无数据"
                           id="stageProjectTartTable">
                   <el-table-column v-for="(title,index) in mTitle" :prop="title.field" :key="index" :label="title.name" id="stageProjectTartColumn" type="index" width="152">
                     <template slot-scope="scope">
                       <div v-if="(scope.row.key == 'TOTALVALUE') ||(index ==0)">
                         <el-input class="target-table" :readonly="false" v-model="scope.row[title.field]"
                                   id="stageProjectTartInput" placeholder=""></el-input>
                       </div>
                       <div v-else>
                         <div v-if="scope.row.key == 'TIMECYCLETIME'" style="text-align: right">
                           <el-date-picker
                             :readonly="stageEdit"
                             v-model="scope.row[title.field]"
                             type="month"
                             placeholder="选择月"
                             format="yyyy - MM"
                             value-format="yyyy-MM"
                           >
                           </el-date-picker>
                         </div>
                         <div v-else>
                           <el-input :readonly="stageEdit" v-model="scope.row[title.field]"
                                     placeholder="">
                           </el-input>
                         </div>
                       </div>
                     </template>
                   </el-table-column>
                 </el-table>
               </div>
             </div>
           </div>
         </el-col>
       </el-row>
     </div>-->
    <div id="stagetargetbox" style="margin-top: 15px;">
      <p class="indentity-title clear" style="text-align: left;">
        <span
          style="border-bottom: 2px solid rgb(68, 120, 232);padding-bottom: 6px; font-size: 15px !important;font-weight: bold">项目经营目标</span>
      </p>
      <div style="margin-top: 15px;">
        <table class="projectVTable" border="1" cellspacing="1">
          <tbody>
          <tr style="text-align: center">
            <td class="projectViewTitle" v-for="(item, key) in mTitle" :key="key+'title'">
              <span v-if="item.name != '项目经营目标' && item.name !='投决会指标'"><span class="required">*</span>{{item.name}}</span>
              <span v-else>{{item.name}}</span>
            </td>
          </tr>
          <tr v-for="(targetinfo,index) in stageProjectTart" :key="index+'data'">
            <td class="projectViewTitle" style="white-space:nowrap;text-align:left;padding-left:5px">
              {{targetinfo.MANAGEMENTOBJECTIVES}}
            </td>
            <td class="stageViewCon">
              <div v-if="index == 5">
                <el-date-picker
                  v-model="targetinfo.VOTINGMEETING"
                  type="month"
                  :disabled="stageEdit"
                  value-format="yyyy-MM"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div v-else>
                <el-input v-model="targetinfo.VOTINGMEETING" :disabled="stageEdit" :maxlength="6"
                          @change="valueFormatEvent(targetinfo,'VOTINGMEETING')">
                  <i slot="suffix">{{index | suffixFilter}}</i>
                </el-input>
              </div>
            </td>
            <td class="stageViewCon">
              <div v-if="index == 5">
                <el-date-picker
                  v-model="targetinfo.FIRSTYEARQUOTA"
                  type="month"
                  :disabled="stageEdit"
                  value-format="yyyy-MM"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div v-else>
                <el-input
                  v-model="targetinfo.FIRSTYEARQUOTA" :disabled="stageEdit"
                  @change="valueFormatEvent(targetinfo,'FIRSTYEARQUOTA')" :maxlength="6">
                  <i slot="suffix">{{index | suffixFilter}}</i>
                </el-input>
              </div>
            </td>
            <td class="stageViewCon">
              <div v-if="index == 5">
                <el-date-picker
                  v-model="targetinfo.LAUNCHMEETING"
                  type="month"
                  :disabled="stageEdit"
                  value-format="yyyy-MM"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div v-else>
                <el-input
                  v-model="targetinfo.LAUNCHMEETING" :disabled="stageEdit"
                  @change="valueFormatEvent(targetinfo,'LAUNCHMEETING')" :max="999999">
                  <i slot="suffix">{{index | suffixFilter}}</i>
                </el-input>
              </div>
            </td>
            <td class="stageViewCon">
              <div v-if="index == 5">
                <el-date-picker
                  v-model="targetinfo.SECONDYEARQUOTA"
                  type="month"
                  :disabled="stageEdit"
                  value-format="yyyy-MM"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div v-else>
                <el-input
                  v-model="targetinfo.SECONDYEARQUOTA" :disabled="stageEdit"
                  @change="valueFormatEvent(targetinfo,'SECONDYEARQUOTA')" :maxlength="6">
                  <i slot="suffix">{{index | suffixFilter}}</i>
                </el-input>
              </div>

            </td>
            <td class="stageViewCon">
              <div v-if="index == 5">
                <el-date-picker
                  v-model="targetinfo.THIRDYEARQUOTA"
                  type="month"
                  :disabled="stageEdit"
                  value-format="yyyy-MM"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div v-else>
                <el-input
                  v-model="targetinfo.THIRDYEARQUOTA" :disabled="stageEdit"
                  @change="valueFormatEvent(targetinfo,'THIRDYEARQUOTA')" :max="999999">
                  <i slot="suffix">{{index | suffixFilter}}</i>
                </el-input>
              </div>
            </td>
            <td class="stageViewCon" style="text-align: right">
              <div v-if="index == 5">
                <el-date-picker
                  v-model="targetinfo.OVERALLPOSTEVALUATION"
                  type="month"
                  :disabled="stageEdit"
                  value-format="yyyy-MM"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div v-else>
                <el-input
                  v-model="targetinfo.OVERALLPOSTEVALUATION" :disabled="stageEdit"
                  @change="valueFormatEvent(targetinfo,'OVERALLPOSTEVALUATION')"
                  :maxlength="6">
                  <i slot="suffix">{{index | suffixFilter}}</i>
                </el-input>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--运营指标-->
    <!--v-if="stageEdit &&this.planGroupTask.data && this.planGroupTask.data.ZStatusCode1!=null"-->
    <div id="operateBox" v-if="stageEdit"
         style="margin-top: 15px;">
      <p class="indentity-title" style="text-align: left">
        <span
          style="border-bottom: 2px solid rgb(68, 120, 232);padding-bottom: 5px;font-size: 15px !important; font-weight: bold">项目运营节奏</span>
      </p>
      <el-table :data="planGroupTask.data" border style="width: 100%;margin-top: 15px;">
        <el-table-column :prop="title.field" :label="title.name"  v-for="(title,keys) in planGroupTask.rowTitle" :key="keys">
          <template slot-scope="scope">
            <div v-if="keys%2 == 1" :class="'project_operate_cell'">
            <span :class="'cell_status'+scope.row[scope.column.property]"></span>
            </div>
            <span v-else>{{scope.row[title.field]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-table :data="planGroupTask.data" border style="width: 50%;margin-top: 15px;" empty-text="暂无数据">-->
        <!--<el-table-column v-for="(title,keys) in planGroupTask.rowTitle" :prop="title.field" :key="title.field"-->
                         <!--:label="title.name" width="300">-->
          <!--<template slot-scope="scope">-->
            <!--<div v-if="keys%2 == 1" :class="'project_operate_cell'">-->
              <!--<span :class="'cell_status'+scope.row[scope.column.property]"></span>-->
            <!--</div>-->
            <!--<span v-else>{{scope.row[title.field]}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    </div>
    <!--面积指标-->
    <div id="areaQuotaBox" style="margin-top: 15px;"
         v-if="stageEdit&& stageAreaQuota.gridData && stageAreaQuota.gridData.length >1">
      <p class="indentity-title" style="text-align: left">
        <span
          style="border-bottom: 2px solid rgb(68, 120, 232);padding-bottom: 6px;font-size: 15px;font-weight: bold">面积指标</span>
      </p>
      <div style="margin-top: 15px;" class="area-table-container">
        <el-table :data="stageAreaQuota.gridData" stripe border style="width: 100%" max-height="350" align="center">
          <el-table-column
            v-for="(title,index) in stageAreaQuota.titleInfo"
            :key="'area'+index"
            class="tabTitle"
            :label="title.name"
            :prop="title.field"
            :fixed="index===0"
            :align="index===0? 'left' : 'center'"
            min-width="200"
          >
            <el-table-column
              v-for="(item, keys) in title.children"
              :key="'cl'+keys"
              :label="item.name"
              :prop="item.field"
              min-width="160"
            >
              <el-table-column
                v-for="(list, ind) in item.children"
                :key="'list'+ind"
                :label="list.name"
                :prop="list.field"
                min-width="160"
              >
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div id="dialog">
      <el-dialog title="选择人员" :visible.sync="dialogVisible" width="50%" :before-close="handleClose"
                 :close-on-click-modal="isClose">
        <div class="select">
          <div class="left" id="searchText">
            <label>搜索: </label>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="searchTree">
            </el-input>
            <el-tree class="filter-tree" node-key="id" :data="orgUsers" :props="defaultProps"
                     :filter-node-method="filterNode" ref="tree" @node-click="nodeClick">
            </el-tree>
          </div>
          <div class="right">
            <div class="">
            </div>
            <ul>
              <li v-for="(persion,index) in persions" :key="index"><span v-text="persion.UserNames"></span></li>
            </ul>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import {message, fetchUtils} from '../../utils';
  import "./stage.less";
  import iframeUrl from "../../config/app-config"
  export default{
    filters: {
      suffixFilter(val){
        const suffixConfig = {
          '1': '%',
          '2': '%',
          '8': '%'
        }
        return suffixConfig[val];
      }
    },
    data(){
      return {
        isFlow:false,
        searchTree: '',
        isClose: false,
        dialogVisible: false,
        filterText: '',
        defaultProps: {
          children: 'Children',
          label: 'name'
        },
        data: [],
        persions: [],
        iscontrols: false,
        tabPosition: 'top',
        nodeId: '', // 分期Id
        addCompannyName: false, // 新增投资名称
        addCompannyNameProject: false, // 新增投资名称
        currentName: {ID: '', COMPANNYTYPE: ''}, //公司名称
        stages: [
          {
            landProperty: '自行开发',
            landPropertyId: 'SELFDEVELOPMENT'
          },
          {
            landProperty: '合作开发',
            landPropertyId: 'COOPERATIVEDELVELOPMENT'
          }
        ],
        imgSrc: require("../../public/images/map.png"),
        titleDialog: "",
        companneyIdDel: "",
        companneyId: "", /*公司ID*/
        currentObj: [],
        //StageIframeUrl: "",
        fullScreenIcon: require("../../public/images/fullScreen.png"),
        noScreenPic: require("../../public/images/nopic.gif"),
        stage_projectId: '',
        allData: [],
      }
    },
    created: function () {
      this.nodeId = this.getNodeId() // 初始化分期ID
      this.getLandPropertys();
      this.getLandPlanUses();
      this.getInitData();
      this.getOrgUsers();
      /*机构树*/
    },
    computed: {
      ... mapGetters([
        'InverstMiddle',
        'ProjectMiddle',
        'commonPathRoleAuthority',
        'commonIframeHasPicture',
        'commonIframeLoading',
        'commonStageIframeUrl',
        'stageVersionStatus',
        'stageVersion',
        'heightVersion',
        'stageIdentityInfo',
        'landPropertys',
        'landPlanUses',
        'planGroupTask',
        'stageAreaQuota',
        'mTitle',
        'stageProjectTart',
        'stageEdit',
        'isShowVersionSelect',
        "InverstBuildUnit",
        "ProjectBuildUnit",
        "GetMessage",
        'BackData',
        'stageImageStatus',
        'stageCurrentVersion',
        'orgUsers',
        'loadTree',
      ]),
      carSunNum: function () {
        return Number(this.stageIdentityInfo.vStageIdentityInfo.upParkSpace) + Number(this.stageIdentityInfo.vStageIdentityInfo.underParkSpace)
      },
      getMessage() {
        return this.GetMessage;
      },
    },
    watch: {
      stageVersionStatus(val){

      },
      searchTree(val) {
        this.$refs.tree.filter(val);
      },
      "$route": function () {
        const {mode, nodeId} = this.$route.query;
        this.showData = !!mode && mode.toLowerCase().trim() === "stage";
        this.stageId = nodeId || "";
        this.nodeId = this.getNodeId() // 初始化分期ID
        this.getInitData();
        this.$store.dispatch("setNoEdit", true);
      },
      getMessage: function (val) {
        if (val) {
          this.$store.dispatch("setNoEdit", true);
          message.success(this.BackData.message);
          this.$router.push({path: '/stage', query: {mode: 'stage', nodeId: this.BackData.stageId}})
//          this.commonGetTreeData()
          this.getInitData();
        }
      }
    },
    methods: {
      changeNumberStr (evt,item) {
        let even =  evt || window.event
        let val = even.target.value
        if(val == ''){
          return false
        }
        if(isNaN(Number(val))){
          let reg = /^[0-9]*(：|:)[0-9]*$/
          if(!reg.test(val)){
            item.parkRatio = ''
          }else{
            item.parkRatio = val
          }
        }else{
          item.parkRatio = Number(val).toFixed(1)
        }

      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      stageProjectTartFlag(){
          let self = this
        if(this.stageIdentityInfo.vStageIdentityInfo.stageName == ''){
            this.isFlow = true
          return false
        }else {
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.principal == ''){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.developmentId == '' || !this.stageIdentityInfo.vStageIdentityInfo.developmentId){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.companyProportion < 1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(!this.stageIdentityInfo.InverstBuildUnit[0].COMPANNYNAME  || this.stageIdentityInfo.InverstBuildUnit[0].COMPANNYNAME ==''){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(!this.stageIdentityInfo.ProjectBuildUnit[0].COMPANNYNAME  || this.stageIdentityInfo.ProjectBuildUnit[0].COMPANNYNAME ==''){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.projectCompanyName == ''){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.projectArea <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.buildArea <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.landGrant <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.plotratio <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.greenRate <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.buildDensity <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.houseNum <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.buildLimit <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.defenceArea <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.publiceArea <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.parkRatio <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.upParkSpace <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        if(this.stageIdentityInfo.vStageIdentityInfo.underParkSpace <1){
          this.isFlow = true
          return false
        }else{
          this.isFlow = false
        }
        this.stageIdentityInfo.vLandList.forEach(function (item){
          if(item.GAINDATE == ''){
            self.isFlow = true
            return false
          }else{
            self.isFlow = false
          }
          if(item.LANDCERTIFICATE == ''){
            self.isFlow = true
            return false
          }else{
            self.isFlow = false
          }
          if(item.LANDPROPERTYID == ''){
            self.isFlow = true
            return false
          }else{
            self.isFlow = false
          }
          if(item.LANDPROPERTY == ''){
            self.isFlow = true
            return false
          }else{
            self.isFlow = false
          }
          if(item.LANDPLANUSEID.length<1){
            self.isFlow = true
            return false
          }else{
            self.isFlow = false
          }
        })
//        console.info(JSON.stringify(this.stageProjectTart,null,2))
        let isEach = true
        this.stageProjectTart.forEach(function (sub){
              for (let arr in sub) {
                if (arr != 'VOTINGMEETING' && arr != 'key' && arr != 'MANAGEMENTOBJECTIVES') {
                  if(isEach) {
                  if (typeof sub[arr] == 'number') {
                    if (sub[arr] > 0) {
                      self.isFlow = false
                    } else {
                      self.isFlow = true
                      isEach = false
                    }
                  }
                  if (typeof sub[arr] == 'string') {
                    if (sub[arr] != '') {
                      self.isFlow = false
                    } else {
                      self.isFlow = true
                      isEach = false
                    }
                  }
                }
              }
            }
        })
        /*项目经营目标*/
        this.allData = [],
          this.stageProjectTart.map(item=> {
            if (typeof item.FIRSTYEARQUOTA == "number") {
              this.allData.push(item.FIRSTYEARQUOTA.toString())
            }
            if (typeof item.LAUNCHMEETING == "number") {
              this.allData.push(item.LAUNCHMEETING.toString())
            }
            if (typeof item.SECONDYEARQUOTA == "number") {
              this.allData.push(item.SECONDYEARQUOTA.toString())
            }
            if (typeof item.THIRDYEARQUOTA == "number") {
              this.allData.push(item.THIRDYEARQUOTA.toString())
            }
            if (typeof item.OVERALLPOSTEVALUATION == "number") {
              this.allData.push(item.OVERALLPOSTEVALUATION.toString())
            }




          })
        /*土地列表*/
        this.stageIdentityInfo.vLandList.map(item=> {
          this.allData.push(item.GAINDATE)
          this.allData.push(item.LANDCERTIFICATE)
          this.allData.push(item.LANDPROPERTY)
          this.allData.push(item.LANDPLANUSEID)
        })


        //console.log(JSON.stringify(this.stageIdentityInfo.vStageIdentityInfo));
        /*<!--土地规划指标 map-->*/
        for (var key in this.stageIdentityInfo.vStageIdentityInfo) {
          if (this.stageIdentityInfo.vStageIdentityInfo.hasOwnProperty(key)) {
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.stageName);
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.principal);
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.developmentId);
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.projectCompanyName);
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.companyProportion.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.projectArea.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.buildArea.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.landGrant.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.plotratio.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.greenRate.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.buildDensity.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.houseNum.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.buildLimit.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.defenceArea.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.publiceArea.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.parkRatio.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.upParkSpace.toString());
            this.allData.push(this.stageIdentityInfo.vStageIdentityInfo.underParkSpace.toString());
          }
        }
        return this.noSuccess();
      },
      noSuccess(){
        /*去重*/
        this.allData = [...new Set(this.allData)];
        //console.log(JSON.stringify(this.allData));
        for (var i in this.allData) {
          if (this.allData[i] == "") {
            return false
          }
        }
        return true
      },
      iframeEvent(){
        this.$store.commit('SET_IFRAME_URL', {typeinfo: '2', versionId: this.stageCurrentVersion});
      },
      getInitData(){
        if (!this.nodeId) {
          return
        }
        this.getStageVersion({nodeId: this.nodeId})
          .then(res => res.rows)
          .then(data => {
            this.$store.commit('STAGE_VERSION', data);
            if (data.length > 0) {
              this.$store.commit('STAGE_CURRENT_VERSION', data[0].versionId);
            }
            this.getPlanGroupTask({stageId: this.nodeId})
            this.getStageAreaQuota({stageVersionId: this.stageCurrentVersion})
            this.getMTitle({stageVersionId: this.stageCurrentVersion, nodeId: this.nodeId})
            this.getStageProjectTart({stageVersionId: this.stageCurrentVersion, nodeId: this.nodeId})
            this.getStageIdentityInfo({stageVersionId: this.stageCurrentVersion, nodeId: this.nodeId})
            this.iframeEvent();
          })
      },
      canleDialogEvent(obj, event){
        if (obj.name == "投资公司名称") {
          this.addCompannyName = false;
          this.$store.dispatch("canleInverstDialog")
        } else {
          this.addCompannyNameProject = false
          this.$store.dispatch("canleProjectDialog")
        }
      },
      submitDialogEvent(obj, event){
        if (obj.name == "投资公司名称") {
          this.addCompannyName = false;
          this.$store.dispatch("submitDialog")
        } else {
          this.addCompannyNameProject = false;
          this.$store.dispatch("submitProjectDialog")
        }


      },
      // 设置当前的版本
      stageChangeVersion(val) {
        this.$store.dispatch("stageSetVersion", val);
        this.$store.dispatch("setStageEdit", true);
        // TODO 此处设置版本选择的业务处理
        const {mode, nodeId} = this.$route.query;
        this.getPlanGroupTask({stageId: this.nodeId})
        this.getStageAreaQuota({stageVersionId: val})
        this.getMTitle({stageVersionId: val, nodeId: this.nodeId})
        this.getStageProjectTart({stageVersionId: val, nodeId: this.nodeId})
        this.getStageIdentityInfo({stageVersionId: val, nodeId: this.nodeId})
        this.iframeEvent()
      },
      landPropertyVal(val){
        // console.log(val + " ====== 对应的ID值");
        this.stageIdentityInfo.vLandList.forEach(function (item) {
          item.LANDPROPERTYID = val
        })
      },
      startApproval(){
        //发起审批
//        if (!this.stageProjectTartFlag()) {
//          message.warning("请完善页面信息")
//          return false
//        }
        this.stageProjectTartFlag()
        if(this.isFlow){
          this.$message({
            message: '请填写必填项!',
            type: 'warning'
          });
          return false
        }
        this.isFlow = false
        this.$store.dispatch("setSave")
        this.$store.dispatch("setNoEdit", true);
        const len = this.stageVersion.length;
        let _data = {
          entiId: '10103',
          dataKey: this.stageCurrentVersion
        }
        this.$store.dispatch("commonIsFirstApproval")
          .then(res => {
            if (res.rows.length === 1 && res.rows[0].versionStatus === '0') {
              //_data.entiId = "10101";
              //_data.dataKey = res.rows[0].versionId;
            }
          }).then(res => {
          return this.$store.dispatch("commonStartApproval", _data);
        }).then(res => {
          this.$message.success("提交审批成功");
          this.getStageVersion({nodeId: this.nodeId})
            .then(res => res.rows)
            .then(data => {
              this.$store.commit('STAGE_VERSION', data);
              if (data.length > 0) {
                this.$store.commit('STAGE_CURRENT_VERSION', data[0].versionId);
              }
            })
        }).catch(err => {
          this.$message.error(err);
        })
      },
      mapEvent(){
        /*   if (this.stageEdit) {
         return message.warning('请先点击编辑再修改分期总图');
         }*/
        if (!this.nodeId) {
          return message.warning('请先点击保存再上传分期总图');
        }
        var str = `${iframeUrl.iframeUrl}/Admin/EditStage?stage_id=${this.stageCurrentVersion}&stage_map_id=stage${this.stageCurrentVersion}`;
        const status = true;
        this.commonSetImageStatus({status, str})
      },
      ...mapActions([
        'canleProjectDialog',
        'commonSetImageStatus',
        'stageSetImageStatus',
        'getStageVersion',
        'stageSetVersion',
        'getStageIdentityInfo',
        'getLandPropertys',
        'getLandPlanUses',
        'getPlanGroupTask',
        'getStageAreaQuota',
        'getMTitle',
        'getStageProjectTart',
        'setMode',
        'addInfo',
        'delInfo',
        'addLand',
        'delLand',
        'setSave',
        'canleDialog',
        'getOrgUsers',
        'commonSetCurrentStatus',
        'commonGetTreeData',
        'setLoadTree',
      ]),
      // 获取当前分期的ID
      getNodeId: function () {
        //let nodeId = sessionStorage.getItem('nodeId')
        const {nodeId, mode} = this.$route.query;
        /*   if (nodeId === 'null') {
         console.info('分期ID 不存在 fenqi - > 25')
         nodeId = ''
         }*/
        return nodeId
      },
      heightVersionEvent(value){
        this.$store.dispatch("stageSetVersion", value);
      },
      set_Version: function (value) {
        //设置全局是否可编辑状态
        const _res = this.stageVersion.filter(item => {
          return item.versionId = value;
        })
        sessionStorage.setItem("globalEditState", _res[0]["versionStatus"]);
        this.$store.dispatch("stageSetVersion", value);
        // 根据版本切换刷新数据
        /*版本ID  节点ID*/
        this.getStageIdentityInfo({stageVersionId: value, nodeId: this.nodeId})
        this.getLandPropertys()
        this.getLandPlanUses()
        this.getPlanGroupTask({stageId: this.nodeId})
        this.getStageAreaQuota({stageVersionId: value})
        this.getMTitle({stageVersionId: value, nodeId: this.nodeId})
        this.getStageProjectTart({stageVersionId: value, nodeId: this.nodeId})
      },
      // 保存操作
      save () {
        if (this.stageVersionStatus == "" || this.stageVersionStatus == "") {
          message.error("暂不能保存？？？");
          return false
        }

        if(this.loadTree){
          this.$store.dispatch("setSave", true)
            .then( res => {
              this.$store.dispatch("setNoEdit", true);
              this.setLoadTree({loadTree:false});
              return res.rows.stageId
            }).then( stageId => {
              this.$store.dispatch('commonSetCurrentStatus', [{type: 'isAdd', value: true}]);
              this.commonGetTreeData()
                .then( () => {
                  this.$store.dispatch('commonSetCurrentStatus', [{type: 'isEnd', value: true}]);
                });
              message.success('新增分期成功！');
              this.$router.push({path:'/stage/info', query: {mode: 'stage', nodeId: stageId}});
            }).catch( err => {
              message.error(err);
            });
        }else{
          this.$store.dispatch("setSave");
          this.$store.dispatch("setNoEdit", true);
           this.setLoadTree({loadTree:false});
        }
      },
      // 开发方式
      mode (value) {
        this.$store.dispatch("setMode", value);
      },
      // 修改投资名字
      setCompannyName (data, event) {
        this.titleDialog = data.name;
        this.companneyIdDel = event.target.id;
        this.currentName = {ID: event.target.id, COMPANNYTYPE: event.target.name}
        if (data.name == "投资公司名称") {
          this.addCompannyName = true
          this.$store.dispatch("getInverData")
        } else {
          this.addCompannyNameProject = true
          this.$store.dispatch("getProjectData")
        }
      },
      // 增加操作
      infoAddButton () {
        if (this.titleDialog == "投资公司名称") {
          this.addInfo({COMPANNYTYPE: "INVESTMENTCOMPANY", ID: this.currentName.ID, COMPANNYNAMEMiddle: ""})
        } else {
          this.addInfo({COMPANNYTYPE: "PROJECTMENTCOMPANY", ID: this.currentName.ID, COMPANNYNAMEMiddle: ""})
        }
      },
      //  删除操作
      infoDelButton () {
        if (this.titleDialog == "投资公司名称") {
          this.delInfo({COMPANNYTYPE: "INVESTMENTCOMPANY", ID: this.currentName.ID})
        } else {
          this.delInfo({COMPANNYTYPE: "PROJECTBUILDUNIT", ID: this.currentName.ID})
        }
      },
      // 地块添加
      addLandGround () {
        this.$store.dispatch("addLand");
      },
      // 地块删除
      delLandGround () {
        this.$store.dispatch("delLand");
      },
      mapEventSmall(){
        var str = `${iframeUrl.iframeUrl}/Map/Stage?stage_id=${this.stageCurrentVersion}&stage_map_id=stage${this.stageCurrentVersion}`;
        window.open(str)
      },
      // 人员分配
      setting () {
        if (!this.stageEdit) {
          this.dialogVisible = true
          this.persions.push({UserNames: this.stageIdentityInfo.vStageIdentityInfo.principal})
        }
      },
      handleClose(){
        this.dialogVisible = false
        this.persions = []
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 节点的选中事件
      nodeClick (data, node, dom) {
        if (node.isLeaf && data.datatype == 2) {
          this.persions = []
          this.persions.push({UserNames: data.name,principalId:data.username})
        }
      },
      deleteUser () {
        this.persions = []
      },
      confirm () {
        /*console.log(this.persions);*/
        if (this.persions.length > 0) {
          this.stageIdentityInfo.vStageIdentityInfo.principal = this.persions[0].UserNames
          this.stageIdentityInfo.vStageIdentityInfo.principalId = this.persions[0].principalId
        } else {
          this.stageIdentityInfo.vStageIdentityInfo.principal = ''
          this.stageIdentityInfo.vStageIdentityInfo.principalId = ''
        }
        this.persions = []
        this.dialogVisible = false
      },
      valueFormatEvent(targetinfo, str){
        if (isNaN(Number(event.target.value))) {
          (str == "VOTINGMEETING") ? (targetinfo[str] = 0) : null;
          (str == "FIRSTYEARQUOTA") ? (targetinfo[str] = 0) : null;
          (str == "SECONDYEARQUOTA") ? (targetinfo[str] = 0) : null;
          (str == "THIRDYEARQUOTA") ? (targetinfo[str] = 0) : null;
          (str == "OVERALLPOSTEVALUATION") ? (targetinfo[str] = 0) : null;
          (str == "LAUNCHMEETING") ? (targetinfo[str] = 0) : null
        }
      },
      landGrantEvent(targetData, str){
        var regPos = /^\d+(\.\d+)?$/;
        if (!(regPos.test(event.target.value))) {
          targetData[str] = 0;
        }
      }
    },
    components: {}
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  #searchText .el-input{
    height: 30px !important;
    margin-top: -10px;
  }
  table {
    border: 1px solid #ebeef5;
    thead tr th, tbody tr td {
       border: 1px solid #ebeef5;
    }
  }
  .project_operate_cell > span {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .cell_status1 {
    background:#CD2626;
  }
  .cell_status2 {
    background: #6495ED;
  }
  .cell_status3 {
    background: #ccc;
  }

  .cell_status4 {
    background: #eaea5c;
  }

  .cell_status5 {
    background: #66CD00;
  }

  .cell_status6 {
    background: #ccc;
  }

  /*身份信息*/
  #identityBox, #groundList {
    table {
      tr {
        td {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          padding: 3px;
          box-sizing: border-box;
          line-height: 26px;
        }
      }
    }
    .el-input, .el-select {
      width: 100% !important;
      height: 100% !important;
      input[disabled="disabled"] {
        text-align: right;
      }
    }
    .el-icon-plus, .el-icon-delete {
      font-size: 18px;
      font-weight: bold !important;
      padding: 3px;
    }
    .stageViewCon {
      width: 35%;
    }
    .stageViewTitle {
      width: 15%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: #fbfdff;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }

  /*
    .stagebox {
      margin-bottom: 150px !important;
    }*/

  #programBox {
    .stageViewTitle {
      width: 27%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: #fbfdff;
      padding-left: 3px;
    }
    .stageViewCon {
      width: 23%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 3px;
      box-sizing: border-box;

    }
  }

  /*土地规划*/
  #groundBox, #targetStage {
    margin-top: 15px;
    .el-input {
      height: 25px !important;
    }
    .el-input.is-disabled .el-input__inner {
      height: 25px !important;
      overflow: hidden;
    }
  }

  #programBox {
    .el-input-number .el-input__inner {
      text-align: right !important;
    }
  }

  /*土地列表*/
  #groundList, #targetbox {
    margin-top: 15px;
    .el-input {
      width: 100% !important;
    }
    .stageViewTitle {
      width: 20%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: #fbfdff;
      padding-left: 10px;
    }
    .stageViewCon {
      width: 30%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 3px;
      box-sizing: border-box;
    }

  }

  #targetStage, #targetBox {
    .target-table {
      input.el-input__inner {
        border: none !important;
      }
    }
  }

  #tabss .el-input__inner {
    border: none !important;
  }

  #stageProjectTart {
    .el-table td, .el-table th {
      padding: 0 !important;
    }
    .el-table th, .el-table tr {
      padding: 0 !important;
    }
  }

  td, tr {
    height: 30px !important;
    box-sizing: border-box;
  }

  .el-icon-arrow-right {
    font-size: 12px;
    padding: 5px;
    border-radius: 50%;
    background-color: #4CAAF4;
    color: #ffffff;
  }

  .indentity-title {
    width: 100%;
    height: 36px;
    line-height: 34px;
    font-size: 15px !important;
    border-bottom: 2px solid #F4F6F9;
    box-sizing: border-box;
  }

  .identity, .ground, .program, .target {
    height: inherit;
    display: flex;
    margin-top: 10px;
  }

  .el-button {
    background: rgba(0, 0, 0, 0);
    color: #fff;
    border: none;
  }

  .map-title {
    text-align: left;
    font-size: 12px;
    margin-bottom: 10px;;
    .el-row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-select {
    width: 100%;
  }

  .ground-temp-title {
    position: relative;
    line-height: 30px;
    text-align: left;
    padding-left: 10px;
  }

  .indentity-annotate {
    line-height: 25px;
    text-align: left;
    font-size: 14px;
    color: #ff8987;
  }

  #version {
    /* width: 25% !important;*/
    width: 120px;
  }

  #areaQuotaBox, #operateBox {
    .el-table thead.is-group th {
      color: #c0c4cc !important;
    }
    .el-input__inner {
      border: none !important;
    }
  }

  .dialog-footer .el-button {
    background: #4caaf4 !important;
  }

  #groundButton {
    position: absolute;
    left: 432px;
  }

  .ground-box {
    width: 100%;
    height: 36px;
    line-height: 34px;
    border-bottom: 2px solid #f4f6f9;
  }

  .el-icon-plus, .el-icon-delete {
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    padding: 5px;
  }

  input[type="button"] {
    border: none;
    background: transparent !important;
    font-size: 13px;
    color: #2c3e50 !important
  }

  .el-input.is-disabled .el-input__inner {
    border-color: #fff !important;
  }

  table .active {
    background-color: #f5f7fa !important;
    //border-color: #e4e7ed !important;
    color: #c0c4cc !important;
    cursor: not-allowed;
  }

  #dialog .select {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    height: 300px;

  }

  #dialog .left {
    /* border: 1px solid #000; */
    display: block;
    float: left;
    width: 45%;
    height: 100%;
    padding: 10px;
  }

  #dialog .right {
    /* border: 1px solid #000; */
    float: right;
    display: block;
    margin-top: 20px;
    width: 45%;
    height: 100%;

  }

  .left > .el-tree {
    border: solid 1px #ddd;
    height: 85%;
    overflow: auto
  }

  .right {
    padding: 10px;
  }

  .right > ul {
    border: solid 1px #ddd;
    height: 85%;
    overflow: auto
  }

  .blank {
    height: 27px;
    padding-bottom: 5px;
  }

  .right > div {
    padding-bottom: 5px;
  }

  .img_container {
    /* height: 370px;*/
    & > img {
      display: block;
      width: 230px;
      margin: 70px auto 0;
    }
  }
  .required {
    color: red;
  }
</style>
