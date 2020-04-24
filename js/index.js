
var t=new Date();
            var iToDay=t.getDate();
            var iToMon=t.getMonth()+1;
            var iToYear=t.getFullYear();
            let nowmonth =iToMon
            let nowday =iToDay
            var nowdatalist=[]
            if(nowday<10){
                nowday="0"+nowday
            }
            if(nowmonth<10){
                nowmonth='0'+nowmonth
            }
            let nowtime =iToYear+'-'+nowmonth+'-'+nowday
            nowdatalist.push([nowtime,0])
            for(let i=1;i<30;i++){
                let newDay = new Date(iToYear,iToMon,(iToDay-i));
                let iToDays=newDay.getDate();
                let iToMons=newDay.getMonth();
                let iToYears=newDay.getFullYear();
                let nowmonths =iToMons
                let nowdays =iToDays
                if(nowdays<10){
                    nowdays="0"+nowdays
                }
                if(nowmonths<10){
                    nowmonths='0'+nowmonths
                }
                let nowtimes =iToYears+'-'+nowmonths+'-'+nowdays
                let nowtimedata =[nowtimes,0]
                nowdatalist.unshift(nowtimedata)
            }
                _ajax({
                    url : "user/firstPart",  // url---->地址
                    type : "GET",   // type ---> 请求方式
                    async : true,   // async----> 同步：false，异步：true 
                    data : {        //传入信息
                    },
                    success : function(data){   //返回接受信息
                        let datas =JSON.parse(data);
                        if(datas.status==0){
                            let datelist = datas.data.chart
                            let allvistnum =datas.data.visitorCount
                            if(allvistnum==null){
                                allvistnum=0
                            }
                            let allaccountnum =datas.data.userCount
                            if(allaccountnum==null){
                                allaccountnum=0
                            }
                            let onlinepricenum =datas.data.gmv
                            if(onlinepricenum==null){
                                onlinepricenum=0
                            }
                            let allshopnum =datas.data.productCount
                            if(allshopnum==null){
                                allshopnum=0
                            }
                            let allcasenum =datas.data.caseCount
                            if(allcasenum==null){
                                allcasenum=0
                            }
                            $('#allvist').html(allvistnum)
                            $('#allaccount').html(allaccountnum)
                            $('#onlineprice').html(onlinepricenum)
                            $('#allshop').html(allshopnum)
                            $('#allcase').html(allcasenum)
                            for(let i=0;i<datelist.length;i++){
                                for(let j=0;j<nowdatalist.length;j++){
                                    // console.log(nowdatalist[j][0])
                                    if(datelist[i].date==nowdatalist[j][0]){
                                        nowdatalist[j][1]=datelist[i].count
                                    }
                                }
                            }
                            var myChart = echarts.init(document.getElementById('main1'));
                            // 指定图表的配置项和数据
                            var option = {
                                grid: {
                                    top: '5%',
                                    right: '1%',
                                    left: '1%',
                                    bottom: '10%',
                                    containLabel: true
                                },
                                tooltip: {
                                    type: 'value',
                                    splitLine: {
                                        lineStyle: {
                                            type: 'dashed'
                                        }
                                    },
                                    splitNumber: 20
                                },
                                xAxis: {
                                    type: 'category',
                                    splitLine: {
                                        lineStyle: {
                                            type: 'dashed'
                                        }
                                    },
                                    axisLabel : {//坐标轴刻度标签的相关设置。
                                        interval:0,
                                        rotate:"60",
                                        formatter: function (val) {
                                            let  time = val.split('-')[1]+"-"+val.split('-')[2]
                                            // var texts=[date.getHours(),date.getMinutes()]
                                            return time
                                         }
                                    },
                                    splitNumber: 30
                                },
                                yAxis: {
                                    type: 'value',
                                    splitLine: {
                                        lineStyle: {
                                            type: 'dashed'
                                        }
                                    }
                                },
                                series: [{
                                    name: '用户量',
                                    type: 'scatter',
                                    label: {
                                        emphasis: {
                                            show: true,
                                            position: 'left',
                                            textStyle: {
                                                color: 'blue',
                                                fontSize: 16
                                            }
                                        }
                                    },
                                    data: nowdatalist,
                                    type: 'line',
                                    smooth: true
                                }]
                            };
                            myChart.setOption(option);
                        }
                    }
                })
                _ajax({
                    url : "orderInfo",  // url---->地址
                    type : "GET",   // type ---> 请求方式
                    async : true,   // async----> 同步：false，异步：true 
                    data : {        //传入信息
                        pageNum:1,
                        size:10
                    },
                    success : function(data){  
                        let shopdatalist = JSON.parse(data);
                        if(shopdatalist.status==0){
                            for(let i=0;i<shopdatalist.data.records.length;i++){
                                let ciliklistone = "'查看订单','./orderdetail.html?orderid="+shopdatalist.data.records[i].oid+"&ordernum="+shopdatalist.data.records[i].order_number+"',800,600"
                                let divlist ='<tr><td>'+timeStamp2String(shopdatalist.data.records[i].gmt_modified,7)+'</td><td>'+shopdatalist.data.records[i].nickname+'</td><td>'+shopdatalist.data.records[i].product_name+'</td><td><image src="'+shopdatalist.data.records[i].product_url+'"></td><td class="td-manage"><a title="查看" onclick="xadmin.open('+ciliklistone+')" ><i class="layui-icon">查看</i></a></td></tr>'
                                $('#tabletwo').append(divlist)
                            }
                        }
                    }
                })
                _ajax({
                    url : "feelback",  // url---->地址
                    type : "GET",   // type ---> 请求方式
                    async : true,   // async----> 同步：false，异步：true 
                    data : {        //传入信息
                        current:1,
                        size:10,
                        state:0
                    },
                    success : function(data){  
                        let userdatalist = JSON.parse(data);
                        console.log9
                        if(userdatalist.status==0){
                            for(let i=0;i<userdatalist.data.records.length;i++){
                                let ciliklist = "'待处理详情','./pdencldetail.html?userid="+userdatalist.data.records[i].id+"',800,600"
                                let divlist ='<tr><td>'+userdatalist.data.records[i].gmtModified+'</td><td>'+userdatalist.data.records[i].contacts+'</td><td>'+userdatalist.data.records[i].phone+'</td><td class="td-manage"><a onclick="xadmin.open('+ciliklist+')" title="查看" ><i class="layui-icon">查看</i></a></td></tr>'
                                $('#tableone').append(divlist)
                            }
                        }
                    }
                })
                function onpenparent(name,url){
                    parent.getshop(name,url);
                  }
          