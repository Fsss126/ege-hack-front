import React from 'react';
import { Route } from "react-router-dom";
import { LoremIpsum } from "lorem-ipsum";
import CourseOverview from "./CourseOverview";
import Catalog from "../common/Catalog";
import CatalogItem from "../common/CatalogItem";
import poster from "img/dummy_poster.jpg"
import {daysBetween} from "../../helpers";

const lorem = new LoremIpsum();
function getDate(daysForward) {
    const date = new Date();
    date.setDate(date.getDate() + daysForward);
    return date;
}

const catalog = [
    {
        title: 'Математика. Мастер группа. Апрель.',
        cover: poster,
        start: getDate(7),
        description: lorem.generateParagraphs(1),
        price: 2500
    },
    {
        title: 'Физика. Мастер группа. Апрель.',
        cover: poster,
        start: getDate(7),
        description: lorem.generateParagraphs(1),
        price: 2500
    }
];

export default class Shop extends React.Component {
    renderCourse = ({title, cover, start, description, price}, key) => {
        const startsIn = daysBetween(new Date(), start);
        return (
            <CatalogItem
                className="course"
                title={title}
                subtitle={`До начала курса ${startsIn} ${startsIn === 1 ? 'день' : 'дней'}`}
                description={description}
                preview={(
                    <div className="course__cover cover">
                        <div className="cover-img" style={{backgroundImage: `url(${cover})`}}/>
                    </div>
                )}
                key={key}>
                <div className="course__select-btn">{price}</div>
            </CatalogItem>
        )
    };

    render() {
        const {match} = this.props;
        return (
            <div className="layout__content">
                <div className="layout__content-container container">
                    <Catalog renderItem={this.renderCourse}>
                        {catalog}
                    </Catalog>
                </div>
                <Route path={`${match.path}/:id`} component={CourseOverview}/>
            </div>
        )
    }
}
