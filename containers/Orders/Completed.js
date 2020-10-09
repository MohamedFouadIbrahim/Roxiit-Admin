import React from 'react';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import ItemSeparator from '../../components/ItemSeparator';

class CompletedOrders extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    render() {
        const { params, renderItem, triggerRefresh, isDriverMode } = this.props

        // const { isFocused } = this.props.navigation

        // if (!isFocused()) {
        //     return (null)
        // }
        return (
            <RemoteDataContainer
                url={isDriverMode ? 'Orders/Driver/Completed' : 'Orders/Completed'}
                params={params}
                cacheName={isDriverMode ? 'ordersCompletedD˝' : 'ordersCompleted'}
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




export default CompletedOrders