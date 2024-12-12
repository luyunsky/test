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



//通过mdz_data数据渲染页面
function renderPage(data) {
    var dom = '';
    for (var i = 1; i <= data.length; i++) {
        var divDom = "<div class='jz-title'>山东省米袋子&nbsp;<span class='black'>" +
            data[i - 1].title +
            "</span>" +
            "<a target='_blank' href='https://index.mysteel.com/topic/sdmdz/detail.html?type=" +
            i +
            "' class='zst-more'></a></div>" +
            "<div class='jz-chart' id='chart-box" +
            i +
            "'>" +
            "<div class='t'>" +
            "<div class='input-line'>" +
            "<div class='input-box'>" +
            "<input class='startTime" +
            i +
            " j-start' type='text'>" +
            "</div>" +
            "<label>至</label>" +
            "<div class='input-box'>" +
            "<input class='endTime" +
            i +
            " j-end' type='text'>" +
            "</div>" +
            "<button class='j-submit'>查 询</button>" +
            "<ul class='month-list'>" +
            "<li class='j-btn' data-val='30'><button>1月</button></li>" +
            "<li class='j-btn' data-val='90'><button>3月</button></li>" +
            "<li class='j-btn' data-val='365'><button>1年</button></li>" +
            "</ul>" +
            "</div>" +
            "<div class='public-line'></div>" +
            "</div>" +
            "<div class='chart-item'>" +
            "<div class='jz-chart-box' id='chart" +
            i +
            "'></div>" +
            "</div>" +
            "</div>"
        dom += divDom;

    }
    $('.jz-main .jz-list').after(dom);
}
renderPage(indexData);



// 初始化日期选择器
function initDateSelectors() {
    for (var i = 0; i < indexData.length; i++) {
        var elem = "#chart-box" + (i + 1); // 确保 elem 包含正确的索引
        initLayDate(elem, i + 1); // 根据indexData的长度调用initLayDate
    }
}
//日期选择
function initLayDate(elem, index) {
    layui.use("laydate", function () {
        var past3year = new Date().getTime() - 60 * 60 * 24 * 365 * 3 * 1000;
        var laydate = layui.laydate;

        // #chart-box 的时间选择器
        var startDateInstance = laydate.render({
            elem: elem + " .startTime" + index,
            trigger: "click",
            theme: "#F59221",
            min: past3year,
            done: function (value, date) {
                if (value !== "") {
                    startDateInstance.config.min.year = date.year;
                    startDateInstance.config.min.month = date.month - 1;
                    startDateInstance.config.min.date = date.date;
                    if (Date.parse(value) > Date.parse($(elem + ".endTime" + index).val())) {
                        $(elem + ".endTime" + index).val("");
                    }
                } else {
                    startDateInstance.config.min.year = "";
                    startDateInstance.config.min.month = "";
                    startDateInstance.config.min.date = "";
                }
            }
        });
        var endDateInstance = laydate.render({
            elem: elem + " .endTime" + index,
            trigger: "click",
            theme: "#F59221",
            min: past3year,
            done: function (value, date) {
                if (value !== "") {
                    if (Date.parse(value) < Date.parse($(elem + ".startTime" + index).val())) {
                        $(elem + ".startTime" + index).val("");
                    }
                } else {
                    endDateInstance.config.min.year = "";
                    endDateInstance.config.min.month = "";
                    endDateInstance.config.min.date = "";
                }
            },
        });
    });
}
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

