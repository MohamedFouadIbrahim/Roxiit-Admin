import React from 'react'
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import { TextInput, ScrollView } from 'react-native';
import TranslatedText from '../../components/TranslatedText';
import { largeBorderRadius, largePagePadding } from '../../constants/Style';
import { GetOrderNote, AddOrderNote } from '../../services/OrdersService';
import { LongToast } from '../../utils/Toast';
import CustomButton from '../../components/CustomButton';

class OrderNote extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            Note: null,
            dataFetched: false,
            lockSubmit: false
        }

        if (this.props.route.params && this.props.route.params?.Id) {
            this.orderId = this.props.route.params?.Id
        }

        this.lockSubmit = false

    }

    componentDidMount() {
        GetOrderNote(this.orderId, res => {
            this.setState({ Note: res.data, dataFetched: true })
        })
    }

    submit = () => {

        const {
            onChildChange
        } = this.props.route.params

        if (this.lockSubmit) {
            return
        }

        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        AddOrderNote({
            OrderId: this.orderId,
            Note: this.state.Note
        }, res => {

            this.setState({ lockSubmit: false })
            this.lockSubmit = false
            LongToast('dataSaved')
            onChildChange && onChildChange()
            this.props.navigation.goBack()

        }, err => {
            this.setState({ lockSubmit: false })
            this.lockSubmit = false
        })

    }

    render() {

        if (!this.state.dataFetched) {
            return null
        }

        return (
            <LazyContainer
                style={{
                    flex: 1,
                    backgroundColor: "#F4F6F9",
                }}
            >
                <CustomHeader
                    navigation={this.props.navigation}
                    title={'Note'}
                />

                <ScrollView
                    contentContainerStyle={{
                        padding: largePagePadding,
                    }}
                >
                    <TranslatedText text='NoteForOrder' style={{ fontWeight: 'bold', marginBottom: largePagePadding }} />
                    <TextInput
                        value={this.state.Note}
                        onChangeText={(Note) => { this.setState({ Note }) }}
                        multiline={true}
                        numberOfLines={10}
                        style={{
                            borderWidth: 0.5,
                            borderRadius: largeBorderRadius,
                            backgroundColor: 'white',
                            padding: 12,
                        }}
                        textAlignVertical='top'
                    />
                    <CustomButton
                        title={'Done'}
                        loading={this.state.lockSubmit}
                        onPress={this.submit}
                        style={{
                            marginVertical: largePagePadding
                        }}
                    />
                </ScrollView>
            </LazyContainer>
        )
    }
}

export default OrderNote