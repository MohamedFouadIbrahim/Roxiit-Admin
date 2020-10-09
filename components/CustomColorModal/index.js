import React from 'react'
import { View, StyleSheet } from 'react-native';
import TranslatedText from '../TranslatedText';
import HorizontalInput from '../HorizontalInput';
import CustomTouchable from '../CustomTouchable';
import Modal from "react-native-modal";
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import { screenWidth } from '../../constants/Metrics';
import { secondColor } from '../../constants/Colors';
import { isValidHexColor } from '../../utils/Validation';
import { LongToast } from '../../utils/Toast';

class CustomColorModal extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            colorPickerShown: false,
            text: ''
        }

    }

    render() {

        const { onBackdropPress, onChangeText, value, onColorChange, onDonepress, defaultColor, isVisible } = this.props

        return (
            <Modal
                onBackdropPress={() => { onBackdropPress && onBackdropPress() }}
                isVisible={isVisible}
            >

                <View style={Styles.ViewContainer}>


                    <HorizontalInput
                        maxLength={7}
                        style={{ textAlign: 'right' }}
                        value={value}
                        label='HexColor'
                        onChangeText={(text) => {
                            this.setState({ text })
                            onChangeText && onChangeText(text)
                        }}
                    />

                    <ColorPicker
                        onColorChange={color => {
                            this.setState({ text: '' })
                            onColorChange && onColorChange(fromHsv(color))
                        }}
                        hideSliders={false}
                        color={value}
                        defaultColor={defaultColor}
                        style={{ width: 150, height: 150, marginVertical: 30 }}
                    />

                    <View style={Styles.ButtonContainer}>
                        <CustomTouchable onPress={() => {
                            if (this.state.text && this.state.text.length && !isValidHexColor(this.state.text)) {

                                return LongToast('invaildColor')

                            } else {
                                onDonepress && onDonepress()
                            }
                        }} style={Styles.Button}>
                            <TranslatedText style={{ color: "#FFF", padding: 10, paddingVertical: 15 }} text={'Done'} />
                        </CustomTouchable>
                    </View>

                </View>

            </Modal>
        )
    }
}
const Styles = StyleSheet.create({
    ViewContainer: {
        width: screenWidth * .9,
        alignSelf: "center",
        paddingBottom: 35,
        backgroundColor: "#FFF",
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center"
    },
    ButtonContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: -.5,
        justifyContent: "center",
        alignItems: "center"
    },
    Button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: secondColor,
    }
})
export default CustomColorModal 