// 通用的pushXAxisAndSeries方法
function pushXAxisAndSeries(indexDataGroup, series, longest, data) {
    indexDataGroup.forEach(function (item) {
        var seriesData = [];
        var dataMap = {};
        var unitMap = {};
        data.forEach(function (indexData) {
            if (indexData.indexCode === item.indexCode) {
                indexData.dataList.forEach(function (dataItem) {
                    if (dataItem.IndexDate && dataItem.IndexValue !== "") {
                        dataMap[dataItem.IndexDate] = dataItem.IndexValue;
                        unitMap[dataItem.IndexDate] = indexData.unit;
                    }
                });
            }
        });

        // 根据 longest.xAxis 生成 seriesData
        for (var i = 0; i < longest.xAxis.length; i++) {
            var date = longest.xAxis[i];
            seriesData[i] = {
                value: dataMap[date] !== undefined ? dataMap[date] : null,
                unit: unitMap[date] || null
            };
        }
        series.push({
            name: item.title,
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
    });
}


//价格指数折线图
function getCharts(boxIndex, startTime, endTime) {
    var endTime = endTime || getPassYearFormatDate(0);
    var chart = echarts.init(document.getElementById("chart" + boxIndex));
    var indexDataGroup = indexData[boxIndex - 1].data; // 根据boxIndex从indexData中获取对应的数据组
    var selectedList = boxIndex === 1 ? selectedList1 :
        boxIndex === 2 ? selectedList2 : selectedList3;
    jQuery.ajax({
        dataType: "jsonp",
        timeout: "20000",
        async: !1,
        url: "https://openapi.mysteel.com/publishd/index/listDateDataForIndexCodes?indexCodes=" + indexDataGroup.map(item => item.indexCode).join(",") +
            "&startTime=" + startTime + "&endTime=" + endTime,
        success: function (response) {
            if (response.status == "200") {
                var dataLength = 0;
                if (response && response.response && Array.isArray(response.response)) {
                    var data = response.response;
                    var xAxis = [];
                    var series = [];
                    var longest = {
                        xAxis: []
                    };
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
                    pushXAxisAndSeries(indexDataGroup, series, longest, data); // 调用通用的pushXAxisAndSeries方法

                    // 配置图表
                    var option = {
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
                            data: indexDataGroup.map(function (item) {
                                return {
                                    name: item.title,
                                    icon: "roundRect"
                                };
                            }),
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
                            selected: selectedList,
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
                    chart.clear();
                    chart.setOption(option);
                    chart.on("legendselectchanged", function (params) {
                        selectedList = params.selected;
                    });
                }
            } else {
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

// 价格指数的点击事件
function handleChartBoxClick(boxIndex) {
    $("#chart-box" + boxIndex + " .j-btn").on("click", function () {
        $(this).siblings().removeClass("cur");
        $(this).addClass("cur");
        var start = getPassYearFormatDate(+$(this).attr("data-val"));
        $("#chart-box" + boxIndex + " .j-start").val(start);
        $("#chart-box" + boxIndex + " .j-end").val(getPassYearFormatDate(0));
        getCharts(boxIndex, start, "");
    });

    // 价格指数查询时间段的折线图
    $("#chart-box" + boxIndex + " .j-submit").on("click", function () {
        var start = $("#chart-box" + boxIndex + " .j-start").val();
        var end = $("#chart-box" + boxIndex + " .j-end").val();
        var gap = (new Date(end) - new Date(start)) / 86400000;
        $("#chart-box" + boxIndex + " .j-btn").removeClass("cur");

        if (gap == 30 && end == getPassYearFormatDate(0)) {
            $("#chart-box" + boxIndex + " .j-btn").eq(0).addClass("cur");
        } else if (gap == 90 && end == getPassYearFormatDate(0)) {
            $("#chart-box" + boxIndex + " .j-btn").eq(1).addClass("cur");
        } else if (gap == 365 && end == getPassYearFormatDate(0)) {
            $("#chart-box" + boxIndex + " .j-btn").eq(2).addClass("cur");
        }
        if (!start) {
            start = getPassYearFormatDate(365 * 3);
        }
        getCharts(boxIndex, start, end);
    });

    // 默认点击第二个按钮
    $("#chart-box" + boxIndex + " .j-btn").eq(1).click();
}


// 价格指数的点击事件
function handleChartBoxClicks() {
    for (var i = 0; i < indexData.length; i++) {
        handleChartBoxClick(i + 1); // 根据indexData的长度调用handleChartBoxClick
    }
}

// 在页面加载完成后，初始化日期选择器和点击事件
$(document).ready(function () {
    initDateSelectors();
    handleChartBoxClicks();
});



//快讯
$.newsFlash("#kuaixunwrap", [], "4372")

//行情列表按钮
$.tabBtn($('.btn-box a'), 'btnon', '.news-item'); //分析栏目选项卡
$.tabBtn($('.menu-btn a'), 'btnon', '.sub-item '); //子级栏目tab