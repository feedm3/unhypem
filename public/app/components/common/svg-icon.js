/**
 * This script is used to display an external svg.
 *
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default class SvgIcon extends React.Component {
    render() {
        return (
            <svg className={this.props.className + ' svg-icon'}
                 width={this.props.width}
                 height={this.props.height}
                 onClick={this.props.onClick}
                 aria-labelledby="title">
                <title id="title">this.props.title</title>
                <use width={this.props.width}
                     height={this.props.height}
                     xlinkHref={this.props.src}
                />
            </svg>
        );
    }
}
SvgIcon.propTypes = {
    src: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    width: React.PropTypes.string.isRequired,
    height: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func
};
