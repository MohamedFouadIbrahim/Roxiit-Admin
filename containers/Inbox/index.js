import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import LazyContainer from '../../components/LazyContainer';
import { mainColor, secondColor } from '../../constants/Colors';
import { store } from '../../Store';
import CustomerList from './CustomerList';
import OrderList from './OrderList';
import UserList from './UserList';


class Inbox extends React.Component {



    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: 'white' }} >

                <CustomHeader
                    navigation={this.props.navigation}
                    title={"Inbox"}
                    leftComponent="drawer"
                />


                <InboxTabNavigator refs={refrence => this.InboxTabNavigator = refrence} screenProps={{
                    translate: this.props.translate,
                    navigation: this.props.navigation,
                    // badges_data:this.props.badges_data
                }} />

            </LazyContainer>
        )
    }
}

const renderBadge = (count) => {
    if (count > 0) {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: -10,
                    right: -20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 18,
                    height: 18,
                    borderRadius: 7,
                    backgroundColor: secondColor,
                }}>
                <FontedText style={{ color: 'white', fontSize: 12 }}>{count}</FontedText>
            </View>
        )
    }
}

const Tab = createMaterialTopTabNavigator()

const InboxTabNavigator = ({ screenProps: { translate, }, screenProps }) => {

    const badges_data = store.getState().badges.badges_data

    // const OrderListTab = () => <OrderList {...screenProps} />

    // const CustomerListTab = () => <CustomerList {...screenProps} />

    // const UserListTab = () => <UserList {...screenProps} />

    return (
        <Tab.Navigator
            lazy={true}
            tabBarOptions={{
                labelStyle: {
                    fontSize: 12,
                    color: mainColor,
                }, indicatorStyle: {
                    backgroundColor: secondColor,
                }, style: {
                    backgroundColor: 'white',
                }
            }}
            backBehavior='none'
        >
            <Tab.Screen name={'OrderList'} component={OrderList} initialParams={screenProps}
                options={{
                    tabBarLabel: (props) => (
                        <View>
                            <FontedText {...props} >
                                {translate('OrderInbox')}
                            </FontedText>
                            {renderBadge(badges_data['inboxordr'])}
                        </View>
                    )
                }}
            />
            <Tab.Screen name={'CustomerList'} component={CustomerList} initialParams={screenProps}
                options={{
                    tabBarLabel: (props) => (
                        <View>
                            <FontedText {...props} >
                                {translate('CustomerInbox')}
                            </FontedText>
                            {renderBadge(badges_data['inboxCustmr'])}
                        </View>
                    )

                }}
            />
            <Tab.Screen name={'UserList'} component={UserList} initialParams={screenProps}
                options={{
                    tabBarLabel: (props) => (
                        <View>
                            <FontedText {...props} >
                                {translate('UserInbox')}
                            </FontedText>
                            {renderBadge(badges_data['inboxUsr'])}
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    )
}


export default withLocalize(Inbox)