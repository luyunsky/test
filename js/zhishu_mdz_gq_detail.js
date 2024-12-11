$(function () {
  layui.use("laydate", function () {
    var past3year = new Date().getTime() - 60 * 60 * 24 * 365 * 3 * 1000;
    var laydate = layui.laydate;
    var startDate = laydate.render({
      elem: ".startTime",
      trigger: "click",
      theme: "#F59221",
      min: past3year,
      done: function (value, date) {
        if (value !== "") {
          endDate.config.min.year = date.year;
          endDate.config.min.month = date.month - 1;
          endDate.config.min.date = date.date;
          if (Date.parse(value) > Date.parse($(".endTime").val())) {
            $(".endTime").val("");
          }
        } else {
          endDate.config.min.year = "";
          endDate.config.min.month = "";
          endDate.config.min.date = "";
        }
      },
    });
    var endDate = laydate.render({
      elem: ".endTime",
      trigger: "click",
      theme: "#F59221",
      min: past3year,
      done: function (value, date) {
        if (value !== "") {
          if (Date.parse(value) < Date.parse($(".startTime").val())) {
            $(".startTime").val("");
          }
        } else {
          startDate.config.min.year = "";
          startDate.config.min.month = "";
          startDate.config.min.date = "";
        }
      },
    });
  });
  //  当前指数名称
  var curZSName = "米袋子供给价格指数";
  // 当前指数指标代码
  var curZSCode = "ID01954385";
  var zhibiaoCodeList = [
    "ID01954385",
    "ID01954115",
    "ID01954113",
    "ID01954114",
    "ID01954112"
  ];

// 动态配置指标名称和代码
var zhibiaoConfig = [
  { name: "米袋子供给价格指数", code: "ID01954385" },
  { name: "深加工企业玉米采购价格指数", code: "ID01954115" },
  { name: "玉米淀粉出库价格指数", code: "ID01954113" },
  { name: "面粉企业小麦采购价格指数", code: "ID01954114" },
  { name: "面粉企业面粉出厂价格指数", code: "ID01954112" }
];

  var zhibiaoYSCodeList = { 
    ID01954385: ["ID01954385","DE0017188897","DE0017188891"],
    ID01954115: ["ID01954115","DE0017188933","DE0017188932"],
    ID01954113: ["ID01954113","DE0017188929","DE0017188928"],
    ID01954114: ["ID01954114","DE0017188931","DE0017188930"],    
    ID01954112: ["ID01954112","DE0017188927","DE0017188926"]
  };

  function getPassYearFormatDate(day) {
    var date = new Date();
    date.setDate(date.getDate() - day);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + "-" + month + "-" + strDate;
    return currentdate;
  }

  function getData(zhibiao, startTime, endTime) {
    var _zhibiao = zhibiaoYSCodeList[zhibiao].join(",");
    var endTime = endTime || getPassYearFormatDate(0);
    jQuery.ajax({
      dataType: "jsonp",
      timeout: "20000",
      async: !1,
      url: "https://openapi.mysteel.com/publishd/index/listDateDataForIndexCodes?indexCodes=" +
        _zhibiao +
        "&startTime=" +
        startTime +
        "&endTime=" +
        endTime,
      success: function (response) {
        if (response.status == "200") {
        if (response && response.response && Array.isArray(response.response)) {
          var datas = response.response;
          var headHtml =
            "<tr>" +
            "<th class='t1 name'>指标名称</th>" +
            "<th class='t2'>指标值</th>" +
            "<th class='t3'>涨跌值</th>" +
            "<th class='t4'>涨跌幅</th>" +
            "<th class='t5'>发布时间</th>" +
            "</tr>";
          $(".j-thead").html(headHtml);
          var bodyHtml = "";
          if (datas[0]&&datas[0].dataList&&datas[0].dataList.length == 0) {
            return $(".j-tbody").html('<p style="text-align: center;line-height: 100px;">暂无数据</p>');
          }

          // 获取数据
          var data1 = datas[0].dataList; // 第一个dataList
          var data2 = datas[1].dataList; // 第二个dataList
          var data3 = datas[2].dataList; // 第三个dataList

          for (var i = 0; i < data1.length; i++) {
            if (data1[i].IndexValue === "") continue;

            var indexDate = data1[i].IndexDate;
            var indexValue = data1[i].IndexValue;
            var className = "";
            var lastClass = "";
            var _data2 = "-";
            var _data3 = "-";

            // 获取涨跌值
            if (data2[i] && data2[i].IndexValue !== "") {
              _data2 = data2[i].IndexValue;
              if (Number(_data2) > 0) {
                className = "up";
              } else if (Number(_data2) < 0) {
                className = "down";
              }
            }

            // 获取涨跌幅
            if (data3[i] && data3[i].IndexValue !== "") {
              _data3 = data3[i].IndexValue + (data3[i].IndexValue.split(".")[1] === undefined ? ".00" : "") + "%";
              if (Number(_data2) > 0) {
                className = "up";
              } else if (Number(_data2) < 0) {
                className = "down";
              }
            }
            if (i == data1.length - 1) {
              lastClass = "last";
            }
            bodyHtml +=
              "<tr class='" +
              lastClass +
              "'>" +
              "<td class='t1 name'>" + curZSName + "</td>" +
              "<td class='t2'>" + indexValue + "</td>" +
              "<td class='t3 " +
              className +
              "'>" + _data2 + "</td>" +
              "<td class='t4 " +
              className +
              "'>" + _data3 + "</td>" +
              "<td class='t5'>" + indexDate + "</td>" +
              "</tr>";
          }
          $(".j-tbody").html(bodyHtml);
        }
      } else {
        $(".j-tbody").html('<p style="text-align: center;line-height: 100px;">暂无数据</p>');
      }
    },
    error: function () {
      $(".j-tbody").html('<p style="text-align: center;line-height: 100px;">暂无数据</p>');
    },
  });
}

  function getCharts(dom, zhibiao, startTime, endTime) {
    var endTime = endTime || getPassYearFormatDate(0);     
    var chart = echarts.init(dom);
    jQuery.ajax({
      dataType: "jsonp",
      timeout: "20000",
      async: !1,
      url: "https://openapi.mysteel.com/publishd/index/listDateDataForIndexCodes?indexCodes=" + 
      zhibiao + "&startTime=" + startTime + "&endTime=" + endTime,
      success: function (response) {
        if (response.status == "200") {
          var dataLength = 0;
        if (response && response.response && Array.isArray(response.response)) {
          var data = response.response;
          var xAxis = [];
          var series = [];
          var longest = [];
          var XAxisList = {}
          // 查找更长的x轴，并获取最新的时间
          data.forEach(function (item) {
            item.dataList.forEach(function (dataItem) {
              if (dataItem.IndexDate && dataItem.IndexValue !== "") {
                XAxisList[dataItem.IndexDate] = dataItem.IndexDate;
              }
            });
            dataLength += item.dataList.length
          });
          longest.xAxis = Object.keys(XAxisList).sort(function (i1, i2) {
            return Date.parse(i1) - Date.parse(i2);
          });
          xAxis = {
            type: "category",
            data: longest.xAxis,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
            }, //X/Y轴O刻度是否重合
            splitLine: {
              show: false,
            }, //是否显示分割线
            axisLabel: {
              margin: 15, //设置文字与X轴的距离
            },
            splitNumber: 20, //分割数量
            min: "dataMin", //坐标轴的最小刻目
            max: "dataMax",
          };
        
          pushXAxisAndSeries(curZSName, curZSCode);
          function pushXAxisAndSeries(name, code) {
            var seriesData = [];
            var dataMap = {};
            var unitMap = {};
            data.forEach(function (item) {
              item.dataList.forEach(function (dataItem) {
                if (dataItem.IndexDate && dataItem.IndexValue !== "") {
                  if (item.indexCode === code) {
                    if (dataItem.IndexValue !== "") {
                      dataMap[dataItem.IndexDate] = dataItem.IndexValue;
                      unitMap[dataItem.IndexDate] = item.unit;
                    }
                  }
                }
              });
            });

            for (var i = 0; i < longest.xAxis.length; i++) {
              if (dataMap[longest.xAxis[i]] !== undefined) {
                  seriesData[i] = {
                      value: dataMap[longest.xAxis[i]],
                      unit: unitMap[longest.xAxis[i]] || null
                  };
              } else {
                  seriesData[i] = {
                      value: null,
                      unit: null
                  };
              }
          }

            series.push({
              name: name,
              type: "line",
              data: seriesData,
              smooth: true,
              symbolSize: 1,
              connectNulls: true,
              lineStyle: {
                normal: {
                  opacity: 1,
                },
              },
            });
          }

          option = {
            color: ["#BC0008"],
            tooltip: {
              trigger: "axis",
              confine: true,
              axisPointer: {
                type: "line",
              },
              formatter: function (params) {  
                  var tooltipContent = params[0].name + '<br>';                             
                  params.forEach(function (item) {  
                      if (item.value !== null) {
                          var unit = item.data && item.data.unit ? item.data.unit : '';  
                          tooltipContent +=  
                              '<span style="color:' + item.color + ';">●</span> ' +  
                              item.seriesName + "：" +                             
                              item.value + unit + '<br>';                         
                      }  
                  });                              
                  return tooltipContent; 
              }
            },
            grid: {
              left: "35px",
              right: "40px",
              bottom: "10px",
              top: "5%",
              containLabel: true,
            },
            xAxis: xAxis,
            yAxis: {
              scale: true,
              splitArea: {
                show: false,
              },
              splitLine: {
                show: true,
              }, //是否显示分割线
            },
            graphic: {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                text: dataLength > 0 ? '' : '暂无数据',
                textAlign: 'center',
                fill: '#333',
                fontSize: 14
              }
            },
            series: series,
          };
          chart.clear()
          chart.setOption(option);

        } 
      } else{
        chart.setOption({
          graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: response.message || '暂无数据',
              textAlign: 'center',
              fill: '#333',
              fontSize: 14
            }
          }
        }, true);
      }        
  },
  error: function () {
    chart.setOption({
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: '暂无数据',
          textAlign: 'center',
          fill: '#333',
          fontSize: 14
        }
      }
    }, true);
  },
});
}

  


  // 左侧栏目点击事件
  $(".j-item").on("click", function () {
    if ($(this).hasClass("cur")) return;
    curZSName = $(this).text();
    curZSCode = zhibiaoCodeList[$(this).index()];
    $(this).siblings().removeClass("cur");
    $(this).addClass("cur");
    $(".j-btn").eq(1).click();
    $("#pinzhong-title").html(curZSName);
    // $(".j-submit").click();
  });
  // 月份点击事件
  $(".j-btn").on("click", function () {
    $(this).siblings().removeClass("cur");
    $(this).addClass("cur");
    var startTime = +$(this).attr("data-val");
    $(".j-start").val(getPassYearFormatDate(startTime));
    $(".j-end").val(getPassYearFormatDate(0));
    getCharts(
      document.getElementById("chart"),
      curZSCode,
      getPassYearFormatDate(startTime),
      ""
    );
    getData(curZSCode, getPassYearFormatDate(startTime), "");
  });
  // 查询时间段点击事件
  $(".j-submit").on("click", function () {
    var startTime = $(".j-start").val();
    var endTime = $(".j-end").val();
    var gap = (new Date(endTime) - new Date(startTime)) / 86400000;
    $(".j-btn").removeClass('cur');
    if (gap == 30 && endTime == getPassYearFormatDate(0)) {
      $(".j-btn").eq(0).addClass("cur");
    } else if (gap == 90 && endTime == getPassYearFormatDate(0)) {
      $(".j-btn").eq(1).addClass("cur");
    } else if (gap == 365 && endTime == getPassYearFormatDate(0)) {
      $(".j-btn").eq(2).addClass("cur");
    }
    if (!startTime) {
      startTime = getPassYearFormatDate(365 * 3);
    }
    getCharts(document.getElementById("chart"), curZSCode, startTime, endTime);
    getData(curZSCode, startTime, endTime);
  });

  // 初始化
  $(".j-btn").eq(1).click();
});