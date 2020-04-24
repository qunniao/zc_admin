function del(e){
    e.parentNode.parentNode.removeChild(e.parentNode);
}
let casedivnum=0;
let ischeck=false
let usrl =  decodeURI(location.search); //获取url中"?"符后的字串
let caseid= usrl.split('&')[0].split('=')[1]
let caseshowid= usrl.split('&')[1].split('=')[1]
console.log(caseshowid)
if(caseshowid==1){
    $('#savebtn').css('display','none')
}
if(caseid!=-1){
    ischeck=true
}
// 修改时获取案例详情
function getcasedetail(){
    _ajax({
        url : "news/info/"+caseid,  // url---->地址
        type : "GET",   // type ---> 请求方式
        async : true,   // async----> 同步：false，异步：true 
        data : {        //传入信息
        },
        success : function(data){   //返回接受信息
            let datas =JSON.parse(data);
            if(datas.status==0){
                let div =' <div style="float:left;width: 100px;height:120px;"><img id="cover" name="shoppics" style="width: 100px;height:100px;" src="'+datas.data.cover+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                $('#demo2').html(div)
                $('#title').val(datas.data.title)
                $('#typeId').val(datas.data.typeId)
                $('#sort').val(datas.data.sort)
                $("#layeditDemo").val(datas.data.content);
                layui.use('layedit', function () {
                    layedit = layui.layedit;
                    var ieditor = layedit.build('layeditDemo');
                });
                // step.Creat_Table();
                renderForm()
            }
        }
    })  
}
if(ischeck){
    // ischeck=false;
    getcasedetail()
}
// 分类下拉一级获取
_ajax({
    url : "newsTypes/list",  // url---->地址
    type : "GET",   // type ---> 请求方式
    async : true,   // async----> 同步：false，异步：true 
    data : {        //传入信息
        current :1,
        size:10,
    },
    success : function(data){   //返回接受信息
        let datas =JSON.parse(data);
        if(datas.status==0){
            let newstypelist =''
            for(let i=0;i<datas.data.records.length;i++){
                let typediv= '<option value="'+datas.data.records[i].id+'">'+datas.data.records[i].name+'</option>'
                newstypelist+=typediv
            }
            $('#typeId').append(newstypelist)
            // if(ischeck){
            //     // ischeck=false;
            //     getcasedetail()
            // }
            // getprotwo(datas.data[0].bid)
            renderForm()
        }
    }
})


