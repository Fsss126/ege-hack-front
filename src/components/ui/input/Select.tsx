/* tslint:disable:max-classes-per-file */
import {assignRef} from 'definitions/helpers';
import _ from 'lodash';
import React, {Component, useCallback} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import SelectInput, {
  components,
  IndicatorProps,
  MenuListComponentProps,
  Props as SelectInputProps,
} from 'react-select';
import {ContainerProps} from 'react-select/src/components/containers';
import {OptionsType, ValueType} from 'react-select/src/types';

import ScrollBars from '../ScrollBars';
import {getPlaceholder, InputChangeHandler} from './Input';
import {InputContainer} from './InputContainer';

export type OptionShape<V = any, L extends React.ReactNode = string> = {
  label: L;
  value: V;
};

const DropdownIndicator = <T extends OptionShape = OptionShape>(
  props: IndicatorProps<T>,
): React.ReactElement => (
  <components.DropdownIndicator {...props}>
    <i className="icon-angle-down" />
  </components.DropdownIndicator>
);

const SelectContainer = <T extends OptionShape = OptionShape>(
  props: ContainerProps<T>,
): React.ReactElement => {
  const {children, selectProps, hasValue, setValue, ...rest} = props;
  const onClear = useCallback(() => {
    setValue(null, 'deselect-option');
  }, [setValue]);

  return (
    <div className="select">
      <components.SelectContainer
        selectProps={{...selectProps, isClearable: false}}
        hasValue={hasValue}
        setValue={setValue}
        {...rest}
      >
        {children}
      </components.SelectContainer>
      {selectProps.isClearable && (
        <div
          className={
            hasValue
              ? 'select__clear-btn'
              : 'select__clear-btn select__clear-btn-hidden'
          }
          onClick={onClear}
        >
          <i className="icon-close" />
        </div>
      )}
    </div>
  );
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

// Scrollbars.prototype.
class MenuList<T extends OptionShape = OptionShape> extends Component<
  MenuListComponentProps<T>
> {
  scrollBar = React.createRef<Scrollbars>();

  componentDidMount(): void {
    // needed to the select to scroll the list to the selected option
    if (this.scrollBar.current) {
      assignRef(this.props.innerRef, this.scrollBar.current.view);
    }
  }

  render(): React.ReactElement {
    const {...props} = this.props;
    delete props.innerRef;
    return (
      <ScrollBars
        autoHeight
        hideTracksWhenNotNeeded
        ref={this.scrollBar}
        autoHeightMax={this.props.maxHeight}
      >
        <components.MenuList innerRef={null} {...props}>
          {this.props.children}
        </components.MenuList>
      </ScrollBars>
    );
  }
}

export type SelectProps<V = any, L extends React.ReactNode = string> = {
  value?: V;
  onChange: InputChangeHandler<V | undefined>;
  options: OptionsType<OptionShape<V, L>>;
  name: string;
  withContainer?: boolean;
} & Omit<SelectInputProps<OptionShape<V, L>>, 'value' | 'onChange' | 'name'>;

export class Select<
  V = any,
  L extends React.ReactNode = string
> extends React.PureComponent<SelectProps<V, L>> {
  static defaultProps = {
    isClearable: true,
    isSearchable: true,
    withContainer: true,
  };

  onChange = (option: ValueType<OptionShape<V, L>>): void => {
    this.props.onChange(
      option && 'value' in option ? option.value : null,
      this.props.name,
    );
  };

  private renderNoOptions = () => 'Нет опций';

  render(): React.ReactElement {
    const {
      name,
      options,
      value,
      components,
      isClearable,
      isSearchable,
      placeholder,
      required,
      onChange,
      withContainer,
      ...selectProps
    } = this.props;

    const formattedPlaceholder = getPlaceholder(placeholder, required);

    const select = (
      <SelectInput<OptionShape<V, L>>
        name={name}
        options={options}
        maxMenuHeight={200}
        value={_.find(options, {value: value as any})}
        className="select__container"
        classNamePrefix="select"
        onChange={this.onChange}
        menuPlacement="auto"
        noOptionsMessage={this.renderNoOptions}
        menuShouldScrollIntoView
        captureMenuScroll={false}
        components={
          components
            ? {
                MenuList,
                DropdownIndicator,
                SelectContainer,
                ...components,
              }
            : {
                MenuList,
                DropdownIndicator,
                SelectContainer,
              }
        }
        styles={{
          // removes default styles from option elements
          option: () => ({}),
        }}
        isClearable={isClearable}
        isSearchable={isSearchable}
        placeholder={withContainer ? 'Не выбрано' : formattedPlaceholder}
        {...selectProps}
      />
    );

    return withContainer ? (
      <InputContainer placeholder={placeholder} required={required}>
        {select}
      </InputContainer>
    ) : (
      select
    );
  }
}
