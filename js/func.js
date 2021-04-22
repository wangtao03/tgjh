var types = ["公务车通行卡", "施工车通行卡", "职工车通行卡"]
/** 界面加载完成后执行查询 */
window.onload = function () {
  query();
  window.addEventListener('touchstart', forceSafariPlayAudio, false);

};

/**BGM播放 */
function forceSafariPlayAudio() {
  var bgm = document.getElementById('bgm');
  bgm.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
  bgm.play(); // iOS 7/8 仅需要 play 一下

  bgm.addEventListener('play', function () {
    // 当 audio 能够播放后, 移除这个事件
    window.removeEventListener('touchstart', forceSafariPlayAudio, false);
  }, false);
}
/** 获取参数的方法 **/
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

/** 获得整数 */
function getNumber(num) {
  return parseInt(num);
}

/** 获取当前时间 */
function getDateTime() {
  var date = new Date();
  return dateFormat(date, "yyyy年MM月dd日 hh时mm分ss秒");
}
/*格式化时间*/
function dateFormat(d, fmt) {
  d.toString().replace("-","/");
  var date = new Date(d);
  var o = {
    "M+": date.getMonth() + 1,                 //月份 
    "d+": date.getDate(),                    //日 
    "h+": date.getHours(),                   //小时 
    "m+": date.getMinutes(),                 //分 
    "s+": date.getSeconds(),                 //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds()             //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/** 格式化数字 */
function prefixInteger(num, length) {
  return (Array(length).join("0") + num).slice(-length);
}

/** 显示警告信息 */
function showWarnning(text) {
  document.getElementById("main").innerHTML = [
    '<section class="ui-notice">',
    "	<i></i>",
    "	<h1>",
    String(text),
    "	</h1>",
    '	<div class="ui-notice-btn">',
    '		<button class="ui-btn-primary ui-btn-lg" onclick="window.history.back();">确定</button>',
    "	</div>",
    "</section>",
  ].join("");
}

/** 执行查询 */
function query() {
  var request = GetRequest();
  var t = request["t"];
  var n = request["n"];
  if (t != undefined && n != undefined) {
    Bmob.initialize("a8ed8f0519ef553d", "^oEQjE");
    const query = Bmob.Query('dc_cars');
    query.equalTo("TID", "==", parseInt(t));
    query.equalTo("PID", "==", parseInt(n));
    query.find().then(res => {
      if (res !== undefined) {
        document.getElementById('warn').hidden=true;
        document.getElementById("type").innerText = types[res[0].TID - 1];
        document.getElementById("num").innerText = res[0].PID;
        document.getElementById("carnum").innerText = res[0].CAR_NUM;
        document.getElementById("telephone").innerText = (res[0].TELEPHONE.length > 0) ? res[0].TELEPHONE : "无联系方式";
        document.getElementById("company").innerText = res[0].COMPANY;
        document.getElementById("createdate").innerText = dateFormat(res[0].CREATE_DATE.iso, "yyyy年MM月dd日");
        document.getElementById("validitydate").innerText = (res[0].VALIDITY_DATE != undefined) ? dateFormat(res[0].VALIDITY_DATE.iso, "yyyy年MM月dd日") : "";
        document.getElementById("time").innerText = getDateTime().toString();
      } else {
        return showWarnning("车辆信息不存在!");
      }
    });
  } else {
    return showWarnning("查询数据无效!");
  }

}
