'use strict';

/**
 *   Create by Malson on 2018/2/24
 */
import $ from 'jquery';
import React from 'react';
import * as d3 from 'd3';
import { Icon } from 'antd';
import polylineCommon from './polylineCommon';

let screen = {};
let standardWidth = 20;

//转换点位置类型
function switchType(type) {
    let returnType = '';
    switch (type) {
        case "1":
            returnType = "up";
            break;
        case "2":
            returnType = "right";
            break;
        case "3":
            returnType = "down";
            break;
        case "4":
            returnType = "left";
            break;
        default:
            break
    }
    return returnType;
}

const CanvasCommon = {
    /**
     *  获取最新的画图区域
    */
    getLastSvg() {
        if (!screen.H || !screen.W) {
            screen.H = d3.select('#svg').attr('height');
            screen.W = d3.select('#svg').attr('width');
        }
        return screen;
    },
    resetSvg() {
        screen = {};
    },
    /**
     *  生成 uuid 区分各个对象
     */
    getUuid() {
        let s = [];
        let hexDigits = '0123456789abcdef';
        for (let i = 0; i < 20; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = '_';

        let uuid = 'id_' + s.join('');
        return uuid;
    },
    /**
     *  根据id 得到该 dom的  返回格式为中心点坐标  111,222
    */
    getMiddleP(id) {
        let v = this.getVal(id);
        let x = v.l + v.w / 2,
            y = v.t + v.h / 2;
        return { x, y };
    },
    /**
     *  获取主dom的宽高  上偏移  左偏移
     *  返回 {w:'',h:'',t:'',l:''}
    */
    getVal(id) {
        if (!id) return false;
        let $t = $('#' + id);
        let w = $t[0].offsetWidth, h = $t[0].offsetHeight,
            l = $t[0].offsetLeft, t = $t[0].offsetTop;
        return {
            w, h, l, t
        }
    },
    getCorrectPoint(v, type) {
        if (v.l === undefined || v.t === undefined || v.w === undefined || v.h === undefined) { console.warn('获取线精确点传参错误'); return ''; }
        let k = 3.5;//圆中心点与边框之间的距离
        let x, y;
        if (type == 1) {//上
            x = v.l + v.w / 2 + 2;
            y = v.t - k;
        } else if (type == 2) {//右
            x = v.w + v.l + k;
            y = v.t + v.h / 2 + 2;
        } else if (type == 3) {//下
            x = v.l + v.w / 2 + 2;
            y = v.t + v.h + k;
        } else if (type == 4) {//左
            x = v.l - k;
            y = v.t + v.h / 2 + 2;
        }
        return x + ',' + y
    },
    /**
     *  根据需求获得主dom的 上1 右2 下3 左4 点
     *  默认为下 3
     *
    */
    getPoint(id, type = 3) {
        if (!id) { console.warn('参数错误'); return false; }
        return this.getCorrectPoint(this.getVal(id), type);
    },
    inRectWrap(id, point) {
        let v = this.getVal(id);
        if (point.x > v.l && point.x < v.l + v.w && point.y > v.t && point.y < v.t + v.h) {
            return true;
        } else {
            return false;
        }
    },
    getPolyLine(sp, ep) {
        let sourceRect = this.initRectObj(sp);
        let targetRect = this.initRectObj(ep);
        let connectionDir = this.getConnectionDirection(sourceRect, targetRect);
        let points = this.calcBendPoints(sourceRect, targetRect, connectionDir);
        return this.changePintsArrayToPoint(points);
    },
    changePintsArrayToPoint(points) {
        let ps = [];
        for (let j = 0, len = points.length; j < len; j++) {
            let point = points[j].x + ',' + points[j].y;
            ps.push(point);
        }
        if (ps.length > 0) {
            return ps.join(' ');
        } else {
            console.error('获取连线上的点出错！');
            return '';
        }
    },
    initRectObj(id) {
        let Rect = {
            id: id,
            getCoordinate: (type) => {
                let point = CanvasCommon.getCoordinateWrap(Rect.id, type);
                return CanvasCommon.changePtoObj(point);
            },
            inRect: (point) => {
                return CanvasCommon.inRectWrap(Rect.id, point);
            },
            getHeight: () => {
                let v = CanvasCommon.getVal(Rect.id);
                if (v.h == undefined) {
                    console.error('获取图形高度出错！ id=', Rect.id);
                    return 0;
                }
                return v.h;
            },
            getWidth: () => {
                let v = CanvasCommon.getVal(Rect.id);
                if (v.w == undefined) {
                    console.error('获取图形宽度出错！id=', Rect.id);
                    return 0;
                }
                return v.w;
            }
        };
        return Rect;
    },
    getCoordinateWrap(id, type) {
        if (!id) { console.warn('获取图形组件参数错误'); return false; }
        let t = 0;
        if (type == 'EM') {
            t = 2;
        } else if (type == 'WM') {
            t = 4;
        } else if (type == 'NC') {
            t = 1;
        } else if (type == 'SC') {
            t = 3;
        }
        return this.getPoint(id, t);
    },
    // 计算两个图形之间的连接方向
    getConnectionDirection(sourceRect, targetRect) {
        // 先计算是否两个图形之间有足够的距离绘制连接线  
        let sourcePoint = sourceRect.getCoordinate("EM");
        let targetPoint = targetRect.getCoordinate("WM");
        if ((targetPoint.x - sourcePoint.x) > standardWidth) {
            return ["E", "W"];
        }

        sourcePoint = sourceRect.getCoordinate("WM");
        targetPoint = targetRect.getCoordinate("EM");
        if ((sourcePoint.x - targetPoint.x) > standardWidth) {
            return ["W", "E"];
        }

        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("SC");
        if ((sourcePoint.y - targetPoint.y) > standardWidth) {
            return ["N", "S"];
        }

        sourcePoint = sourceRect.getCoordinate("SC");
        targetPoint = targetRect.getCoordinate("NC");
        if ((targetPoint.y - sourcePoint.y) > standardWidth) {
            return ["S", "N"];
        }

        // 再是否可以通过拐点进行连接  
        sourcePoint = sourceRect.getCoordinate("EM");
        targetPoint = targetRect.getCoordinate("NC");
        if (((targetPoint.x - sourcePoint.x) > 0.5 * standardWidth) && ((targetPoint.y - sourcePoint.y) > standardWidth)) {
            return ["E", "N"];
        }
        targetPoint = targetRect.getCoordinate("SC");
        if (((targetPoint.x - sourcePoint.x) > 0.5 * standardWidth) && ((sourcePoint.y - targetPoint.y) > standardWidth)) {
            return ["E", "S"];
        }

        sourcePoint = sourceRect.getCoordinate("WM");
        targetPoint = targetRect.getCoordinate("SC");
        if (((sourcePoint.x - targetPoint.x) > 0.5 * standardWidth) && ((sourcePoint.y - targetPoint.y) > standardWidth)) {
            return ["W", "S"];
        }
        targetPoint = targetRect.getCoordinate("NC");
        if (((sourcePoint.x - targetPoint.x) > 0.5 * standardWidth) && ((targetPoint.y - sourcePoint.y) > standardWidth)) {
            return ["W", "N"];
        }

        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("EM");
        if (((sourcePoint.y - targetPoint.y) > 0.5 * standardWidth) && ((sourcePoint.x - targetPoint.x) > standardWidth)) {
            return ["N", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if (((sourcePoint.y - targetPoint.y) > 0.5 * standardWidth) && ((targetPoint.x - sourcePoint.x) > standardWidth)) {
            return ["N", "W"];
        }

        sourcePoint = sourceRect.getCoordinate("SC");
        targetPoint = targetRect.getCoordinate("EM");
        if (((targetPoint.y - sourcePoint.y) > 0.5 * standardWidth) && ((sourcePoint.x - targetPoint.x) > standardWidth)) {
            return ["S", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if (((targetPoint.y - sourcePoint.y) > 0.5 * standardWidth) && ((targetPoint.x - sourcePoint.x) > standardWidth)) {
            return ["S", "W"];
        }

        // 最后计算可用的连接点，然后从中选择。两个连接点可连接优先级为：NN >> EE >> NE >> NW >> SE >> SW  
        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("NC");
        if ((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))) {
            if ((sourcePoint.y - targetPoint.y) < 0) {
                if (Math.abs(sourcePoint.x - targetPoint.x) > ((sourceRect.getWidth() + standardWidth) / 2))
                    return ["N", "N"];
            } else {
                if (Math.abs(sourcePoint.x - targetPoint.x) > (targetRect.getWidth() / 2))
                    return ["N", "N"];
            }
        }

        sourcePoint = sourceRect.getCoordinate("EM");
        targetPoint = targetRect.getCoordinate("EM");
        if ((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))) {
            if ((sourcePoint.x - targetPoint.x) > 0) {
                if (Math.abs(sourcePoint.y - targetPoint.y) > ((sourceRect.getHeight() + standardWidth) / 2))
                    return ["E", "E"];
            } else {
                if (Math.abs(sourcePoint.y - targetPoint.y) > (targetRect.getHeight() / 2))
                    return ["E", "E"];
            }
        }

        // 其次判断NE、NW是否可用  
        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("EM");
        if ((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))) {
            return ["N", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if ((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))) {
            return ["N", "W"];
        }

        // 最后判断SE、SW是否可用  
        sourcePoint = sourceRect.getCoordinate("SC");
        targetPoint = targetRect.getCoordinate("EM");
        if ((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))) {
            return ["S", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if ((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))) {
            return ["S", "W"];
        }

        // 只能返回这个  
        return ["E", "W"];
    },
    // 计算两个图形之间的拐点
    calcBendPoints(sourceRect, targetRect, connectionDir) {
        let points = [], startPoint, endPoint;
        if ("E" == connectionDir[0]) {
            startPoint = sourceRect.getCoordinate("EM");
            points.push(startPoint);
            if ("S" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("SC");
                points.push({ x: endPoint.x, y: startPoint.y });
                points.push(endPoint);
            } else if ("N" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("NC");
                points.push({ x: endPoint.x, y: startPoint.y });
                points.push(endPoint);
            } else if ("E" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("EM");
                points.push({ x: Math.max(startPoint.x, endPoint.x) + 1.5 * standardWidth, y: startPoint.y });
                points.push({ x: Math.max(startPoint.x, endPoint.x) + 1.5 * standardWidth, y: endPoint.y });
                points.push(endPoint);
            } else {
                endPoint = targetRect.getCoordinate("WM");
                if (endPoint.y != startPoint.y) {
                    points.push({ x: (startPoint.x + endPoint.x) / 2, y: startPoint.y });
                    points.push({ x: (startPoint.x + endPoint.x) / 2, y: endPoint.y });
                }
                points.push(endPoint);
            }
        } else if ("W" == connectionDir[0]) {
            startPoint = sourceRect.getCoordinate("WM");
            points.push(startPoint);
            if ("S" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("SC");
                points.push({ x: endPoint.x, y: startPoint.y });
                points.push(endPoint);
            } else if ("N" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("NC");
                points.push({ x: endPoint.x, y: startPoint.y });
                points.push(endPoint);
            } else {
                endPoint = targetRect.getCoordinate("EM");
                if (endPoint.y != startPoint.y) {
                    points.push({ x: (startPoint.x + endPoint.x) / 2, y: startPoint.y });
                    points.push({ x: (startPoint.x + endPoint.x) / 2, y: endPoint.y });
                }
                points.push(endPoint);
            }
        } else if ("N" == connectionDir[0]) {
            startPoint = sourceRect.getCoordinate("NC");
            points.push(startPoint);
            if ("E" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("EM");
                if ((endPoint.x - startPoint.x) > 0) {
                    points.push({ x: startPoint.x, y: startPoint.y - standardWidth });
                    points.push({ x: endPoint.x + 1.5 * standardWidth, y: startPoint.y - standardWidth });
                    points.push({ x: endPoint.x + 1.5 * standardWidth, y: endPoint.y });
                } else {
                    points.push({ x: startPoint.x, y: endPoint.y });
                }
                points.push(endPoint);
            } else if ("W" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("WM");
                if ((endPoint.x - startPoint.x) < 0) {
                    points.push({ x: startPoint.x, y: startPoint.y - standardWidth });
                    points.push({ x: endPoint.x - 1.5 * standardWidth, y: startPoint.y - standardWidth });
                    points.push({ x: endPoint.x - 1.5 * standardWidth, y: endPoint.y });
                } else {
                    points.push({ x: startPoint.x, y: endPoint.y });
                }
                points.push(endPoint);
            } else if ("N" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("NC");
                points.push({ x: startPoint.x, y: Math.min(startPoint.y, endPoint.y) - 1.5 * standardWidth });
                points.push({ x: endPoint.x, y: Math.min(startPoint.y, endPoint.y) - 1.5 * standardWidth });
                points.push(endPoint);
            } else {
                endPoint = targetRect.getCoordinate("SC");
                if (endPoint.x != startPoint.x) {
                    points.push({ x: startPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                    points.push({ x: endPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                }
                points.push(endPoint);
            }
        } else if ("S" == connectionDir[0]) {
            startPoint = sourceRect.getCoordinate("SC");
            points.push(startPoint);
            if ("E" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("EM");
                if ((endPoint.x - startPoint.x) > 0) {
                    points.push({ x: startPoint.x, y: startPoint.y + standardWidth });
                    points.push({ x: endPoint.x + 1.5 * standardWidth, y: startPoint.y + standardWidth });
                    points.push({ x: endPoint.x + 1.5 * standardWidth, y: endPoint.y });
                } else {
                    points.push({ x: startPoint.x, y: endPoint.y });
                }
                points.push(endPoint);
            } else if ("W" == connectionDir[1]) {
                endPoint = targetRect.getCoordinate("WM");
                if ((endPoint.x - startPoint.x) < 0) {
                    points.push({ x: startPoint.x, y: startPoint.y + standardWidth });
                    points.push({ x: endPoint.x - 1.5 * standardWidth, y: startPoint.y + standardWidth });
                    points.push({ x: endPoint.x - 1.5 * standardWidth, y: endPoint.y });
                } else {
                    points.push({ x: startPoint.x, y: endPoint.y });
                }
                points.push(endPoint);
            } else {
                endPoint = targetRect.getCoordinate("NC");
                if (endPoint.x != startPoint.x) {
                    points.push({ x: startPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                    points.push({ x: endPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                }
                points.push(endPoint);
            }
        }
        // console.log(points);
        return points;
    },


    /**
     *  拖动card改变path值
     *  id : 当前card  id
     *  cInfo : 当前 card 的 w,h,l,t数据
     *  lineData : 当前画线的数据
     *  cardData : 当前卡片的数据
     */
    moveCard(canvas, id, cInfo, lineData, cardData) {
        let v = Object.assign({}, cInfo);
        let d = this.dragArea(v.w, v.h, v.l, v.t);
        cInfo.t = d.y;
        cInfo.l = d.x;
        if (!lineData.length) return;//没有连线数据
        let l = lineData.slice(0),
            c = cardData.slice(0);
        l.map(item => {
            let $t = $("#" + item.id),
                $s = $("#" + item.id + '_show'),
                startPoint = '',
                endPoint = '',
                eInfo = {},
                sInfo = {};

            if (item.from === id) {//以此card为起点
                eInfo = c.find(jtem => jtem.id === item.to);
                startPoint = this.getCorrectPoint(cInfo, item.fromType);
                endPoint = this.getCorrectPoint({ w: eInfo.width, h: eInfo.height, l: eInfo.x, t: eInfo.y }, item.toType);
                if (item.type === "line_polyline") {//折线
                    let sp = { x1: CanvasCommon.changePtoObj(startPoint).x, y1: CanvasCommon.changePtoObj(startPoint).y, path1: switchType(item.fromType) },
                        ep = { x2: CanvasCommon.changePtoObj(endPoint).x, y2: CanvasCommon.changePtoObj(endPoint).y, path2: switchType(item.toType) };
                    // let points = CanvasCommon.getPolyLine(sp,ep);
                    // let points = CanvasCommon.getPolyLine(item.from, item.to);
                    // $t.attr('points',`${startPoint} ${points} ${endPoint}`);
                    // $s.attr('points',`${startPoint} ${points} ${endPoint}`);
                    let points = polylineCommon.getPoints(sp, ep);
                    $t.attr('points', `${points}`);
                    $s.attr('points', `${points}`);
                    this.movePolylineHint(canvas, item, points);
                } else {
                    $t.attr('d', `M${startPoint} L${endPoint}`);
                    $s.attr('d', `M${startPoint} L${endPoint}`);
                    this.moveSolidLineHint(canvas, item, startPoint, endPoint);
                }
            }
            else if (item.to === id) {//以此card为终点
                sInfo = c.find(jtem => jtem.id === item.from);
                startPoint = this.getCorrectPoint({ w: sInfo.width, h: sInfo.height, l: sInfo.x, t: sInfo.y }, item.fromType);
                endPoint = this.getCorrectPoint(cInfo, item.toType);
                if (item.type === "line_polyline") {
                    let sp = { x1: CanvasCommon.changePtoObj(startPoint).x, y1: CanvasCommon.changePtoObj(startPoint).y, path1: switchType(item.fromType) },
                        ep = { x2: CanvasCommon.changePtoObj(endPoint).x, y2: CanvasCommon.changePtoObj(endPoint).y, path2: switchType(item.toType) };
                    // let points = CanvasCommon.getPolyLine(sp,ep);
                    // let points = CanvasCommon.getPolyLine(item.from, item.to);
                    let points = polylineCommon.getPoints(sp, ep);
                    // $t.attr('points',`${startPoint} ${points} ${endPoint}`);
                    // $s.attr('points',`${startPoint} ${points} ${endPoint}`);
                    $t.attr('points', `${points}`);
                    $s.attr('points', `${points}`);
                    this.movePolylineHint(canvas, item, points);
                } else {
                    $t.attr('d', `M${startPoint} L${endPoint}`);
                    $s.attr('d', `M${startPoint} L${endPoint}`);
                    this.moveSolidLineHint(canvas, item, startPoint, endPoint);
                }
            }
        })
    },

    // 线上的标题
    moveSolidLineHint(canvas, item, startP, endP) {
        // 中心点，显示序号和提示信息
        var p1 = startP.split(',');
        var p2 = endP.split(',');
        if (p1.length !== 2 || p2.length !== 2) {
            return;
        }

        // 序号
        let $no = $("#p_" + item.id);
        if ($no) {
            var x = (parseInt(p1[0]) + parseInt(p2[0])) / 2;
            var dy = (parseInt(p1[1]) + parseInt(p2[1])) / 2;

            $no.attr('x', x);
            $no.attr('dy', dy - 4);
        }

        // 提示信息
        if (canvas.props.drawHint === true) {
            let $hint = $("#t_" + item.id);
            if ($hint) {
                var lineHint = $hint.text();
                var pos = canvas.getSolidLineHintPos(lineHint, startP, endP);

                $hint.attr('x', pos.left);
                $hint.attr('dy', pos.top);
            }
        }
    },
    // 提示信息
    movePolylineHint(canvas, item, points) {
        let $no = $("#p_" + item.id);
        if ($no) {
            var pt = canvas.getTextPoint(points);
            $no.attr('x', pt[0]);
            $no.attr('dy', pt[1]);
        }

        // 提示信息
        if (canvas.props.drawHint === true) {
            let $hint = $("#t_" + item.id);
            if ($hint) {
                var pt = canvas.getHorizonPoint(points)
                $hint.attr('x', pt[0] + 10);
                $hint.attr('dy', pt[1] - 8);
            }
        }
    },

    /**
     *  处理数据 编辑或者新增
     *  传入 已存在数据  新数据  比对返回最后数据
    */
    handleData(preData, newData) {
        let f = true,
            p = preData.slice(0);
        for (let i = 0; i < preData.length; i++) {
            if (preData[i].id === newData.id) {
                for (let k in newData) {
                    preData[i][k] = newData[k]
                }
                f = false;
                break;
            }
        }
        if (f) {
            p.push(newData);
        }
        return p;
    },
    /**
     *判断是否已经存在连线了
     * sID: 起始点id
     * eID: 结束点id
     * lineData :已存在的连线信息
    */
    existFlag(sID, eID, lineData) {
        let l = lineData.slice(0);
        let f = false;
        for (let i = 0; i < l.length; i++) {
            //双向只能存在一个 (l[i].from===sID && l[i].to===eID)||(l[i].from===eID && l[i].to===sID)
            //双向存在两个  (l[i].from===sID && l[i].to===eID)
            if ((l[i].from === sID && l[i].to === eID)) {
                f = true;
                break;
            }
        }
        return f;
    },
    /**
     *  根据 matrix 的数值获取旋转值
    */
    getRotateDeg(a, b, c, d, e, f) {
        let aa = Math.round(180 * Math.asin(a) / Math.PI);
        let bb = Math.round(180 * Math.acos(b) / Math.PI);
        let cc = Math.round(180 * Math.asin(c) / Math.PI);
        let dd = Math.round(180 * Math.acos(d) / Math.PI);
        let deg = 0;
        if (aa === bb || -aa === bb) {
            deg = dd;
        } else if (-aa + bb === 180) {
            deg = 180 + cc;
        } else if (aa + bb === 180) {
            deg = 360 - cc || 360 - dd;
        }
        return deg >= 360 ? 0 : deg;
    },
    /**
     *  获取移动中的deg
     *  cx  cy  当前鼠标的x y
     *  mx  my  当前图标的中心点
    */
    getMovingDeg(cx, cy, mx, my) {
        let long, short, deg;
        long = Math.sqrt(Math.pow((my - cy), 2) + Math.pow((cx - mx), 2));
        if (cy <= my && cx > mx) {//第一象限
            short = cx - mx;
            deg = 180 * Math.asin(short / long) / Math.PI;
        } else if (cy >= my && cx >= mx) {//第二象限
            short = cy - my;
            deg = 180 * Math.acos(-short / long) / Math.PI;
        } else if (cy > my && cx <= mx) { //第三象限
            short = mx - cx;
            deg = 180 * Math.asin(short / long) / Math.PI + 180;
        } else if (cy <= my && cx < mx) { //第四象限
            short = my - cy;
            deg = 180 * Math.acos(-short / long) / Math.PI + 180;
        }
        deg = (0 < deg % 90) && (deg % 90 < 3) ? Math.floor(deg / 90) * 90 : deg % 90 > 87 ? Math.ceil(deg / 90) * 90 : deg;
        return deg;
    },
    /**
     *  获取折线转折点
     *  sp ： 开始的点的数据
     *  ep :  结束的点的数据
     *  数据包括  x  y  t  （x,y坐标和 type）
    */

    getPolyLineBackup(sp, ep) {
        let p = '';
        if (sp.t == 1) {
            p = ''
        }
        else if (sp.t == 2) {
            if (ep.x > sp.x) {
                if (ep.t == 1) {
                    if (ep.y < sp.y) {
                        p = ''
                    } else {
                        p = `${ep.x},${sp.y}`;
                    }
                }
                else if (ep.t == 2) {
                    let tx = ep.x + 20;
                    p = `${tx},${sp.y} ${tx},${ep.y}`;
                }
                else if (ep.t == 3) {
                    if (ep.y > sp.y) {
                        p = ''
                    } else {
                        p = `${ep.x},${sp.y}`
                    }
                }
                else if (ep.t == 4) {
                    let tx = (sp.x + ep.x) / 2;
                    p = `${tx},${sp.y} ${tx},${ep.y}`;
                }
            }
        }
        else if (sp.t == 3) {
            if (ep.y > sp.y) {
                if (ep.t == 1) {
                    let ty = (ep.y + sp.y) / 2;
                    p = `${sp.x},${ty}  ${ep.x},${ty}`;
                }
                else if (ep.t == 2) {
                    if (ep.x > sp.x) {
                        p = '';
                    } else {
                        p = `${sp.x},${ep.y}`;
                    }
                }
                else if (ep.t == 3) {
                    let ty = ep.y + 20;
                    p = `${sp.x},${ty}  ${ep.x},${ty}`;
                }
                else if (ep.t == 4) {
                    if (ep.x > sp.x) {
                        p = ''
                    } else {
                        p = `${sp.x},${ep.y}`;
                    }
                }
            }
        }
        else if (sp.t == 4) {
            if (ep.x < sp.x) {
                if (ep.t == 1) {
                    if (ep.y < sp.y) {
                        p = ''
                    } else {
                        p = `${ep.x},${sp.y}`;
                    }
                }
                else if (ep.t == 2) {
                    let tx = (sp.x + ep.x) / 2;
                    p = `${tx},${sp.y}  ${tx},${ep.y}`;
                }
                else if (ep.t == 3) {
                    if (ep.y > sp.y) {
                        p = '';
                    } else {
                        p = `${ep.x},${sp.y}`;
                    }
                }
                else if (ep.t == 4) {
                    let tx = ep.x - 20;
                    p = `${tx},${sp.y} ${tx},${ep.y}`;
                }
            }
        }
        return p;
    },
    /**
     *  在移动的时候保证图形在有效区域内
     *  H   W   svg的高度和宽度
     *  cw  ch  当前的宽高
     *  x  y    当前的位置
    */
    dragArea(cw, ch, x, y) {
        let H = this.getLastSvg().H,
            W = this.getLastSvg().W;
        x = x < 0 ? 0 : x > (W - cw - 6) ? (W - cw - 6) : x;
        y = y > (H - ch) ? (H - ch) : y < 4 ? 4 : y;
        x = x % 10 <= 2 ? parseInt(x / 10) * 10 : x % 10 >= 8 ? parseInt(x / 10) * 10 + 10 : x,
            y = y % 10 <= 2 ? parseInt(y / 10) * 10 : y % 10 >= 8 ? parseInt(y / 10) * 10 + 10 : y;
        return { x, y }
    },
    /**
     *  在放大的时候保证在有效区域内
     *  svg高 svg宽 当前左偏移 当前上偏移  拉动的宽  拉动的高
     *
    */
    pullArea(cl, ct, x, y) {
        let H = this.getLastSvg().H,
            W = this.getLastSvg().W;
        x = x > (W - cl - 6) ? (W - cl - 6) : x;
        y = y > (H - ct) ? (H - ct) : y;
        return { x, y }
    },
    /**140px
     *  将坐标转为对象
    */
    changePtoObj(point) {
        let x = Number(point.split(',')[0]),
            y = Number(point.split(',')[1]);
        return { x, y };
    },
    getWrapHtml(option, activeMap, onEdit) {
        if (!option) { console.warn('html参数错误'); }
        let wrapHtml = '',
            attr = Object.assign({}, this.getDefaultCardAttr(option.type), option.attr);

        var lineCol = attr.lineCol;
        if (activeMap && activeMap[option.id]) {
            lineCol = "#00FF00";
        }

        var fillCol = (option.type === 'card' && option.invalid === true) ? '#F0F0F0' : attr.fillCol;
        let pp = `<div class='point-common point-top' data-type='1'/><div class='point-common point-right' data-type='2'/><div class='point-common point-bottom' data-type='3'/><div class='point-common point-left' data-type='4'/>`;
        let commonStyle = `width: ${option.width}px;height: ${option.height}px;top:${option.y}px;left:${option.x}px;z-index: ${option.zIndex};font-size:${attr.fontSize}px;color:${attr.fontCol};background-color:${fillCol};border-width:${attr.lineWidth}px;border-color:${lineCol};border-style:solid;`
        switch (option.type) {
            case 'card':
                if (onEdit) {
                    wrapHtml = `<div id=${option.id} data-type='card' data-index='1' class='card-wrap common-class' style="${commonStyle} border-radius: 12px;"><div class="text-content common-content">${option.content}</div><i class="anticon anticon-edit common-edit"></i><div class="common-close">×</div><div class='common-pull' />${pp}</div>`;
                } else {
                    wrapHtml = `<div id=${option.id} data-type='card' data-index='1' class='card-wrap common-class' style="${commonStyle} border-radius: 12px;"><div class="text-content common-content">${option.content}</div><div class="common-close">×</div><div class='common-pull' />${pp}</div>`;
                }
                
                break;
            case 'judge':
                {
                    let points = `${(option.width - 2) / 2},1 ${option.width - 2},${(option.height - 2) / 2} ${(option.width - 2) / 2},${option.height - 3} 2,${(option.height - 2) / 2}`;
                    wrapHtml = `<div id=${option.id} data-type='judge' data-index='2' class='judge-wrap common-class' style="width: ${option.width}px;height: ${option.height}px;top:${option.y}px;left:${option.x}px;z-index: ${option.zIndex};font-size:${attr.fontSize}px;color:${attr.fontCol};"><svg class="judge-svg" width=${option.width} height=${option.height}><polygon class="judge-polygon" points="${points}" fill="${attr.fillCol}" stroke="${attr.lineCol}" stroke-width="${attr.lineWidth}"></polygon></svg><div class="judge-content common-content">${option.content}</div><div class="common-close">×</div><div class='common-pull' />${pp}</div>`;
                }
                break;
            case 'text':
                wrapHtml = `<div id=${option.id} data-type='text' data-index='6' class='text-wrap common-class' style="width: ${option.width}px;height: ${option.height}px;top:${option.y}px;left:${option.x}px;z-index: ${option.zIndex};font-size:${attr.fontSize}px;color:${attr.fontCol}; transform:rotate(${option.rotate}deg)"><div class="text-content common-content">${option.content}</div><div class="common-close">×</div><div class='common-pull' /><div class='common-rotate'></div></div>`;
                break;
            case 'start':
                wrapHtml = `<div id=${option.id} data-type='start' data-index='3' class='start-wrap common-class' style="${commonStyle} border-radius: 50%;"><div class="text-content common-content">start</div><div class="common-close">×</div>${pp}</div>`;
                break;
            case 'end':
                wrapHtml = `<div id=${option.id} data-type='end' data-index='4' class='start-wrap common-class' style="${commonStyle} border-radius: 50%;"><div class="text-content common-content">end</div><div class="common-close">×</div>${pp}</div>`;
                break;
            default:
                break;
        }
        return wrapHtml;
    },
    /**
     *  编辑时 获取线上所有点的坐标
     *  包括直线  和  折线
    */
    getEditPoints(line, cardArr) {
        let p,
            sCard = cardArr.find(item => item.id === line.from),
            eCard = cardArr.find(item => item.id === line.to);
        let sp = this.getCorrectPoint({ w: sCard.width, h: sCard.height, l: sCard.x, t: sCard.y }, line.fromType),
            ep = this.getCorrectPoint({ w: eCard.width, h: eCard.height, l: eCard.x, t: eCard.y }, line.toType);
        //直线
        if (line.type === "line_solid") {
            p = { sp, ep };
        }
        else if (line.type === "line_polyline") {
            let spObj = { x1: Number(sp.split(',')[0]), y1: Number(sp.split(',')[1]), path1: switchType(line.fromType) },
                epObj = { x2: Number(ep.split(',')[0]), y2: Number(ep.split(',')[1]), path2: switchType(line.toType) };
            // let points = this.getPolyLine(spObj,epObj);
            // let points = this.getPolyLine(line.from, line.to);
            p = polylineCommon.getPoints(spObj, epObj)
            // p = `${sp} ${points} ${ep}`;
            // p = `${points}`;
        }
        return p;
    },
    /**
     *  获取树形菜单的html
    */
    getTreeHtml(opt) {
        let t = `<li class="tree-${opt.level}" ><span class="mal-icon lz-${opt.type} iconfont"></span><span class="mal-content mal-drag" drag-flag="false" data-id=${opt.nodeId} data-type=${opt.level} title=${opt.name.replace(/\s+/g, "")}>${opt.name}</span><ul class="mal-clild-ul"></ul></li>`;
        return t;
    },
    /**
     *  默认card颜色属性
    */
    getDefaultCardAttr(type) {
        let color = {},
            dLineCol = '#2d63a7',
            dFontSize = '12',
            dStartCol = '#f9b61f',
            dWidth = '1.5',
            dTextCol = '#444',
            dFillCol = '#fff',
            dLineType = 'line_solid';
        if (type === 'default') {
            color = { lineCol: '', lineWidth: '', fillCol: '', fontSize: '', fontCol: '', lineType: '' };
        }
        else if (type === 'text') {
            color = {
                fontSize: dFontSize,//字体大小
                fontCol: dTextCol,
            };
        }
        else if (type === 'line') {
            color = {
                lineCol: dLineCol,
                lineWidth: dWidth,
                lineType: dLineType//线类型
            };
        }
        else {
            let col = (type === 'start' || type === 'end') ? dStartCol : dLineCol;
            color = {
                fillCol: dFillCol,//卡片  填充  颜色
                fontSize: dFontSize,//字体大小
                fontCol: dTextCol,
                lineCol: col,//线的颜色（包括边框）
                lineWidth: dWidth,//线的大小（包括边框）
            };
        }
        return color;
    },
    /**
     *  dom  改变某个图形的attr属性
    */
    changeDomAttr(opt) {
        let { attr, id, type } = opt;
        let $t = $("#" + id);
        if (type === 'card' || type === 'start' || type === 'end') {
            $t.css({
                'border-width': attr.lineWidth,
                'border-color': attr.lineCol,
                'background-color': attr.fillCol,
                'color': attr.fontCol,
                'font-size': attr.fontSize + 'px',
            })
        }
        else if (type === 'judge') {
            $t.css({
                'color': attr.fontCol,
                'font-size': attr.fontSize + 'px',
            });
            $t.find('.judge-polygon').attr({
                'stroke': attr.lineCol,
                'stroke-width': attr.lineWidth,
                'fill': attr.fillCol
            })
        }
        else if (type === 'text') {
            $t.css({
                'color': attr.fontCol,
                'font-size': attr.fontSize + 'px',
            })
        }
        else if (type.indexOf('line') > -1) {
            let $ts = $("#" + id + '_show');
            $t.css({
                'stroke': attr.lineCol,
                'stroke-width': attr.lineWidth
            });
            $t.attr('marker-end', `url(#arrow${attr.lineCol.substring(1)})`);
            $ts.css({
                'stroke-width': Number(attr.lineWidth) + 4
            });
        }
    },
    /**
     *  根据画布上的所有点获取已用的画布区域
     *  计算出保存用的图片的大小
     *  cardData  已画的卡片数据
    */
    getPicSize(cardData) {
        // console.log(cardData);
        let minL, minT, maxL, maxT, maxTH, maxLW;
        cardData.map((t, i) => {
            if (i === 0) {
                minL = t.x;
                maxL = t.x
                minT = t.y;
                maxT = t.y;
                maxTH = t.height;
                maxLW = t.width;
            }
            else {
                if (t.x < minL) {
                    minL = t.x;
                } else if (t.x > maxL) {
                    maxL = t.x;
                    maxLW = t.width;
                }
                if (t.y < minT) {
                    minT = t.y;
                } else if (t.y > maxT) {
                    maxT = t.y;
                    maxTH = t.height;
                }
            }
        });
        let width = minL + maxL + maxLW,
            height = minT + maxT + maxTH;
        width = width > 3500 ? 3500 : width;
        height = height > 2000 ? 2000 : height;
        // console.log(width, height);
        return { width, height }
    },
    /**
     *  自定义颜色
    */
    getColors() {
        //写全6位
        let colArr = ['#fccb00', '#db3e00', '#1273de', '#2d63a7', '#333333', '#37d67a'];
        return colArr;
    }
};

export default CanvasCommon;