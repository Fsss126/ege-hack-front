import React, {Component} from 'react';
import SelectInput, { components } from 'react-select';
import {Scrollbars} from 'react-custom-scrollbars';
import _ from 'lodash';
import PropTypes from 'prop-types';

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <i className="icon-angle"/>
    </components.DropdownIndicator>
);

const SelectContainer = ({ children, selectProps, setValue, ...props }) => (
    <div className="select">
        <components.SelectContainer selectProps={{...selectProps, isClearable: false}} setValue={setValue} {...props}>
            {children}
        </components.SelectContainer>
        {selectProps.isClearable && (
            <div className="select__clear-btn" onClick={() => {setValue(null);}}>
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

export class MenuList extends Component {
    componentDidMount() {
        //needed to the select to scroll the list to the selected option
        this.props.innerRef(this.scrollBar.view);
    }

    renderTrackVertical = props => (<div {...props} className="track-vertical"/>);

    renderThumbHorizontal = props => (<div {...props} className="thumb-vertical"/>);

    render() {
        return (
            <Scrollbars
                autoHeight
                renderTrackVertical={this.renderTrackVertical}
                renderThumbVertical={this.renderThumbHorizontal}
                hideTracksWhenNotNeeded
                ref={ref => { this.scrollBar = ref; }}
                autoHeightMax={this.props.maxHeight}>
                <div className='select__list'>
                    {this.props.children}
                </div>
            </Scrollbars>
        );
    }

    static propTypes = {
        maxHeight: PropTypes.number.isRequired,
        children: PropTypes.node.isRequired,
        innerRef: PropTypes.func.isRequired
    }
}

//TODO: try react virtualized select
export default class Select extends React.PureComponent {
    onChange = (option) => {
        this.props.callback(option ? option.value : null, this.props.name);
    };

    render() {
        console.log(this.props.value, _.find(this.props.options, {value: this.props.value}));
        return (
            <SelectInput
                name={this.props.name}
                options={this.props.options}
                maxMenuHeight={200}
                value={_.find(this.props.options, {value: this.props.value}) || null}
                className='select__container' classNamePrefix='select'
                onChange={this.onChange}
                menuPlacement="auto"
                components={
                    this.props.components ? ({
                        Option,
                        MenuList,
                        DropdownIndicator,
                        SelectContainer,
                        ...this.props.components
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
                {...this.props.selectProps}
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
