'use strict';

/**
 *   Create by Malson on 2018/1/17
 */
/**
*  图形模板
*/
import React from 'react';
import Common from '../../public/script/canvas-common';

class ComponentPattern extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        //连接线箭头  前面留空隙
        let arrowColors = Common.getColors();
        //拖拽时的箭头  前面不留空隙
        const ArrowDrag = (
            <marker
                id="arrowDragging"
                fill="#2d63a7"
                markerUnits="strokeWidth"
                markerWidth="16"
                markerHeight="16"
                viewBox="0 0 10 10"
                refX="5"
                refY="4"
                orient="auto"
            >
                <path d="M2,2 L5,4 L2,6 L3,4 L2,2" />
            </marker>
        );

        //拖拽时的箭头  前面不留空隙
        const ArrowSelect = (
            <marker
                id="arrowSelect"
                fill="#165290"
                markerUnits="strokeWidth"
                markerWidth="16"
                markerHeight="16"
                viewBox="0 0 10 10"
                refX="8"
                refY="4"
                orient="auto"
            >
                <path d="M2,2 L5,4 L2,6 L3,4 L2,2"></path>
            </marker>
        );

        //人物  图标
        const PersonIcon = (
            <symbol id="personIcon">
                <svg height="36" width="36" viewBox="0 0 1024 1024">
                    <path xmlns="http://www.w3.org/2000/svg" d="M512 213.2c41.2 0.2 74.6-33.2 74.6-74.6 0-41.2-33.4-74.6-74.6-74.6-41.2 0-74.6 33.4-74.6 74.6C437.4 179.8 470.8 213.2 512 213.2z"></path>
                    <path xmlns="http://www.w3.org/2000/svg" d="M586.8 230 512 230l-74.8 0c-56.4 0-93.2 49.6-93.2 96.8L344 554c0 44 62 44 62 0L406 344l12 0 0 571.2c0 60.8 84 58.8 86 0L504 586l14 0 2 0 0 329.4c3.4 62.4 86 56.4 86-0.2L606 344l10 0 0 210c0 44 64 44 64 0L680 326.8C680 279.8 643 230 586.8 230z"></path>
                </svg>
            </symbol>
        );
        return (
            <g>
                <defs>
                    {arrowColors.map((item, i) => {
                        return (
                            <marker
                                id={`arrow${item.substring(1)}`}
                                fill={item}
                                markerUnits="strokeWidth"
                                markerWidth="16"
                                markerHeight="16"
                                viewBox="0 0 10 10"
                                refX="5"
                                refY="4"
                                orient="auto"
                                key={i}
                            >
                                <path d="M2,2 L5,4 L2,6 L3,4 L2,2" />
                            </marker>
                        );
                    })}
                    {ArrowDrag}
                    {ArrowSelect}
                </defs>
            </g>
        )
    }
}
export default ComponentPattern;