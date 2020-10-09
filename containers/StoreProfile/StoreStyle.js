import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { Image, ScrollView, View, Dimensions } from 'react-native';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import Modal from "react-native-modal";
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomColorModal from '../../components/CustomColorModal';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import HorizontalInput from '../../components/HorizontalInput/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import LazyContainer from '../../components/LazyContainer';
import SettingsSeparator from '../../components/Settings/SettingsSeparator.js';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { secondColor } from '../../constants/Colors.js';
import { shadowStyle0 } from '../../constants/Style';
import { GetStoreStyle, PostStoreStyle } from '../../services/StoreProfileServece';
import { LongToast } from '../../utils/Toast';
import { isValidHexColor } from '../../utils/Validation';

class StoreStyle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lockSubmit: false,
      didFetchData: false,
      colorPickerShown: false,
      SelectedColor: {
        Name: null,
        Value: null
      },
      screenWidth: Dimensions.get('screen').width,
      screenHeight: Dimensions.get('screen').height,
    }
    this.lockSubmit = false;

    this.AvailableAuthThemesRef = React.createRef();
    this.AvailableStoreThemesRef = React.createRef();
    this.AvailableUserThemesRef = React.createRef()
    this.AvailableFontsRef = React.createRef()
  }

  componentDidMount() {
    this.cacelFitchData = GetStoreStyle(res => {

      this.setState({
        ...res.data,
        FontStyle: res.data.AvailableFonts.find(item => item.Value == res.data.FontStyle),
        didFetchData: true,
      })
    })

    //re render when change orientation
    Dimensions.addEventListener('change', () => {
      this.setState({
        screenWidth: Dimensions.get('screen').width,
        screenHeight: Dimensions.get('screen').height,
      })
    })

  }

  componentWillUnmount() {
    this.cacelFitchData && this.cacelFitchData()
  }
  submit() {
    if (this.lockSubmit) {
      return
    }

    const {
      mainColor,
      secondColor,
      thirdColor,
      bgColor1,
      bgColor2,
      textColor1,
      textColor2,
      iconColor1,
      mainColorText,
      statusBarColor,
      FontSize,
      OrderRadius,
      Padding_1,
      Padding_2,
      Padding_3,
      Margin_1,
      Margin_2,
      Margin_3,
      FontStyle,
    } = this.state
    const {
      AuthThemeType,
      StoreThemeType,
      UserThemeType,
    } = this.state
    // return
    if (!AuthThemeType || !StoreThemeType || !UserThemeType) {
      return LongToast('CantHaveEmptyInputs')
    }
    if (mainColor == '' || secondColor == '' || thirdColor == '' || !bgColor1 || !bgColor2 || !textColor1 || !textColor2 || !iconColor1 || !mainColorText || !statusBarColor) {
      return LongToast('CantHaveEmptyInputs')
    }
    if (Padding_1 < 0 || Padding_2 < 0 || Padding_3 < 0 || OrderRadius < 0) {
      return LongToast('NegativeValidation')
    }
    if (String(Padding_1) == '' || String(Padding_2) == '' || String(Padding_3) == '' || String(OrderRadius) == '') {
      return LongToast('CantHaveEmptyInputs')
    }
    if (Margin_1 < 0 || Margin_2 < 0 || Margin_3 < 0) {
      return LongToast('NegativeValidation')
    }
    if (String(Margin_1) == '' || String(Margin_2) == '' || String(Margin_3) == '') {
      return LongToast('CantHaveEmptyInputs')
    }


    if (FontSize < 10 || FontSize > 30) {
      return LongToast('FontSizeValidation')
    }

    if (!isValidHexColor(mainColor) || !isValidHexColor(secondColor) || !isValidHexColor(thirdColor) || !isValidHexColor(bgColor1)) {
      return LongToast('invaildColor')

    }

    if (!isValidHexColor(bgColor2) || !isValidHexColor(textColor1) || !isValidHexColor(textColor2) || !isValidHexColor(iconColor1)) {
      return LongToast('invaildColor')
    }

    if (!isValidHexColor(mainColorText) || !isValidHexColor(statusBarColor)) {
      return LongToast('invaildColor')
    }


    this.setState({ lockSubmit: true })
    this.lockSubmit = true

    PostStoreStyle({
      AuthThemeTypeId: AuthThemeType.Id,
      StoreThemeTypeId: StoreThemeType.Id,
      UserThemeTypeId: UserThemeType.Id,
      mainColor,
      secondColor,
      thirdColor,
      bgColor1,
      bgColor2,
      textColor1,
      textColor2,
      iconColor1,
      mainColorText,
      statusBarColor,
      FontSize,
      OrderRadius,
      Padding_1,
      Padding_2,
      Padding_3,
      Margin_1,
      Margin_2,
      Margin_3,
      FontStyle: FontStyle.Value
    }, res => {
      this.setState({ lockSubmit: false, didSucceed: true })
      this.lockSubmit = false
      this.props.navigation.goBack()
    }, err => {
      this.setState({ lockSubmit: false })
      this.lockSubmit = false
    })
  }
  renderRightComponentForArrowItem = (colorValue) => {
    return (
      <View>
        <Image source={require('../../assets/images/productOptions/wheel-5-ryb.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
        <View style={{ backgroundColor: colorValue, width: 20, height: 20, borderRadius: 10, left: 5, top: 5, position: "absolute" }}></View>
      </View>
    )
  }
  renderContent = () => {
    const {
      mainColor,
      secondColor,
      thirdColor,
      bgColor1,
      bgColor2,
      textColor1,
      textColor2,
      iconColor1,
      mainColorText,
      statusBarColor,
      FontSize,
      AuthThemeType,
      StoreThemeType,
      UserThemeType,
      FontStyle,
      Padding_1,
      Padding_2,
      Padding_3,
      Margin_1,
      Margin_2,
      Margin_3,
      OrderRadius
    } = this.state
    return (
      <ScrollView>

        <SettingsTitle title={"Color"} />

        <SettingsSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'mainColor', Value: fromHsv(mainColor) } })
          }}
          title={'MainColor'}
          rightComponent={this.renderRightComponentForArrowItem(mainColor)}
        />

        <ItemSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'secondColor', Value: fromHsv(secondColor) } })
          }}
          title={'SecondColor'}
          rightComponent={this.renderRightComponentForArrowItem(secondColor)}
        />

        <ItemSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'thirdColor', Value: fromHsv(thirdColor) } })
          }}
          title={'ThirdColor'}
          rightComponent={this.renderRightComponentForArrowItem(thirdColor)}
        />
        <ItemSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'bgColor1', Value: fromHsv(bgColor1) } })
          }}
          title={'bgColor1'}
          rightComponent={this.renderRightComponentForArrowItem(bgColor1 || '#ffffff')}
        />

        <ItemSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'bgColor2', Value: fromHsv(bgColor2) } })
          }}
          title={'bgColor2'}
          rightComponent={this.renderRightComponentForArrowItem(bgColor2 || '#ffffff')}
        />

        <ItemSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'textColor1', Value: fromHsv(textColor1) } })
          }}
          title={'textColor1'}
          rightComponent={this.renderRightComponentForArrowItem(textColor1 || '#ffffff')}
        />

        <ItemSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'textColor2', Value: fromHsv(textColor2) } })
          }}
          title={'textColor2'}
          rightComponent={this.renderRightComponentForArrowItem(textColor2 || '#ffffff')}
        />

        <ItemSeparator />

        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'iconColor1', Value: fromHsv(iconColor1) } })
          }}
          title={'iconColor1'}
          rightComponent={this.renderRightComponentForArrowItem(iconColor1 || '#ffffff')}
        />

        <ItemSeparator />
        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'mainColorText', Value: fromHsv(mainColorText) } })
          }}
          title={'mainColorText'}
          rightComponent={this.renderRightComponentForArrowItem(mainColorText || '#ffffff')}
        />

        <ItemSeparator />
        <ArrowItem
          style={{ ...shadowStyle0 }}
          onPress={() => {
            this.setState({ colorPickerShown: true, SelectedColor: { Name: 'statusBarColor', Value: fromHsv(statusBarColor) } })
          }}
          title={'statusBarColor'}
          rightComponent={this.renderRightComponentForArrowItem(statusBarColor || '#ffffff')}
        />

        <ItemSeparator />

        <SettingsTitle title={"Fonts"} />

        <SettingsSeparator />

        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          label="FontSize"
          keyboardType="numeric"
          value={String(FontSize)}
          onChangeText={(FontSize) => { this.setState({ FontSize }) }}
        />

        <ItemSeparator />

        <ArrowItem
          onPress={() => {
            this.AvailableFontsRef.current.show()
          }}
          title={'FontType'}
          info={FontStyle ? FontStyle.Text : this.props.translate('Defaultfont')}
        />

        <ItemSeparator />

        <SettingsTitle title={"Theme"} />

        <SettingsSeparator />

        <ArrowItem
          onPress={() => {
            this.AvailableAuthThemesRef.current.show()
          }}
          title={'AuthThemeType'}
          info={AuthThemeType ? AuthThemeType.Name : null}
        />

        <ItemSeparator />

        <ArrowItem
          onPress={() => {
            this.AvailableStoreThemesRef.current.show()
          }}
          title={'StoreThemeType'}
          info={StoreThemeType ? StoreThemeType.Name : null}
        />

        <ItemSeparator />

        <ArrowItem
          onPress={() => {
            this.AvailableUserThemesRef.current.show()
          }}
          title={'UserThemeType'}
          info={UserThemeType ? UserThemeType.Name : null}
        />

        <ItemSeparator />

        <SettingsTitle title={"Sizes"} />

        <SettingsSeparator />

        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          label="BorderRadius"
          keyboardType="numeric"
          value={String(OrderRadius)}
          onChangeText={(OrderRadius) => { this.setState({ OrderRadius }) }} />

        <ItemSeparator />


        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          keyboardType="numeric"
          label="Padding1"
          value={String(Padding_1)}
          onChangeText={(Padding_1) => { this.setState({ Padding_1 }) }} />

        <ItemSeparator />

        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          keyboardType="numeric"
          label="Padding2"
          value={String(Padding_2)}
          onChangeText={(Padding_2) => { this.setState({ Padding_2 }) }} />

        <ItemSeparator />

        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          keyboardType="numeric"
          label="Padding3"
          value={String(Padding_3)}
          onChangeText={(Padding_3) => { this.setState({ Padding_3 }) }} />

        <ItemSeparator />

        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          keyboardType="numeric"
          label="Margin1"
          value={String(Margin_1)}
          onChangeText={(Margin_1) => { this.setState({ Margin_1 }) }} />

        <ItemSeparator />

        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          keyboardType="numeric"
          label="Margin2"
          value={String(Margin_2)}
          onChangeText={(Margin_2) => { this.setState({ Margin_2 }) }} />

        <ItemSeparator />

        <HorizontalInput
          // maxLength={STRING_LENGTH_MEDIUM}
          keyboardType="numeric"
          label="Margin3"
          value={String(Margin_3)}
          onChangeText={(Margin_3) => { this.setState({ Margin_3 }) }} />

        <ItemSeparator />

        {/* {this.renderColorModal()} */}
        <CustomColorModal
          onBackdropPress={() => { this.setState({ colorPickerShown: false }) }}
          onChangeText={(text) => {
            const { SelectedColor } = this.state
            this.setState({ [SelectedColor.Name]: text })
          }}
          value={this.state[this.state.SelectedColor.Name]}
          onColorChange={color => {
            const { SelectedColor } = this.state
            this.setState({ [SelectedColor.Name]: fromHsv(color) })
          }}
          isVisible={this.state.colorPickerShown}
          onDonepress={() => { this.setState({ colorPickerShown: false }) }}
          defaultColor={mainColor}
        />
      </ScrollView>
    )
  }

  handelSelectedCoolor = () => {

    if (this.editingMainColor) {

      return this.state.MainColor
    }

    if (this.editingSecondColor) {

      return this.state.SecondColor
    }
    if (this.editingThirdColor) {
      return this.state.ThirdColor
    }
  }

  renderColorModal = () => (
    <Modal onBackdropPress={() => this.setState({ colorPickerShown: false })} isVisible={this.state.colorPickerShown}>
      <View style={{ width: this.state.screenWidth * .9, alignSelf: "center", paddingBottom: 35, backgroundColor: "#FFF", borderRadius: 10, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
        <ColorPicker
          onColorChange={(color) => {
            const { SelectedColor } = this.state
            this.setState({ [SelectedColor.Name]: fromHsv(color) })
          }}
          hideSliders={false}

          color={this.state[this.state.SelectedColor.Name]}
          // defaultColor={this.state[this.state.SelectedColor.Name]}
          style={{ width: 150, height: 150, marginVertical: 30 }}
        />
        <View style={{ flexDirection: "row", position: "absolute", bottom: -.5, justifyContent: "center", alignItems: "center" }}>
          <CustomTouchable onPress={() => this.setState({ colorPickerShown: false })} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: secondColor, }}>
            <TranslatedText style={{ color: "#FFF", padding: 10, paddingVertical: 15 }} text={'Done'} />
          </CustomTouchable>
        </View>
      </View>
    </Modal>
  )

  render() {
    const {
      AvailableAuthThemes,
      AvailableStoreThemes,
      AvailableUserThemes,
      didFetchData,
      AuthThemeType,
      StoreThemeType,
      UserThemeType,
      AvailableFonts
    } = this.state
    if (!didFetchData) {
      return null
    }
    return (
      <LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }} >
        <CustomHeader
          navigation={this.props.navigation}
          title={"StoreStyle"}
          rightComponent={
            <HeaderSubmitButton
              isLoading={this.state.lockSubmit}
              didSucceed={this.state.didSucceed}
              onPress={() => { this.submit() }} />
          } />

        {this.renderContent()}

        {/* {this.renderColorModal()} */}


        <CustomSelector
          ref={this.AvailableUserThemesRef}
          options={AvailableUserThemes.map(item => item.Name)}
          onSelect={(index) => {
            this.setState({ UserThemeType: AvailableUserThemes[index] })
          }}
          onDismiss={() => { }}
        />

        <CustomSelector
          ref={this.AvailableStoreThemesRef}
          options={AvailableStoreThemes.map(item => item.Name)}
          onSelect={(index) => {
            this.setState({ StoreThemeType: AvailableStoreThemes[index] })
          }}
          onDismiss={() => { }}
        />

        {AvailableFonts && <CustomSelector
          ref={this.AvailableFontsRef}
          options={AvailableFonts.map(item => item.Text)}
          onSelect={(index) => {
            this.setState({ FontStyle: AvailableFonts[index] })
          }}
          onDismiss={() => { }}
        />}

        <CustomSelector
          ref={this.AvailableAuthThemesRef}
          options={AvailableAuthThemes.map(item => item.Name)}
          onSelect={(index) => {
            this.setState({ AuthThemeType: AvailableAuthThemes[index] })
          }}
          onDismiss={() => { }}
        />

      </LazyContainer>
    )
  }
}

export default withLocalize(StoreStyle)