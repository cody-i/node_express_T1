/**
 * Created by li on 2019/5/26.
 */
const webConfig = {
    host:'localhost',
    port:3000,
    router:'online'
}

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};

//机能
function setUserName(obj){
    var url = `http://${webConfig.host}:${webConfig.port}/${webConfig.router}/getUserNameFromSession`;
    // do ajax 从后台session中取得用户名
    $.ajax({
        type:"POST",
        url:url,
        data:{},
        dataType:"json",
        success:function(res){
            // 成功通信，取得用户名
            obj.innerHTML = res.userName;
        },
        error:function(e){
            alert('登陆有问题啊你，后台没有你的信息啊。重新登陆来一次吧你');
            location.href = './login.html';
        }
    });
}

// 显示具体哪页菜单开关
function triggleType(e){
    // 全部隐藏
    for (var i = 0; i < typeMenu.length; i++) {
        // code to be executed
        typeMenu[i].obj.style.display = 'none';
    }

    var menuName = e.target.value;
    if(menuName == '报告作成'){
        document.getElementById('reportModule').style.display = '';
    }else if(menuName == '报告查询'){
        document.getElementById('searchModule').style.display = '';
    }
}

function getWorkListByWorkIdAndUserName(){
    var workId = document.getElementById("workId").value;
    var userName = document.getElementById('userName').innerHTML;
    var url = `http://${webConfig.host}:${webConfig.port}/${webConfig.router}/getWorkListByWorkIdAndUserName`;
    var info = {};
    info.workId = workId;
    info.userName = userName;

    // connect server to get this user's work list on this work id.
    $.ajax({
        type:"POST",
        url:url,
        data:info,
        dataType:"json",
        success:function(res){
            /* res 结构
             - msg
             - returnCode
             - workList
             - 数据库workList数据结构
             */
            var selectedIndex = 0;		// 储存<select>控件选择的index

            // check return code
            if (res.returnCode == null || res.returnCode < 0) {
                alert("error on server.\n" + res.msg);
            }else{
                alert(res.workList.workStatus);
                // create work list
                if(res.workList.length != 0){		// has work list

                    // 若已存在，先删除<select>控件
                    var objList = whileContent.children;
                    for(var i = 0; i < objList.length; i++){
                        if(objList[i].tagName == "SELECT"){
                            whileContent.removeChild(objList[i]);
                            break;
                        }
                    }

                    // 删除"确定"按钮
                    for(var i = 0; i < objList.length; i++){
                        if(objList[i].id == "confirmWorkId"){
                            whileContent.removeChild(objList[i]);
                            break;
                        }
                    }

                    // 创建新<select>控件
                    var objSelect = document.createElement("select");
                    objSelect.style.width = "150px";
                    for(var i = 0; i < res.workList.length; i++){
                        objSelect.options[i] = new Option(res.workList[i].workTitle, "");
                    }
                    objSelect.onchange = function(e){
                        selectedIndex = e.target.selectedIndex;		// 更新选择项
                    }
                    whileContent.appendChild(objSelect);

                    // 创建"确定"按钮
                    var objItem = document.createElement("input");
                    objItem.id = "confirmWorkId";
                    objItem.type = "button";
                    objItem.value = "confirm";
                    whileContent.appendChild(objItem);
                    objItem.onclick = function(e){

                        var workDetailContent = res.workList[selectedIndex];
                        var workDetail = document.getElementById("workDetail");

                        // 制作表格头
                        var tr = document.createElement("tr");
                        workDetail.appendChild(tr);
                        createOneThData("创建时间", tr);
                        createOneThData("担当者", tr);
                        createOneThData("作业番号", tr);
                        createOneThData("作业内容", tr);
                        createOneThData("预估工数", tr);
                        createOneThData("已用工数", tr);
                        createOneThData("总件数", tr);
                        createOneThData("已完成件数", tr);
                        createOneThData("实际开始时间", tr);
                        createOneThData("实际结束时间", tr);
                        createOneThData("作业状态", tr);
                        createOneThData("今天进度", tr);
                        createOneThData("用时（天）", tr);
                        createOneThData("已完成百分比", tr);

                        // 制作一行数据
                        tr = document.createElement("tr");
                        workDetail.appendChild(tr);
                        createOneTrData(workDetailContent.createTime, tr);
                        createOneTrData(workDetailContent.owner, tr);
                        createOneTrData(workDetailContent.workId, tr);
                        createOneTrData(workDetailContent.workTitle, tr);
                        createOneTrData(workDetailContent.estimateMD, tr);
                        createOneTrData(workDetailContent.usedMD, tr);
                        createOneTrData(workDetailContent.totalNum, tr);
                        createOneTrData(workDetailContent.completedNum, tr);
                        createOneTrData(workDetailContent.actualStartDate, tr);
                        createOneTrData(workDetailContent.actualEndDate, tr);
                        // 最后三项需要用户输入，分别是：
                        // - 作业状态
                        // - 当天完成量
                        // - 用时（天）
                        var td = document.createElement("td");
                        var selectTab = document.createElement("select");
                        selectTab.options[0] = new Option("未着手", "");
                        selectTab.options[1] = new Option("开始对应", "");
                        selectTab.options[2] = new Option("对应中", "");
                        selectTab.options[3] = new Option("对应完了", "");
                        td.appendChild(selectTab);
                        tr.appendChild(td);
                        if(workDetailContent.workStatus == "未着手"){
                            selectTab.selectedIndex = 0;
                        }else if(workDetailContent.workStatus == "开始对应"){
                            selectTab.selectedIndex = 1;
                        }else if(workDetailContent.workStatus == "对应中"){
                            selectTab.selectedIndex = 2;
                        }else if(workDetailContent.workStatus == "对应完了"){
                            selectTab.selectedIndex = 3;
                        }else{
                            selectTab.selectedIndex = 0;
                        }
                        td = document.createElement("td");
                        var input = document.createElement("input");
                        input.type = "text";
                        td.appendChild(input);
                        tr.appendChild(td);
                        td = document.createElement("td");
                        input = document.createElement("input");
                        input.type = "text";
                        td.appendChild(input);
                        tr.appendChild(td);
                        // 额外添加一项，百分比
                        if(workDetailContent.completedNum != ""){
                            var percentage = caculatePercentage(workDetailContent.totalNum, workDetailContent.completedNum);
                            createOneTrData(percentage, tr);
                        }else{
                            createOneTrData(`0%`, tr);
                        }

                        popUp.innerHTML = "";							// 关闭"popUp"中的所有控件
                        workDetail.style.display = "";		// 显示作业列表
                    }
                }else{
                    alert("user:" + userName + " , has no work in this work id: " + workId);
                }
            }
        },
        error:function(e){
            alert("fail to connect server");
        }
    });
}

function createOneThData(data, targetObj){
    var th = document.createElement("th");
    th.innerHTML = data;
    targetObj.appendChild(th);
}

function createOneTrData(data, targetObj){
    var td = document.createElement("td");
    td.innerHTML = data;
    targetObj.appendChild(td);
}

function caculatePercentage(total, completed){
    var totalNum = parseFloat(total);
    var completedNum = parseFloat(completed);
    var percentage = completedNum/totalNum * 100;
    return percentage + "%";
}