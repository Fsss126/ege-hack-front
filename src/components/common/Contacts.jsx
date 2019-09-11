import React from 'react';

export default function Contacts({contacts: {vk, fb, ok, ig}}) {
    return (
        <div className="social-media font-light-grey">
            {vk && <a href={vk} className="social-media__link"><i className="fab fa-vk vk"/></a>}
            {fb && <a href={fb} className="social-media__link"><i className="fab fa-facebook-f fb"/></a>}
            {ok && <a href={ok} className="social-media__link"><i className="fab fa-odnoklassniki ok"/></a>}
            {ig && <a href={ig} className="social-media__link"><i className="fab fa-instagram ig"/></a>}
        </div>
    );
}
