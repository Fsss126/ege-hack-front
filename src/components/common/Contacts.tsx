import React, {FunctionComponent} from 'react';
import Link from "components/ui/Link";
import {ContactInfo} from "types/entities";

interface ContactsProps {
    contacts: ContactInfo;
}

const Contacts: FunctionComponent<ContactsProps> = ({contacts: {vk, fb, ok, ig}}) => {
    return (
        <div className="social-media font-light-grey">
            {vk && <Link to={vk} className="social-media__link"><i className="fab fa-vk vk"/></Link>}
            {fb && <Link to={fb} className="social-media__link"><i className="fab fa-facebook-f fb"/></Link>}
            {ok && <Link to={ok} className="social-media__link"><i className="fab fa-odnoklassniki ok"/></Link>}
            {ig && <Link to={ig} className="social-media__link"><i className="fab fa-instagram ig"/></Link>}
        </div>
    );
};

export default Contacts;
