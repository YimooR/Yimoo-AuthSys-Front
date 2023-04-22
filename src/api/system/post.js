import request from '@/utils/request'

//常量
const api_name='/admin/system/sysPost'

export default{
    //获取分页列表
    getPageList(page,limit){
        return request({
            //接口路径
            //url: '/admin/system/sysPost'+page+"/"+limit,
            url: `${api_name}/${page}/${limit}`,
            method: 'get' //提交方式
        })
    },
    //更改岗位状态接口
    updateStatus(id,status){
        return request({
            //接口
            url: `${api_name}/updateStatus/${id}/${status}`,
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
     //添加岗位
     savePost(sysPost){
        return request({
            //接口路径
         url: `${api_name}/save`,
         method: 'post', //提交方式
         params: sysPost
        })
     },
     //根据id查询用户
    getPostById(id){
        return request({
            //接口路径
            url: `${api_name}/findPostById/${id}`,
            method: 'post',
        })
    },
    //修改用户
    update(post){
        return request({
           //接口路径
           url: `${api_name}/update`,
           method: 'post',
           data: post
        })
    },
}