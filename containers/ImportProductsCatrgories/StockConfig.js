import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import ArrowItem from '../../components/ArrowItem';
import { ExternalTranslate } from '../../utils/Translate';
import CustomHeader from '../../components/CustomHeader';
import { pickXlsxFile } from '../../utils/File';
import { TrimText } from '../../utils/Text';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { AddStockConfig } from '../../services/ImportService';
import { LongToast } from '../../utils/Toast';

class StockConfig extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            lockSubmit: false,
            file: {}
        }

        this.lockSubmit = false
    }

    submit = () => {

        const {
            file,
        } = this.state

        if ((!file && !file.type) || file.type != 'application/xlsx') {
            return LongToast('SelectXlsxFile')
        }

        this.lockSubmit = true
        this.setState({ lockSubmit: true })
        const dataToSubmit = {
            file,
        }
        AddStockConfig(dataToSubmit, res => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
            LongToast('dataSaved')
            this.props.navigation.navigate('ImportProductsCatrgories')
        }, err => {
            this.lockSubmit = false
            LongToast('dataNotSaved')
            this.setState({ lockSubmit: false })
        })
    }

    renderContent() {
        const {
            file
        } = this.state

        return (
            <ArrowItem
                title='File'
                onPress={() => {
                    pickXlsxFile(file => {
                        this.setState({ file })
                    }, () => {
                        return LongToast('SelectXlsxFile')
                    })
                }}
                info={file && file.fileName ? TrimText(file.fileName, 10) : ExternalTranslate('notselected')}
            />

        )
    }

    render() {

        return (
            <LazyContainer>

                <CustomHeader
                    navigation={this.props.navigation}
                    title='Config'
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            onPress={this.submit}
                        />
                    }
                />
                {this.renderContent()}

            </LazyContainer>
        )
    }
}




export default StockConfig