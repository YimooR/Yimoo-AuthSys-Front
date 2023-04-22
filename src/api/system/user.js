import request from '@/utils/request'

//常量
const api_name='/admin/system/sysUser'

export default{
    //更改用户状态接口
    updateStatus(id,status){
        return request({
            //接口
            url: `${api_name}/updateStatus/${id}/${status}`,
            method: 'get'
        })
    },
    //批量删除
    batchRemove(idList){
       return request({
          //接口路径
          url: `${api_name}/batchRemove`,
          method: 'delete',
          //@RequestBody用data获取数据
          data: idList
       })  
    },
    //根据id查询用户
    getUserById(id){
        return request({
            //接口路径
            url: `${api_name}/findUserById/${id}`,
            method: 'post',
        })
    },
    //修改用户
    update(user){
        return request({
           //接口路径
           url: `${api_name}/update`,
           method: 'post',
           data: user
        })
    },
    //添加用户
    saveUser(user){
        return request({
           //接口路径
           url: `${api_name}/save`,
           method: 'post',
           //传递json格式
           data: user
        }) 
    },
    //列表
    getPageList(page,limit,searchObj){
        return request({
            //接口路径
            //url: '/admin/system/sysUser'+page+"/"+limit,
            url: `${api_name}/${page}/${limit}`,
            method: 'get', //提交方式
            //参数
            params: searchObj
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
    
}
