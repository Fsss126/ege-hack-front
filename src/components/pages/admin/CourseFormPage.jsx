import React from "react";
import Page, {PageContent} from "../../Page";
import Input from "../../ui/Input";

const INITIAL_FORM_DATA = {
    name: null,
    subject_id: null,
    teacher_id: null,
    image: null,
    price: null,
    date_start: null,
    date_end: null,
    online: false
};

const SELECT_PROPS = {isClearable: false, placeholder: 'Предмет'};

const CourseFormPage = (props) => {
    const {location} = props;
    const [formData, setFormData] = React.useState(INITIAL_FORM_DATA);
    const {name, subject_id, teacher_id, image, price, date_start, date_end, online} = formData;
    const onInputChange = React.useCallback((value, name) => {
        setFormData(state => ({...state, [name]: value}));
    }, []);
    return (
        <Page
            className="course-form-page"
            title="Магазин курсов"
            location={location}>
            <PageContent>
                <div className="layout__content-block">
                    <form className="course-page">
                        <input type="text" required placeholder="Предмет"/>
                        <Input.Select
                            name="subject"
                            placeholder="Предмет"
                            options={options}
                            value={subject_id}
                            selectProps={selectProps}
                            callback={onInputChange}/>
                        <Input.CheckBox
                            name="online"
                            value={online}
                            label="Онлайн"
                            onChange={onInputChange}/>
                    </form>
                </div>
            </PageContent>
        </Page>
    )
};

export default CourseFormPage;
