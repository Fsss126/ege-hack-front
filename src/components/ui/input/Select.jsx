import React, {Component} from 'react';
import SelectInput, { components } from 'react-select';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ScrollBars from "../ScrollBars";
import {getPlaceholder} from "./Input";

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

// class Menu extends Component {
//     componentDidMount() {
//         //needed to the select to scroll the list to the selected option
//         this.props.innerRef(this.scrollBar.view);
//     }
//
//     getStyles = (elementName, props) => {
//         console.log(props);
//         const {style: scrollbarStyle} = props;
//         const {getStyles} = this.props;
//         const menuListStyle = getStyles(elementName, props);
//         console.log(scrollbarStyle, menuListStyle);
//         return {...scrollbarStyle, ...menuListStyle};
//     };
//
//     render() {
//         return (
//             <ScrollBars
//                 autoHeight
//                 hideTracksWhenNotNeeded
//                 ref={ref => { this.scrollBar = ref; }}
//                 autoHeightMax={this.props.maxHeight}
//                 tagName={components.Menu} {...this.props} getStyles={this.getStyles}>
//                 {this.props.children}
//             </ScrollBars>
//         );
//     }
//
//     static propTypes = {
//         maxHeight: PropTypes.number.isRequired,
//         children: PropTypes.node.isRequired,
//         innerRef: PropTypes.func.isRequired
//     }
// }

// class MenuList extends Component {
//     componentDidMount() {
//         //needed to the select to scroll the list to the selected option
//         this.props.innerRef(this.scrollBar.view);
//     }
//
//     render() {
//         return (
//             <ScrollBars
//                 autoHeight
//                 hideTracksWhenNotNeeded
//                 ref={ref => { this.scrollBar = ref; }}
//                 renderView={props => {
//                     console.log(props);
//                     const {style: scrollbarStyle} = props;
//                     const {getStyles, innerRef, ...menuListProps} = this.props;
//                     const getMergedStyles = (...args) => {
//                         const menuListStyle = getStyles(...args);
//                         console.log(...args, menuListStyle);
//                         return {...menuListStyle, ...scrollbarStyle};
//                     };
//                     return <components.MenuList {...menuListProps} getStyles={getMergedStyles} {...props}/>;
//                 }}
//                 autoHeightMax={this.props.maxHeight}>
//                 {this.props.children}
//             </ScrollBars>
//         );
//     }
//
//     static propTypes = {
//         maxHeight: PropTypes.number.isRequired,
//         children: PropTypes.node.isRequired,
//         innerRef: PropTypes.func.isRequired
//     }
// }

class MenuList extends Component {
    componentDidMount() {
        //needed to the select to scroll the list to the selected option
        this.props.innerRef(this.scrollBar.view);
    }

    render() {
        const {innerRef, ...props} = this.props;
        return (
            <ScrollBars
                autoHeight
                hideTracksWhenNotNeeded
                ref={ref => { this.scrollBar = ref; }}
                autoHeightMax={this.props.maxHeight}>
                <components.MenuList {...props}>
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
        const {name, options, value, components, isClearable, isSearchable, placeholder, required, ...selectProps} = this.props;
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
                menuShouldScrollIntoView
                captureMenuScroll={false}
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
                placeholder={getPlaceholder(placeholder, required)}
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
    };

    static defaultProps = {
        isClearable: true,
        isSearchable: true
    }
}
