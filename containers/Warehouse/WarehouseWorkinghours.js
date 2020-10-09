import React, { Component } from "react";
import { View, I18nManager } from "react-native";
import LazyContainer from "../../components/LazyContainer";
import RemoteDataContainer from "../../components/RemoteDataContainer/index.js";
import { largePagePadding, pagePadding, largeBorderRadius } from "../../constants/Style.js";
import { connect } from "react-redux";
import ItemSeparator from "../../components/ItemSeparator/index.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import { withLocalize } from "react-localize-redux";
import CustomHeader, { secondHeaderIconSize } from "../../components/CustomHeader/index.js";
import CustomSelector from "../../components/CustomSelector/index.js";
import CustomSelectorForDeleteAndEdit from "../../components/CustomSelectorForDeleteAndEdit/index";
import { DeleteWarehouseWorkinghours, GetDays, PostWhereHouseHour } from "../../services/WarehousesService";
import FontedText from "../../components/FontedText/index.js";
import { mainColor } from "../../constants/Colors.js";
import TranslatedText from "../../components/TranslatedText/index";
import SwitchItem from '../../components/SwitchItem/index';
import CustomDatePicker from '../../components/CustomDatePicker/index';
import CustomAddModal from '../../components/CustomAddModal/index';
import { LongToast } from "../../utils/Toast";
import CustomTouchable from '../../components/CustomTouchable';
class WarehouseWorkinghours extends Component {
  constructor(props) {
    super(props);

    const { Id } = this.props.route.params
    this.warehouseId = Id;

    this.state = {
      data: null,
      triggerRefresh: false,
      showCustomSelectorForDeleteref: false,
      Loading: false,
      searchBarShown: false,
      isPopupVisible: false,
      searchingFor: "",
      lockSubmit: false,
      didFetchData: false,
      isDateTimePickerVisibleFrom: false,
      isDateTimePickerVisibleTo: false,
      IsOpen: false
    };
    this.lockSubmit = false
    this.DaysRef = React.createRef();
    this.editMode = false
  }
  componentDidMount() {
    this.fitchDay = GetDays(res => {
      this.setState({
        Days: res.data.DayTypes,
        didFetchData: true
      })
    })
  }

  componentWillUnmount() {
    this.fitchDay && this.fitchDay()
    this.cancelPost && this.cancelPost();
    this.cancelDelte && this.cancelDelte()
  }


  onSubmit = () => {
    const { From, To, selectedDay, IsOpen } = this.state
    const { translate } = this.props
    if (!From || !selectedDay || !To) {
      return LongToast('CantHaveEmptyInputs')
    }
    const data = [
      {
        Id: this.editMode ? this.EditOrDeleteId : 0,
        WorkingDayTypeId: selectedDay.Id,
        IsOpen,
        From,
        To
      }
    ]
    this.lockSubmit = true
    this.setState({ lockSubmit: true })

    this.cancelPost = PostWhereHouseHour(this.warehouseId, data, res => {
      this.lockSubmit = false
      this.setState({
        isDateTimePickerVisibleFrom: false,
        isDateTimePickerVisibleTo: false,
        lockSubmit: false,
        From: '',
        To: '',
        triggerRefresh: !this.state.triggerRefresh,
        isPopupVisible: false,
        VaidError: ''
      })
      return LongToast('dataSaved')
    }, err => {
      this.lockSubmit = false
      this.setState({
        isDateTimePickerVisibleFrom: false,
        isDateTimePickerVisibleTo: false,
        lockSubmit: false,
        From: '',
        To: '',
        triggerRefresh: !this.state.triggerRefresh,
        isPopupVisible: false,
        VaidError: ''
      })
    })

  }


