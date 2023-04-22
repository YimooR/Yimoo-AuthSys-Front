<template>
    <div class="app-container">
  
      <!-- 列表 -->
      <el-table
        :data="sysDeptList"
        style="width: 100%;margin-bottom: 20px;margin-top: 10px;"
        row-key="id"
        border
        :default-expand-all="false"
        :tree-props="{children: 'children'}"
        >
  
        <el-table-column prop="name" label="部门名称"  align="center"/>
        <el-table-column prop="leader" label="部门负责人"  align="center"/>
        <el-table-column prop="phone" label="电话" align="center"/>
        <el-table-column label="状态"  align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status === 1"
              @change="switchStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column label="操作"  align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="success" v-if="scope.row.type !== 2" icon="el-icon-plus" size="mini" @click="add(scope.row)" title="添加下级节点" :disabled="$hasBP('bnt.sysDept.add')  === false"/>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)" title="删除" :disabled="$hasBP('bnt.sysDept.remove')  === false"/>
          </template>
        </el-table-column>
      </el-table>
    
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" >
        <el-form ref="dataForm" :model="sysDept" label-width="300px" size="small" style="padding-right: 40px;">
          <el-form-item label="上级部门" v-if="sysDept.id === ''">
            <el-input v-model="sysDept.parentName" disabled="true"/>
          </el-form-item>
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="sysDept.name"/>
          </el-form-item>
          <el-form-item label="部门负责人" prop="leader">
            <el-input v-model="sysDept.leader"/>
          </el-form-item>
          <el-form-item label="电话" prop="phone" >
            <el-input v-model="sysDept.phone" placeholder="不能超过11位"/>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="sysDept.sortValue" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="状态" prop="type">
            <el-radio-group v-model="sysDept.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
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
  import api from "@/api/system/dept";
  const defaultForm = {
    id: '',
    name: '',
    parentId: '',
    treePath: '',
    sortValue: 1,
    leader: '',
    phone: '',
    status: 1,
    create_time: '',
    update_time: '',
    is_deleted: 0
  }
  export default {
    //定义初始值
    data() {
      return {
        sysDeptList: [],
        expandKeys: [], // 需要自动展开的项
  
        type0Disabled: false,
        type1Disabled: false,
        type2Disabled: false,
        dialogTitle: '',
        dialogVisible: false,
        saveBtnDisabled: false,
        sysDept: defaultForm
      }
    },
    //页面渲染之前执行
    created() {
      this.fetchData();
    },
    //具体方法
    methods: {
      // //添加以下方法
      //编辑
      edit(row) {
        debugger
        this.dialogTitle = '修改菜单'
        this.dialogVisible = true
        console.log("点击编辑"+row)
        this.sysDept = Object.assign({}, row)
      },
      //更新
      update() {
        api.updateById(this.sysDept).then(response => {
          this.$message.success(response.message || '操作成功')
          this.dialogVisible = false
          this.fetchData()
        })
      },
      //添加
      save() {
        api.save(this.sysDept).then(response => {
          this.$message.success(response.message || '操作成功')
          this.dialogVisible = false
          this.fetchData(this.page)
        })
      },
      //添加或更新
      saveOrUpdate() {
        if(this.sysDept.parentId !== 0) {
          this.sysDept.component = 'ParentView'
        }
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.saveBtnDisabled = true // 防止表单重复提交
            if (!this.sysDept.id) {
              this.save()
            } else {
              console.log("123")
              this.update()
            }
          }
        })
      },
      //弹出添加或更新的表单
      add(row){
        debugger
        this.typeDisabled = false
        this.dialogTitle = '添加下级节点'
        this.dialogVisible = true
  
        this.sysDept = Object.assign({}, defaultForm)
        this.sysDept.id = ''
        if(row) {
          this.sysDept.parentId = row.id
          this.sysDept.parentName = row.name
          this.sysDept.component = 'ParentView'
          if(row.type === 0) {
            this.sysDept.type = 1
            this.typeDisabled = false
            this.type0Disabled = false
            this.type1Disabled = false
            this.type2Disabled = true
          } else if(row.type === 1) {
            this.sysDept.type = 2
            this.typeDisabled = true
          }
        } else {
          this.dialogTitle = '添加目录节点'
          this.sysDept.type = 0
          this.sysDept.component = 'Layout'
          this.sysDept.parentId = 0
          this.typeDisabled = true
        }
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
        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
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
      //当页面加载时获取数据
      //条件分页列表方法
      //pageNum查询页数
      fetchData() {
        console.log('加载列表')
        api.findNodes().then(response => {
          this.sysDeptList = response.data
          console.log(this.sysDeptList)
        })
      },
    },
  };
  </script>