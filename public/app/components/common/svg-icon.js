/**
 * This script is used to display an svg.
 *
 * <p>It is assumed that ths svg file was loaded and only the id of the
 * svg needs to be set.
 *
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default class SvgIcon extends React.Component {
    render() {
        let iconStyleNames = this.props.className ? this.props.className + ' svg-icon ' : 'svg-icon ';
        this.props.onClick ? iconStyleNames += ' svg-icon-clickable' : null;

        const svgId = this.props.id[0] === '#' ? this.props.id : '#' + this.props.id;

        return (
            <svg className={iconStyleNames}
                 style={this.props.style}
                 width={this.props.width}
                 height={this.props.height}
                 onClick={this.props.onClick}
                 onMouseEnter={this.props.onMouseEnter}
                 aria-labelledby="title">
                <title id="title">{this.props.title}</title>
                <use width={this.props.width}
                     height={this.props.height}
                     xlinkHref={svgId}
                />
            </svg>
        );
    }
}
SvgIcon.propTypes = {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    width: React.PropTypes.string.isRequired,
    height: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    onClick: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func
};