  renderDaysDropDown = () => {
    const { selectedDay } = this.state
    return (
      <CustomTouchable
        onPress={() => {
          this.DaysRef.current.show()
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: mainColor,
          borderRadius: largeBorderRadius,
          marginHorizontal: largePagePadding,
          width: '80%'
        }}>
        <FontedText style={{ color: 'white', fontSize: 11, }}>{selectedDay ? selectedDay.Name.slice(0, 10) : 'Day'}</FontedText>
        <Ionicons
          name={"md-arrow-dropdown"}
          size={18}
          color={'white'}
          style={{
            marginLeft: 5,
          }} />
      </CustomTouchable>
    )
  }

  renderFromToDrobDown = () => {
    const { From, To, IsOpen } = this.state;
    return (
      <View style={{ marginHorizontal: largePagePadding, width: '80%', alignSelf: 'center' }} >
        <View style={{ justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 10, width: '100%', }} >
          <CustomTouchable
            onPress={() => {
              this.setState({ isDateTimePickerVisibleFrom: true })
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: mainColor,
              borderRadius: largeBorderRadius,
              // marginHorizontal: largePagePadding,
              width: '40%'
            }}>
            <FontedText style={{ color: 'white', fontSize: 11, }}>{From ? From : 'From'}</FontedText>
            <Ionicons
              name={"md-arrow-dropdown"}
              size={18}
              color={'white'}
              style={{
                marginLeft: 5,
              }} />
          </CustomTouchable>

          <CustomTouchable
            onPress={() => {
              this.setState({ isDateTimePickerVisibleTo: true })
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: mainColor,
              borderRadius: largeBorderRadius,
              // marginHorizontal: largePagePadding,
              width: '40%'
            }}>
            <FontedText style={{ color: 'white', fontSize: 11, }}>{To ? To : 'To'}</FontedText>
            <Ionicons
              name={"md-arrow-dropdown"}
              size={18}
              color={'white'}
              style={{
                marginLeft: 5,
              }} />
          </CustomTouchable>
        </View>
        <SwitchItem
          titleStyle={{ color: 'black' }}
          title={'IsOpen'}
          style={{ marginHorizontal: largePagePadding, paddingHorizontal: 0 }}
          value={IsOpen}
          onValueChange={(IsOpen) => { this.setState({ IsOpen }) }}
        />
      </View>
    )
  }
  _onRenderModal = () => {
    // const { onBackdropPress, isVisible, RoundedCloseButtonPress, loading, onSubmit, error, onErrorMsgClosePress, otherProps } = this.props
    return (
      <CustomAddModal
        onBackdropPress={() => {
          this.setState({ isPopupVisible: false, VaidError: '', From: '', To: '', selectedDay: null })
        }}
        isVisible={this.state.isPopupVisible}
        error={this.state.VaidError}
        loading={this.state.lockSubmit}
        onErrorMsgClosePress={() => {
          this.setState({ VaidError: '' })
        }}
        RoundedCloseButtonPress={() => {
          this.setState({ isPopupVisible: false })
        }}
        onSubmit={() => {
          const { translate } = this.props
          const { From, To, selectedDay, IsOpen } = this.state
          if (!From || !selectedDay || !To) {
            this.setState({
              VaidError: translate('CantHaveEmptyInputs')
            })
          } else { this.onSubmit() }
        }}
      >

        {this.renderDaysDropDown()}

        {this.renderFromToDrobDown()}

        <CustomDatePicker
          time={true}
          isVisible={this.state.isDateTimePickerVisibleFrom}
          onConfirm={(value) => {
            this.setState({ From: `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.toString(), isDateTimePickerVisibleFrom: false })
          }}
          is24Hour={true}
          mode='time'
          onCancel={() => this.setState({ isDateTimePickerVisibleFrom: false })}
        />

        <CustomDatePicker
          time={true}
          isVisible={this.state.isDateTimePickerVisibleTo}
          onConfirm={(value) => {
            this.setState({ To: `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.toString(), isDateTimePickerVisibleTo: false })
          }}
          is24Hour={true}
          mode='time'
          onCancel={() => this.setState({ isDateTimePickerVisibleTo: false })}
        />

      </CustomAddModal>
    )
  }
  // renderModal = () => {
  //   return (
  //     <Modal onBackdropPress={() => this.setState({ isPopupVisible: false, VaidError: '', From: '', To: '', selectedDay: null })} isVisible={this.state.isPopupVisible}  >

