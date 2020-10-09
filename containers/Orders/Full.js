import React from 'react';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import ItemSeparator from '../../components/ItemSeparator';

class FullOrders extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    render() {

        const { params, renderItem, triggerRefresh } = this.props

        // const { isFocused } = this.props.navigation

        // if (!isFocused()) {
        //     return (null)
        // }
        return (
            <RemoteDataContainer
                url={'Orders'}
                params={params}
                cacheName={"orders"}
                onDataFetched={(data) => {
                    this.setState({ data })
                }}
                updatedData={this.state.data}
                triggerRefresh={triggerRefresh}
                keyExtractor={({ Id }) => `${Id}`}
                ItemSeparatorComponent={() => <ItemSeparator />}
                renderItem={renderItem} />
        )
    }
}




export default FullOrders