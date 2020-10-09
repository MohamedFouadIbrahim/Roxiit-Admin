import React, { PureComponent } from 'react'
import { View } from "react-native";
import {
	VictoryPie,
	VictoryChart,
	VictoryAxis,
	VictoryLabel,
	VictoryContainer
} from "victory-native";
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { screenWidth } from '../../constants/Metrics';
import FontedText from '../../components/FontedText';

const padAngle = 7
const pieColors = [
	["#F74F62", "#FD43B3"],
	["#906BFF", "#695CFF"],
	["#2ACAE6", "#17D1A5"],
	["#E8CBC0", "#636FA4"],
	["#3B4371", "#F3904F"],
	["#DCE35B", "#45B649"],
	["#c0c0aa", "#1cefff"],
	["#C5796D", "#DBE6F6"],
	["#3494E6", "#EC6EAD"],
	["#67B26F", "#4ca2cd"],
]

class PieChart extends PureComponent {
	constructor(props, context) {
		super(props, context);

		const { values, labels } = this.props

		this.state = {
			chartWidth: screenWidth * 0.9,
			chartMargin: screenWidth * 0.05,
			pie: this.generatePieDataArray(values, labels),
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.values !== prevProps.values) {
			const { values, labels } = this.props

			this.setState({
				pie: this.generatePieDataArray(values, labels),
			})
		}
	}

	generatePieDataArray = (values, labels = []) => {
		let colorIndex = 0

		return (
			values.map((item, index) => {
				if (colorIndex === pieColors.length) {
					colorIndex = 0
				}

				const pieItem = {
					id: index,
					percentage: item,
					label: labels[index],
					X: values[index],
					gradientStart: pieColors[colorIndex][0],
					gradientEnd: pieColors[colorIndex][1],
				}

				colorIndex++

				return pieItem
			})
		)
	}

	percentToDeg = (percentage) => {
		return (percentage * 360) / 100
	}

	renderPieDefs = () => {
		return (
			<Defs>
				<LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<Stop offset="0%" stopColor="black" stopOpacity="0" />
					<Stop offset="50%" stopColor="black" stopOpacity="0.5" />
					<Stop offset="100%" stopColor="black" stopOpacity="0" />
				</LinearGradient>

				{
					this.state.pie.map((item, index) => (
						<LinearGradient key={index} id={`rad${index + 1}`} x1="0%" y1="0%" x2="0%" y2="100%">
							<Stop offset="0%" stopColor={item.gradientStart} stopOpacity="1.0" />
							<Stop offset="100%" stopColor={item.gradientEnd} stopOpacity="1.0" />
						</LinearGradient>
					))
				}
			</Defs>
		)
	}

	renderPieCharts = () => {
		let pieData = []
		let nextStartPercent = 0
		let accPercent = 0

		this.state.pie.forEach((item, index) => {
			pieData.unshift({
				fill: `url(#rad${index + 1})`,
				data: [{ x: `${parseInt(item.percentage)}%`, y: item.percentage }],
				startAngle: nextStartPercent === 0 ? this.percentToDeg(-padAngle) : nextStartPercent,
				endAngle: this.percentToDeg(item.percentage + accPercent),
			})

			accPercent += item.percentage
			nextStartPercent = this.percentToDeg(accPercent - padAngle)
		})

		const emptyPercentage = 100 - accPercent

		this.availablePercentage = emptyPercentage

		if (emptyPercentage > 0) {
			pieData.unshift({
				fill: 'url(#gradient)',
				data: [{ x: `${Math.ceil(emptyPercentage)}%`, y: emptyPercentage }],
				startAngle: this.percentToDeg(accPercent - 5),
				endAngle: this.percentToDeg(100 + 5),
			})
		}

		const styles = this.getStyles();

		return (
			pieData.map((item, index) => (
				<VictoryPie
					key={index}
					standalone={true}
					name="same_pie"
					width={this.state.chartWidth}
					style={{
						parent: {
						},
						data: {
							fill: item.fill
						},
						labels: styles.pieLabels
					}}
					radius={80}
					innerRadius={130}
					//labelRadius={90}
					cornerRadius={30}
					startAngle={item.startAngle}
					endAngle={item.endAngle}
					data={item.data}
				/>
			))
		)
	}

	renderPieLabel = (item, index) => {
		const { gradientStart, label, X } = item

		return (
			<View
				key={index}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginRight: 15,
					marginBottom: 10,
				}}>
				<View
					style={{
						width: 25,
						height: 25,
						borderRadius: 5,
						backgroundColor: gradientStart,
					}} />

				<FontedText style={{ color: '#444444', marginLeft: 5, }}>{label}</FontedText>
			</View>
		)
	}

	renderPieLabels = () => {
		return (
			<View
				style={{
					flexWrap: 'wrap',
					marginTop: 5,
					marginHorizontal: 25,
				}}>
				{this.state.pie.map(this.renderPieLabel)}
			</View>
		)
	}

	render() {
		const styles = this.getStyles();
		const {
			title
		} = this.props

		return (
			<View
				onLayout={(event) => {
					const { width, height } = event.nativeEvent.layout

					this.setState({
						pieLabelX: width / 2,
						pieLabelY: height / 2
					})
				}}>
				<VictoryChart
					containerComponent={<VictoryContainer disableContainerEvents={true} />}>
					{this.renderPieDefs()}

					<VictoryAxis
						tickLabelComponent={<View />}
						style={{ axis: { stroke: "none" } }} />

					{this.state.pieLabelX && this.state.pieLabelY && <VictoryLabel
						x={this.state.pieLabelX}
						y={this.state.pieLabelY - 40}
						style={styles.title}
						text={title} />}

					{this.renderPieCharts()}
				</VictoryChart>

				{this.renderPieLabels()}
			</View>
		);
	}

	getStyles() {
		return {
			title: {
				textAnchor: "middle",
				verticalAnchor: "end",
				fill: "#000000",
				fontFamily: "Montserrat-Regular",
				fontSize: "30px",
			},
			subtitle: {
				textAnchor: "middle",
				verticalAnchor: "end",
				fill: "rgba(0,0,0,0.5)",
				fontFamily: "Montserrat-Regular",
				fontSize: "11px",
			},
			pieLabels: {
				fontSize: 14,
				fill: "#eeeeee",
				fontWeight: 'bold'
			},
		};
	}
}

export default PieChart