/* TO BE DELETED */




import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, {  } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import FontedText from '../../components/FontedText/index.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';

export default class UserLoginHistory extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params?
		this.userId = Id

		this.state = {
			data: null,
			triggerRefresh: false,
		}
	}

	renderItem = ({ item }) => {
		return (
			<View 
				style={{
					flex: 1,
					flexDirection: "row",
					paddingVertical: 15,
					paddingHorizontal: 40,
					borderBottomColor: "#EEE",
					borderBottomWidth: .3,
					marginVertical: 2,
					backgroundColor: 'white',
				}}>
				<View style={{ flex: 1 }}>
					<FontedText style={{ fontWeight: "500", marginBottom: 5, fontSize: 18, color: "#140F26" }}>{`${item.SessionSource.Name} . ${item.Country.Name}, ${item.City}`}</FontedText>
					<FontedText style={{ color: "#6C7B8A" }}>{`${item.IP} . ${item.ExpirationDate}`}</FontedText>
				</View>
			</View>
		)
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title="Sessions" />

				<RemoteDataContainer
					url={"Sessions"}
					params={`userId=${this.userId}`}
					pagination={false}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />
			</LazyContainer>
		)
	}
}