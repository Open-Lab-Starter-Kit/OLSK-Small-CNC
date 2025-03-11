
import { NavLink, Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';

const HeaderBar = styled.header`
width: 100%;
 padding: 0.5rem 1rem;
     display: flex;
    height: 56px;
    position: relative;
    align-items: center;
    background-color: #fff;
        font-family: Barlow;
    font-size: medium;
`;

// Define MobileMenu component
const MobileMenu = () => {
    return (
        <div className={'mobile-menu'}>
            <a href='#home'>Home</a>
            <a href='#news'>News</a>
            <a href='#shop'>Shop</a>
            <a href='#contact'>Contact</a>
            <a href='#about'>About</a>
            <a href='#privacy'>Privacy Policy</a>
        </div>
    );
};

export default function Header() {

    const [isShown, setIsShown] = useState(false);

    const toggleMobileMenu = () => {
        setIsShown(!isShown);
    };

    const home = useRef()
    const howTo = useRef()
    const contact = useRef()
    const about = useRef()

    // adding the states 
    const [isActive, setIsActive] = useState(false);
    const [isHomeActive, setIsHomeActive] = useState(true);
    const [isHowToActive, setIsHowToActive] = useState(false);

    //add the active class
    const toggleActiveClass = () => {
        setIsActive(!isActive);
    };

    //clean up function to remove the active class
    const removeActive = () => {
        setIsActive(false)
    }
    const homeActive = () => {
        setIsHomeActive(true)
        setIsHowToActive(false);
    }
    const howToActive = () => {
        setIsHomeActive(false)
        setIsHowToActive(true)
    }

    return <>
        <HeaderBar>
            <div>
                <img src="./InMachines_Logo_positive_RGB.svg" className="navLogo" id="mainLogo" />
            </div>
            <div><h1 className="Title" >OLSK Small CNC V3</h1></div>

            <div className="navMenu" >
                <ul >
                    <li><NavLink to="/">Assembly Manual</NavLink></li>
                    <li><NavLink to='/HowTo' target="_blank">How To</NavLink></li>
                    {/*                     <li><a href="./index.html/" ref={home} className={`${isHomeActive ? 'active' : ''}`} >Assembly Manual</a></li>
                    <li><a href="./howTo.html" ref={howTo} target="_blank" >How To</a></li>
                    <li><a href="#contact">Tools</a></li>
                    <li><a href="#about">Contact</a></li> */}
                </ul>

            </div>
            <button className='hamburger' onClick={toggleMobileMenu}>
                &#8801;
            </button>

        </HeaderBar>
    </>
}