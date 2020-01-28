import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import {PERMISSIONS} from "definitions/constants";
import {useParticipants, useShopCourse} from "store";
import ListItem from "components/common/ListItem";
import CoverImage from "components/common/CoverImage";
import Catalog from "components/common/Catalog";
import {Link} from "react-router-dom";
import Button from "components/ui/Button";
import DropdownMenu, {DropdownMenuOption} from "components/common/DropdownMenu";

const filterBy = {
    search: true,
    subject: false,
    online: false
};

const ParticipantsPage = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const {participants, error: errorLoadingParticipants, reload: reloadParticipants} = useParticipants(courseId);
    const {course, error: errorLoadingCourses, reload: reloadCourses} = useShopCourse(courseId);

    const isLoaded = !!(participants && course);

    const renderStudent = useCallback((user, renderProps) => {
        const {
            id,
            vk_info: {
            full_name,
            photo,
        }, contacts: {vk}} = user;
        return (
            <ListItem
                key={id}
                link={vk}
                item={user}
                className="user"
                title={full_name}
                selectable
                preview={(
                    <CoverImage src={photo} className="course__cover" round/>
                )}
                {...renderProps}/>
        );
    }, []);
    const getMatchingUsers = React.useCallback((subject, online, search) =>
        participants.filter(({vk_info: {full_name}}) => {
            const userName = full_name.toLowerCase().replace(/\s/g, '');
            const searchKey = search.toLowerCase().replace(/\s/g, '');
            return search ? userName.includes(searchKey) : true
        }), [participants]);
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={PERMISSIONS.PARTICIPANT_MANAGEMENT}
            className="participants-page"
            title={course && `Ученики курса ${course.name}`}
            location={location}>
            {isLoaded && (
                <Catalog.Body
                    filterItems={getMatchingUsers}>
                    <PageContent>
                        <Catalog.Filter filterBy={filterBy}>
                            <div className="col d-flex justify-content-end">
                                <DropdownMenu content={(
                                    <i className="dropdown__icon-btn icon-ellipsis"/>
                                )}>
                                    <DropdownMenuOption
                                        tag={Link}
                                        to={`/courses/${courseId}/participants/edit/`}>
                                        <i className="icon-add"/>Добавить учеников
                                    </DropdownMenuOption>
                                </DropdownMenu>
                            </div>
                        </Catalog.Filter>
                        <Catalog.Catalog
                            className="users-list"
                            placeholder="Нет совпадающих учеников"
                            adaptive={false}
                            plain
                            renderItem={renderStudent}>
                            {participants}
                        </Catalog.Catalog>
                    </PageContent>
                </Catalog.Body>
            )}
        </Page>
    );
};

export default ParticipantsPage;