  //       {
  //         this.state.VaidError ?
  //           <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
  //             colors={['#f24b80', '#f26390']}
  //             style={[{
  //               width: screenWidth - 40,
  //               borderRadius: 40,
  //               justifyContent: "space-between",
  //               alignItems: "center",
  //               flexDirection: "row",
  //               paddingHorizontal: 20,
  //               paddingVertical: 15,
  //               opacity: .99,
  //               alignSelf: 'center',
  //               marginBottom: 20
  //             }]}>

  //             <FontedText style={{ flex: 1, color: "#FFF", fontSize: 14, }}>{this.state.VaidError}</FontedText>
  //             <CustomTouchable onPress={() => {

  //             }} style={{ flex: .3, alignItems: "flex-end" }}>
  //               <AntDesign style={{}} name="close" color="#FFF" size={18} onPress={() => {
  //                 this.setState({ VaidError: '' })
  //               }} />
  //             </CustomTouchable>
  //           </LinearGradient> : null
  //       }

  //       <View style={{ backgroundColor: 'white', borderBottomEndRadius: 22, borderBottomLeftRadius: 22, borderTopEndRadius: 22, borderTopLeftRadius: 22, paddingBottom: 0 }} >
  //         <View style={{ marginVertical: 10, marginRight: 10, alignItems: 'flex-end' }}>
  //           <RoundedCloseButton onPress={() => this.setState({ isPopupVisible: false })} />
  //         </View>

  //         {this.renderDaysDropDown()}

  //         {this.renderFromToDrobDown()}

  //         <CustomTouchable
  //           // disabled={this.state.lockSubmit}
  //           style={{ backgroundColor: secondColor, justifyContent: "center", alignItems: "center", borderBottomEndRadius: 20, borderBottomLeftRadius: 20, marginBottom: 0 }}
  //           onPress={() => {
  //             const { translate } = this.props
  //             const { From, To, selectedDay, IsOpen } = this.state
  //             if (!From || !selectedDay || !To) {
  //               this.setState({
  //                 VaidError: translate('CantHaveEmptyInputs')
  //               })
  //             } else { this.onSubmit() }
  //           }}>
  //           {
  //             this.state.lockSubmit ? <ActivityIndicator color="#FFF" size="small" style={{ paddingVertical: 13 }} /> :
  //               <TranslatedText style={{ color: '#FFF', textAlign: "center", paddingVertical: 13 }} text={"Add"} />
  //           }

  //         </CustomTouchable>
  //       </View>

  //     </Modal>
  //   )
  // }


  renderIsOpen = (IsOpen) => {
    return (
      <View style={{ backgroundColor: IsOpen == true ? '#32CD32' : 'red', borderRadius: 4, marginTop: 5, justifyContent: 'center' }}>
        <TranslatedText style={{ fontSize: 12, color: "white", textAlign: 'center', paddingVertical: 4, paddingHorizontal: 6 }} text={IsOpen == true ? 'Open' : 'Close'} />
      </View>
    )
  }

  onLongPressItem = (value) => {
    const { Id } = value;
    this.EditOrDeleteId = Id
    this.setState({ showCustomSelectorForDeleteref: true });
  };

  onPressItem = (Day, items) => {
    const { Id } = items
    this.EditOrDeleteId = Id;
    this.setState({ selectedDay: Day, From: items.From, To: items.To, IsOpen: items.IsOpen, isPopupVisible: true })
    this.editMode = true
  }

