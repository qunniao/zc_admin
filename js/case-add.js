function del(e){
    e.parentNode.parentNode.removeChild(e.parentNode);
}
let casedivnum=0;
let ischeck=false
let usrl =  decodeURI(location.search); //获取url中"?"符后的字串
let caseid= usrl.split('&')[0].split('=')[1]
let caseshowid= usrl.split('&')[1].split('=')[1]
if(caseshowid==1){
    $('#savebtn').css('display','none')
}
if(caseid!=-1){
    ischeck=true
}
// 修改时获取案例详情
function getcasedetail(){
    _ajax({
        url : "case/info/"+caseid,  // url---->地址
        type : "GET",   // type ---> 请求方式
        async : true,   // async----> 同步：false，异步：true 
        data : {        //传入信息
        },
        success : function(data){   //返回接受信息
            let datas =JSON.parse(data);
            if(datas.status==0){
                let div =' <div style="float:left;width: 100px;height:120px;"><img id="cover" name="shoppics" style="width: 100px;height:100px;" src="'+datas.data.cover+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                $('#demo2').html(div)
                $('#name').val(datas.data.name)
                let isrecimmend =0
                if(datas.data.recommend){
                    isrecimmend=1
                }
                $('#isRecommend').val(isrecimmend)
                $('#price').val(datas.data.price)
                let mobilepic = datas.data.mobileDetail.split(',')
                for(let i=0;i<mobilepic.length;i++){
                    let div =' <div style="float:left;width: 100px;height:120px;"><img name="mobileshoppics" style="width: 100px;height:100px;" src="'+mobilepic[i]+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                    $('#demo3').append(div)
                }
                let caseparamlist = datas.data.caseAttrs;
                for(let i=0;i<caseparamlist.length;i++){
                    casedivnum =1+i;
                    let casedivid= 'casediv'+casedivnum
                    let casetwodiv =caseparamlist[i].attrValue.split(',')
                    let casediv=' <div name="casecsboxs" class="csbox" id="'+casedivid+'"><input style="text-align:center" type="text" value="'+caseparamlist[i].attrName+'" placeholder="参数名"  name="casename" required="" lay-verify="required" autocomplete="off" class="layui-input"><input type="text" style="text-align:center" placeholder="参数值" value="'+casetwodiv[0]+'"  name="casenum" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label><label onclick="addshopctwo('+casedivid+')"> 添加</label></div>'
                    $('#caseattrbox').append(casediv)
                    for(let j=1;j<casetwodiv.length;j++){
                        let adddiv =' <div class="csboxtwo"><input type="text" value="'+casetwodiv[j]+'" placeholder="参数值"  style="text-align:center" name="casenum" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label></div>'
                        $('#'+casedivid).append(adddiv)
                    }
                }
                $("#layeditDemo").val(datas.data.content);
                layui.use('layedit', function () {
                    layedit = layui.layedit;
                    content = layedit.build('layeditDemo');
                });
                if(datas.data.caseLabels.pid==0){
                    $('#protypeid').val(datas.data.tid)
                }else{
                    $('#protypeid').val(datas.data.caseLabels.pid)
                    let twoid =datas.data.tid
                    $('#tid').empty()
                    _ajax({
                        url : "caseLabel/list/"+datas.data.caseLabels.pid,  // url---->地址
                        type : "GET",   // type ---> 请求方式
                        async : true,   // async----> 同步：false，异步：true 
                        data : {        //传入信息
                        },
                        success : function(data){   //返回接受信息
                            let datas =JSON.parse(data);
                            let shopprolisttwo =''
                            if(datas.status==0){
                                for(let i=0;i<datas.data.length;i++){
                                    let shoptwodiv= '<option value="'+datas.data[i].bid+'">'+datas.data[i].labelName+'</option>'
                                    shopprolisttwo+=shoptwodiv
                                }
                                $('#tid').append(shopprolisttwo)
                                $('#tid').val(twoid)
                                renderForm()
                            }
                        }
                    })
                }
                renderForm()
            }
        }
    })  
}
// 分类下拉一级获取
_ajax({
    url : "/caseLabel/list",  // url---->地址
    type : "GET",   // type ---> 请求方式
    async : true,   // async----> 同步：false，异步：true 
    data : {        //传入信息
        pageNum:1,
        size:10,
        pid :0
    },
    success : function(data){   //返回接受信息
        let datas =JSON.parse(data);
        if(datas.status==0){
            let shopprolist =''
            for(let i=0;i<datas.data.length;i++){
                let optiondiv = '<option value="'+datas.data[i].bid+'">'+datas.data[i].labelName+'</option>'
                shopprolist+=optiondiv
            }
            $('#protypeid').append(shopprolist)
            getprotwo(datas.data[0].bid)
            renderForm()
        }
    }
})
// 分类二级下拉获取
function getprotwo(id){
    $('#tid').empty()
    _ajax({
        url : "caseLabel/list/"+id,  // url---->地址
        type : "GET",   // type ---> 请求方式
        async : true,   // async----> 同步：false，异步：true 
        data : {        //传入信息
        },
        success : function(data){   //返回接受信息
            let datas =JSON.parse(data);
            let shopprolisttwo =''
            if(datas.status==0){
                for(let i=0;i<datas.data.length;i++){
                    let shoptwodiv= '<option value="'+datas.data[i].bid+'">'+datas.data[i].labelName+'</option>'
                    shopprolisttwo+=shoptwodiv
                }
                $('#tid').append(shopprolisttwo)
                renderForm()
                if(ischeck){
                    ischeck=false;
                    getcasedetail()
                }
            }
        }
    })
} 
// 添加案例属性
function addshopctwo(e){
    let adddiv =' <div class="csboxtwo"><input type="text" placeholder="参数值"  style="text-align:center" name="casenum" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label></div>'
    $('#'+e.id).append(adddiv)
}
function addcaseattr(){
    casedivnum +=1;
    let casedivid= 'casediv'+casedivnum
    let casediv=' <div name="casecsboxs" class="csbox" id="'+casedivid+'"><input style="text-align:center" type="text" placeholder="参数名"  name="casename" required="" lay-verify="required" autocomplete="off" class="layui-input"><input type="text" style="text-align:center" placeholder="参数值"  name="casenum" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label><label onclick="addshopctwo('+casedivid+')"> 添加</label></div>'
    // let shopdiv = '<div class="csbox"><input type="text"  name="shopcsname" required="" lay-verify="required" autocomplete="off" class="layui-input"><input type="text"  name="shopcsnamestyle" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label></div>'
    $('#caseattrbox').append(casediv)
}
// function addcaselabel(){
//     let adddiv ='<div class="csbox"><input type="text" name="casenum"  required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label></div>'
//     $('#caselabelbox').append(adddiv)
// }
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
            if(data.upload.length > 1){//这里是判断选择文件的个数,根据实际情况设置
                layer.alert('请选择单个文件!!!:', {//本人这里是用的layer插件提示用户
                    icon: 2,
                    skin: 'layer-ext-moon'
                });
                return false;
            }
        }
        ,before: function(e, data) {//这个是选择文件的回调函数
            if(e.upload.length > 2){//这里是判断选择文件的个数,根据实际情况设置
                layer.alert('请选择单个文件!!!:', {//本人这里是用的layer插件提示用户
                    icon: 2,
                    skin: 'layer-ext-moon'
                });
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
            acceptMime: 'image/*',
            headers:{'token':localStorage.getItem('token')},
            field:'files',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: 1024 * 10,
            data: {
            }
            ,done: function (data) {
            }
        },
        uploadVideo: {
            url: 'your url',
            accept: 'video',
            headers:{'token':localStorage.getItem('token')},
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
        getprotwo(data.value)

    })
    //监听提交
    form.on('submit(add)',
    function(data) {
        let casecslength=[]//获取所有案例的最外层id
        let shoppic='' //产品轮播图
        let caseparam =[]//案例属性
        let mobileurl='' //手机端详情图
        $("div[name='casecsboxs']").each(function(j,item){
            casecslength.push(item.id)
        });
        $("img[name='mobileshoppics']").each(function(j,item){
            if(j==0){
                mobileurl+=item.src
            }else{
                mobileurl+=","+item.src
            }
        });
        if($('#cover')[0]==undefined){
            layer.msg('图片未上传', {icon: 1})
        }
        for(let i=0;i<casecslength.length;i++){
            $("#"+casecslength[i]).each(function(j,item){
                $("#"+casecslength[i]+" input[name='casename']").each(function(j,item){
                    let paramkey ={
                        name:item.value,
                        value:''
                    }
                    caseparam.push(paramkey)
                    // console.log('输出')
                    // console.log(item.value)
                })
                $("#"+casecslength[i]+" input[name='casenum']").each(function(j,item){
                    if(j==0){
                        caseparam[i].value=''+item.value
                    }else{
                        caseparam[i].value+=","+item.value
                    }
                })
            });
        }
        if(caseid!=-1){
            let recommend =false;
            if(data.field.isRecommend==1){
                recommend=true
            }
            let pushdatas ={
                cid:caseid,
                recommend:recommend,
                name:data.field.name,
                price:data.field.price,
                tid:data.field.tid,
                cover:$('#cover')[0].src,
                mobileDetail:mobileurl,
                attrs:caseparam,
                content:data.field.layeditDemo
            }
            if(data.field.tid==''){
                pushdatas.tid=data.field.protypeid
            }
            $.ajax({
                url:Url+"case/update",
                type:"PUT",
                data:JSON.stringify(pushdatas),
                dataType:"json",
                headers:{"Content-Type":"application/json",'token':localStorage.getItem('token')},
                success:function(data){
                    if(data.status==0){
                            layer.msg('修改成功', {icon: 1},function(){
                                closeiframe()
                        });
                    }else{
                        layer.msg('修改失败',{icon:5})
                    }
                    
                }
            });                        
        }else{
            let recommend =false;
            if(data.field.isRecommend==1){
                recommend=true
            }
            if($('#cover')[0]==undefined){
                layer.msg('图片未上传', {icon: 5})
                return false
            }
            console.log(data)
            let pushdatas ={
                recommend:recommend,
                name:data.field.name,
                price:data.field.price,
                tid:data.field.tid,
                cover:$('#cover')[0].src,
                mobileDetail:mobileurl,
                attrs:caseparam,
                content:data.field.layeditDemo
            }
            if(data.field.tid==''){
                pushdatas.tid=data.field.protypeid
            }
            $.ajax({ 
                url:Url+'case/save', 
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