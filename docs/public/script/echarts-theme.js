'use strict';
import React from 'react';
var $ = require('jquery');

var infoColorPalette = [
    '#C1232B', '#27727B', '#FCCE10', '#E87C25', '#B5C334',
    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
];

var infoTheme = {
    color: infoColorPalette,

    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#27727B'
        }
    },

    visualMap: {
        color: ['#C1232B', '#FCCE10']
    },

    toolbox: {
        iconStyle: {
            normal: {
                borderColor: infoColorPalette[0]
            }
        }
    },

    tooltip: {
        backgroundColor: 'rgba(50,50,50,0.5)',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#27727B',
                type: 'dashed'
            },
            crossStyle: {
                color: '#27727B'
            },
            shadowStyle: {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: 'rgba(181,195,52,0.3)',
        fillerColor: 'rgba(181,195,52,0.2)',
        handleColor: '#27727B'
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#27727B'
            }
        },
        splitLine: {
            show: false
        }
    },

    valueAxis: {
        axisLine: {
            show: false
        },
        splitArea: {
            show: false
        },
        splitLine: {
            lineStyle: {
                color: ['#ccc'],
                type: 'dashed'
            }
        }
    },

    timeline: {
        lineStyle: {
            color: '#27727B'
        },
        controlStyle: {
            normal: {
                color: '#27727B',
                borderColor: '#27727B'
            }
        },
        symbol: 'emptyCircle',
        symbolSize: 3
    },

    line: {
        itemStyle: {
            normal: {
                borderWidth: 2,
                borderColor: '#fff',
                lineStyle: {
                    width: 3
                }
            },
            emphasis: {
                borderWidth: 0
            }
        },
        symbol: 'circle',
        symbolSize: 3.5
    },

    candlestick: {
        itemStyle: {
            normal: {
                color: '#C1232B',
                color0: '#B5C334',
                lineStyle: {
                    width: 1,
                    color: '#C1232B',
                    color0: '#B5C334'
                }
            }
        }
    },

    graph: {
        color: infoColorPalette
    },

    map: {
        label: {
            normal: {
                textStyle: {
                    color: '#C1232B'
                }
            },
            emphasis: {
                textStyle: {
                    color: 'rgb(100,0,0)'
                }
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#ddd',
                borderColor: '#eee'
            },
            emphasis: {
                areaColor: '#fe994e'
            }
        }
    },

    gauge: {
        axisLine: {
            lineStyle: {
                color: [[0.2, '#B5C334'], [0.8, '#27727B'], [1, '#C1232B']]
            }
        },
        axisTick: {
            splitNumber: 2,
            length: 5,
            lineStyle: {
                color: '#fff'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            length: '5%',
            lineStyle: {
                color: '#fff'
            }
        },
        title: {
            offsetCenter: [0, -20]
        }
    }
};


var shineColorPalette = [
    '#c12e34', '#e6b600', '#0098d9', '#2b821d',
    '#005eaa', '#339ca8', '#cda819', '#32a487'
];

var shineTheme = {

    color: shineColorPalette,

    title: {
        textStyle: {
            fontWeight: 'normal'
        }
    },

    visualMap: {
        color: ['#1790cf', '#a2d4e6']
    },

    toolbox: {
        iconStyle: {
            normal: {
                borderColor: '#06467c'
            }
        }
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.6)'
    },

    dataZoom: {
        dataBackgroundColor: '#dedede',
        fillerColor: 'rgba(154,217,247,0.2)',
        handleColor: '#005eaa'
    },

    timeline: {
        lineStyle: {
            color: '#005eaa'
        },
        controlStyle: {
            normal: {
                color: '#005eaa',
                borderColor: '#005eaa'
            }
        }
    },

    candlestick: {
        itemStyle: {
            normal: {
                color: '#c12e34',
                color0: '#2b821d',
                lineStyle: {
                    width: 1,
                    color: '#c12e34',
                    color0: '#2b821d'
                }
            }
        }
    },

    graph: {
        color: shineColorPalette
    },

    map: {
        label: {
            normal: {
                textStyle: {
                    color: '#c12e34'
                }
            },
            emphasis: {
                textStyle: {
                    color: '#c12e34'
                }
            }
        },
        itemStyle: {
            normal: {
                borderColor: '#eee',
                areaColor: '#ddd'
            },
            emphasis: {
                areaColor: '#e6b600'
            }
        }
    },

    gauge: {
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#2b821d'], [0.8, '#005eaa'], [1, '#c12e34']],
                width: 5
            }
        },
        axisTick: {
            splitNumber: 10,
            length: 8,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            width: 3,
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    }
};

