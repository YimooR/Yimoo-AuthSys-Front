<template>
    <div class="app-container">
  
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysPost.add')  === false">添 加</el-button>
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
  
        <el-table-column prop="postCode" label="岗位代码"  align="center"/>
        <el-table-column prop="name" label="岗位名称"  align="center"/>
        <el-table-column prop="description" label="岗位描述" align="center"/>
        <el-table-column label="状态"  align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status === 1"
              @change="switchStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column label="操作"  align="center" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" :disabled="$hasBP('bnt.sysPost.update')  === false"/>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)" title="删除" :disabled="$hasBP('bnt.sysPost.remove')  === false"/>
          </template>
        </el-table-column>
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

      <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
        <el-form ref="dataForm" :model="sysPost"  label-width="100px" size="small" style="padding-right: 40px;">
          <el-form-item label="岗位代码" prop="postCode">
            <el-input v-model="sysPost.postCode"/>
          </el-form-item>
          <!-- v-if="!sysUser.id" -->
          <el-form-item  label="岗位名称" prop="name">
            <el-input v-model="sysPost.name"/>
          </el-form-item>
          <el-form-item label="岗位描述" prop="description">
            <el-input v-model="sysPost.description"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
          <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
//引入定义接口的js文件
import api from "@/api/system/post";

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
      sysPost:{}
    }
  },
  //页面渲染之前执行
  created() {
    this.fetchData();
  },
  //具体方法
  methods: {
    //添加以下方法
    //添加方法
    save(){
          api.savePost(this.sysPost)
          .then(response=>{
              //提示
              this.$message({
              type: 'success',
              message: '添加成功!'
            })
              //关闭弹框
              this.dialogVisible=false
              //刷新页面
              this.fetchData()
          })
      },
    //点击确定添加方法,判断用户id是否为空
    saveOrUpdate(){
         if(!this.sysPost.id){
             this.save()
         }else{
          this.update()
         }
      },
    //修改方法数据回显
    edit(id){
          //弹框
          this.dialogVisible=true
          //获取数据
          api.getPostById(id).then(response=>{
              //双向绑定
              this.sysPost=response.data
          })
      },
    add(){
      this.dialogVisible=true,
      this.sysPost = {}
    },
    //更改状态
    switchStatus(row){
        //判断，如果当前用户可用，修改禁用
        row.status=row.status===1?0:1
        console.log("修改前"+row.status)
        api.updateStatus(row.id,row.status)
        .then(response=>{
          //提示信息
          if(response.code){
              this.$message.success(response.message||'操作成功')
              //刷新列表
         this.fetchData()
          }
        })
        console.log("修改后"+row.status)
    },
    //删除
    removeById(id){
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         return api.removeById(id)
      }).then((respons)=>{  
      //提示信息
      this.$message({
          type: 'success',
          message: '删除成功!'
        })
        //刷新列表
       this.fetchData()
     }) 
    },
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
      api.getPageList(this.page,this.limit,this.searchObj)
      .then(respons=>{
          this.list=respons.data.records
          this.total=respons.data.total
      })
    },
    //修改方法
    update(){
          api.update(this.sysPost)
          .then(response=>{
              //提示信息
          this.$message({
              type: 'success',
              message: '修改成功!'
            })
            //关闭弹框
            this.dialogVisible=false
            //刷新列表
           this.fetchData()
          })
      },
  },
};
</script>