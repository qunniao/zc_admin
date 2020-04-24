let usrl =  decodeURI(location.search); //获取url中"?"符后的字串
let orderid= usrl.split('&')[0].split('=')[1]
let ordernum =usrl.split('&')[1].split('=')[1]
_ajax({
        url : "orderInfo/One",  // url---->地址
        type : "GET",   // type ---> 请求方式
        async : true,   // async----> 同步：false，异步：true 
        data : {        //传入信息
          oid :orderid,
        },
        success : function(data){  
            let userdatas = JSON.parse(data);
            if(userdatas.status==0){
                let userdata =userdatas.data
                console.log(userdata)
                $('#orderNumber').html(userdata.orderNumber)
                $('#totalPrice').html(userdata.totalPrice)
                $('#payMoney').html(userdata.payMoney)
                $('#gmtModified').html(userdata.gmtModified)
                $('#contactName').html(userdata.contactName)
                $('#contactPhone').html(userdata.contactPhone)
                $('#contactAddress').html(userdata.contactAddress)
                $('#payNumber').html(userdata.payNumber)
                $('#sendWay').html(userdata.sendWay)
                $('#freight').html(userdata.freight)
                let orderstatus =''
                let payfun =''
                let payplat =''
                // 订单状态
                if(userdata.orderState==-1){
                    orderstatus= '已关闭'
                }else if(userdata.orderState==0){
                    orderstatus=  '待付款'
                }
                else if(userdata.orderState==2){
                    orderstatus=  '服务中'
                }
                else if(userdata.orderState==3){
                    orderstatus=  '待评价'
                }
                // 支付方式
                if(userdata.payWay==0){
                    payfun= '未支付'
                }else if(userdata.payWay==0){
                    payfun=  '货到付款'
                }
                else if(userdata.payWay==2){
                    payfun=  '线上支付'
                }
                // 支付平台
                if(userdata.payPlatform==0){
                    payplat= '余额支付'
                }else if(userdata.payPlatform==1){
                    payplat=  '支付宝'
                }
                else if(userdata.payPlatform==2){
                    payplat=  '微信'
                }
                $('#orderState').html(orderstatus)
                $('#payWay').html(payfun)
                $('#payPlatform').html(payplat)
                // for(let i=0;i<userdatalist.data.records.length;i++){
                //     let divlist ='<tr><td>'+userdatalist.data.records[i].gmtModified+'</td><td>'+userdatalist.data.records[i].contacts+'</td><td>'+userdatalist.data.records[i].phone+'</td><td class="td-manage"><a title="查看" ><i class="layui-icon">查看</i></a></td></tr>'
                //     $('#tableone').append(divlist)
                // }
            }
        }
})
_ajax({
    url : "orderProduct",  // url---->地址
    type : "GET",   // type ---> 请求方式
    async : true,   // async----> 同步：false，异步：true 
    data : {        //传入信息
        orderNumber :ordernum,
    },
    success : function(data){  
        let orderdatas = JSON.parse(data);
        if(orderdatas.status==0){
            let oderlist = orderdatas.data;
            for(let i=0;i<oderlist.length;i++){
                let oderdiv ='<tr><td><img class="orderpic" src="'+oderlist[i].url+'"></td><td><div>产品名称</div><div>'+oderlist[i].sku_name+'</div><div>x'+oderlist[i].product_num+'</div><div>￥'+oderlist[i].product_price+'</div></td><td>查看</td></tr>'
                $('#tabletwo').append(oderdiv)
            }
        }
    }
})