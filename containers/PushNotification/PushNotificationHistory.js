import React from 'react';
import { View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import FontedText from '../../components/FontedText';
import ItemSeparator from '../../components/ItemSeparator';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import { mainTextColor } from '../../constants/Colors';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { formatDate, formatTime } from '../../utils/Date';
import { TrimText } from '../../utils/Text';

class PushNotificationHistory extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
        }

        if (this.props.route.params && this.props.route.params?.Id) {
            this.Id = this.props.route.params?.Id;
        }

    }

    renderItem = ({ item }) => {
        const {
            Id,
            TemplateName,
            TemplateId,
            DateTime,
            LastSentCount
        } = item

        return (
            <View
                style={{
                    flex: 1,
                    paddingVertical: largePagePadding - 5,
                    paddingHorizontal: largePagePadding
                }}
            >

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: pagePadding }} >

                    <FontedText style={{ color: mainTextColor }}>{`${TrimText(TemplateName, 22)}`}</FontedText>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        {DateTime && <FontedText style={{ color: mainTextColor }}>{`${formatDate(DateTime)} `}</FontedText>}
                        {DateTime && <FontedText style={{ color: mainTextColor }}>{` ${formatTime(DateTime)}`}</FontedText>}
                    </View>

                </View>
                
            </View>
        )
    }


    render() {

        return (
            <LazyContainer style={{ flex: 1 }} >
                <CustomHeader
                    navigation={this.props.navigation}
                    leftComponent={'back'}
                    title={"History"}
                />

                <RemoteDataContainer
                    url={`NsMng/History`}
                    params={`templateId=${this.Id}`}
                    pagination={false}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />
            </LazyContainer>
        )
    }
}
export default PushNotificationHistory
