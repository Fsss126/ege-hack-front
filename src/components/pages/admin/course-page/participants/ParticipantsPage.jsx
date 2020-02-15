import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import {ADMIN_ROLES, PERMISSIONS} from "definitions/constants";
import ListItem from "components/common/ListItem";
import CoverImage from "components/common/CoverImage";
import Catalog from "components/common/Catalog";
import {Link} from "react-router-dom";
import Button from "components/ui/Button";
import {useCheckPermissions} from "components/ConditionalRender";
import Tooltip from "components/ui/Tooltip";
import {renderDate} from "../../../../../definitions/helpers";

const filterBy = {
    search: true,
    subject: false,
    online: false
};

const filter = ({vk_info: {full_name}}, {subject, online, search}) => {
    const userName = full_name.toLowerCase().replace(/\s/g, '');
    const searchKey = search.toLowerCase().replace(/\s/g, '');
    return search ? userName.includes(searchKey) : true
};

const ParticipantsPage = (props) => {
    const {match: {params: {courseId: param_course}}, location, participants, course, isLoaded, children: header, parentSection, path} = props;
    const courseId = parseInt(param_course);

    const canEdit = useCheckPermissions(PERMISSIONS.PARTICIPANT_MANAGEMENT);

    const renderStudent = useCallback((user, {link, ...renderProps}) => {
        const {
            id,
            vk_info: {
                first_name,
                last_name,
                photo,
            },
            contacts: {vk},
            join_date_time
        } = user;
        return (
            <ListItem
                key={id}
                item={user}
                className="user"
                title={`${last_name} ${first_name}`}
                selectable
                noOnClickOnAction
                preview={(
                    <CoverImage src={photo} className="course__cover" round/>
                )}
                link={vk}
                action={
                    <Tooltip
                        content={`Присоединился ${renderDate(join_date_time, renderDate.dateWithYear)}`}
                        position="left">
                        <i className="icon-info"/>
                    </Tooltip>
                }
                {...renderProps}/>
        );
    }, []);
    const title = course && `Ученики курса ${course.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={PERMISSIONS.PARTICIPANT_MANAGEMENT}
            className="admin-page admin-page--participants"
            title={title}
            location={location}>
            {isLoaded && (
                <Catalog.Body
                    items={participants}
                    filter={filter}>
                    <PageContent parentSection={parentSection}>
                        {header}
                        {canEdit && (
                            <div className="layout__content-block layout__content-block--stacked d-flex">
                                <Button
                                    neutral
                                    tag={Link}
                                    to={`${path}/${courseId}/participants/edit/`}
                                    icon={<i className="icon-add"/>}>
                                    Добавить учеников
                                </Button>
                            </div>
                        )}
                        <Catalog.Filter filterBy={filterBy}>
                            {/*<div className="col d-flex justify-content-end">*/}
                            {/*    <DropdownMenu content={(*/}
                            {/*        <DropdownIconButton className="icon-ellipsis"/>*/}
                            {/*    )}>*/}
                            {/*        <DropdownMenuOption*/}
                            {/*            tag={Link}*/}
                            {/*            to={`/catalog-page/${courseId}/participants/edit/`}>*/}
                            {/*            <i className="icon-add"/>Добавить учеников*/}
                            {/*        </DropdownMenuOption>*/}
                            {/*    </DropdownMenu>*/}
                            {/*</div>*/}
                        </Catalog.Filter>
                        <Catalog.Catalog
                            className="users-list"
                            placeholder="Нет совпадающих учеников"
                            adaptive={false}
                            plain
                            renderItem={renderStudent}/>
                    </PageContent>
                </Catalog.Body>
            )}
        </Page>
    );
};

export default ParticipantsPage;
