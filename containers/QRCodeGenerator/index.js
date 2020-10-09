import React from 'react';
import { View } from 'react-native';
import ArrowItem from '../../components/ArrowItem';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import CustomSelector from '../../components/CustomSelector';
import LazyContainer from '../../components/LazyContainer';
import QRCode from '../../components/QRCode';
import { GetQRCode } from '../../services/OrdersService';
import { SaveImge } from '../../utils/Image';
import { TrimText } from '../../utils/Text';
import { LongToast } from '../../utils/Toast';
import { screenWidth } from '../../constants/Metrics';
import { largePagePadding, pagePadding } from '../../constants/Style';

class QRCodeGenerator extends React.Component {
	constructor() {
		super()

		this.state = {
			dataFetched: false,
			QRCodeData: [],
			selectedQRItem: null,
			loading: false
		}

		this.QRCodeValuesRef = React.createRef()
	}

	componentDidMount() {
		GetQRCode(res => {
			this.setState({ QRCodeData: res.data, dataFetched: true })
		})
	}

	render() {
		const {
			dataFetched,
			QRCodeData,
			selectedQRItem
		} = this.state

		if (!dataFetched || !QRCodeData || !QRCodeData.length) {
			return null
		}

		return (
			<LazyContainer style={{ flex: 1 }} >

				<CustomHeader
					navigation={this.props.navigation}
					title={"QRCodeGenerator"}
				/>

				<ArrowItem
					onPress={() => { this.QRCodeValuesRef.current.show() }}
					title={'QRCodeList'}
					info={selectedQRItem ? TrimText(selectedQRItem.Name, 20) : TrimText(QRCodeData[0].Name, 20)}
				/>

				<View
					style={{ alignSelf: 'center', marginTop: 50 }}
				>
					<QRCode
						getRef={(c) => (this.svg = c)}
						size={200}
						value={selectedQRItem ? selectedQRItem.Code : QRCodeData[0].Code}
					/>
				</View>

				<CustomButton
					style={{
						position: 'absolute'
						, bottom: 10,
						width: screenWidth - largePagePadding,
						left: pagePadding
					}}
					title='SaveToGallery'
					onPress={() => {
						this.svg.toDataURL(data => {

							this.setState({ loading: true })
							SaveImge(
								data,
								selectedQRItem ? selectedQRItem.Name : QRCodeData[0].Name, () => {
									this.setState({ loading: false })
									LongToast('dataSaved')
								}, err => {
									this.setState({ loading: false })
									LongToast('DataNotSaved')
								})
						})

					}}
					loading={this.state.loading}
				/>
				{QRCodeData && <CustomSelector
					ref={this.QRCodeValuesRef}
					options={QRCodeData.map(item => item.Name)}
					onSelect={index => {
						this.setState({ selectedQRItem: QRCodeData[index] });
					}}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}
export default QRCodeGenerator