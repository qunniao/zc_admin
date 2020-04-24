
layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider','form'], function(){
var laydate = layui.laydate //日期
,laypage = layui.laypage //分页
,layer = layui.layer //弹层
,table = layui.table //表格
,carousel = layui.carousel //轮播
,upload = layui.upload //上传
,element = layui.element //元素操作
,slider = layui.slider //滑块

//监听Tab切换
element.on('tab(demo)', function(data){
layer.tips('切换了 '+ data.index +'：'+ this.innerHTML, this, {
tips: 1
});
});

//执行一个 table 实例
table.render({
elem: '#demo'
,height:1200
,url: Url+'/userCard/list' //数据接口
,where: {
  // name:$("#searchstatus").val(),
  // sortType:false,
}
,request: {
pageName: 'current' //页码的参数名称，默认：page
,limitName: 'size' //每页数据量的参数名，默认：limit
},parseData: function(res){ //res 即为原始返回的数据
// console.log(res.data.le)
if(res.data.length==0){
  pageNum=pageNumtwo;
}
return {
  "code": res.status, //解析接口状态
  "msg": res.descripition, //解析提示文本
  "count": res.data.total, //解析数据长度
  "data": res.data.records //解析数据列表
};
}
,response: {
statusName: 'code' //数据状态的字段名称，默认：code
,statusCode: 0 //成功的状态码，默认：0
,msgName: 'msg' //状态信息的字段名称，默认：msg
,countName: 'count' //数据总数的字段名称，默认：count
,dataName: 'data' //数据列表的字段名称，默认：data
}
,title: '用户表'
,page: true //开启分页
,toolbar: 'false' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
,totalRow: false //开启合计行
,cols: [[ //表头
{type: 'checkbox', fixed: 'left',toolbar: '#checkbox'}
,{field: 'uid', title: '编号', width:80, fixed: 'left'}
,{field: 'name', title: '昵称', width:150}
,{field: 'isRecommend', title: '是否推荐', width: 200,toolbar: '#isrecommend'}
,{field: 'cover', title: '头像', width: 100,height:100,toolbar: '#imgshow'}
,{field: 'phone', title: '手机号', width:150}
,{field: 'email', title: '邮箱', width: 200}
,{field: 'companyName', title: '公司', width: 200}
,{field: 'address', title: '地址', width: 200}
,{field: 'schoolXueli', title: '学历', width: 200}
,{fixed: 'right', width: 165, title: '操作',align:'center', toolbar: '#barDemo'}
]]
});

//监听头工具栏事件
table.on('tool(demo)', function(obj){
  var data = obj.data;
  console.log(data)
  let isRecommendcheck =1
  let datamsg ='确认推荐该用户'
  if(data.isRecommend){
    isRecommendcheck=0
    datamsg='确认不推荐该用户'
  }
  if(obj.event === 'detail'){
  } else if(obj.event === 'change'){
    layer.confirm(datamsg, function(index){
      console.log(obj.data.id)
      let okdata={
        id:obj.data.cid,
        state:1
      }
      _ajax({
            url : "userCard/update/recommend",  // url---->地址
            type : "DELETE",   // type ---> 请求方式
            async : true,   // async----> 同步：false，异步：true 
            data : {        //传入信息
              cid:obj.data.cid,
              recommend:isRecommendcheck
            },
            success : function(data){   //返回接受信息
              let datas =JSON.parse(data);  
              if(datas.status==0){
                    layer.msg('修改成功', {icon: 1},function(){
                      table.reload('demo', {
                      where: {
                      }
                      ,page: {
                        curr:1
                      }
                    });
                  layer.close(index);
                });
              }
            }
        })
    });
  } else if(obj.event === 'edit'){
    layer.alert('编辑行：<br>'+ JSON.stringify(data))
  }
});


$('#del').on('click', function  (argument) {
  var ids = [];
  var namelsit =[]
  console.log(layui.table.checkStatus('demo').data)
  let checkdata=layui.table.checkStatus('demo').data
  for(let i=0;i<checkdata.length;i++){
    ids.push(checkdata[i].cid)
    namelsit.push(checkdata[i].name)
  }
  if(ids.length>1){
    layer.msg('每次只能删除一个', {icon:5});
  }else{
    layer.confirm('确认要删除吗？'+namelsit.toString(),function(index){
    _ajax({
              url : "/userCard/delete/"+ids[0],  // url---->地址
              type : "DELETE",   // type ---> 请求方式
              async : true,   // async----> 同步：false，异步：true 
              data : {        //传入信息
                id :ids[0],
              },
              success : function(data){  
                  layer.msg('删除成功', {icon: 1});
                  pageNum=1
                  table.reload('demo', {
                  where: {
                  }
                  ,page: {
                    curr:pageNum
                  }
                });
              }
        })
    });
  }
}
);
})
layui.use(['laydate','form'], function(){
  var laydate = layui.laydate;
  var  form = layui.form;


  // 监听全选
  form.on('checkbox(checkall)', function(data){

    if(data.elem.checked){
      $('table input').prop('checked',true);
    }else{
      $('table input').prop('checked',false);
    }
    form.render('checkbox');
  }); 
  
  //执行一个laydate实例
  laydate.render({
    elem: '#start' //指定元素
  });

  //执行一个laydate实例
  laydate.render({
    elem: '#end' //指定元素
  });


});