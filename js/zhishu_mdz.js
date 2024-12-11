// JavaScript Document$(function () {

//头部价格指数
// 请求指标数据
function getData(zhibiao, zhibiaoName, JDom) {
    jQuery.ajax({
        dataType: "jsonp",
        timeout: "20000",
        async: !1,
        url: "https://openapi.mysteel.com/publishd/index/latestDataForIndexCodes?indexCodes=" +
            encodeURIComponent(zhibiao) + "&names=" + encodeURIComponent(zhibiaoName),
        success: function (data) {
            if (data.status == "200") {
                var responseData = data.response;
                var arr = zhibiao.split(",");
                // Filter data based on indexCode
                var data1 = responseData.filter(function (item) {
                    return item.indexCode == arr[0];
                })[0];
                var data2 = responseData.filter(function (item) {
                    return item.indexCode == arr[1];
                })[0];
                var data3 = responseData.filter(function (item) {
                    return item.indexCode == arr[2];
                })[0];
                // }
                genZhibiao(
                    JDom,
                    data1.thisWeekValue || "-",
                    data2.thisWeekValue || "-",
                    data3.thisWeekValue ? data3.thisWeekValue : "-",
                    data2.thisWeekDate || "-"
                );
            }

        },
        error: function () {},
    });
}
// 生成指标的dom内容
function genZhibiao(JDom, data1, data2, data3, time) {
    var fuhao = "";
    if (data1 !== "-") {
        data1 = data1 + (data1.split(".")[1] === undefined ? ".00" : "");
    }
    if (data2 !== "-") {
        data2 = data2 + (data2.split(".")[1] === undefined ? ".00" : "");
    }
    if (data3 !== "-") {
        data3 = data3 + (data3.split(".")[1] === undefined ? ".00" : "");
    }
    if (+data2 == 0 || data2 == "-") {
        JDom.removeClass("down").addClass("flat");
    }
    if (+data2 > 0) {
        JDom.removeClass("down").removeClass("flat");
        // fuhao = "+";
    }
    if (+data2 < 0) {
        JDom.removeClass("flat").addClass("down");
    }
    var html =
        '<div class="m">' +
        '<div class="jz-num">' +
        "<span>" +
        data1 +
        "</span>" +
        "</div>" +
        '<div class="jz-bfb">' +
        '<div class="jz-zd">' +
        '<span class="jz-zd-b">涨跌值</span>' +
        "<span class='jz-zd-num'>" +
        fuhao +
        data2 +
        "</span>" +
        "</div>" +
        '<div class="jz-zd">' +
        '<span class="jz-zd-b">涨跌幅</span>' +
        "<span class='jz-zd-num'>" + fuhao + data3 + (data3 !== "-" ? "%" : "") + "</span>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="jz-item-time">' +
        time +
        "</div>";
    JDom.append(html);
    JDom.parent().parent().find(".time-con").text(time);

    // 获取当前时间
    var currentDate = new Date().toLocaleDateString('en-US');
    // 获取.time-con的内容并转换为日期格式
    var timeConContent = new Date(JDom.parent().parent().find(".time-con").text().split(" ")[0]);

    if (timeConContent.toLocaleDateString('en-US') === currentDate) {
        JDom.parent().parent().find(".time-con").text(time).addClass("red");
    } else {
        JDom.parent().parent().find(".time-con").text(time);
    }
}

// 初始化
getData("ID01954382,DE0017188898,DE0017188899", "米袋子：价格指数：山东（周）,米袋子：价格指数涨跌值：山东（周）,米袋子：价格指数涨跌幅：山东（周）", $("#mdzjgzs"));
getData("ID01954385,DE0017188897,DE0017188891", "米袋子：米袋子：基期=2024年第一期：供给价格指数：山东（周）,米袋子：基期=2024年第一期：供给价格指数涨跌值：山东（周）,米袋子：基期=2024年第一期：供给价格指数涨跌幅：山东（周）", $("#mdzgjzs"));
getData("ID01954379,DE0017188896,DE0017188889", "米袋子：基期=2024年第一期：消费价格指数：山东（周）,米袋子：基期=2024年第一期：消费价格指数涨跌值：山东（周）,米袋子：基期=2024年第一期：消费价格指数涨跌幅：山东（周）", $("#mdzxfzs"));



