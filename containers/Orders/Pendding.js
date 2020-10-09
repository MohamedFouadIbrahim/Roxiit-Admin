import React from 'react';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import ItemSeparator from '../../components/ItemSeparator';
import { connect } from 'react-redux';
import { loadProductPenddingSoundAndPlay } from '../../utils/Sounds';

class PenndingOrders extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            triggerRefresh: false
        }
    }

    reload = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }
    componentDidMount = () => {
        this.fetchPenddingOrders()
    }

    componentDidUpdate(prevProps) {

        //when navigating to another tab
        if (this.props.isFocused == false) {
            clearInterval(global.penddingIntervalId)
            global.penddingIntervalId = null
        }

        //When back from another BottomNavigationTab (handled from index)
        if ((prevProps.refreshPennding !== this.props.refreshPennding) && this.props.isFocused == true) {
            this.fetchPenddingOrders()
        }

        //When back from another tab
        if ((prevProps.isFocused !== this.props.isFocused) && this.props.isFocused == true) {
            this.fetchPenddingOrders()
        }
    }


    fetchPenddingOrders = () => {
        const { AutoRefreshOrderList, PlaySoundRefreshhOrderList } = this.props

        if (AutoRefreshOrderList.Value) {
            clearInterval(global.penddingIntervalId)
            global.penddingIntervalId = null

            //update every 15 sec
            let penddingIntervalId = setInterval(() => {
                this.RefreshPenddingOrders(PlaySoundRefreshhOrderList.Value)
            }, 15000)
            global.penddingIntervalId = penddingIntervalId
        }
    }


    RefreshPenddingOrders = (playSound) => {
        this.reload()

        if (this.state.data.length >= 1 && playSound == true && !this.props.mutePenddingSound) {
            loadProductPenddingSoundAndPlay()
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
                url={isDriverMode ? 'Orders/Driver/Pending' : 'Orders/Pending'}
                params={params}
                cacheName={isDriverMode ? 'ordersPendingD' : "ordersPending"}
                onDataFetched={(data) => {
                    this.setState({ data })
                }}
                updatedData={this.state.data}
                triggerRefresh={triggerRefresh || this.state.triggerRefresh}
                keyExtractor={({ Id }) => `${Id}`}
                ItemSeparatorComponent={() => <ItemSeparator />}
                renderItem={renderItem} />
        )
    }
}


const mapStateToProps = ({
    login: {
        mutePenddingSound
    },
    runtime_config: {
        runtime_config: {
            screens: {
                Admin_Page_0_0:
                {
                    AutoRefreshOrderList,
                    PlaySoundRefreshhOrderList
                }
            },
        },
    },
}) => ({
    mutePenddingSound,
    AutoRefreshOrderList,
    PlaySoundRefreshhOrderList
})


export default connect(mapStateToProps)(PenndingOrders)