var romaColorPalette = ['#E01F54', '#001852', '#f5e8c8', '#b8d2c7', '#c6b38e',
    '#a4d8c2', '#f3d999', '#d3758f', '#dcc392', '#2e4783',
    '#82b6e9', '#ff6347', '#a092f1', '#0a915d', '#eaf889',
    '#6699FF', '#ff6666', '#3cb371', '#d5b158', '#38b6b6'
];

var romaTheme = {
    color: romaColorPalette,

    visualMap: {
        color: ['#e01f54', '#e7dbc3'],
        textStyle: {
            color: '#333'
        }
    },

    candlestick: {
        itemStyle: {
            normal: {
                color: '#e01f54',
                color0: '#001852',
                lineStyle: {
                    width: 1,
                    color: '#f5e8c8',
                    color0: '#b8d2c7'
                }
            }
        }
    },

    graph: {
        color: romaColorPalette
    },

    gauge: {
        axisLine: {
            lineStyle: {
                color: [[0.2, '#E01F54'], [0.8, '#b8d2c7'], [1, '#001852']],
                width: 8
            }
        }
    }
};

var grayTheme = {
    // 默认色板
    color: [
        '#757575', '#c7c7c7', '#dadada',
        '#8b8b8b', '#b5b5b5', '#e9e9e9'
    ],

    // 图表标题
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#757575'
        }
    },

    // 值域
    dataRange: {
        color: ['#636363', '#dcdcdc']
    },

    // 工具箱
    toolbox: {
        color: ['#757575', '#757575', '#757575', '#757575']
    },

    // 提示框
    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {          // 直线指示器样式设置
                color: '#757575',
                type: 'dashed'
            },
            crossStyle: {
                color: '#757575'
            },
            shadowStyle: {                     // 阴影指示器样式设置
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    // 区域缩放控制器
    dataZoom: {
        dataBackgroundColor: '#eee',            // 数据背景颜色
        fillerColor: 'rgba(117,117,117,0.2)',   // 填充颜色
        handleColor: '#757575'     // 手柄颜色
    },

    // 网格
    grid: {
        borderWidth: 0
    },

    // 类目轴
    categoryAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#757575'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    // 数值型坐标轴默认参数
    valueAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#757575'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    timeline: {
        lineStyle: {
            color: '#757575'
        },
        controlStyle: {
            normal: { color: '#757575' },
            emphasis: { color: '#757575' }
        }
    },

    // K线图默认参数
    k: {
        itemStyle: {
            normal: {
                color: '#8b8b8b',          // 阳线填充颜色
                color0: '#dadada',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#757575',   // 阳线边框颜色
                    color0: '#c7c7c7'   // 阴线边框颜色
                }
            }
        }
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },

    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    color: '#757575'
                }
            }
        }
    },

    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge: {
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#b5b5b5'], [0.8, '#757575'], [1, '#5c5c5c']],
                width: 8
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length: 18,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#333'
            }
        },
        detail: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        }
    },

    textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
    }
};

var macaronsTheme = {
    // 默认色板
    color: [
        '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
        '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ],

    // 图表标题
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#008acd'          // 主标题文字颜色
        }
    },

    // 值域
    dataRange: {
        itemWidth: 15,
        color: ['#5ab1ef', '#e0ffff']
    },

    // 工具箱
    toolbox: {
        color: ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
        effectiveColor: '#ff4500'
    },

    // 提示框
    tooltip: {
        backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {          // 直线指示器样式设置
                color: '#008acd'
            },
            crossStyle: {
                color: '#008acd'
            },
            shadowStyle: {                     // 阴影指示器样式设置
                color: 'rgba(200,200,200,0.2)'
            }
        }
    },

    // 区域缩放控制器
    dataZoom: {
        dataBackgroundColor: '#efefff',            // 数据背景颜色
        fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
        handleColor: '#008acd'    // 手柄颜色
    },

    // 网格
    grid: {
        borderColor: '#eee'
    },

    // 类目轴
    categoryAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#008acd'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    // 数值型坐标轴默认参数
    valueAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#008acd'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    polar: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#ddd'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.2)']
            }
        },
        splitLine: {
            lineStyle: {
                color: '#ddd'
            }
        }
    },

    timeline: {
        lineStyle: {
            color: '#008acd'
        },
        controlStyle: {
            normal: { color: '#008acd' },
            emphasis: { color: '#008acd' }
        },
        symbol: 'emptyCircle',
        symbolSize: 3
    },

    // 柱形图默认参数
    bar: {
        itemStyle: {
            normal: {
                barBorderRadius: 5
            },
            emphasis: {
                barBorderRadius: 5
            }
        }
    },

    // 折线图默认参数
    line: {
        smooth: true,
        symbol: 'emptyCircle',  // 拐点图形类型
        symbolSize: 3           // 拐点图形大小
    },

    // K线图默认参数
    k: {
        itemStyle: {
            normal: {
                color: '#d87a80',       // 阳线填充颜色
                color0: '#2ec7c9',      // 阴线填充颜色
                lineStyle: {
                    color: '#d87a80',   // 阳线边框颜色
                    color0: '#2ec7c9'   // 阴线边框颜色
                }
            }
        }
    },

    // 散点图默认参数
    scatter: {
        symbol: 'circle',    // 图形类型
        symbolSize: 4        // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
    },

    // 雷达图默认参数
    radar: {
        symbol: 'emptyCircle',    // 图形类型
        symbolSize: 3
        //symbol: null,         // 拐点图形类型
        //symbolRotate : null,  // 图形旋转控制
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#d87a80'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#fe994e'
                }
            }
        }
    },

    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    color: '#1e90ff'
                }
            }
        }
    },

    chord: {
        itemStyle: {
            normal: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#2ec7c9'], [0.8, '#5ab1ef'], [1, '#d87a80']],
                width: 10
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length: 15,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length: 22,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer: {
            width: 5
        }
    },

    textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
    }
};

