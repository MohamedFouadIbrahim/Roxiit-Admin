import React, { Component } from "react";
import LazyContainer from "../../components/LazyContainer";
import RemoteDataContainer from "../../components/RemoteDataContainer/index.js";
import ItemSeparator from "../../components/ItemSeparator/index.js";
import { withLocalize } from "react-localize-redux";
import CustomHeader from '../../components/CustomHeader/index.js';
import PayMentMethodItem from "./PayMentMethodItem";

class PaymentMethods extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			triggerRefresh: false,
		};
		if (this.props.route.params && this.props.route.params?.FormGoLive) {

			this.FormGoLive = true

		} else {
			this.FormGoLive = false
		}
	}

	onPressItem = (item) => {
		const { Id, IsActive } = item
		this.props.navigation.navigate("PaymentConfig", {
			Id,
			onChildChange: this.onChildChange,
			ShowProvider: Id == 2 ? true : false,
			ShowDeleteButton: IsActive
		});
	}

	renderItem = ({ item }) => {
		return (
			<PayMentMethodItem
				item={item}
				onPress={this.onPressItem}
			/>
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh });
	};

	render() {

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent={this.FormGoLive == true ? 'back' : "drawer"}
					navigation={this.props.navigation}
					title="Payment"
				/>

				<RemoteDataContainer
					url={"PaymentMethods"}
					cacheName={"PaymentMethods"}
					onDataFetched={data => {
						this.setState({ data });
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem}
				/>

			</LazyContainer>
		);
	}
}

export default withLocalize(PaymentMethods);