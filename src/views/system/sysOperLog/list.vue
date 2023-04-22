<template>
    <div class="app-container">
  
        <div class="search-div">
        <el-form label-width="70px" size="small">
          <el-row>
            <el-col :span="8">
              <el-form-item label="关 键 字">
                <el-input style="width: 95%" v-model="searchObj.operName" placeholder="操作人员"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作时间">
                <el-date-picker
                  v-model="createTimes"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="margin-right: 10px;width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display:flex">
            <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()" :disabled="$hasBP('bnt.sysOperLog.list')  === false">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>            
          </el-row>
        </el-form>
      </div>
      <!-- 列表 -->
      <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;">
  
        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>
  
        <el-table-column prop="title" label="操作名称"  align="center"/>
        <el-table-column prop="businessType" label="操作类型"  align="center"/>
        <el-table-column prop="method" label="操作方法" align="center"/>
        <el-table-column prop="operName" label="操作人员" align="center"/>
        <el-table-column label="状态"  align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status === 1"
              @change="switchStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
      </el-table>
  
      <!-- 分页组件 -->
      <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchData"
      />
    </div>
</template>
<script>
//引入定义接口的js文件
import api from "@/api/system/operlog";

export default {
  //定义初始值
  data() {
    return {
      //listloading: flase,//是否显示加载的图标
      list: [], //岗位列表
      total: 0, //总记录数
      page: 1, //当前页
      limit: 10, //每页记录数
      searchObj: {}, //条件查询封装对象
      dialogVisible:false, //弹出框，默认关闭
      createTimes:[]
    }
  },
  //页面渲染之前执行
  created() {
    this.fetchData();
  },
  //具体方法
  methods: {
    //添加以下方法
    //重置
    resetData(){
          console.log('重置查询表单')
          this.searchObj = {}
          this.createTimes = []
          this.fetchData()
      },
    //条件分页列表方法
      //pageNum查询页数
      fetchData(pageNum = 1) {
        //页数赋值
        this.page = pageNum;
        if(this.createTimes && this.createTimes.length==2){
             this.searchObj.createTimeBegin=this.createTimes[0]
             this.searchObj.createTimeEnd=this.createTimes[1]
        }
        api.index(this.page,this.limit,this.searchObj)
        .then(respons=>{
            this.list=respons.data.records
            this.total=respons.data.total
        })
      },
  },
};
</script>