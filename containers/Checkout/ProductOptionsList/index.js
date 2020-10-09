import React, { PureComponent } from 'react';
import { withLocalize } from 'react-localize-redux';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { pagePadding, largePagePadding } from '../../../constants/Style';
import { mainColor, mainTextColor, secondColor, secondTextColor } from '../../../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDatePicker from '../../../components/CustomDatePicker';
import CustomTouchable from '../../../components/CustomTouchable';
import FontedText from '../../../components/FontedText';
import RoundedInput from '../../../components/HorizontalInput';
import Icon from '../../../components/Icon';
import TranslatedText from '../../../components/TranslatedText';
import { screenWidth } from '../../../constants/Metrics';
import { addToDate, formatDate, formatTime, removeFromDate } from '../../../utils/Date';
import { GetMyCurrentPostion } from '../../../utils/Location';
import { LongToast } from '../../../utils/Toast';

class ProductOptionsList extends PureComponent {
	constructor(props) {
		super(props)

		const { data, type } = this.props

		this.state = {
			isDateTimePickerVisible: false,
			isMapVisible: false,
			latitude: null,
			longitude: null,
			data,
			type,
		}

		switch (type) {
			case 5:
			case 6:
			case 7:
				const { data } = this.state
				const { value1: minDays, value2: maxDays } = data[0]

				if (minDays && minDays.length) {
					this.minDate = removeFromDate(new Date(), parseInt(minDays))
				}

				if (maxDays && maxDays.length) {
					this.maxDate = addToDate(new Date(), parseInt(maxDays))
				}
				break;
		}
	}

	componentDidMount() {
		const { type, data } = this.state

		switch (type) {
			case 8:
				this.setState({ output: "1" })
				this.onSelectOptionData("1")
				break;
			default:
				const {
					value1
				} = data[0]
				this.setState({ output: value1 })
				break;
		}
	}

	static getDerivedStateFromProps(props) {
		return {
			...props
		}
	}

	hideDateTimePicker = (callback) => {
		this.setState({ isDateTimePickerVisible: false }, () => { callback && callback() })
	}

	showDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: true })
	}

	toggleMap = () => {
		const { latitude, longitude, isMapVisible } = this.state
		const newMapState = !isMapVisible

		if (newMapState && (!latitude || !longitude)) {
			GetMyCurrentPostion(({ latitude, longitude }) => {
				this.onSelectOptionData(latitude, longitude)

				this.setState({
					latitude,
					longitude,
					UserLat: latitude,
					UserLng: longitude,
					isMapVisible: newMapState,
				})
			})
		}
		else {
			this.setState({ isMapVisible: newMapState })
		}
	}

	onSelectOptionData = (data1, data2) => {
		const { type } = this.state
		const { onSelect } = this.props
		let modifiedMembers = this.state.data

		if (type === 4) {
			const isSelected = data1 && data2

			modifiedMembers[0].value1 = data1
			modifiedMembers[0].value2 = data2
			modifiedMembers[0].isSelected = isSelected

			this.setState({
				latitude: data1,
				longitude: data2,
				isLocationSelected: isSelected,
			})

			onSelect && onSelect(modifiedMembers)
		}
		else {
			modifiedMembers[0].isSelected = data1 ? true : false

			switch (type) {
				case 5:
					// Date			
					modifiedMembers[0].value1 = formatDate(data1)
					break;
				case 6:
					// Time			
					modifiedMembers[0].value1 = formatTime(data1, true)
					break;
				case 7:
					// Datetime
					modifiedMembers[0].value1 = `${formatDate(data1)} ${formatTime(data1, true)}`
					break;
				default:
					modifiedMembers[0].value1 = data1
					break;
			}

			onSelect && onSelect(modifiedMembers)
			this.setState({ output: data1 })
		}
	}

	onPressItem = (item) => {
		const { selection, onSelect } = this.props

		switch (selection) {
			case 1:
				// Single selection
				const singleData = this.state.data.map(mapItem => ({
					...mapItem,
					isSelected: mapItem.Id === item.Id ? (item.isSelected ? false : true) : false
				}))

				this.setState({ data: singleData })

				onSelect && onSelect(singleData, singleData.filter(item => item.isSelected))
				break;
			case 2:
				// Multi selection
				const multiData = this.state.data.map(mapItem => ({
					...mapItem,
					isSelected: mapItem.Id === item.Id ? (item.isSelected ? false : true) : mapItem.isSelected
				}))

				this.setState({ data: multiData })

				onSelect && onSelect(multiData, multiData.filter(item => item.isSelected))
				break;
		}
	}

	onLongPressItem = (item) => {
		LongToast(item.Name, false)
	}

	renderColor = (item, index) => {
		const { value1: Color, isSelected } = item
		// const { bgColor2 } = this.props

		return (
			<CustomTouchable
				key={index}
				onPress={() => this.onPressItem(item)}
				onLongPress={() => this.onLongPressItem(item)}
				style={{
					width: 36,
					height: 36,
					borderRadius: 18,
					backgroundColor: Color,
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: 15,
					marginRight: 15,
				}}>
				{isSelected && <FontAwesome name="check" color={mainColor} size={16} />}
			</CustomTouchable>
		)
	}

	renderCode = (item, index) => {
		const { value1: ShortCode, isSelected } = item
		// const { mainColor, bgColor2, textColor2 } = this.props

		return (
			<CustomTouchable
				key={index}
				onPress={() => this.onPressItem(item)}
				onLongPress={() => this.onLongPressItem(item)}
				style={{
					height: 36,
					paddingHorizontal: 15,
					borderRadius: 18,
					backgroundColor: 'transparent',
					borderColor: isSelected ? secondColor : secondTextColor,
					borderWidth: 1,
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: 15,
					marginRight: 15,
				}}>
				<FontedText style={{ color: isSelected ? secondColor : secondTextColor, fontSize: 14, }}>{ShortCode}</FontedText>
			</CustomTouchable>
		)
	}

	renderIcon = (item, index) => {
		// const { mainColor, textColor2 } = this.props
		const { value1: MobileIcon, value2: MobileIconFamily, isSelected } = item

		return (
			<CustomTouchable
				key={index}
				onPress={() => this.onPressItem(item)}
				onLongPress={() => this.onLongPressItem(item)}
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: 15,
					marginRight: 15,
					borderColor: isSelected ? secondColor : secondTextColor,
					borderWidth: 1,
					borderRadius: 18,
					paddingHorizontal: 10
				}}>
				<Icon
					family={MobileIconFamily}
					name={MobileIcon}
					color={isSelected ? secondColor : secondTextColor}
					size={24} />
			</CustomTouchable>
		)
	}

	clearSelectedLocation = () => {
		this.onSelectOptionData(null, null)
	}

	renderLocation = () => {
		// const { mainColor } = this.props
		const { isMapVisible, isLocationSelected } = this.state

		let iconName, onPressAction

		if (isMapVisible) {
			iconName = "check-circle"
			onPressAction = this.toggleMap
		}
		else if (isLocationSelected) {
			iconName = "close-circle"
			onPressAction = this.clearSelectedLocation
		}
		else {
			iconName = "plus-circle"
			onPressAction = this.toggleMap
		}

		return (
			<CustomTouchable
				onPress={onPressAction}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<MaterialCommunityIcons
					name={iconName}
					size={36}
					color={mainColor}
					style={{
						marginRight: 5,
						marginBottom: 5,
					}} />
			</CustomTouchable>
		)
	}

	clearDateTimePicker = () => {
		this.onSelectOptionData(null)
	}

	renderDatetime = (type) => {
		// const { mainColor } = this.props
		const { output } = this.state

		let displayedOutput

		if (output) {
			switch (type) {
				case 5:
					// Date			
					displayedOutput = formatDate(output)
					break;
				case 6:
					// Time			
					displayedOutput = formatTime(output)
					break;
				case 7:
					// Datetime
					displayedOutput = `${formatDate(output)} ${formatTime(output)}`
					break;
			}
		}

		return (
			<CustomTouchable
				onPress={this.showDateTimePicker}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<CustomTouchable
					onPress={output ? this.clearDateTimePicker : this.showDateTimePicker}
					style={{}}>
					<MaterialCommunityIcons
						name={output ? 'close-circle' : 'plus-circle'}
						size={36}
						color={secondColor} />
				</CustomTouchable>

				{output ? <FontedText style={{ marginLeft: 5 }}>{displayedOutput}</FontedText> : null}
			</CustomTouchable>
		)
	}

	renderTextInput = (type) => {
		const { output } = this.state
		const {
			typName
		} = this.props

		return (
			<RoundedInput
				containerStyle={{ paddingHorizontal: 0 }}
				placeholder={'TypeOptionValue'}
				value={output}
				label={typName}
				keyboardType={type === 8 ? "decimal-pad" : "default"}
				onChangeText={this.onSelectOptionData}
			/>
		)
	}

	renderMainComponent = () => {
		const { type, data } = this.state

		switch (type) {
			case 1:
				// Color
				return data.map(this.renderColor)
			case 2:
				// Code
				return data.map(this.renderCode)
			case 3:
				// Icon			
				return data.map(this.renderIcon)
			case 4:
				// Location			
				return this.renderLocation()
			case 5:
			case 6:
			case 7:
				// Time, date or datetime			
				return this.renderDatetime(type)
			case 8:
			case 9:
				// Length, String		
				return this.renderTextInput(type)
		}
	}

	renderLocationHelper = () => {
		const {
			isMapVisible,
			latitude,
			longitude,
		} = this.state

		if (isMapVisible && latitude && longitude) {
			const {
				UserLat,
				UserLng,
			} = this.state

			return (
				<View
					style={{
						overflow: "hidden",
						borderRadius: 30,
					}}>
					<MapView
						style={{
							width: screenWidth * 0.8,
							height: 300,
						}}
						initialRegion={{
							latitude,
							longitude,
							latitudeDelta: 0.2,
							longitudeDelta: 0.2,
						}}
						region={{
							latitude,
							longitude,
							latitudeDelta: 0.2,
							longitudeDelta: 0.2,
						}}
						showsUserLocation={true}
						followsUserLocation={true}>
						{[<Marker
							key={`MyLocation_0`}
							coordinate={{
								latitude: UserLat,
								longitude: UserLng,
							}}
							pinColor={"#1296DB"} />,
						<Marker
							key={`MyLocation_1`}
							coordinate={{
								latitude: UserLat,
								longitude: UserLng,
							}}>
							<TranslatedText style={{ color: 'black', marginBottom: 50, }} text="MyLocation" />
						</Marker>]}

						<Marker
							draggable
							coordinate={{
								latitude,
								longitude,
							}}
							onDragEnd={(f) => {
								const { latitude, longitude } = f.nativeEvent.coordinate
								this.onSelectOptionData(latitude, longitude)
							}}
						/>
					</MapView>
				</View>
			)
		}
	}

	renderDatetimeHelper = (mode) => {
		const { isDateTimePickerVisible, output } = this.state
		const { minDate, maxDate } = this

		return (
			<CustomDatePicker
				mode={mode}
				isVisible={isDateTimePickerVisible}
				date={output}
				minimumDate={minDate}
				maximumDate={maxDate}
				onDatePicked={(datetime) => {
					this.hideDateTimePicker(() => {
						this.onSelectOptionData(datetime)
					})
				}}
				onCancel={this.hideDateTimePicker} />
		)
	}

	renderHelperComponent = () => {
		const { type } = this.state

		switch (type) {
			case 4:
				// Location			
				return this.renderLocationHelper()
			case 5:
				// Date			
				return this.renderDatetimeHelper('date')
			case 6:
				// Time			
				return this.renderDatetimeHelper('time')
			case 7:
				// Datetime			
				return this.renderDatetimeHelper('datetime')
		}
	}

	render() {
		if (!this.state.type) {
			return null
		}

		const { style, ...restProps } = this.props

		return (
			<View
				style={[{
					flexWrap: 'wrap',
					flexDirection: 'row',
					alignItems: 'center',
				}, style]}
				{...restProps}>
				{this.renderMainComponent()}
				{this.renderHelperComponent()}
			</View>
		)
	}
}




export default withLocalize(ProductOptionsList)