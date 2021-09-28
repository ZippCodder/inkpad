/* Global header component */

import { graphicLogo, textLogo } from "./.images.js";

export default function Header(props: {}): JSX.Element {
return (
<header className="main-header">
<div className="main-header__logo">
<img src={graphicLogo} className="main-header__logo__gLogo" alt="logo"/>
<img src={textLogo} className="main-header__logo__tLogo" alt="pictr"/>
<small className="main-header__slogan">animation comics and art</small>
<div className="main-header__options">
<button className="main-header__options__button">Sign Up</button><button className="main-header__options__button">Sign In</button>
</div>
</div>
</header>
)
}

