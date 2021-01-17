import React from 'react';

import './Panel.css';

export default function Panel(props) {

    return (
        <div className={`panel left ${props.visible ? 'visible' : ''}`}>
            <div style={{padding: '2em'}}>
                <span style={{minHeight: '2em', padding: '0.25em 0'}}></span>
                {props.children}
            </div>
        </div>
    );
}
