import React, {useCallback} from "react";
import classnames from 'classnames';
import {Link} from "react-router-dom";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import Page, {PageContent, PageParentSection} from "components/Page";
import Catalog, {CatalogFilter, CatalogItemRenderer} from "components/common/Catalog";
import Button from "components/ui/Button";
import ListItem, {ListItemProps} from "components/common/ListItem";
import {renderDate} from "definitions/helpers";
import {useWebinar, WEBINAR_STATE} from "components/common/WebinarSchedule";
import PosterCover from "components/common/PosterCover";
import Countdown, {CountdownRenderProps} from "react-countdown-now";
import {useCheckPermissions} from "components/ConditionalRender";
import {useDeleteWebinar} from "hooks/selectors";
import {Permission} from "types/enums";
import {CourseInfo, WebinarInfo, WebinarScheduleInfo} from "types/entities";
import {RouteComponentProps} from "react-router";

const filterBy = {
    search: true,
    subject: false,
    online: false
};

const filter: CatalogFilter<WebinarInfo> = (lesson, {search}) => {
    const name = lesson.name.toLowerCase().replace(/\s/g, '');
    const searchKey = search.toLowerCase().replace(/\s/g, '');
    return search ? name.includes(searchKey) : true
};

type WebinarProps = Omit<React.Defaultize<ListItemProps<WebinarInfo>, typeof ListItem.defaultProps>, 'item' | 'preview' | 'truncate' | 'title' | 'selectable'> & {
    webinar: WebinarInfo;
}
const Webinar: React.FC<WebinarProps> = (props) => {
    const {webinar, ...rest} = props;
    const {id, image_link, name, date_start} = webinar;
    const {state, isUnlocked, onTick, onWebinarStart} = useWebinar(webinar);

    const renderCountdown = (remainingTime: CountdownRenderProps) => {
        const {formatted: {days, hours, minutes, seconds}, completed} = remainingTime;
        const stateText = state === WEBINAR_STATE.ENDED ? 'Завершен' : (
            state === WEBINAR_STATE.AIRING
                ? 'В эфире'
                : `Осталось ${days}:${hours}:${minutes}:${{seconds}}`);
        return <div title={stateText}>{renderDate(date_start, renderDate.dateWithHour)}</div>;
    };
    return (
        <ListItem
            truncate={false}
            key={id}
            item={webinar}
            className="webinar"
            title={name}
            description={(
                <Countdown
                    date={date_start}
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

export type WebinarsPageProps = RouteComponentProps<{courseId: string}> & {
    path: string;
    parentSection?: PageParentSection;
    children: React.ReactNode;
    course?: CourseInfo;
    webinars?: WebinarScheduleInfo;
    isLoaded: boolean;
}
const WebinarsPage: React.FC<WebinarsPageProps> = (props) => {
    const {location, path, match, children: header, course, webinars: webinarSchedule, isLoaded, parentSection} = props;
    const {params: {courseId: param_id}} = match;
    const courseId = parseInt(param_id);

    const webinars = webinarSchedule ? webinarSchedule.webinars : undefined;

    const onDelete = useDeleteWebinar();

    const canEdit = useCheckPermissions(Permission.WEBINAR_EDIT);
    const courseLink = `${path}/${courseId}`;
    const renderWebinar: CatalogItemRenderer<WebinarInfo> = useCallback((webinar, {link, ...rest}) => {
        const {id} = webinar;
        const deleteCallback = (): void => {
            webinarSchedule && onDelete(courseId, id, webinarSchedule);
        };
        return (
            <Webinar
                key={id}
                webinar={webinar}
                action={canEdit ? (
                    <DropdownMenu
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
                ) : undefined}
                {...rest}/>
        )
    }, [courseLink, canEdit, webinarSchedule, courseId, onDelete]);
    const title = course && `Вебинары курса ${course.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredPermissions={Permission.WEBINAR_EDIT}
            className="admin-page admin-page--webinars"
            title={title}
            location={location}>
            {isLoaded && webinars && (
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
                            noMatchPlaceholder="Нет совпадающих вебинаров"
                            plain
                            renderItem={renderWebinar}/>
                    </PageContent>
                </Catalog.Body>
            )}
        </Page>
    );
};

export default WebinarsPage;
