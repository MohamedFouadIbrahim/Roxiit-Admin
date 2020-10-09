import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import CustomHeader, { headerHeight } from '../../components/CustomHeader/index.js';
import { largePagePadding, pagePadding, shadowStyle3 } from '../../constants/Style.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import LazyContainer from '../../components/LazyContainer';
import ArrowItem from '../../components/ArrowItem/index';
import CustomButton from '../../components/CustomButton/index';
import Triangle from 'react-native-triangle';
import CustomSelector from '../../components/CustomSelector/index.js';
import { DeleteReview, ApproveOrDisApprove } from '../../services/ReviewsService';
import AntDesign from 'react-native-vector-icons/AntDesign'
import DeleteButton from '../../components/DeleteButton/index.js';
import EditButton from '../../components/EditButton/index';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import ReviewItem from './ReviewItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { ExternalTranslate } from '../../utils/Translate.js';
class ReviewIndex extends React.Component {
    constructor(props) {
        super(props)
        this.OrderReviewref = React.createRef()
        this.Approvedref = React.createRef()
        this.Repliedref = React.createRef()
        this.AproveOrDisApprove = React.createRef()
        this.lockSubmit = false

        this.state = {
            data: null,
            searchBarShown: false,
            isPopupVisible: false,
            Product: props.route.params?.product ? props.route.params.product : null,
            OrderReview: [
                { Id: 1, Name: 'ReviewDate' },
                { Id: 2, Name: 'ApproveDate' },
                { Id: 3, Name: 'Rating' }
            ],
            ApprovedList: [
                {
                    Key: 'NoFilter', Value: null
                },
                {
                    Key: 'Approved', Value: true
                },
                {
                    Key: 'NotApproved', Value: false
                }
            ],
            RepliedList: [
                {
                    Key: 'NoFilter', Value: null
                },
                {
                    Key: 'Replied', Value: true
                },
                {
                    Key: 'NotReplied', Value: false
                }
            ],
            triggerRefresh: false,
            SelectedOrderReview: null,
            Approved: null,
            Replied: null,
            ApprovedOrDisApproveList: [
                { Name: 'Approved', Value: true },
                { Name: 'Dis Approved', Value: false },
            ],
            IsApprove: null,
            lockSubmit: false,
            showCustomSelectorForDeleteref: false,
            Loading: false
        }
    }