var blueTheme = {
    // 默认色板
    color: [
        '#1790cf', '#1bb2d8', '#99d2dd', '#88b0bb',
        '#1c7099', '#038cc4', '#75abd0', '#afd6dd'
    ],

    // 图表标题
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#1790cf'
        }
    },

    // 值域
    dataRange: {
        color: ['#1178ad', '#72bbd0']
    },

    // 工具箱
    toolbox: {
        color: ['#1790cf', '#1790cf', '#1790cf', '#1790cf']
    },

    // 提示框
    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {          // 直线指示器样式设置
                color: '#1790cf',
                type: 'dashed'
            },
            crossStyle: {
                color: '#1790cf'
            },
            shadowStyle: {                     // 阴影指示器样式设置
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    // 区域缩放控制器
    dataZoom: {
        dataBackgroundColor: '#eee',            // 数据背景颜色
        fillerColor: 'rgba(144,197,237,0.2)',   // 填充颜色
        handleColor: '#1790cf'     // 手柄颜色
    },

    // 网格
    grid: {
        borderWidth: 0
    },

    // 类目轴
    categoryAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#1790cf'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    // 数值型坐标轴默认参数
    valueAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#1790cf'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    timeline: {
        lineStyle: {
            color: '#1790cf'
        },
        controlStyle: {
            normal: { color: '#1790cf' },
            emphasis: { color: '#1790cf' }
        }
    },

    // K线图默认参数
    k: {
        itemStyle: {
            normal: {
                color: '#1bb2d8',          // 阳线填充颜色
                color0: '#99d2dd',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#1c7099',   // 阳线边框颜色
                    color0: '#88b0bb'   // 阴线边框颜色
                }
            }
        }
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },

    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    color: '#1790cf'
                }
            }
        }
    },

    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge: {
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#1bb2d8'], [0.8, '#1790cf'], [1, '#1c7099']],
                width: 8
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length: 18,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#333'
            }
        },
        detail: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        }
    },

    textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
    }
};

var greenTheme = {
    // 默认色板
    color: [
        '#408829', '#68a54a', '#a9cba2', '#86b379',
        '#397b29', '#8abb6f', '#759c6a', '#bfd3b7'
    ],

    // 图表标题
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#408829'
        }
    },

    // 值域
    dataRange: {
        color: ['#1f610a', '#97b58d']
    },

    // 工具箱
    toolbox: {
        color: ['#408829', '#408829', '#408829', '#408829']
    },

    // 提示框
    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {          // 直线指示器样式设置
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle: {                     // 阴影指示器样式设置
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    // 区域缩放控制器
    dataZoom: {
        dataBackgroundColor: '#eee',            // 数据背景颜色
        fillerColor: 'rgba(64,136,41,0.2)',   // 填充颜色
        handleColor: '#408829'     // 手柄颜色
    },

    // 网格
    grid: {
        borderWidth: 0
    },

    // 类目轴
    categoryAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#408829'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    // 数值型坐标轴默认参数
    valueAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#408829'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    timeline: {
        lineStyle: {
            color: '#408829'
        },
        controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
        }
    },

    // K线图默认参数
    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',          // 阳线填充颜色
                color0: '#a9cba2',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#408829',   // 阳线边框颜色
                    color0: '#86b379'   // 阴线边框颜色
                }
            }
        }
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },

    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    color: '#408829'
                }
            }
        }
    },

    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge: {
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                width: 8
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length: 18,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#333'
            }
        },
        detail: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        }
    },

    textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
    }
};

