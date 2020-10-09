import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import CustomSelector from '../../components/CustomSelector';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem';
import ItemSeparator from '../../components/ItemSeparator';
import SwitchItem from '../../components/SwitchItem';
import { ScrollView } from 'react-native';
import { ExternalTranslate } from '../../utils/Translate';
import { getFilters } from '../../services/FilterService';
import CustomHeader from '../../components/CustomHeader';
import { pickZipFile } from '../../utils/File';
import { TrimText } from '../../utils/Text';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { AddConfig } from '../../services/ImportService';
import { LongToast } from '../../utils/Toast';

class ProductConfig extends React.Component {
    constructor(props) {
        super(props)

        const { languages_data, currLang } = this.props

        this.state = {
            lockSubmit: false,
            mainLanguage: languages_data.find(item => item.code === currLang),
            secondLanguage: languages_data.find(item => item.code != currLang),
            updateProduct: true,
            createCategory: true,
            visibility: null,
            status: null,
            type: null,
            ProductStatus: [],
            ProductVisibility: [],
            ProductTypes: [],
            dataFetched: false,
            file: {}
        }

        this.lockSubmit = false
        this.mainLanguageSelectorRef = React.createRef();
        this.secondLanguageSelectorRef = React.createRef();
        this.visibilitySelectorRef = React.createRef();
        this.statusSelectorRef = React.createRef();
        this.typeSelectorRef = React.createRef();

    }

    componentDidMount() {
        this.fetchFilters()
    }

    fetchFilters = () => {
        this.cancelFetchDatagetFilters = getFilters({ productStatus: true, productVisibility: true, productTypes: true }, res => {
            const {
                ProductStatus,
                ProductVisibility,
                ProductTypes
            } = res.data

            this.setState({
                ProductStatus,
                ProductVisibility,
                ProductTypes,
                visibility: ProductVisibility.find(item => item.Id == 1),
                status: ProductStatus.find(item => item.Id == 1),
                type: ProductTypes.find(item => item.Id == 1),
                dataFetched: true,
            })
        })
    }

    submit = () => {

        const {
            file,
            mainLanguage,
            secondLanguage,
            type,
            createCategory,
            status,
            visibility,
            updateProduct
        } = this.state

        if ((!file && !file.type) || file.type != 'application/zip') {
            return LongToast('selectZipFile')
        }

        this.lockSubmit = true
        this.setState({ lockSubmit: true })
        const dataToSubmit = {
            mainLanguage: mainLanguage.key,
            secondLanguage: secondLanguage.key,
            updateProduct,
            createCategory,
            visibility: visibility.Id,
            status: status.Id,
            type: type.Id,
            file
        }
        AddConfig(dataToSubmit, res => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
            this.props.navigation.navigate('ProductConfirm', {
                data: res.data,
                isError: res.data.isError,
                dataToSubmit
            })
        }, err => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
        })
    }

    renderContent() {

        const {
            mainLanguage,
            secondLanguage,
            updateProduct,
            createCategory,
            visibility,
            status,
            type,
            file
        } = this.state

        return (
            <ScrollView>

                <ArrowItem
                    title='MainLanguage'
                    onPress={() => {
                        this.mainLanguageSelectorRef.current.show()
                    }}
                    info={mainLanguage ? mainLanguage.label : ExternalTranslate('notselected')}
                />

                <ItemSeparator />

                <ArrowItem
                    title='SecondLanguage'
                    onPress={() => {
                        this.secondLanguageSelectorRef.current.show()
                    }}
                    info={secondLanguage ? secondLanguage.label : ExternalTranslate('notselected')}
                />

                <ItemSeparator />

                <SwitchItem
                    title='UpdateProduct'
                    value={updateProduct}
                    onValueChange={(updateProduct) => { this.setState({ updateProduct }) }}
                />

                <ItemSeparator />

                <SwitchItem
                    title='CreateCategory'
                    value={createCategory}
                    onValueChange={(createCategory) => { this.setState({ createCategory }) }}
                />


                <ArrowItem
                    title='Visibility'
                    onPress={() => {
                        this.visibilitySelectorRef.current.show()
                    }}
                    info={visibility ? visibility.Name : ExternalTranslate('notselected')}
                />

                <ItemSeparator />

                <ArrowItem
                    title='Status'
                    onPress={() => {
                        this.statusSelectorRef.current.show()
                    }}
                    info={status ? status.Name : ExternalTranslate('notselected')}
                />
                <ItemSeparator />

                <ArrowItem
                    title='Type'
                    onPress={() => {
                        this.typeSelectorRef.current.show()
                    }}
                    info={type ? type.Name : ExternalTranslate('notselected')}
                />

                <ItemSeparator />

                <ArrowItem
                    title='File'
                    onPress={() => {
                        pickZipFile(file => {

                            this.setState({ file })

                        }, () => {
                            return LongToast('selectZipFile')
                        })
                    }}
                    info={file && file.fileName ? TrimText(file.fileName, 10) : ExternalTranslate('notselected')}
                />
            </ScrollView>
        )
    }

    render() {

        const { languages_data } = this.props
        const { dataFetched, ProductStatus, ProductTypes, ProductVisibility } = this.state

        if (!dataFetched) {
            return null
        }

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

                <CustomSelector
                    ref={this.mainLanguageSelectorRef}
                    options={languages_data.map(item => item.label)}
                    onSelect={(index) => { this.setState({ mainLanguage: languages_data[index] }) }}
                    onDismiss={() => { }}
                />

                <CustomSelector
                    ref={this.secondLanguageSelectorRef}
                    options={languages_data.map(item => item.label)}
                    onSelect={(index) => { this.setState({ secondLanguage: languages_data[index] }) }}
                    onDismiss={() => { }}
                />

                <CustomSelector
                    ref={this.visibilitySelectorRef}
                    options={ProductVisibility.map(item => item.Name)}
                    onSelect={(index) => { this.setState({ visibility: ProductVisibility[index] }) }}
                    onDismiss={() => { }}
                />

                <CustomSelector
                    ref={this.typeSelectorRef}
                    options={ProductTypes.map(item => item.Name)}
                    onSelect={(index) => { this.setState({ type: ProductTypes[index] }) }}
                    onDismiss={() => { }}
                />

                <CustomSelector
                    ref={this.statusSelectorRef}
                    options={ProductStatus.map(item => item.Name)}
                    onSelect={(index) => { this.setState({ status: ProductStatus[index] }) }}
                    onDismiss={() => { }}
                />

            </LazyContainer>
        )
    }
}


const mapStateToProps = ({
    language: {
        languages_data,
        currLang,
    },
}) => ({
    languages_data,
    currLang,
})


export default connect(mapStateToProps)(ProductConfig)