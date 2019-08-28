import React from 'react';
import '../sass/index.scss';
import { BrowserRouter as Router, Route, Link, Prompt } from "react-router-dom";
import Header from "./Header";

export default class App extends React.Component {
    state = {opened: false};

    onMenuButtonClick = () => {this.setState((state) => ({opened: !state.opened}));};

    render() {
        return (
            <div className="app">
                <Router>
                    <Header onMenuButtonClick={this.onMenuButtonClick}/>
                    <main className={`layout ${this.state.opened ? 'drawer-opened' : ''}`}>
                        <div className="layout__drawer">
                            Мои курсы
                        </div>
                        <Route exact path="/" render={() => <div className="layout__content">Home</div>}/>
                        <Route path="/about" render={() => <div className="layout__content">About</div>}/>
                        <Route path="/topics" render={() => <div className="layout__content">Topics</div>}/>
                    </main>
                    <footer>Footer</footer>
                </Router>
            </div>
        );
    }
}
