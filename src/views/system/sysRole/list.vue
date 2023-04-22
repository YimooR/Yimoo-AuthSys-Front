<template>
  <div class="app-container">
    <!--查询表单-->
<div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 30%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()" :disabled="$hasBP('bnt.sysRole.list')  === false">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysRole.add')  === false">添 加</el-button>
          <el-button class="btn-add" size="mini" @click="batchRemove()" :disabled="$hasBP('bnt.sysRole.remove')  === false">批量删除</el-button>
        </el-row>
      </el-form>
    </div>
    
    <!-- v-loading="listloading" -->
    <el-table v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"/>
        <el-table-column label="序号" width="50px" align="center">
        <template slot-scope="scope">{{(page-1)*limit+scope.$index+1}}</template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center"> </el-table-column>
      <el-table-column prop="roleCode" label="角色编码" align="center">
      </el-table-column>
      <el-table-column prop="description" label="角色描述" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center"> </el-table-column>
      <el-table-column  label="操作" align="center">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" :disabled="$hasBP('bnt.sysRole.update')  === false"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除" :disabled="$hasBP('bnt.sysRole.remove')  === false"/>
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限" :disabled="$hasBP('bnt.sysRole.assignAuth')  === false"/>
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <!-- 分页组件 -->
    <div class="block" align="center">
    <el-pagination
      @current-change="fetchData"
      :current-page="page"
      :page-size="limit"
      layout="total ,prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="sysRole.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
</el-dialog>
  </div>
  </div>
</template>
<script>
//引入定义接口的js文件
import api from "@/api/system/role";

export default {
  //定义初始值
  data() {
    return {
      //listloading: flase,//是否显示加载的图标
      list: [], //角色列表
      total: 0, //总记录数
      page: 1, //当前页
      limit: 10, //每页记录数
      searchObj: {}, //条件查询封装对象
      sysRole: {},//封装添加表单的数据
      dialogVisible:false, //弹出框，默认关闭
      selectValue:[]//批量删除选中的记录列表
    };
  },
  //页面渲染之前执行
  created() {
    this.fetchData();
  },
  //具体方法
  methods: {
    //跳转分配菜单权限
    showAssignAuth(row) {
  this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
},
    //复选框发生变化，执行方法
    handleSelectionChange(selection){
        this.selectValue=selection
        console.log(this.selectValue)
    },
    //批量删除
    batchRemove(){
        //判断数组长度是否为0
        if(this.selectValue.length==0){
            //提示
            this.$message({
            type: 'warning',
            message: '请先选择复选框！'
          })
        }else{
            this.$confirm('此操作将永久删除所选角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            var idList=[]
            //获取多个复选框的id值
            for(var i=0;i<this.selectValue.length;i++){
                var obj=this.selectValue[i]
                //获取id值
                var id=obj.id
                //放到数组中
                idList.push(id)
            }
           return api.batchRemove(idList)
        }).then((respons)=>{  
        //提示信息
        this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //刷新列表
         this.fetchData()
          }) 
        }
    },
    //修改方法数据回显
    edit(id){
        //弹框
        this.dialogVisible=true
        //获取数据
        api.getRoleById(id).then(response=>{
            //双向绑定
            this.sysRole=response.data
        })
    },
    //点击确定添加方法,判断角色id是否为空
    saveOrUpdate(){
       if(!this.sysRole.id){
           this.save()
       }else{
        this.update()
       }
    },
    //添加方法
    save(){
        api.saveRole(this.sysRole)
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
    //修改方法
    update(){
        api.update(this.sysRole)
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
    //点击添加弹出对话框
    add(){
       this.dialogVisible=true
       this.sysRole = {}
    },
    //删除
    removeDataById(id){
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
        this.fetchData()
    },
    //条件分页列表方法
    //pageNum查询页数
    fetchData(pageNum = 1) {
      //页数赋值
      this.page = pageNum;
      //ajax
      api.getPageList(this.page, this.limit, this.searchObj).then((respons) => {
        //console.log(respons)
        this.list = respons.data.records;
        this.total = respons.data.total;
      });
    },
  },
};
</script>