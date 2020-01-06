import React, {Component} from 'react';
import SelectInput, { components } from 'react-select';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ScrollBars from "../ScrollBars";

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <i className="icon-angle"/>
    </components.DropdownIndicator>
);

const SelectContainer = ({ children, selectProps, hasValue, setValue, ...props }) => (
    <div className="select">
        <components.SelectContainer
            selectProps={{...selectProps, isClearable: false}}
            hasValue={hasValue}
            setValue={setValue}
            {...props}>
            {children}
        </components.SelectContainer>
        {selectProps.isClearable && (
            <div className={hasValue ? 'select__clear-btn' : 'select__clear-btn select__clear-btn-hidden'} onClick={() => {setValue(null);}}>
                <i className="icon-close"/>
            </div>
        )}
    </div>
);


export const Option = ({content, ...props}) => (
    <components.Option {...props}>
        {content ? content : props.label}
    </components.Option>
);

Option.propTypes = {
    content: PropTypes.node,
    label: PropTypes.node
};

class MenuList extends Component {
    componentDidMount() {
        //needed to the select to scroll the list to the selected option
        this.props.innerRef(this.scrollBar.view);
    }

    render() {
        return (
            <ScrollBars
                autoHeight
                hideTracksWhenNotNeeded
                ref={ref => { this.scrollBar = ref; }}
                autoHeightMax={this.props.maxHeight}>
                <components.MenuList {...this.props}>
                    {this.props.children}
                </components.MenuList>
            </ScrollBars>
        );
    }

    static propTypes = {
        maxHeight: PropTypes.number.isRequired,
        children: PropTypes.node.isRequired,
        innerRef: PropTypes.func.isRequired
    }
}

export class Select extends React.PureComponent {
    onChange = (option) => {
        this.props.callback(option ? option.value : null, this.props.name);
    };

    render() {
        const {name, options, value, components, selectProps, isClearable=true, isSearchable=true, placeholder} = this.props;
        return (
            <SelectInput
                name={name}
                options={options}
                maxMenuHeight={200}
                value={_.find(options, {value: value}) || null}
                className='select__container' classNamePrefix='select'
                onChange={this.onChange}
                menuPlacement="auto"
                noOptionsMessage={() => 'Нет опций'}
                components={
                    components ? ({
                        Option,
                        MenuList,
                        DropdownIndicator,
                        SelectContainer,
                        ...components
                    }) : ({
                        Option,
                        MenuList,
                        DropdownIndicator,
                        SelectContainer,
                    })
                }
                styles={{
                    //removes default styles from option elements
                    option: () => ({})
                }}
                isClearable={isClearable}
                isSearchable={isSearchable}
                placeholder={placeholder}
                {...selectProps}
            />
        );
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any,
            label: PropTypes.any
        })).isRequired,
        callback: PropTypes.func.isRequired,
        value: PropTypes.any,
        selectProps: PropTypes.object,
        components: PropTypes.object
    }
}
