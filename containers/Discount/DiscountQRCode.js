import React from 'react'
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import QRCode from '../../components/QRCode';
import { View } from 'react-native';
import { SaveImge } from '../../utils/Image';
import { LongToast } from '../../utils/Toast';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { screenWidth } from '../../constants/Metrics';

class DiscountQRCode extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false
        }

        if (this.props.route.params && this.props.route.params?.QRCode) {
            this.QRCode = this.props.route.params?.QRCode
        }
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    navigation={this.props.navigation}
                    title={"QRCode"}
                    leftComponent='back'
                />
                
                <View style={{ alignSelf: 'center', marginTop: 50 }} >
                    <QRCode
                        getRef={(c) => (this.svg = c)}
                        size={200}
                        value={this.QRCode}
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
                                this.QRCode, () => {
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

            </LazyContainer>
        )
    }
}

export default DiscountQRCode