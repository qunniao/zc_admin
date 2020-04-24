// let shopotions =''
let usrl =  decodeURI(location.search); //获取url中"?"符后的字串
let prodectid= usrl.split('&')[0].split('=')[1]
let prodectshowid= usrl.split('&')[1].split('=')[1]
if(prodectshowid==1){
    $('#savebtn').css('display','none')
}
let ischeck =false
if(prodectid!=''&&prodectid!=null&&prodectid!=undefined&&prodectid!=-1){
    ischeck=true
}
let shopdivnum=0;
let skudivnum =0;
let skutwoid =0;
let ishavelist =[];
let mobbileid =''
let pcid=''
// // 获取属性名
// _ajax({
//     url : "attrName",  // url---->地址
//     type : "GET",   // type ---> 请求方式
//     async : true,   // async----> 同步：false，异步：true 
//     data : {        //传入信息
//     },
//     success : function(data){   //返回接受信息
//         let datas =JSON.parse(data);
//         if(datas.status==0){
//             for(let i=0;i<datas.data.length;i++){
//                 let optiondiv = '<option value="'+datas.data[i].nid+'">'+datas.data[i].name+'</option>'
//                 shopotions+=optiondiv
//             }
//         }
//     }
// })
// 获取一级产品类型
_ajax({
    url : "/productType",  // url---->地址
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
            for(let i=0;i<datas.data.records.length;i++){
                let optiondiv = '<option value="'+datas.data.records[i].tid+'">'+datas.data.records[i].typeName+'</option>'
                shopprolist+=optiondiv
            }
            $('#protypeid').append(shopprolist)
            if(ischeck){
                ischeck=false
                getshopdetail(prodectid)
            }else{
                getprotwo(datas.data.records[0].tid)
            }
            renderForm()
        }
    }
})
function getshopdetail(shoid){
    _ajax({
        url : "product/info/"+shoid,  // url---->地址
        type : "GET",   // type ---> 请求方式
        async : true,   // async----> 同步：false，异步：true 
        data : {        //传入信息
        },
        success : function(data){   //返回接受信息
            let datas =JSON.parse(data);
            let shopdatas =datas
            let shopprolisttwo =''
                $('#product_name').val(datas.data.product.productName)
                $('#product_intro').val(datas.data.product.productIntro)
                $('#price').val(datas.data.product.price)
                $('#market_price').val(datas.data.product.marketPrice)
                $('#price_unit').val(datas.data.product.priceUnit)
                mobbileid =datas.data.product.productDetailMobile.did
                pcid=datas.data.product.productDetailPc.did
                let mobilepic = []
                if(datas.data.product.productDetailMobile.content!=null){
                    mobilepic=datas.data.product.productDetailMobile.content.split(',')
                }
                let isrecimmend =0
                if(datas.data.product.isRecommend==true){
                    isrecimmend=1
                }
                $('#isRecommend').val(Number(isrecimmend))
                renderForm()
                _ajax({
                    url : "productType/info/"+datas.data.product.ptId,  // url---->地址
                    type : "GET",   // type ---> 请求方式
                    async : true,   // async----> 同步：false，异步：true 
                    data : {        //传入信息
                    },
                    success : function(data){   //返回接受信息
                        let datas =JSON.parse(data);
                        let checkdata =datas
                        if(datas.status==0){
                            if(datas.data.pid==0){
                                $('#protypeid').val(shopdatas.data.product.ptId)
                                renderForm()
                            }else{
                                $('#ptid').empty()
                                _ajax({
                                    url : "productType",  // url---->地址
                                    type : "GET",   // type ---> 请求方式
                                    async : true,   // async----> 同步：false，异步：true 
                                    data : {        //传入信息
                                        pageNum:1,
                                        size:10,
                                        pid :datas.data.pid
                                    },
                                    success : function(data){   //返回接受信息
                                        let datas =JSON.parse(data);
                                        let shopprolisttwo =''
                                        if(datas.status==0){
                                            for(let i=0;i<datas.data.records.length;i++){
                                                let shoptwodiv= '<option value="'+datas.data.records[i].tid+'">'+datas.data.records[i].typeName+'</option>'
                                                shopprolisttwo+=shoptwodiv
                                            }
                                            $('#ptid').append(shopprolisttwo)
                                            renderForm()
                                            $('#ptid').val(checkdata.data.tid)
                                            $('#protypeid').val(checkdata.data.pid)
                                            renderForm()
                                        }
                                    }
                                })
                            }
                            renderForm()
                        }
                    }
                })
                let shoppic =datas.data.product.productImage
                // pc端详情
                $("#layeditDemo").val(datas.data.product.productDetailPc.content);
                for(let i=0;i<mobilepic.length;i++){
                    let div =' <div style="float:left;width: 100px;height:120px;"><img name="mobileshoppics" style="width: 100px;height:100px;" src="'+mobilepic[i]+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                    $('#demo3').append(div)
                }
                for(let i=0;i<shoppic.length;i++){
                    let div =' <div style="float:left;width: 100px;height:120px;"><img name="shoppics" style="width: 100px;height:100px;" src="'+shoppic[i].url+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                    $('#demo2').append(div)
                }
                // $('#layeditDemo').val(datas.pcContent)
                // 商品参数
                let shopcslist = datas.data.product.productParam;
                for(let i=0;i<shopcslist.length;i++){
                    shopdivnum =1+i;
                    let shopdivid= 'shopdiv'+shopdivnum
                    let shoptwodiv =[]
                    if(shopcslist[i].values!=undefined){
                        shoptwodiv=shopcslist[i].values.split(',')
                    }
                    let shopdiv=' <div name="shopcsboxs" class="csbox" id="'+shopdivid+'"><input style="text-align:center" type="text" value="'+shopcslist[i].name+'" placeholder="参数名"  name="shopcsname" required="" lay-verify="required" autocomplete="off" class="layui-input"><input type="text" style="text-align:center" placeholder="参数值" value="'+shoptwodiv[0]+'"  name="shopcsnamestyle" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label><label onclick="addshopctwo('+shopdivid+')"> 添加</label></div>'
                    $('#shopcs').append(shopdiv)
                    for(let j=1;j<shoptwodiv.length;j++){
                        let adddiv =' <div class="csboxtwo"><input type="text" value="'+shoptwodiv[j]+'" placeholder="参数值"  style="text-align:center" name="shopcsnamestyle" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label></div>'
                        $('#'+shopdivid).append(adddiv)
                    }
                }
                // sku参数
                let skucslist = datas.data.productGuigeNameList;
                for(let i=0;i<skucslist.length;i++){
                    skudivnum +=i;
                    let skudivid= 'Father_Item'+skudivnum
                    let skunumid=  'skunum'+skudivnum
                    let skudiv ='<div><ul class="Father_Title"><input name="skunums" id='+skunumid+'  type="text" onchange="bindsteps(this)" class="layui-input" value="'+skucslist[i].gName+'"  lay-verify="required" autocomplete="off" required=""/><label onclick="delall(this)"> 删除</label><label onclick="addskuname('+skudivid+')"> 添加</label></ul><ul name="skuboxshow" class="'+skudivid+'" id="'+skudivid+'"><li class="li_width"><input onchange="bindstep(this)"  type="text" class="layui-input" value="'+skucslist[i].productGuigeValueList[0].gValue+'" /><label onclick="dels(this)"> 删除</label></li></ul></div>'
                    $('#skucs').append(skudiv)

                    for(let j=1;j<skucslist[i].productGuigeValueList.length;j++){
                        let addskudiv ='<li class="li_width"><input  type="text" class="layui-input" onchange="bindstep(this)" value="'+skucslist[i].productGuigeValueList[j].gValue+'"  lay-verify="required" autocomplete="off" required="" /><label onclick="dels(this)"> 删除</label></li></li>'
                        $('#'+skudivid).append(addskudiv)
                    }
                    
                }
                layui.use('layedit', function () {
                    layedit = layui.layedit;
                    content = layedit.build('layeditDemo');
                });
                step.Creat_Table();
                for(let x=0;x<datas.data.sku.length;x++){
                    $("input[name='Txt_PriceSon']").eq(x).val(datas.data.sku[x].price)
                    $("input[name='Txt_CountSon']").eq(x).val(datas.data.sku[x].num)
                }
                renderForm()
        }
    })
}
function getprotwo(id){
    $('#ptid').empty()
    _ajax({
        url : "productType",  // url---->地址
        type : "GET",   // type ---> 请求方式
        async : true,   // async----> 同步：false，异步：true 
        data : {        //传入信息
            pageNum:1,
            size:10,
            pid :id
        },
        success : function(data){   //返回接受信息
            let datas =JSON.parse(data);
            let shopprolisttwo =''
            if(datas.status==0){
                for(let i=0;i<datas.data.records.length;i++){
                    let shoptwodiv= '<option value="'+datas.data.records[i].tid+'">'+datas.data.records[i].typeName+'</option>'
                    shopprolisttwo+=shoptwodiv
                }
                $('#ptid').append(shopprolisttwo)
                renderForm()
            }
        }
    })
} 
function del(e){
    e.parentNode.parentNode.removeChild(e.parentNode);
}
layui.use('upload', function(){
    var $ = layui.jquery
    ,upload = layui.upload;
    upload.render({
        elem: '#test2'
        ,url: Url+'banner/addFile'
        ,headers:{'token':localStorage.getItem('token')}
        ,multiple: true
        ,field:'files'
        ,before: function(obj){
        //预读本地文件示例，不支持ie8
        // obj.preview(function(index, file, result){
        //     // $('#demo2').append('<img src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img">')
        //     let div =' <div style="float:left;width: 100px;height:120px;"><img name="shoppics" style="width: 100px;height:100px;" src="'+result+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
        //     $('#demo2').append(div)
        // });
        }
        ,done: function(res){
            for(let i=0;i<res.data.length;i++){
                let div =' <div style="float:left;width: 100px;height:120px;"><img name="shoppics" style="width: 100px;height:100px;" src="'+res.data[i]+'"><title style="display: block;text-align: center" onclick="del(this)">删除</title></div>'
                $('#demo2').append(div)
            }
            console.log(res)
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
        //自定义样式-暂只支持video添加
        //, customTheme: {
        //    video: {
        //        title: ['原版', 'custom_1', 'custom_2']
        //        , content: ['', 'theme1', 'theme2']
        //        , preview: ['', '/images/prive.jpg', '/images/prive2.jpg']
        //    }
        //}
        //插入自定义链接
        , customlink:{
            title: '插入layui官网'
            , href: 'https://www.layui.com'
            ,onmouseup:''
        }
        , facePath: 'http://knifez.gitee.io/kz.layedit/Content/Layui-KnifeZ/'
        , devmode: true
        , videoAttr: ' preload="none" ' 
        //预览样式设置，等同layer的offset和area规则，暂时只支持offset ,area两个参数
        //默认为 offset:['r'],area:['50%','100%']
        //, previewAttr: {
        //    offset: 'r'
        //    ,area:['50%','100%']
        //}
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
layui.use(['form', 'layer','layedit', 'jquery'],
function() {
    $ = layui.jquery;
    var form = layui.form,
    layer = layui.layer;

    //自定义验证规则
    form.verify({
        nikename: function(value) {
            if (value.length < 5) {
                return '昵称至少得5个字符啊';
            }
        },
        pass: [/(.+){6,12}$/, '密码必须6到12位'],
        repass: function(value) {
            if ($('#L_pass').val() != $('#L_repass').val()) {
                return '两次密码不一致';
            }
        }
    });
    form.on('select(business)', function(data){
        let changeid=$(this).parent().parent().parent().parent()[0].id
        $("#"+changeid+" select[name='selectwo']").eq(0).empty();;
        // $("#"+changeid+" div[class='csbox3']").remove();
        let newlist=''
        _ajax({
            url : "/attrValue",  // url---->地址
            type : "GET",   // type ---> 请求方式
            async : true,   // async----> 同步：false，异步：true 
            data : {        //传入信息
                nid:data.value
            },
            success : function(data){   //返回接受信息
                let datas =JSON.parse(data);
                if(datas.status==0){
                    for(let i=0;i<datas.data.length;i++){
                        let newoptiondiv = '<option value="'+datas.data[i].vid+'">'+datas.data[i].name+'</option>'
                        newlist+=newoptiondiv
                    }
                    $("#"+changeid+" select[name='selectwo']").eq(0).append(newlist)
                    renderForm()
                }
            }
        }) 
        renderForm()

    })
    form.on('select(changepro)', function(data){
        getprotwo(data.value)

    })
    //监听提交
    form.on('submit(add)',
    function(data) {
        let shoppic=[] //产品轮播图
        let shopcslength = [];
        let mobileurl={
            sort:0,
            content:''
        } //手机端详情图
        let paramlist =[];//商品参数
        // let skulist =[];
        let skudatalist =[] //sku参数
        // 产品轮播图
        $("img[name='shoppics']").each(function(j,item){
            if(j==0){
                let imgdata={
                    is_cover:'true',
                    url:item.src
                }
                shoppic.push(imgdata)
            }else{
                let imgdata={
                    is_cover:'false',
                    url:item.src
                }
                shoppic.push(imgdata)
            }
        });
        // 手机端详情
        $("img[name='mobileshoppics']").each(function(j,item){
            if(j==0){
                mobileurl.content+=item.src
            }else{
                mobileurl.content+=","+item.src
            }
        });
        // 获取全部商品参数个数
        $("div[name='shopcsboxs']").each(function(j,item){
            shopcslength.push(item.id)
            console.log(item)
        });
        // 获取全部sku参数
        let allshow =[]
        let skulist =[]
        let k=1;
        let x=1;
        let skuInfo={
            sku:[]
        }
        $("th[name='skuallnum']").each(function(j,item){
                ishavelist.push(item.innerHTML)                      
        });
        $("input[name='skunums']").each(function(j,item){
            console.log(item)
            for(let i=0;i<ishavelist.length;i++){
                if(ishavelist[i]==item.value){
                    if(k==1){
                        skuInfo.level1={}
                        skuInfo.level1.key=item.value
                    }
                    if(k==2){
                        skuInfo.level2={}
                        skuInfo.level2.key=item.value
                    }
                    if(k==3){
                        skuInfo.level3={}
                        skuInfo.level3.key=item.value
                    }
                    k+=1
                    allshow.push('Father_Item'+item.id.split('skunum')[1])
                }
            }        
        });
        for(let i=0;i<allshow.length;i++){
            $("#"+allshow[i]+" input").each(function(j,item){
                if(x==1){
                    if(j==0){
                        skuInfo.level1.value=''+item.value
                    }else{
                        skuInfo.level1.value+=','+item.value
                    }
                }
                if(x==2){
                    if(j==0){
                        skuInfo.level2.value=''+item.value
                    }else{
                        skuInfo.level2.value+=','+item.value
                    }
                }
                if(x==3){
                    if(j==0){
                        skuInfo.level3.value=''+item.value
                    }else{
                        skuInfo.level3.value+=','+item.value
                    }
                }
            })
            x++
        }
        let skuprice = $("input[name='Txt_PriceSon']")
        let skusl =$("input[name='Txt_CountSon']")
        for(let i=0;i<skuprice.length;i++){
            let price={
                "price":skuprice[i].value,
                "num":skusl[i].value
            }
            skuInfo.sku.push(price)
        }
        console.log(skuInfo)
        // 判断sku参数是否重复
        // 产品参数获取
        for(let i=0;i<shopcslength.length;i++){
            console.log(shopcslength[i])
            $("#"+shopcslength[i]).each(function(j,item){
                $("#"+shopcslength[i]+" input[name='shopcsname']").each(function(j,item){
                    let paramkey ={
                        name:item.value,
                        values:''
                    }
                    paramlist.push(paramkey)
                })
                $("#"+shopcslength[i]+" input[name='shopcsnamestyle']").each(function(j,item){
                    if(j==0){
                        paramlist[i].values+=item.value
                    }else{
                        paramlist[i].values+=','+item.value
                    }
                })
            });
        }
        let skucheck =true
        for(let i=0;i<skuInfo.sku.length;i++){
            if(skuInfo.sku[i].price==''||skuInfo.sku[i].num==''){
                layer.msg('sku部分有价格或数量未填写', {icon: 5})
                return false
            }
        }
        if(data.field.layeditDemo==null||data.field.layeditDemo==''){
            layer.msg('电脑端详情未填写', {icon: 5})
                return false
        }
        if(mobileurl.content==''){
            layer.msg('手机端端详情未上传', {icon: 5})
                return false
        }
        if(shoppic.length<1){
            layer.msg('产品轮播图未上传', {icon: 5})
                return false
        }
        if(!skucheck){
            return false
        }
        let ptid =data.field.ptid
        if(data.field.ptid==''){
            ptid=data.field.protypeid
        }
        let recommend =false;
        if(data.field.isRecommend==1){
            recommend=true
        }
        let jsondata={
            "product": {
                "ptId": ptid,
                "recommend":recommend,
                "productName": data.field.product_name,
                "productIntro": data.field.product_intro,
                "price": data.field.price,
                "marketPrice": data.field.market_price,
                "priceUnit": data.field.price_unit
            },
            "productImage": shoppic,
            "productDetailMobile": mobileurl,
            "productDetailPc":{
                sort:0,
                content:data.field.layeditDemo
            },
            "param": paramlist,
            "skuInfo": skuInfo
        }
        console.log(jsondata)
        if(prodectid!=''&&prodectid!=null&&prodectid!=undefined&&prodectid!=-1){
            jsondata.product.pid=prodectid
            jsondata.productDetailMobile.did=mobbileid
            jsondata.productDetailPc.did=pcid
            $.ajax({
                url:Url+"product/update",
                type:"PUT",
                data:JSON.stringify(jsondata),
                dataType:"json",
                headers:{"Content-Type":"application/json",'token':localStorage.getItem('token')},
                success:function(data){
                    console.log(data)
                    if(data.status==0){
                        layer.msg('修改成功', {icon: 1},function(){
                                closeiframe()
                        });
                    }else{
                        layer.msg('修改失败', {icon: 5})
                    }
                    
                }
            });   
        }else{
            $.ajax({ 
            url:Url+'product/insert', 
            type:'post', 
            headers:{"Content-Type":"application/json",'token':localStorage.getItem('token')},
            dataType:'JSON', 
            data : JSON.stringify(jsondata),
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
        return false;
    });


});
// 产品参数
function addshopctwo(e){
    console.log(e)
    let adddiv =' <div class="csboxtwo"><input type="text" placeholder="参数值"  style="text-align:center" name="shopcsnamestyle" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label></div>'
    $('#'+e.id).append(adddiv)
}
function addshopcs(){
    shopdivnum +=1;
    let shopdivid= 'shopdiv'+shopdivnum
    console.log(shopdivid)
    let shopdiv=' <div name="shopcsboxs" class="csbox" id="'+shopdivid+'"><input style="text-align:center" type="text" placeholder="参数名"  name="shopcsname" required="" lay-verify="required" autocomplete="off" class="layui-input"><input type="text" style="text-align:center" placeholder="参数值"  name="shopcsnamestyle" required="" lay-verify="required" autocomplete="off" class="layui-input"><label onclick="del(this)"> 删除</label><label onclick="addshopctwo('+shopdivid+')"> 添加</label></div>'
    $('#shopcs').append(shopdiv)
}
function del(thisdel){
    thisdel.parentNode.parentNode.removeChild(thisdel.parentNode);
}
// sku参数
function addsku(){
    let skudivid= 'Father_Item'+skudivnum
    let skunumid=  'skunum'+skudivnum
    skudivnum +=1;
    let skudiv ='<div><ul class="Father_Title"><input name="skunums" id='+skunumid+'  type="text" onchange="bindsteps(this)"  lay-verify="required" autocomplete="off" required="" class="layui-input" value="" /><label onclick="delall(this)"> 删除</label><label onclick="addskuname('+skudivid+')"> 添加</label></ul><ul name="skuboxshow" class="'+skudivid+'" id="'+skudivid+'"><li class="li_width"><input onchange="bindstep(this)"  type="text" class="layui-input"  lay-verify="required" autocomplete="off" required="" value="" /><label onclick="dels(this)"> 删除</label></li></ul></div>'
    $('#skucs').append(skudiv)
}
function bindsteps(e){
    step.Creat_Table();
}
function bindstep(e){
    if(e.value==''){
        e.parentNode.parentNode.removeChild(e.parentNode);
    }
    let arr =$('#'+e.parentNode.parentNode.id+' input');
    let isdel =false
    for(let i=0;i<arr.length;i++){
        for(let j=i+1;j<arr.length;j++){
            if(arr[i].value==arr[j].value){
                isdel=true
            }
        }
    }
    if(isdel){
        layer.msg('不能添加重复值', {icon: 5},function(){
            e.parentNode.parentNode.removeChild(e.parentNode);
        });
    }
    step.Creat_Table();
}
function delall(e){
    // $(this).next().remove();
    e.parentNode.parentNode.remove();
    // e.parentNode.parentNode.removeChild(e.parentNode);
    step.Creat_Table();
}
function dels(e){
    e.parentNode.parentNode.removeChild(e.parentNode);
    step.Creat_Table();
}
function addskuname(e){
    console.log(123)
    // skutwoid+=1
    // let skutwodivid= 'skutwodiv'+skutwoid
    let addskudiv ='<li class="li_width"><input  type="text" class="layui-input" onchange="bindstep(this)" value="" /><label onclick="dels(this)"> 删除</label></li></li>'
    $('#'+e.id).append(addskudiv)
    layui.use(['form', 'layer'],
    function() {
        $ = layui.jquery;
        var form = layui.form,
        layer = layui.layer;
        form.render()
    })
}