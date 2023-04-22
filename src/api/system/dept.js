import request from '@/utils/request'

//常量
const api_name='/admin/system/sysDept'

export default{
  /*
  更新
  */
  update(sysDept) {
    return request({
      url: `${api_name}/update`,
      method: "post",
      data: sysDept
    })
  },
  /*
  保存
  */
  save(sysDept) {
    return request({
      url: `${api_name}/save`,
      method: "post",
      data: sysDept
    })
  },  
  /*
  获取部门列表
  */
  findNodes() {
    return request({
      url: `${api_name}/findNodes`,
      method: 'get'
    })
  },
    //删除
    removeById(id){
        return request({
         //接口路径
         url: `${api_name}/remove/${id}`,
         method: 'delete' //提交方式
        })
     },
     //更改部门状态接口
    updateStatus(id,status){
        return request({
            //接口
            url: `${api_name}/updateStatus/${id}/${status}`,
            method: 'get'
        })
    }
}