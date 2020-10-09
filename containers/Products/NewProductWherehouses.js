import React from 'react'
import { View, TextInput, ScrollView, FlatList } from 'react-native';
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import ItemSeparator from '../../components/ItemSeparator';
import FontedText from '../../components/FontedText';
import CheckBox from '../../components/CheckBox';
import { largePagePadding } from '../../constants/Style';
import { LongToast } from '../../utils/Toast';
import { withLocalize } from 'react-localize-redux';
import CustomTouchable from '../../components/CustomTouchable';

const imageSize = 45

class ProudctsInWherehouse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lockSubmit: false,
            triggerRefresh: false,
            Stock: 0
        }

        this.lockSubmit = false

        this.ProductId = this.props.ProductId

    }

    componentDidMount() {
        this.setState({ data: this.props.route.params?.Data, didataFitched: true })
    }

    submit = () => {

        let vaildData = ''
        const NewData = this.state.data.map(item => {

            const obj = {
                IsSelected: item.IsSelected,
                Stock: item.Stock,
                Warehouse: item.Warehouse

            }

            if (item.Stock < 0) {
                vaildData = 'LessThanZero'
            }
            return obj
        })

        if (vaildData) {
            return LongToast(vaildData)
        }

        this.props.route.params?.onSelect && this.props.route.params?.onSelect(NewData)
    }

    renderItem = ({ item, index }) => {

        const {
            IsSelected,
            Stock,
            Warehouse: { Id, Name },
        } = item

        return (
            <CustomTouchable
                activeOpacity={0.7}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: largePagePadding, marginVertical: 10 }}
                onPress={() => {

                    const NewData = this.state.data.map(ite => {
                        if (ite.Warehouse.Id == Id) {
                            ite = { ...item, IsSelected: !ite.IsSelected, Stock: null }
                        }
                        return ite
                    })

                    this.setState({ data: NewData })
                }}
            >

                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }} >

                    <CheckBox
                        style={{ alignSelf: 'center', marginHorizontal: 10 }}
                        selected={IsSelected}
                    />

                </View>

                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }} >
                    <FontedText style={{ color: 'black', alignSelf: 'center', textAlign: 'left', width: 200 }} >{Name}</FontedText>
                    <TextInput
                        onChangeText={tes => {
                            if (tes < 0) {
                                LongToast('LessThanZero')
                            }
                            const NewData = this.state.data.map(ite => {
                                if (ite.Warehouse.Id == Id) {
                                    ite = { ...item, Stock: tes, IsSelected: true }
                                }
                                return ite
                            })
                            this.setState({ data: NewData })
                        }}
                        keyboardType='numeric'
                        placeholder={this.props.translate('Qty')}
                        style={{
                            marginHorizontal: 10,
                            textAlign: 'center',
                            width: 80
                        }}
                        multiline
                        clearTextOnFocus={Stock ? false : true}
                        value={`${Stock == null ? '' : Stock}`}
                    />
                </View>

            </CustomTouchable>

        )
    }


    render() {
        if (!this.state.didataFitched) {
            return null
        }
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: 'white' }} >
                <CustomHeader
                    title={'Where_Houses'}
                    navigation={this.props.navigation}
                    onBack={() => { this.submit() }}
                />
                <ScrollView >
                    <FlatList
                        data={this.state.data}
                        refreshing={true}
                        updatedData={this.state.data}
                        keyExtractor={({ Warehouse: { Id } }) => `${Id}`}
                        ItemSeparatorComponent={() => <ItemSeparator />}
                        renderItem={this.renderItem}
                    />
                </ScrollView>
            </LazyContainer>
        )
    }
}
export default withLocalize(ProudctsInWherehouse)