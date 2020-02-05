import React, {useCallback} from "react";
import classnames from 'classnames';
import {Link} from "react-router-dom";
import {ADMIN_ROLES, PERMISSIONS} from "definitions/constants";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import Page, {PageContent} from "components/Page";
import Catalog from "components/common/Catalog";
import Button from "components/ui/Button";
import ListItem from "components/common/ListItem";
import {renderDate} from "definitions/helpers";
import {useWebinar, WEBINAR_STATE} from "components/common/WebinarSchedule";
import PosterCover from "components/common/PosterCover";
import Countdown from "react-countdown-now";
import {useCheckPermissions} from "components/ConditionalRender";
import {useDeleteWebinar} from "store";

const filterBy = {
    search: true,
    subject: false,
    online: false
};

const filter = (lesson, {subject, online, search}) => {
    const name = lesson.name.toLowerCase().replace(/\s/g, '');
    const searchKey = search.toLowerCase().replace(/\s/g, '');
    return search ? name.includes(searchKey) : true
};

const Webinar = ({webinar, ...rest}) => {
    const {id, image_link, name, date_start} = webinar;
    const {state, isUnlocked, onTick, onWebinarStart} = useWebinar(webinar);

    const renderCountdown = (remainingTime) => {
        const {formatted: {days, hours, minutes, seconds}, completed} = remainingTime;
        const stateText = state === WEBINAR_STATE.ENDED ? 'Завершен' : (
            state === WEBINAR_STATE.AIRING
                ? 'В эфире'
                : `Осталось ${days}:${hours}:${minutes}:${{seconds}}`);
        return <div title={stateText}>{renderDate(date_start, renderDate.dateWithHour)}</div>;
    };
    return (
        <ListItem
            key={id}
            item={webinar}
            className="webinar"
            title={name}
            description={(
                <Countdown
                    date={date_start}
                    className="countdown"
                    renderer={renderCountdown}
                    onTick={onTick}
                    onComplete={onWebinarStart}/>
            )}
            selectable
            preview={(
                <PosterCover
                    cover={image_link}
                    className={classnames('webinar-cover', state !== WEBINAR_STATE.ENDED && {
                        'locked': !isUnlocked,
                        'unlocked': isUnlocked
                    })}
                    online={state === WEBINAR_STATE.AIRING}/>
            )}
            {...rest}/>
    );
};

const WebinarsPage = ({location, path, match, children: header, course, webinars: webinarSchedule = {}, isLoaded, parentSection}) => {
    const {params: {courseId: param_id}} = match;
    const courseId = parseInt(param_id);

    const {webinars} = webinarSchedule;

    const onDelete = useDeleteWebinar();

    const canEdit = useCheckPermissions(PERMISSIONS.WEBINAR_EDIT);
    const courseLink = `${path}/${courseId}`;
    const renderWebinar = useCallback((webinar, {link, ...rest}) => {
        const {id} = webinar;
        const deleteCallback = () => {
            onDelete(courseId, id, webinarSchedule);
        };
        return (
            <Webinar key={id} webinar={webinar} {...rest}>
                {canEdit && (
                    <DropdownMenu
                        className="user-nav"
                        content={<DropdownIconButton className="icon-ellipsis"/>}>
                        <DropdownMenuOption
                            tag={Link}
                            to={`${courseLink}/webinars/edit/`}>
                            <i className="far fa-edit"/>Изменить
                        </DropdownMenuOption>
                        <DropdownMenuOption onClick={deleteCallback}>
                            <i className="icon-close"/>Удалить
                        </DropdownMenuOption>
                    </DropdownMenu>
                )}
            </Webinar>
        )
    }, [courseLink, canEdit, webinarSchedule, courseId, onDelete]);
    const title = course && `Вебинары курса ${course.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredRoles={ADMIN_ROLES}
            fullMatch={false}
            className="admin-page admin-page--webinars"
            title={title}
            location={location}>
            {isLoaded && (
                <Catalog.Body
                    items={webinars}
                    filter={filter}>
                    <PageContent parentSection={parentSection}>
                        {header}
                        {canEdit && (
                            <div className="layout__content-block layout__content-block--stacked d-flex">
                                <Button
                                    neutral
                                    tag={Link}
                                    to={`${courseLink}/webinars/edit/`}
                                    icon={<i className="icon-add"/>}>
                                    Добавить вебинар
                                </Button>
                            </div>
                        )}
                        <Catalog.Filter filterBy={filterBy}/>
                        <Catalog.Catalog
                            className="webinars-list"
                            emptyPlaceholder="Нет вебинаров"
                            noMatchplaceholder="Нет совпадающих вебинаров"
                            adaptive={false}
                            plain
                            renderItem={renderWebinar}/>
                    </PageContent>
                </Catalog.Body>
            )}
        </Page>
    );
};

export default WebinarsPage;
