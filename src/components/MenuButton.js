import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import './MenuButton.css';

export default function MenuPanel(props) {

    //<button onClick={() => props.onClick(props.side, props.name)} className={`menu-button ${props.className ? props.className : ''}`}>
    return (
            <div className={`menu-button-container left`}>
                <button
                    className='menu-button'
                    onClick={props.onClick} > 
                    <MenuIcon />
                </button>
            </div>
    );
}