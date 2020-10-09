import React, { Component } from "react";
import { withLocalize } from "react-localize-redux";
import PageConfigType from '../../containers/Pages/PageConfigType';


class PageSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            didFetchData: false
        };
        this.pageId = this.props.route.params?.Id
        this.pageName = this.props.route.params?.Name
    }

    render() {

        return (<PageConfigType navigation={this.props.navigation} pageId={this.pageId} pageName={this.pageName} />);
    }
}

export default withLocalize(PageSetting);
