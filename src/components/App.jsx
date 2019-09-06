import React from 'react';
import '../sass/index.scss';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import Shop from "./shop/Shop";

export default class App extends React.Component {
    state = {opened: false};

    onMenuButtonClick = () => {this.setState((state) => ({opened: !state.opened}));};

    render() {
        return (
            <Router>
                <div className="app">
                    <Header onMenuButtonClick={this.onMenuButtonClick}/>
                    <div className={`layout ${this.state.opened ? 'sidebar-opened' : ''}`}>
                        <SideBar onMenuClose={this.onMenuButtonClick}/>
                        <Route exact path="/" render={() => <div className="layout__content">Home</div>}/>
                        <Switch>
                            <Route path="/shop" component={Shop}/>
                            <Route path="/:section" render={(props) => <div className="layout__content">{props.match.params.section}</div>}/>
                        </Switch>
                    </div>
                </div>
                {/*<footer>Footer</footer>*/}
            </Router>
        );
    }
}
