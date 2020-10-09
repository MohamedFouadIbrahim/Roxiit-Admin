import React, { Component } from 'react'
import { ScrollView, View, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { withLocalize } from 'react-localize-redux';
import { GetProductPhysicalInfo, EditProductPhysicalInfo } from '../../services/ProductService.js';
import { EventRegister } from 'react-native-event-listeners'
import { STRING_LENGTH_LONG, STRING_LENGTH_SHORT } from '../../constants/Config';
import { LongToast } from '../../utils/Toast';

class ProductPhysicalInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			didFetchData: false,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}

		this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
			if (currentPost == '2') {
				this.submitDesc()
			}
		})
	}

	componentDidMount() {
		this.cancelFetchDataGetProductPhysicalInfo = GetProductPhysicalInfo(this.props.ProductId, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		}, err => {
		})

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
		this.cancelFetchDataGetProductPhysicalInfo && this.cancelFetchDataGetProductPhysicalInfo()
		this.cancelFetchDataEditProductPhysicalInfo && this.cancelFetchDataEditProductPhysicalInfo()
	}

	submitDesc = () => {
		EventRegister.emit('submitting', true)
		const { Weight, Length, Height, Width, LocalLocation, ManufacturerPartNumber, SKU } = this.state
		const { ProductId } = this.props

		this.cancelFetchDataEditProductPhysicalInfo = EditProductPhysicalInfo({
			Id: ProductId,
			Weight,
			Length,
			Height,
			Width,
			LocalLocation,
			ManufacturerPartNumber,
			SKU
		}, res => {
			LongToast('dataSaved')
			EventRegister.emit('submitting', false)
		}, err => {
			EventRegister.emit('submitting', false)
		})
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					{
						/*
							length, height, width, weight
							local locatiom, sku,ManufacturerPartNumber
						*/
					}


					<HorizontalInput
						label="Length"
						keyboardType="numeric"
						value={`${this.state.Length ? this.state.Length : ''}`}
						onChangeText={(text) => { this.setState({ Length: text }) }} />
					<ItemSeparator />

					<HorizontalInput
						label="Height"
						keyboardType="numeric"
						value={`${this.state.Height ? this.state.Height : ''}`}
						onChangeText={(text) => { this.setState({ Height: text }) }} />
					<ItemSeparator />

					<HorizontalInput
						label="Width"
						keyboardType="numeric"
						value={`${this.state.Width ? this.state.Width : ''}`}
						onChangeText={(text) => { this.setState({ Width: text }) }} />
					<ItemSeparator />

					<HorizontalInput
						label="Weight"
						keyboardType="numeric"
						value={`${this.state.Weight ? this.state.Weight : ''}`}
						onChangeText={(text) => { this.setState({ Weight: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="LocalLocation"
						value={`${this.state.LocalLocation ? this.state.LocalLocation : ''}`}
						onChangeText={(text) => { this.setState({ LocalLocation: text }) }} />
					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="SKU"
						value={`${this.state.SKU ? this.state.SKU : ''}`}
						onChangeText={(text) => { this.setState({ SKU: text }) }} />
					<ItemSeparator />

					<HorizontalInput
						label="ManufacturerPartNumber"
						value={`${this.state.ManufacturerPartNumber ? this.state.ManufacturerPartNumber : ''}`}
						onChangeText={(text) => { this.setState({ ManufacturerPartNumber: text }) }} />

					<ItemSeparator />

				</ScrollView>
			)
		} else {
			return (
				<View style={{ flex: 1, minHeight: this.state.screenHeight / 2, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator />
				</View>
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", }}>
				{
					Platform.OS == 'ios' ?

						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							keyboardVerticalOffset={150}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :

						this.renderContent()

				}
				{/* {this.renderContent()} */}
			</LazyContainer>
		)
	}
}

export default withLocalize(ProductPhysicalInfo)