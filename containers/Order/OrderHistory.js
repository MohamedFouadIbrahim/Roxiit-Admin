import React, { Component } from 'react';
import { View } from 'react-native';
import Timeline from 'react-native-timeline-feed';
import CustomHeader from '../../components/CustomHeader';
import FontedText from '../../components/FontedText';
import LazyContainer from '../../components/LazyContainer';
import { secondColor } from '../../constants/Colors';
import { largePagePadding } from '../../constants/Style';
import { GetOrderHistory } from '../../services/OrdersService';

export default class OrderHistory extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.orderId = Id

		this.state = {
			timeline_data: [],
		}
	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
	}

	componentDidMount() {
		this.cancelFetchData = GetOrderHistory(this.orderId, (res, formatted_data) => {
			this.setState({
				timeline_data: formatted_data,
			})
		})
	}

	renderItem = ({ item, index }) => {

		return (

			<View>
				<FontedText style={{
					fontSize: 18,
					fontWeight: 'bold',
					// marginTop: -15
				}} > {item.title} </FontedText>

				<FontedText style={{ marginVertical: 5, marginLeft: 5 }} >
					{item.description}
				</FontedText>

				{item.Note ?
					<FontedText style={{
						marginLeft: 5, marginBottom: 5, fontSize: 18,
						fontWeight: 'bold'
					}} >
						{`Note : `}
						<FontedText style={{ fontSize: 15, fontWeight: '200' }} >
							{item.Note}
						</FontedText>
					</FontedText> : null}

			</View>
		)
	}
	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
				<CustomHeader
					navigation={this.props.navigation}
					title="TrackingHistory" />

				<Timeline
					innerCircleType='dot'
					showTime={false}
					separator={false}
					circleColor={secondColor}
					lineColor={secondColor}
					titleStyle={{
						// marginTop: -15,
						fontSize: 18,
					}}
					descriptionStyle={{
						marginTop: 3,
						marginBottom: 40,
					}}
					style={{
						backgroundColor: 'white',
						paddingHorizontal: 0,
						marginVertical: 0,
						paddingVertical: 0,
					}}
					flatListProps={{
						contentContainerStyle: {
							padding: largePagePadding,
						}
					}}
					renderDetail={this.renderItem}
					keyExtractor={item => String(item.Id)}
					data={this.state.timeline_data} />

				{/* <FlatList 
					keyExtractor={item => String(item.Id)}
					data={this.state.timeline_data}
					renderItem={this.renderItem}
					/> */}

			</LazyContainer>
		)
	}
}