layui.use("laydate", function () {
    var past3year = new Date().getTime() - 60 * 60 * 24 * 365 * 3 * 1000;
    var laydate = layui.laydate;

    // #chart-box1 的时间选择器
    var startDate1 = laydate.render({
        elem: ".startTime1",
        trigger: "click",
        theme: "#F59221",
        min: past3year,
        done: function (value, date) {


            if (value !== "") {
                endDate1.config.min.year = date.year;
                endDate1.config.min.month = date.month - 1;
                endDate1.config.min.date = date.date;
                if (Date.parse(value) > Date.parse($(".endTime1").val())) {
                    $(".endTime1").val("");
                }
            } else {
                endDate1.config.min.year = "";
                endDate1.config.min.month = "";
                endDate1.config.min.date = "";
            }
        },
    });
    var endDate1 = laydate.render({
        elem: ".endTime1",
        trigger: "click",
        theme: "#F59221",
        min: past3year,
        done: function (value, date) {
            if (value !== "") {
                if (Date.parse(value) < Date.parse($(".startTime1").val())) {
                    $(".startTime1").val("");
                }
            } else {
                startDate1.config.min.year = "";
                startDate1.config.min.month = "";
                startDate1.config.min.date = "";
            }
        },
    });

    // #chart-box2 的时间选择器
    var startDate2 = laydate.render({
        elem: ".startTime2", // 修改为对应的选择器
        trigger: "click",
        theme: "#F59221",
        min: past3year,
        done: function (value, date) {
            if (value !== "") {
                endDate2.config.min.year = date.year;
                endDate2.config.min.month = date.month - 1;
                endDate2.config.min.date = date.date;
                if (Date.parse(value) > Date.parse($(".endTime2").val())) {
                    $(".endTime2").val("");
                }
            } else {
                endDate2.config.min.year = "";
                endDate2.config.min.month = "";
                endDate2.config.min.date = "";
            }
        },
    });

    var endDate2 = laydate.render({
        elem: ".endTime2", // 修改为对应的选择器
        trigger: "click",
        theme: "#F59221",
        min: past3year,
        done: function (value, date) {
            if (value !== "") {
                if (Date.parse(value) < Date.parse($(".startTime2").val())) {
                    $(".startTime2").val("");
                }
            } else {
                startDate2.config.min.year = "";
                startDate2.config.min.month = "";
                startDate2.config.min.date = "";
            }
        },
    });

    // #chart-box3 的时间选择器
    var startDate3 = laydate.render({
        elem: ".startTime3", // 修改为对应的选择器
        trigger: "click",
        theme: "#F59221",
        min: past3year,
        done: function (value, date) {
            if (value !== "") {
                endDate3.config.min.year = date.year;
                endDate3.config.min.month = date.month - 1;
                endDate3.config.min.date = date.date;
                if (Date.parse(value) > Date.parse($(".endTime3").val())) {
                    $(".endTime3").val("");
                }
            } else {
                endDate3.config.min.year = "";
                endDate3.config.min.month = "";
                endDate3.config.min.date = "";
            }
        },
    });

    var endDate3 = laydate.render({
        elem: ".endTime3", // 修改为对应的选择器
        trigger: "click",
        theme: "#F59221",
        min: past3year,
        done: function (value, date) {
            if (value !== "") {
                if (Date.parse(value) < Date.parse($(".startTime3").val())) {
                    $(".startTime3").val("");
                }
            } else {
                startDate3.config.min.year = "";
                startDate3.config.min.month = "";
                startDate3.config.min.date = "";
            }
        },
    });





});
// 生成时间
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

var selectedList1 = {
    "山东省米袋子价格指数": true
};

var selectedList2 = {
    "米袋子供给价格指数": true,
    "深加工企业玉米采购价格指数": false,
    "玉米淀粉出库价格指数": false,
    "面粉企业小麦采购价格指数": false,
    "面粉企业面粉出厂价格指数": false
};
var selectedList3 = {
    "米袋子消费价格指数": true,
    "面粉批发价格指数": false,
    "面粉零售价值指数": false,
    "大米批发价格指数": false,
    "大米零售价格指数": false,
    "小米批发价格指数": false,
    "小米零售价格指数": false,
    "绿豆批发价格指数": false,
    "绿豆零售价格指数": false,
    "玉米面批发价格指数": false,
    "玉米面零售价格指数": false
};