var redTheme = {
    // 默认色板
    color: [
        '#d8361b', '#f16b4c', '#f7b4a9', '#d26666',
        '#99311c', '#c42703', '#d07e75'
    ],

    // 图表标题
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#d8361b'
        }
    },

    // 值域
    dataRange: {
        color: ['#bd0707', '#ffd2d2']
    },

    // 工具箱
    toolbox: {
        color: ['#d8361b', '#d8361b', '#d8361b', '#d8361b']
    },

    // 提示框
    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {          // 直线指示器样式设置
                color: '#d8361b',
                type: 'dashed'
            },
            crossStyle: {
                color: '#d8361b'
            },
            shadowStyle: {                     // 阴影指示器样式设置
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    // 区域缩放控制器
    dataZoom: {
        dataBackgroundColor: '#eee',            // 数据背景颜色
        fillerColor: 'rgba(216,54,27,0.2)',   // 填充颜色
        handleColor: '#d8361b'     // 手柄颜色
    },

    // 网格
    grid: {
        borderWidth: 0
    },

    // 类目轴
    categoryAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#d8361b'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    // 数值型坐标轴默认参数
    valueAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#d8361b'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    timeline: {
        lineStyle: {
            color: '#d8361b'
        },
        controlStyle: {
            normal: { color: '#d8361b' },
            emphasis: { color: '#d8361b' }
        }
    },

    // K线图默认参数
    k: {
        itemStyle: {
            normal: {
                color: '#f16b4c',          // 阳线填充颜色
                color0: '#f7b4a9',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#d8361b',   // 阳线边框颜色
                    color0: '#d26666'   // 阴线边框颜色
                }
            }
        }
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },

    force: {
        itemStyle: {
            normal: {
                linkStyle: {
                    color: '#d8361b'
                }
            }
        }
    },

    chord: {
        padding: 4,
        itemStyle: {
            normal: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis: {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle: {
                    lineStyle: {
                        color: 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge: {
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#f16b4c'], [0.8, '#d8361b'], [1, '#99311c']],
                width: 8
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length: 18,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#333'
            }
        },
        detail: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        }
    },

    textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
    }
};