layui.use('upload', function(){
    var $ = layui.jquery
    ,upload = layui.upload;
    upload.render({
        elem: '#test2'
        ,url: Url+'banner/addFile'
        ,headers:{'token':localStorage.getItem('token')}
        ,multiple: true
        ,field:'files'
        ,change: function(e, data) {//这个是选择文件的回调函数
            console.log(data)
            console.log(e)
            if(data.upload.length > 1){//这里是判断选择文件的个数,根据实际情况设置
                layer.alert('请选择单个文件!!!:', {//本人这里是用的layer插件提示用户
                    icon: 2,
                    skin: 'layer-ext-moon'
                });
                return false;
            }
        }
        ,before: function(e, data) {//这个是选择文件的回调函数
            console.log(e.upload)
            console.log(e.upload.length)
            if(e.upload.length > 2){//这里是判断选择文件的个数,根据实际情况设置
                layer.alert('请选择单个文件!!!:', {//本人这里是用的layer插件提示用户
                    icon: 2,
                    skin: 'layer-ext-moon'
                });
                console.log('失败')
                return false;
            }
        }
        ,done: function(res){
            // for(let i=0;i<res.data.length;i++){
                let div =' <div style="float:left;width: 100px;height:120px;"><img id="cover" name="shoppics" style="width: 100px;height:100px;" src="'+res.data[0]+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                $('#demo2').html(div)
            // }
        //上传完毕
        }
    });
    upload.render({
        elem: '#test3'
        ,url: Url+'banner/addFile'
        ,headers:{'token':localStorage.getItem('token')}
        ,multiple: true
        ,field:'files'
        ,before: function(obj){
        }
        ,done: function(res){
            for(let i=0;i<res.data.length;i++){
                let div =' <div style="float:left;width: 100px;height:120px;"><img name="mobileshoppics" style="width: 100px;height:100px;" src="'+res.data[i]+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                $('#demo3').append(div)
            }
            console.log(res)
        //上传完毕
        }
    });
})
layui.use(['layedit', 'layer', 'jquery'], function () {
    var $ = layui.jquery
        , layer = layui.layer
        , layedit = layui.layedit;
    layedit.set({
        //暴露layupload参数设置接口 --详细查看layupload参数说明
        uploadImage: {
            url: Url+'banner/addFile',
            accept: 'image',
            headers:{'token':localStorage.getItem('token')},
            acceptMime: 'image/*',
            field:'files',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: 1024 * 10,
            data: {
            }
            ,done: function (data) {
                console.log(data);
            }
        },
        uploadVideo: {
            url: 'your url',
            accept: 'video',
            acceptMime: 'video/*',
            exts: 'mp4|flv|avi|rm|rmvb',
            size: 1024 * 10 * 2,
            done: function (data) {
                console.log(data);
            }
        }
        , uploadFiles: {
            url:Url+'banner/addFile',
            accept: 'file',
            headers:{'token':localStorage.getItem('token')},
            acceptMime: 'file/*',
            size: '20480',
            autoInsert: true , //自动插入编辑器设置
            done: function (data) {
                // console.log(data);
            }
        }
        //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
        //传递参数：
        //图片： imgpath --图片路径
        //视频： filepath --视频路径 imgpath --封面路径
        //附件： filepath --附件路径
        , calldel: {
            // url: 'your url',
            // done: function (data) {
            //     console.log(data);
            // }
        }
        , rightBtn: {
            type: "layBtn",//default|layBtn|custom  浏览器默认/layedit右键面板/自定义菜单 default和layBtn无需配置customEvent
            customEvent: function (targetName, event) {
                //根据tagName分类型设置
                switch (targetName) {
                    case "img":
                        alert("this is img");
                        break;
                    default:
                        alert("hello world");
                        break;
                };
                //或者直接统一设定
                //alert("all in one");
            }
        }
        //测试参数
        , backDelImg: true
        //开发者模式 --默认为false
        , devmode: true
        //是否自动同步到textarea
        , autoSync: true
        //内容改变监听事件
        , onchange: function (content) {
            // console.log(content);
        }
        //插入代码设置 --hide:false 等同于不配置codeConfig
        , codeConfig: {
            hide: true,  //是否隐藏编码语言选择框
            default: 'javascript', //hide为true时的默认语言格式
            encode: true //是否转义
            ,class:'layui-code' //默认样式
        }
        //新增iframe外置样式和js
        , quote:{
            // style: ['Content/css.css'],
            //js: ['/Content/Layui-KnifeZ/lay/modules/jquery.js']
        }
        , customlink:{
            title: '插入layui官网'
            , href: 'https://www.layui.com'
            ,onmouseup:''
        }
        , facePath: 'http://knifez.gitee.io/kz.layedit/Content/Layui-KnifeZ/'
        , devmode: true
        , videoAttr: ' preload="none" ' 
        , tool: [
            'undo', 'redo', 'code', 'strong', 'italic', 'underline', 'del', 'addhr', '|','removeformat', 'fontFomatt', 'fontfamily','fontSize', 'fontBackColor', 'colorpicker', 'face'
            , '|', 'left', 'center', 'right', '|', 'link', 'unlink', 'images', 'image_alt', 'attachment', 'anchors'
            , '|'
            , 'table','customlink'
            , 'fullScreen','preview'
        ]
        , height: '500px'
    });
var ieditor = layedit.build('layeditDemo');
})
layui.use(['form', 'layer'],
function() {
    $ = layui.jquery;
    var form = layui.form,
    layer = layui.layer;

    form.on('select(changepro)', function(data){
        // getprotwo(data.value)

    })
    //监听提交
    form.on('submit(add)',
    function(data) {
        let casecslength=[]//获取所有案例的最外层id
        console.log($('#cover')[0])
        if($('#cover')[0]==undefined){
            layer.msg('封面图不能为空', {icon: 5})
            return false
        }
        if(caseid!=-1){
            console.log(data)
            let recommend =false;
            if(data.field.isRecommend==1){
                recommend=true
            }
            let pushdatas ={
                id:caseid,
                typeId:data.field.typeId,
                cover:$('#cover')[0].src,
                sort:data.field.sort,
                title:data.field.title,
                content:data.field.layeditDemo
            }
            // console.log(pushdatas)
            $.ajax({
                url:Url+"news/update",
                type:"put",
                headers:{"Content-Type":"application/json",'token':localStorage.getItem('token')},
                dataType:"json",
                data:JSON.stringify(pushdatas),
                timeout:20000,
                success:function(data){
                    // callback(msg);
                    // console.log(data)
                    // let datas =JSON.parse(data)
                    if(data.status==0){
                        layer.msg('修改成功', {icon: 1},function(){
                            closeiframe()
                        });
                    }else{
                        layer.msg('修改失败', {icon: 5})
                    }
                },
                error:function(xhr,textstatus,thrown){
    
                }
            });                       
        }else{
            console.log(data)
            let pushdatas ={
                typeId:data.field.typeId,
                cover:$('#cover')[0].src,
                sort:data.field.sort,
                title:data.field.title,
                content:data.field.layeditDemo
            }
            $.ajax({ 
                url:Url+'news/save', 
                type:'post', 
                headers:{"Content-Type":"application/json",'token':localStorage.getItem('token')},
                dataType:'JSON', 
                data : JSON.stringify(pushdatas),
                success:function(data){
                    if(data.status==0){
                        layer.msg('添加成功', {icon: 1},function(){
                            closeiframe()
                        });
                    }else{
                        layer.msg('添加失败', {icon: 5})
                    }
                    return false
                } 
            })
        }

        //发异步，把数据提交给php
        // layer.alert("增加成功", {
        //     icon: 6
        // },
        // function() {
        //     // 获得frame索引
        //     var index = parent.layer.getFrameIndex(window.name);
        //     //关闭当前frame
        //     parent.layer.close(index);
        // });
        return false;
    });

});