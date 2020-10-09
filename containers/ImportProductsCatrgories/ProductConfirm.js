import React from 'react'
import { View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import { largePagePadding, pagePadding } from '../../constants/Style';
import ItemSeparator from '../../components/ItemSeparator';
import RowItem from './RowItem';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import FontedText from '../../components/FontedText';
import { ConfirmConfig } from '../../services/ImportService';
import { LongToast } from '../../utils/Toast';
import { redColor, greenColor } from '../../constants/Colors';

class Confirm extends React.Component {
    constructor(props) {
        super(props)

        const {
            isError,
            data
        } = this.props.route.params

        if (data) {
            this.state = {
                data: data.Items,
                isError,
                lockSubmit: false
            }
        }

        this.lockSubmit = false

    }

    submit = () => {

        if (this.lockSubmit) {
            return
        }

        const {
            dataToSubmit
        } = this.props.route.params

        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        ConfirmConfig(dataToSubmit, res => {
            this.setState({ lockSubmit: false })
            this.lockSubmit = false
            LongToast('dataSaved')
            this.props.navigation.navigate('ImportProductsCatrgories')
        }, err => {
            this.setState({ lockSubmit: false })
            this.lockSubmit = false
        })

    }

    renderItem = ({ item, index }) => {

        return (
            <RowItem item={item} />
        )
    }

    renderContent = () => {
        return (
            <View
                style={{ flex: 1 }}
            >
                <FontedText
                    style={{ color: this.state.isError ? redColor : greenColor, marginTop: pagePadding, marginBottom: pagePadding, alignSelf: 'center', fontWeight: 'bold' }}
                >
                    {this.state.isError ? 'Not Vaild' : 'Vaild'}
                </FontedText>

                <RemoteDataContainer
                    initialData={this.state.data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                />

                <CustomButton
                    onPress={this.submit}
                    loading={this.state.lockSubmit}
                    style={{
                        marginHorizontal: largePagePadding,
                    }}
                    title='Confirm'
                />
            </View>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    navigation={this.props.navigation}
                    title='Confirm'
                />
                {this.renderContent()}
            </LazyContainer>
        )
    }
}
export default Confirm