var mintTheme = {
    // 全图默认背景
    // backgroundColor: 'rgba(0,0,0,0)',

    // 默认色板
    color: ['#8aedd5', '#93bc9e', '#cef1db', '#7fe579', '#a6d7c2',
        '#bef0bb', '#99e2vb', '#94f8a8', '#7de5b8', '#4dfb70'],



    // 值域
    dataRange: {
        color: ['#93bc92', '#bef0bb']
    },

    // K线图默认参数
    k: {
        // barWidth : null          // 默认自适应
        // barMaxWidth : null       // 默认自适应 
        itemStyle: {
            normal: {
                color: '#8aedd5',          // 阳线填充颜色
                color0: '#7fe579',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#8aedd5',   // 阳线边框颜色
                    color0: '#7fe579'   // 阴线边框颜色
                }
            },
            emphasis: {
                // color: 各异,
                // color0: 各异
            }
        }
    },

    // 饼图默认参数
    pie: {
        itemStyle: {
            normal: {
                // color: 各异,
                borderColor: '#fff',
                borderWidth: 1,
                label: {
                    show: true,
                    position: 'outer',
                    textStyle: { color: '#1b1b1b' },
                    lineStyle: { color: '#1b1b1b' }
                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                },
                labelLine: {
                    show: true,
                    length: 20,
                    lineStyle: {
                        // color: 各异,
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        }
    },

    map: {
        mapType: 'china',   // 各省的mapType暂时都用中文
        mapLocation: {
            x: 'center',
            y: 'center'
            // width    // 自适应
            // height   // 自适应
        },
        showLegendSymbol: true,       // 显示图例颜色标识（系列标识的小圆点），存在legend时生效
        itemStyle: {
            normal: {
                // color: 各异,
                borderColor: '#fff',
                borderWidth: 1,
                areaStyle: {
                    color: '#ccc'//rgba(135,206,250,0.8)
                },
                label: {
                    show: false,
                    textStyle: {
                        color: 'rgba(139,69,19,1)'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                // color: 各异,
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                areaStyle: {
                    color: '#f3f39d'
                },
                label: {
                    show: false,
                    textStyle: {
                        color: 'rgba(139,69,19,1)'
                    }
                }
            }
        }
    },

    force: {
        itemStyle: {
            normal: {
                // color: 各异,
                label: {
                    show: false
                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                },
                nodeStyle: {
                    brushType: 'both',
                    strokeColor: '#49b485'
                },
                linkStyle: {
                    strokeColor: '#49b485'
                }
            },
            emphasis: {
                // color: 各异,
                label: {
                    show: false
                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                },
                nodeStyle: {},
                linkStyle: {}
            }
        }
    },

    gauge: {
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#93bc9e'], [0.8, '#8aedd5'], [1, '#a6d7c2']],
                width: 8
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length: 18,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#333'
            }
        },
        detail: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        }
    }
};


var sakuraTheme = {
    // 全图默认背景
    // backgroundColor: 'rgba(0,0,0,0)',

    // 默认色板
    color: ['#e52c3c', '#f7b1ab', '#fa506c', '#f59288', '#f8c4d8',
        '#e54f5c', '#f06d5c', '#e54f80', '#f29c9f', '#eeb5b7'],

    // 值域
    dataRange: {
        color: ['#e52c3c', '#f7b1ab']//颜色 
    },


    // K线图默认参数
    k: {
        // barWidth : null          // 默认自适应
        // barMaxWidth : null       // 默认自适应 
        itemStyle: {
            normal: {
                color: '#e52c3c',          // 阳线填充颜色
                color0: '#f59288',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#e52c3c',   // 阳线边框颜色
                    color0: '#f59288'   // 阴线边框颜色
                }
            },
            emphasis: {
                // color: 各异,
                // color0: 各异
            }
        }
    },

    // 饼图默认参数
    pie: {
        itemStyle: {
            normal: {
                // color: 各异,
                borderColor: '#fff',
                borderWidth: 1,
                label: {
                    show: true,
                    position: 'outer',
                    textStyle: { color: 'black' }
                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                },
                labelLine: {
                    show: true,
                    length: 20,
                    lineStyle: {
                        // color: 各异,
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        }
    },

    map: {
        mapType: 'china',   // 各省的mapType暂时都用中文
        mapLocation: {
            x: 'center',
            y: 'center'
            // width    // 自适应
            // height   // 自适应
        },
        showLegendSymbol: true,       // 显示图例颜色标识（系列标识的小圆点），存在legend时生效
        itemStyle: {
            normal: {
                // color: 各异,
                borderColor: '#fff',
                borderWidth: 1,
                areaStyle: {
                    color: '#ccc'//rgba(135,206,250,0.8)
                },
                label: {
                    show: false,
                    textStyle: {
                        color: 'rgba(139,69,19,1)'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                // color: 各异,
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                areaStyle: {
                    color: '#f3f39d'
                },
                label: {
                    show: false,
                    textStyle: {
                        color: 'rgba(139,69,19,1)'
                    }
                }
            }
        }
    },

    force: {
        // 分类里如果有样式会覆盖节点默认样式
        itemStyle: {
            normal: {
                // color: 各异,
                label: {
                    show: false
                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                },
                nodeStyle: {
                    brushType: 'both',
                    strokeColor: '#e54f5c'
                },
                linkStyle: {
                    strokeColor: '#e54f5c'
                }
            },
            emphasis: {
                // color: 各异,
                label: {
                    show: false
                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                },
                nodeStyle: {},
                linkStyle: {}
            }
        }
    },

    gauge: {
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#e52c3c'], [0.8, '#f7b1ab'], [1, '#fa506c']],
                width: 8
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length: 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length: 18,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            color: 'auto'
        },
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#333'
            }
        },
        detail: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        }
    }
};

var vintageColorPalette = ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'];


module.exports = {
    registerThme: function (echarts) {
        echarts.registerTheme('infographic', infoTheme);
        echarts.registerTheme('shine', shineTheme);
        echarts.registerTheme('roma', romaTheme);
        echarts.registerTheme('gray', grayTheme);
        echarts.registerTheme('macarons', macaronsTheme);
        echarts.registerTheme('blue', blueTheme);
        echarts.registerTheme('green', greenTheme);
        echarts.registerTheme('red', redTheme);
        echarts.registerTheme('mint', mintTheme);
        echarts.registerTheme('sakura', sakuraTheme);

        echarts.registerTheme('vintage', {
            color: vintageColorPalette,
            backgroundColor: '#fef8ef',
            graph: {
                color: vintageColorPalette
            }
        });
    },
    
};

