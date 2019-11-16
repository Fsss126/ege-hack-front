import {CSSTransition} from "react-transition-group";
import ReactDOM from 'react-dom';

//hack to get context because lib doesn't export it properly and import doesn't work
// const TransitionGroupContext = Transition.contextType;
//
// const getClassNames = (classNames, type) => {
//     const isStringClassNames = typeof classNames === 'string';
//     const prefix = isStringClassNames && classNames
//         ? `${classNames}-`
//         : '';
//
//     let baseClassName = isStringClassNames
//         ? `${prefix}${type}`
//         : classNames[type];
//
//     let activeClassName = isStringClassNames
//         ? `${baseClassName}-active`
//         : classNames[`${type}Active`];
//
//     let doneClassName = isStringClassNames
//         ? `${baseClassName}-done`
//         : classNames[`${type}Done`];
//
//     return {
//         baseClassName,
//         activeClassName,
//         doneClassName
//     };
// };
//
// function getClassName(classNames, type, phase) {
//     // console.log(arguments);
//     let className = getClassNames(classNames, type)[`${phase}ClassName`];
//
//     if (type === 'appear' && phase === 'done') {
//         className += ` ${getClassNames(classNames, 'enter').doneClassName}`;
//     }
//
//     return className;
// }
//
// const State = {
//     entering: 'entering',
//     entered:  'entered',
//     exiting:  'exiting',
//     exited: 'exited'
// };
//
// const StableCSSTransition = ({classNames='', appear, children, ...props}) => {
//     const isMounting = !useIsMounted();
//     const context = React.useContext(TransitionGroupContext);
//         const appearingRef = React.useRef(context ? context.isMounting : appear);
//     const prevStateRef = React.useRef(null);
//     const appliedClassNamesRef = React.useRef('');
//     return (
//         <Transition
//             // mountOnEnter
//             // unmountOnExit
//             {...props}
//             appear={appear}>
//             {(state) => {
//                 const appearing = appearingRef.current;
//                 const prevState = prevStateRef.current;
//                 const animateMounting = context != null;
//
//                 console.log(prevState, '->', state);
//                 let className = appliedClassNamesRef.current;
//                 if (state === State.exited) {
//                     if (prevState !== State.exiting) {
//                         if (appearing) {
//                             className = getClassName(classNames, 'appear', 'base');
//                         }
//                         else if (prevState !== null || animateMounting) {
//                             className = getClassName(classNames, 'enter', 'base');
//                         }
//                     }
//                     else {
//                         className = getClassName(classNames, 'exit', 'done');
//                     }
//                 }
//                 else if (state === State.exiting) {
//                     className = getClassName(classNames, 'exit', 'active');
//                 }
//                 else if (state === State.entered) {
//                     if (prevState === State.entered) {
//                         className = getClassName(classNames, 'exit', 'base');
//                     }
//                     else if (prevState !== null || animateMounting) {
//                         className = getClassName(classNames, appearing ? 'appear' : 'enter', 'done');
//                     }
//                     appearingRef.current = false;
//                 }
//                 else if (state === State.entering || animateMounting) {
//                     className = getClassName(classNames, appearing ? 'appear' : 'enter', 'active');
//                 }
//                 prevStateRef.current = state;
//                 appliedClassNamesRef.current = className;
//                 console.log(className);
//                 const child = React.Children.only(children);
//                 return React.cloneElement(child, {
//                     className: child.props.className ? `${child.props.className} ${className}` : className
//                 });
//             }}
//         </Transition>
//     );
// };

class StableCSSTransition extends CSSTransition {
    type = null;
    phase = null;

    addClass(node, type, phase) {
        super.addClass(node, type, phase);
        this.type = type;
        this.phase = phase;
    }

    componentDidUpdate() {
        if (this.appliedClasses[this.type] && this.appliedClasses[this.type][this.phase])
            super.addClass(ReactDOM.findDOMNode(this), this.type, this.phase);
    }
}

export default StableCSSTransition;
