import React from "react";
import { View } from "react-native";
import LazyContainer from '../../components/LazyContainer';
import FontedText from '../../components/FontedText';
import { GetStatusHistory } from '../../services/ProductService';
import Timeline from 'react-native-timeline-feed';
import { mainColor, secondColor } from '../../constants/Colors';
import { largePagePadding } from '../../constants/Style';
class StatusHistory extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			timeline_data: []
		}
	}

	componentDidMount() {
		this.cancelFetchData = GetStatusHistory(this.props.ProductId, (res, formatted_data) => {
			this.setState({
				timeline_data: formatted_data
			})
		})
	}

	renderItem = ({ item, index }) => {

		return (

			<View>
				<FontedText style={{
					fontSize: 18,
					fontWeight: 'bold',
					bottom: 15
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
		if (this.state.timeline_data && this.state.timeline_data.length < 0) {
			return null
		}

		return (
			<LazyContainer style={{ flex: 1 }} >

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
						// backgroundColor: 'white',
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

export default StatusHistory