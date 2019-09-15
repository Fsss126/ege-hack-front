import { Sticky} from 'react-sticky';

export default class StickyElement extends Sticky{
    componentDidMount() {
        window.dispatchEvent(new Event('scroll'));
    }
}
