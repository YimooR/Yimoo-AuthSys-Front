import request from '@/utils/request'

//常量
const api_name='/admin/system/sysOperLog'

export default{
    //获取分页列表
    index(page,limit,searchObj){
        return request({
            //接口路径
            //url: '/admin/system/sysPost'+page+"/"+limit,
            url: `${api_name}/${page}/${limit}`,
            method: 'get', //提交方式
            params: searchObj
        })
    }
}