    onSelectOrderReview = (OrderReview) => {
        this.setState({ SelectedOrderReview: OrderReview })
    }
    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }
    renderSwipebuttons = (item) => {
        const { Id } = item
        return (
            <View
                style={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'row',
                    padding: 20,
                }}>
                <EditButton
                    onPress={() => {
                        this.EditId = Id;
                        this.AproveOrDisApprove.current.show();
                    }}
                    style={{ marginRight: 10 }}
                />
                <DeleteButton
                    onPress={() => {
                        DeleteReview(Id, () => {
                            this.setState({
                                data: this.state.data.filter(filterItem => filterItem.Id !== Id),
                            })
                        }, err => {
                            // alert(err)
                        })
                    }}
                />
            </View>
        )
    }

    onPressItem = (item) => {
        this.setState({ isPopupVisible: false })
        const { Id } = item
        this.props.navigation.navigate('Review', {
            Id,
            onChildChange: this.onChildChange
        })
    }

    onLongPressItem = (item) => {
        const { Id } = item
        this.DeleteOrEditId = Id
        this.EditId = Id
        this.setState({ showCustomSelectorForDeleteref: true })
    }

    renderItem = ({ item }) => {
        return (
            <ReviewItem
                item={item}
                onPress={this.onPressItem}
                onLongPress={this.onLongPressItem} />
        )
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }
    Refresh = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    componentDidMount() {
        // if (this.props.route.params && this.props.route.params?.product) {

        //     this.setState({ Product: this.props.route.params?.product })

        // }
    }
    getRequestParams = () => {
        let params = ''
        const { SelectedOrderReview, Approved, Replied, Product } = this.state
        if (SelectedOrderReview) {
            params += `${this.addParamsSeparator(params)}order=${SelectedOrderReview.Id}`
        }
        if (Approved != null && Approved.Value != null) {
            params += `${this.addParamsSeparator(params)}approved=${Approved.Value}`
        }
        if (Replied != null && Replied.Value != null) {
            params += `${this.addParamsSeparator(params)}replied=${Replied.Value}`
        } if (Product) {
            params += `${this.addParamsSeparator(params)}productId=${Product.Id}`
        }
        return params
    }
    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible || pos_x === undefined || pos_y === undefined) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29

        const { SelectedOrderReview, Approved, Replied } = this.state

        return (
            <View
                style={{
                    position: 'absolute',
                    top: pos_y + headerHeight + 2,
                    right: pos_x + 35,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: largePagePadding,
                    width: 220,
                    ...shadowStyle3,
                }}>
                <Triangle
                    width={14}
                    height={10}
                    color={'white'}
                    direction={'up'}
                    style={{
                        position: 'absolute',
                        top: -10,
                        right: pos_x + 45,
                        zIndex: 1
                    }}
                />
                <ArrowItem
                    onPress={() => {
                        this.OrderReviewref.current.show()
                    }}
                    title={'OrderReview'}
                    info={SelectedOrderReview ? `${ExternalTranslate(SelectedOrderReview.Name).slice(0, 9)}..` : ExternalTranslate('NoneSelected')} />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        this.Repliedref.current.show()
                    }}
                    title={'Replied'}
                    info={Replied != null ? `${ExternalTranslate(Replied.Key).slice(0, 10)}..` : ''} />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        this.Approvedref.current.show()
                    }}
                    title={'Approved'}
                    info={Approved != null ? `${ExternalTranslate(Approved.Key).slice(0, 10)}..` : ''} />

                <ItemSeparator />

                <CustomButton
                    onPress={() => {
                        this.hidePopup()
                        this.setState({ SelectedOrderReview: null, Approved: null, Replied: null })
                    }}
                    style={{
                        marginTop: pagePadding,
                        marginHorizontal: largePagePadding,
                    }}
                    title='Clear' />

            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }
    onApproveOrDisApprove = (value) => {
        if (this.EditId) {
            const DataArgs = {
                Id: this.EditId,
                Review: '',
                ReplyReview: '',
                IsReviewApproved: value
            }
            this.lockSubmit = true
            this.setState({ lockSubmit: true })
            ApproveOrDisApprove(DataArgs, () => {
                this.lockSubmit = false
                this.setState({ lockSubmit: false })
                this.Refresh()
            }, (err) => {
                this.lockSubmit = false
                this.setState({ lockSubmit: false })
                // alert(err)
            })
        }
    }
    render() {
        const { OrderReview, ApprovedList, RepliedList, ApprovedOrDisApproveList } = this.state
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: 'white' }} >
                <CustomHeader
                    leftComponent="drawer"
                    navigation={this.props.navigation}
                    title="Reviews"
                    rightNumOfItems={1}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {this.state.lockSubmit ?
                                <ActivityIndicator size='small' color='white' /> :
                                <CustomTouchable
                                    onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                                        this.setState({ pos_x: x, pos_y: y })
                                    }}
                                    onPress={() => { this.setState({ isPopupVisible: !this.state.isPopupVisible }) }}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flex: 1
                                    }}>
                                    <AntDesign
                                        name={`filter`}
                                        size={24}
                                        color={'white'} />
                                </CustomTouchable>
                            }
                        </View>
                    } />
                <RemoteDataContainer
                    url={"Reviews"}
                    cacheName={"reviews"}
                    params={this.getRequestParams()}
                    // onDataFetched={(data) => {
                    //     this.setState({ data })
                    // }}
                    // updatedData={this.state.data}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem}
                    triggerRefresh={this.state.triggerRefresh}
                />


                <CustomSelectorForDeleteAndEdit
                    showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
                    justForDelete={false}
                    onCancelDelete={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                    }}
                    onCancelConfirm={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                    }}
                    onDelete={() => {
                        this.setState({ Loading: true, showCustomSelectorForDeleteref: false })
                        DeleteReview(this.DeleteOrEditId, () => {
                            this.setState({
                                data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
                                showCustomSelectorForDeleteref: false,
                                Loading: false
                            })
                            LongToast('dataDeleted')
                        }, err => {
                            // alert(err)
                            this.setState({ Loading: false })
                        })
                    }}
                    onEdit={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                        this.AproveOrDisApprove.current.show();
                    }}
                />
                {this.renderPopup()}
                {OrderReview && <CustomSelector
                    ref={this.OrderReviewref}
                    options={OrderReview.map(item => ExternalTranslate(item.Name))}
                    onSelect={(index) => { this.onSelectOrderReview(OrderReview[index]) }}
                    onDismiss={() => { }}
                />}
                {ApprovedList && <CustomSelector
                    ref={this.Approvedref}
                    options={(ApprovedList.map(item => ExternalTranslate(item.Key)))}
                    onSelect={(index) => {
                        this.setState({
                            Approved: ApprovedList[index]
                        })
                    }}
                    onDismiss={() => { }}
                />}
                {RepliedList && <CustomSelector
                    ref={this.Repliedref}
                    options={(RepliedList.map(item => ExternalTranslate(item.Key)))}
                    onSelect={(index) => {
                        this.setState({ Replied: RepliedList[index] })
                    }}
                    onDismiss={() => { }}
                />}
                {ApprovedOrDisApproveList && <CustomSelector
                    ref={this.AproveOrDisApprove}
                    options={ApprovedOrDisApproveList.map(item => item.Name)}
                    onSelect={(index) => {
                        this.onApproveOrDisApprove(ApprovedOrDisApproveList[index].Value)
                    }}
                    onDismiss={() => { }}
                />}
            </LazyContainer>
        );
    }
}
export default withLocalize(ReviewIndex)