  renderItem = ({ index, item }) => {
    const { Day, items } = item;
    return (
      <View
        key={index}
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: largePagePadding,
          paddingVertical: pagePadding
        }}
      >
        <View style={{ flex: 1 }}>

          <FontedText style={{ color: "black" }}>{Day.Name}</FontedText>
          {items.map((value, index) => {
            return (
              <CustomTouchable
                style={{ marginVertical: 5 }}
                key={index}
                onLongPress={() => { this.onLongPressItem(value) }}
                onPress={() => { this.onPressItem(Day, value) }}
              >
                <View style={{ flexDirection: 'row', justifyContent: "space-between" }} >
                  {this.renderIsOpen(value.IsOpen)}
                  <FontedText style={{ color: "black", alignSelf: 'center' }}> {this.props.translate('From')} : {value.From}</FontedText>
                  {I18nManager.isRTL ?
                    <Ionicons name='ios-arrow-round-back' color='black' size={25} style={{ alignSelf: 'center' }} /> :
                    <Ionicons name='ios-arrow-round-forward' color='black' size={25} style={{ alignSelf: 'center' }} />
                  }
                  <FontedText style={{ color: "black", alignSelf: 'center' }}>{this.props.translate('To')} : {value.To}</FontedText>
                </View>
              </CustomTouchable>
            )
          })}

        </View>
      </View>

    );
  };

  onChildChange = () => {
    this.setState({ triggerRefresh: !this.state.triggerRefresh });
  };

  render() {
    if (!this.state.didFetchData) {
      return null
    }
    const { Days } = this.state
    return (
      <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
        <CustomHeader
          leftComponent="back"
          navigation={this.props.navigation}
          title="WorkingHours"
          rightNumOfItems={1}
          rightComponent={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <CustomTouchable
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                  this.setState({ pos_x: x, pos_y: y })
                }}
                onPress={() => {
                  this.editMode = true
                  this.setState({ isPopupVisible: !this.state.isPopupVisible })
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1
                }}
              >
                <Ionicons
                  name={`ios-add`}
                  size={secondHeaderIconSize}
                  color={"white"}
                />
              </CustomTouchable>
            </View>
          }
        />

        <RemoteDataContainer
          url={'Warehouse/WorkingHours'}
          params={`warehouseId=${this.warehouseId}`}
          cacheName={`WorkingHours`}
          onDataFetched={data => {
            this.setState({ data });
          }}
          updatedData={this.state.data}
          triggerRefresh={this.state.triggerRefresh}
          ItemSeparatorComponent={() => <ItemSeparator />}
          keyExtractor={({ Id }) => `${Id}`}
          renderItem={this.renderItem}
        />

        {this._onRenderModal()}


        <CustomSelectorForDeleteAndEdit
          showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
          justForDelete={true}
          onCancelDelete={() => {
            this.setState({ showCustomSelectorForDeleteref: false })
          }}
          onCancelConfirm={() => {
            this.setState({ showCustomSelectorForDeleteref: false })
          }}
          onDelete={() => {
            this.setState({ Loading: true, showCustomSelectorForDeleteref: false })

            this.cancelDelte = DeleteWarehouseWorkinghours(this.warehouseId, this.EditOrDeleteId, res => {
              this.setState({
                triggerRefresh: !this.state.triggerRefresh,
                showCustomSelectorForDeleteref: false,
                Loading: false
              })

            }, err => { this.setState({ showCustomSelectorForDeleteref: false }) })
          }}
        />



        {Days && <CustomSelector
          ref={this.DaysRef}
          options={Days.map(item => item.Name)}
          onSelect={(index) => { this.setState({ selectedDay: Days[index] }) }}
          onDismiss={() => { }}
        />}
      </LazyContainer>
    );
  }
}

const mapStateToProps = ({ language: { languages_data } }) => ({
  languages_data
});

export default connect(mapStateToProps)(withLocalize(WarehouseWorkinghours));
