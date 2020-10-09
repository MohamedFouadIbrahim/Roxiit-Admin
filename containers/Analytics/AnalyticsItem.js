import React, { PureComponent } from 'react'
import { View } from 'react-native'
import PieChart from '../../components/PieChart';

export default class AnalyticsItem extends PureComponent {
	render() {
		const { item } = this.props
		const { Data, Title, Type } = item

		switch (Type) {
			case 1:
				return (
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<PieChart
							values={Data.map(item => item.X)}
							labels={Data.map(item => item.Lable)}
							title={Title} />
					</View>
				)
			default:
				return null
		}
	}
}