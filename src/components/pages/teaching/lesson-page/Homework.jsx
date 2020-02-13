import React, {useCallback, useState} from "react";
import classnames from 'classnames';
import ListItem from "components/common/ListItem";
import CoverImage from "components/common/CoverImage";
import {File} from "components/ui/input/file-input";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import {downloadFile} from "definitions/helpers";
import HomeworkForm from "./HomeworkForm";

const Homework = (props) => {
    const {homework, ...renderProps} = props;
    const {
        files,
        mark,
        pupil: {
            id,
            vk_info: {
                full_name,
                photo,
            }
        }
    } = homework;
    const [{file_name: name, downloadName, file_link: url}] = files || [{}];

    const [isAssessing, setIsAssessing] = useState(false);
    // files.map((file, i) => (
    //     <File file={file} key={i}/>
    // )
    const downloadCallback = useCallback(() => {
        if (url)
            downloadFile(url, downloadName || name);
    }, [url, name, downloadName]);
    const assessCallback = useCallback(() => {
        setIsAssessing(true);
    }, []);
    const cancelAssessCallback = useCallback(() => {
        setIsAssessing(false);
    }, []);
    return (
        <ListItem
            key={id}
            truncate={false}
            item={homework}
            className={classnames('user', 'homework', {
                'homework--assessing': isAssessing
            })}
            title={full_name}
            selectable={false}
            preview={(
                <CoverImage src={photo} className="course__cover" round/>
            )}
            description={files ? (mark ? <span>Оценка: <span className="badge">{mark}</span></span> : 'Нет оценки') :  'Нет работы'}
            action={files && (
                <DropdownMenu
                    content={<DropdownIconButton className="icon-ellipsis"/>}>
                    <DropdownMenuOption onClick={downloadCallback}>
                        <i className="icon-download"/>Скачать работу
                    </DropdownMenuOption>
                    <DropdownMenuOption onClick={assessCallback}>
                        <i className="far fa-edit"/>{mark ? 'Изменить оценку' : 'Оценить'}
                    </DropdownMenuOption>
                </DropdownMenu>
            )}
            {...renderProps}>
            {isAssessing && (
                <HomeworkForm
                    homework={homework}
                    cancelAssess={cancelAssessCallback}/>
            )}
        </ListItem>
    );
};

export default Homework;
