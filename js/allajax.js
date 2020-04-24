
// let Url = 'http://10.7.17.33:8763/v1/' 
// let Url = 'http://47.110.34.1:8763/v1/'
let Url ='http://admin.zhanchengwlkj.com:8080/zc_program_backstage/v1/'
let token = localStorage.getItem('token')
if(token==null){
    alert('登录已过期，请重新登录')
    top.location.href='login.html'
}
function closeiframe(){
    xadmin.close();
    parent.location.reload()
}
function renderForm(){
    layui.use('form', function(){
    var form = layui.form;//高版本建议把括号去掉，有的低版本，需要加()
    form.render();
    });
}
function _ajax(options){
    var xhr = null;
    var params = formsParams(options.data);
    //创建对象
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 连接
    if(options.type == "GET"||options.type == "PUT"){
        xhr.open(options.type,Url+options.url + "?"+ params,options.async);
        xhr.setRequestHeader("token",token);
        xhr.send(null)
    } else if(options.type == "POST"){
        xhr.open(options.type,Url+options.url,options.async);
        xhr.setRequestHeader("token",token);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(params);
    } else if(options.type == "DELETE"){
        xhr.open(options.type,Url+options.url + "?"+ params,options.async);
        xhr.setRequestHeader("token",token);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(params);
    }else if(options.type == "JSON"){
        let paramsdata=  JSON.stringify(params)
        xhr.open('PUT',Url+options.url,options.async);
        xhr.setRequestHeader("token",token);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramsdata);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            options.success(xhr.responseText);
            if(JSON.parse(xhr.response).status==4000||JSON.parse(xhr.response).status==4001||JSON.parse(xhr.response).status==4002){
                localStorage.removeItem('token')
                location.href='login.html'
            }
        }
        // if(xhr.readyState == 4&& xhr.status == 200){
        //     console.log(JSON.parse(xhr.response).status)
        // }
    }
    function formsParams(data){
        var arr = [];
        for(var prop in data){
            arr.push(prop + "=" + data[prop]);
        }
        return arr.join("&");
    }
 
}
function timeStamp2String(time, type) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    if (type == '1') {
        return year + "年" + month + "月" + date + "日";
    }
    if (type == '2') {
        return year + "-" + month + "-" + date;
    }
    if (type == '3') {
        return month + "-" + date;
    }
    if(type == '4'){
        return month;
    }
    if(type == '5'){
        return date;
    }
    if(type == '6'){
        return year + "." + month + "." + date + " " + hour + ":" + minute + ":" + second;
    }
    if(type == '7'){
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
    if(type == '8'){
        return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    }
    if(type == '9'){
        return month + "-" + date + " " + hour + ":" + minute;
    }
}
