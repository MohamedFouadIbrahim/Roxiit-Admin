import React from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import TranslatedText from '../../components/TranslatedText';
import { largeBorderRadius, largePagePadding, shadowStyle0 } from '../../constants/Style';
import { formatDate, formatTime } from '../../utils/Date';
import CustomSelector from '../../components/CustomSelector';
import ConfirmModal from '../../components/ConfirmModal';
import { DeleteReminder } from '../../services/OrdersService';
import { LongToast } from '../../utils/Toast';

class ReminderList extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            triggerRefresh: false,
            didDataFetched: false
        }

        this.confirmRef = React.createRef();
        this.optionsRef = React.createRef();
        this.options = ['Delete']
    }

    onLongPressItem = (Id) => {
        this.idForDelete = Id
        this.optionsRef.current.show()
    }

    componentDidMount() {
        this.setState({
            data: this.props.Reminders,
            didDataFetched: true
        })
    }

    onPressItem = (item) => {

    }

    renderItem = ({ item, index }) => {
        const { Message, TargetDate, Id } = item

        return (
            <View
                style={{
                    backgroundColor: 'white',
                    borderRadius: largeBorderRadius,
                    ...shadowStyle0,
                    padding: 5,
                    justifyContent: 'center',
                    marginHorizontal: 10,
                    marginVertical: 2
                }}>

                <CustomTouchable
                    onPress={() => this.onPressItem(item)}
                    onLongPress={() => this.onLongPressItem(Id)}>
                    <FontedText>
                        {`${formatDate(TargetDate)} - ${formatTime(TargetDate)}`}
                    </FontedText>
                </CustomTouchable>

            </View>
        )
    }


    componentDidUpdate(prevProps) {
        if (this.props.Reminders.length != prevProps.Reminders.length) {
            this.setState({ data: nextProp.Reminders })
        }
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
        this.props.fetchData && this.props.fetchData()
    }


    render() {
        const { data, didDataFetched } = this.state

        if (!didDataFetched) {
            return null
        }

        return (
            <LazyContainer style={{ flex: 1 }} >

                <RemoteDataContainer
                    initialData={data}
                    showsHorizontalScrollIndicator={false}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={data}
                    triggerRefresh={this.state.triggerRefresh}
                    keyExtractor={({ Id }) => `${Id}`}
                    renderItem={this.renderItem}
                    horizontal />

                <CustomSelector
                    ref={this.optionsRef}
                    options={this.options}
                    onSelect={(index) => {
                        this.confirmRef.current.show()
                    }}
                    onDismiss={() => { }}
                />

                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => {
                        DeleteReminder(this.idForDelete, res => {
                            LongToast('dataDeleted')
                            this.onChildChange()
                        })
                    }}
                    onResponse={(check) => {

                    }}
                />

            </LazyContainer>
        )
    }
}

export default ReminderList;

