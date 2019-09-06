import React from 'react';

export default class CourseOverview extends React.Component {
    render() {
        const {match} = this.props;
        return (
            <div>
                Course {match.params.id}
            </div>
        )
    }
}
