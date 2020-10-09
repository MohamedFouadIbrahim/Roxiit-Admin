import React, { Component } from 'react'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import { GET } from "../../utils/Network"
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { processPressedNotification } from '../../utils/Notifications.js';
import NotificationItem from './NotificationItem.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class Notifications extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			triggerRefresh: false,
		}
	}

	readAllNotifications = () => {
		GET('Notification/ReadAll', res => {
			this.onChildChange()
		}, err => {
		})
	}

	readNotification = (NotificationId) => {
		GET(`Notification/Read?notificationId=${NotificationId}`, res => {
			// alert(JSON.stringify(res))
			var data = this.state.data;
			data.map((notification) => {
				if(notification.NotificationId == NotificationId) {
					notification.ReadDate = this.getCurrentDate()
				}
			})
			this.setState({ data })
		}, err => {
		})
	}
	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}
	getCurrentDate = () => {
		var today = new Date();
		var hr = today.getHours();
		var min = today.getMinutes();
		var sec = today.getSeconds();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!

		var yyyy = today.getFullYear();
		if (dd < 10) {
		dd = '0' + dd;
		} 
		if (mm < 10) {
		mm = '0' + mm;
		} 
		// 2019-06-20T16:56:19.967
		// 2019-06-20T10:8:52
		var standard = yyyy + '-' + mm + '-' + dd + 'T' + hr + ':' + min + ':' + sec
		return standard
	}

	onPressNotification = (notification) => {
		processPressedNotification(notification, this.props.navigation, false)
	}

	onPressItem = (item) => {
		if (!item.ReadDate) {
			this.readNotification(item.NotificationId)
		}

		this.onPressNotification(item)
	}

	renderItem = ({ item }) => {
		return (
			<NotificationItem
				item={item}
				onPress={this.onPressItem}
				style={{
					paddingVertical: 10,
					flexDirection: 'row',
					justifyContent: 'space-between',
					backgroundColor: item.ReadDate ? '#FFF' : '#eff4fc',
				}} />
		)
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					rightComponent={<CustomTouchable style={{ flex: 1, justifyContent: "center", alignItems: "center" }} onPress={this.readAllNotifications}><SimpleLineIcons size={secondHeaderIconSize} color="#FFF" name="eye" /></CustomTouchable>}
					title="NOTIFICATIONS" />

				<RemoteDataContainer
					url={"Notifications"}
					cacheName={"notifications"}
					initalData={[]}
					triggerRefresh={this.state.triggerRefresh}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					keyExtractor={({ NotificationId }) => NotificationId.toString()}
					renderItem={this.renderItem} />
			</LazyContainer>
		)
	}
}