//价格指数折线图
function getCharts1(startTime, endTime) {
    var endTime = endTime || getPassYearFormatDate(0);
    var chart1 = echarts.init(document.getElementById("chart1"));
    jQuery.ajax({
        dataType: "jsonp",
        timeout: "20000",
        async: !1,
        url: "https://openapi.mysteel.com/publishd/index/listDateDataForIndexCodes?indexCodes=" + "ID01954382" +
            "&startTime=" +
            startTime +
            "&endTime=" +
            endTime,
        success: function (response) {
            if (response.status == "200") {
                var dataLength = 0;
                if (response && response.response && Array.isArray(response.response)) {
                    var data = response.response;
                    var xAxis = [];
                    var series = [];
                    var longest = [];
                    var XAxisList = {};
                    // 查找更长的x轴，并获取最新的时间
                    data.forEach(function (item) {
                        item.dataList.forEach(function (dataItem) {
                            if (dataItem.IndexDate && dataItem.IndexValue !== "") {
                                XAxisList[dataItem.IndexDate] = dataItem.IndexDate;
                            }

                        });
                        dataLength += item.dataList.length;
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
                            }
                        });
                    }

                    pushXAxisAndSeries("山东省米袋子价格指数", "ID01954382");
                    option = {
                        color: [
                            "#BC0008",
                            "#023985",
                            "#84A2C9",
                            "#BFBFBF",
                            "#FF91A0",
                            "#537FB3"
                        ],
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
                        legend: {
                            data: [{
                                name: "山东省米袋子价格指数",
                                icon: "roundRect",
                            }],
                            itemWidth: 34,
                            itemHeight: 7,
                            align: "right",
                            orient: "vertical",
                            left: "0px",
                            right: "10px",
                            top: "10px",
                            textStyle: {
                                fontSize: 14,
                                color: "#333",
                                lineHeight: 30,
                                padding: [7, 10, 5, 0],
                            },
                            selected: selectedList1,
                        },
                        grid: {
                            left: "220px",
                            right: "38px",
                            bottom: "10px",
                            top: "30px",
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
                            left: '55%',
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
                    chart1.clear();
                    chart1.setOption(option);
                    chart1.on("legendselectchanged", function (params) {
                        selectedList1 = params.selected;
                    });
                }
            } else {
                {
                    chart1.setOption({
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
            }
        },
        error: function () {
            chart1.setOption({
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
//供给价格指数折线图
function getCharts2(startTime, endTime) {
    var endTime = endTime || getPassYearFormatDate(0);
    var chart2 = echarts.init(document.getElementById("chart2"));
    jQuery.ajax({
        dataType: "jsonp",
        timeout: "20000",
        async: !1,
        url: "https://openapi.mysteel.com/publishd/index/listDateDataForIndexCodes?indexCodes=" + "ID01954385,ID01954115,ID01954113,ID01954114,ID01954112" +
            "&startTime=" +
            startTime +
            "&endTime=" +
            endTime,
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

                    pushXAxisAndSeries("米袋子供给价格指数", "ID01954385");
                    pushXAxisAndSeries("深加工企业玉米采购价格指数", "ID01954115");
                    pushXAxisAndSeries("玉米淀粉出库价格指数", "ID01954113");
                    pushXAxisAndSeries("面粉企业小麦采购价格指数", "ID01954114");
                    pushXAxisAndSeries("面粉企业面粉出厂价格指数", "ID01954112");

                    option = {
                        color: [
                            "#BC0008",
                            "#023985",
                            "#84A2C9",
                            "#BFBFBF",
                            "#FF91A0",
                            "#537FB3"
                        ],
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
                        legend: {
                            data: [{
                                    name: "米袋子供给价格指数",
                                    icon: "roundRect",
                                },
                                {
                                    name: "深加工企业玉米采购价格指数",
                                    icon: "roundRect",
                                },
                                {
                                    name: "玉米淀粉出库价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "面粉企业小麦采购价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "面粉企业面粉出厂价格指数",
                                    icon: "roundRect",
                                }
                            ],
                            itemWidth: 34,
                            itemHeight: 7,
                            align: "right",
                            orient: "vertical",
                            left: "0px",
                            right: "10px",
                            top: "10px",
                            textStyle: {
                                fontSize: 14,
                                color: "#333",
                                lineHeight: 30,
                                padding: [7, 10, 5, 0],
                            },
                            selected: selectedList2,
                        },
                        grid: {
                            left: "260px",
                            right: "38px",
                            bottom: "10px",
                            top: "30px",
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
                            left: '60%',
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
                    chart2.clear();
                    chart2.setOption(option);

                    chart2.on("legendselectchanged", function (params) {
                        selectedList2 = params.selected;
                    });
                }
            } else {
                chart2.setOption({
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
            chart2.setOption({
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
//消费价格指数折线图
function getCharts3(startTime, endTime) {
    var endTime = endTime || getPassYearFormatDate(0);
    var chart3 = echarts.init(document.getElementById("chart3"));
    jQuery.ajax({
        dataType: "jsonp",
        timeout: "20000",
        async: !1,
        url: "https://openapi.mysteel.com/publishd/index/listDateDataForIndexCodes?indexCodes=" + "ID01954379,ID01954124,ID01954118,ID01954131,ID01954121,ID01954132,ID01954119,ID01954135,ID01954130,ID01954120,ID01954133" +
            "&startTime=" +
            startTime +
            "&endTime=" +
            endTime,
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
                    pushXAxisAndSeries("米袋子消费价格指数", "ID01954379");
                    pushXAxisAndSeries("面粉批发价格指数", "ID01954124");
                    pushXAxisAndSeries("面粉零售价值指数", "ID01954118");
                    pushXAxisAndSeries("大米批发价格指数", "ID01954131");
                    pushXAxisAndSeries("大米零售价格指数", "ID01954121");
                    pushXAxisAndSeries("小米批发价格指数", "ID01954132");
                    pushXAxisAndSeries("小米零售价格指数", "ID01954119");
                    pushXAxisAndSeries("绿豆批发价格指数", "ID01954135");
                    pushXAxisAndSeries("绿豆零售价格指数", "ID01954130");
                    pushXAxisAndSeries("玉米面批发价格指数", "ID01954120");
                    pushXAxisAndSeries("玉米面零售价格指数", "ID01954133");

                    option = {
                        color: [
                            "#BC0008",
                            "#023985",
                            "#84A2C9",
                            "#BFBFBF",
                            "#FF91A0",
                            "#537FB3",
                            '#57b8b9',
                            '#4b377f',
                            '#a6a955',
                            '#d69733',
                            '#e8ea58'

                        ],
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
                        legend: {
                            data: [{
                                    name: "米袋子消费价格指数",
                                    icon: "roundRect",
                                },
                                {
                                    name: "面粉批发价格指数",
                                    icon: "roundRect",
                                },
                                {
                                    name: "面粉零售价值指数",
                                    icon: "roundRect",
                                }, {
                                    name: "大米批发价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "大米零售价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "小米批发价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "小米零售价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "绿豆批发价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "绿豆零售价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "玉米面批发价格指数",
                                    icon: "roundRect",
                                }, {
                                    name: "玉米面零售价格指数",
                                    icon: "roundRect",
                                }
                            ],
                            itemWidth: 34,
                            itemHeight: 7,
                            align: "right",
                            orient: "vertical",
                            left: "0px",
                            right: "10px",
                            top: "10px",
                            textStyle: {
                                fontSize: 14,
                                color: "#333",
                                lineHeight: 30,
                                padding: [7, 10, 5, 0],
                            },
                            selected: selectedList3,
                        },
                        grid: {
                            left: "220px",
                            right: "38px",
                            bottom: "10px",
                            top: "30px",
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
                            left: '56%',
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
                    chart3.clear();
                    chart3.setOption(option);
                    chart3.on("legendselectchanged", function (params) {
                        selectedList3 = params.selected;
                    });
                }
            } else {
                chart3.setOption({
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
            chart3.setOption({
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

//价格指数点击
$("#chart-box1 .j-btn").on("click", function () {
    $(this).siblings().removeClass("cur");
    $(this).addClass("cur");
    var start1 = getPassYearFormatDate(+$(this).attr("data-val"));
    $("#chart-box1 .j-start").val(start1);
    $("#chart-box1 .j-end").val(getPassYearFormatDate(0));
    getCharts1(start1, "");
});

// 价格指数查询时间段的折线图
$("#chart-box1 .j-submit").on("click", function () {
    var start1 = $("#chart-box1 .j-start").val();
    var end1 = $("#chart-box1 .j-end").val();
    var gap1 = (new Date(end1) - new Date(start1)) / 86400000;
    $("#chart-box1 .j-btn").removeClass("cur");

    if (gap1 == 30 && end1 == getPassYearFormatDate(0)) {
        $("#chart-box1 .j-btn").eq(0).addClass("cur");
    } else if (gap1 == 90 && end1 == getPassYearFormatDate(0)) {
        $("#chart-box1 .j-btn").eq(1).addClass("cur");
    } else if (gap1 == 365 && end1 == getPassYearFormatDate(0)) {
        $("#chart-box1 .j-btn").eq(2).addClass("cur");
    }
    if (!start1) {
        start1 = getPassYearFormatDate(365 * 3);
    }
    getCharts1(start1, end1);
});
$("#chart-box1 .j-btn").eq(1).click();

//供给价格指数点击
$("#chart-box2 .j-btn").on("click", function () {
    $(this).siblings().removeClass("cur");
    $(this).addClass("cur");
    var start2 = getPassYearFormatDate(+$(this).attr("data-val"));
    $("#chart-box2 .j-start").val(start2);
    $("#chart-box2 .j-end").val(getPassYearFormatDate(0));
    getCharts2(start2, ""); // 单个指数
});

// 供给价格指数查询时间段的折线图
$("#chart-box2 .j-submit").on("click", function () {
    var start2 = $("#chart-box2 .j-start").val();
    var end2 = $("#chart-box2 .j-end").val();
    var gap2 = (new Date(end2) - new Date(start2)) / 86400000;
    $("#chart-box2 .j-btn").removeClass("cur");

    if (gap2 == 30 && end2 == getPassYearFormatDate(0)) {
        $("#chart-box2 .j-btn").eq(0).addClass("cur");
    } else if (gap2 == 90 && end2 == getPassYearFormatDate(0)) {
        $("#chart-box2 .j-btn").eq(1).addClass("cur");
    } else if (gap2 == 365 && end2 == getPassYearFormatDate(0)) {
        $("#chart-box2 .j-btn").eq(2).addClass("cur");
    }
    if (!start2) {
        start2 = getPassYearFormatDate(365 * 3);
    }
    getCharts2(start2, end2);
});
$("#chart-box2 .j-btn").eq(1).click();


//消费价格指数点击
$("#chart-box3 .j-btn").on("click", function () {
    $(this).siblings().removeClass("cur");
    $(this).addClass("cur");
    var start3 = getPassYearFormatDate(+$(this).attr("data-val"));
    $("#chart-box3 .j-start").val(start3);
    $("#chart-box3 .j-end").val(getPassYearFormatDate(0));
    getCharts3(start3, ""); // 单个指数
});

// 消费价格指数查询时间段的折线图
$("#chart-box3 .j-submit").on("click", function () {
    var start3 = $("#chart-box3 .j-start").val();
    var end3 = $("#chart-box3 .j-end").val();
    var gap3 = (new Date(end3) - new Date(start3)) / 86400000;
    $("#chart-box3 .j-btn").removeClass("cur");
    if (gap3 == 30 && end3 == getPassYearFormatDate(0)) {
        $("#chart-box3 .j-btn").eq(0).addClass("cur");
    } else if (gap3 == 90 && end3 == getPassYearFormatDate(0)) {
        $("#chart-box3 .j-btn").eq(1).addClass("cur");
    } else if (gap3 == 365 && end3 == getPassYearFormatDate(0)) {
        $("#chart-box3 .j-btn").eq(2).addClass("cur");
    }
    if (!start3) {
        start3 = getPassYearFormatDate(365 * 3);
    }
    getCharts3(start3, end3);
});
$("#chart-box3 .j-btn").eq(1).click();



//快讯
$.newsFlash("#kuaixunwrap", [], "4372")

//行情列表按钮
$.tabBtn($('.btn-box a'), 'btnon', '.news-item'); //分析栏目选项卡
$.tabBtn($('.menu-btn a'), 'btnon', '.sub-item '); //子级栏目tab