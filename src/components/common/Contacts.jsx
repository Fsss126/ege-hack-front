import React from 'react';
import Link from "components/ui/Link";

export default function Contacts({contacts: {vk, fb, ok, ig}}) {
    return (
        <div className="social-media font-light-grey">
            {vk && <Link to={vk} className="social-media__link"><i className="fab fa-vk vk"/></Link>}
            {fb && <Link to={fb} className="social-media__link"><i className="fab fa-facebook-f fb"/></Link>}
            {ok && <Link to={ok} className="social-media__link"><i className="fab fa-odnoklassniki ok"/></Link>}
            {ig && <Link to={ig} className="social-media__link"><i className="fab fa-instagram ig"/></Link>}
        </div>
    );
}
