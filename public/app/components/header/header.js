/**
 * @author Fabian Dietenberger
 */

'use strict';
 
import React from 'react';

export default () => {
    return (
        <div className="navbar navbar-default navbar-color navbar-static-top">
            <div className="container">
                <div className="navbar-header">
                    <a href="#/" className="navbar-brand">Unhypem</a>
                    <button className="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </button>
                </div>
                <div className="collapse navbar-collapse navbar-right">
                    <ul className="nav navbar-nav">
                        <li>
                            <a href="#about">About</a>
                        </li>
                        <li>
                            <a href="#imprint">Imprint</a>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

