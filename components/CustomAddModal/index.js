import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TranslatedText from "../../components/TranslatedText/index";
import CustomTouchable from "../../components/CustomTouchable";
import Modal from "react-native-modal";
import { mainColor, secondColor } from "../../constants/Colors.js";
import { withLocalize } from "react-localize-redux";
import { screenHeight, screenWidth } from '../../constants/Metrics.js';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontedText from "../../components/FontedText/index.js";
import RoundedCloseButton from '../../components/RoundedCloseButton/index.js';

class CustomAddModal extends React.Component {
    render() {
        const { onBackdropPress, isVisible, RoundedCloseButtonPress, loading, onSubmit, error, onErrorMsgClosePress, otherProps, Edit } = this.props
        return (
            <Modal onBackdropPress={onBackdropPress} isVisible={isVisible} {...otherProps} >
                {
                    error ?
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            colors={['#f24b80', '#f26390']}
                            style={Styles.LinearGradient}>

                            <FontedText style={{ flex: 1, color: "#FFF", fontSize: 14, }}>{error}</FontedText>
                            <CustomTouchable onPress={() => {

                            }} style={{ flex: .3, alignItems: "flex-end" }}>
                                <AntDesign name="close" color="#FFF" size={18} onPress={onErrorMsgClosePress} />
                            </CustomTouchable>
                        </LinearGradient> : null
                }
                <View style={Styles.subContainer} >

                    <View style={{ marginVertical: 10, marginRight: 10, alignItems: 'flex-end' }}>
                        <RoundedCloseButton onPress={RoundedCloseButtonPress} />
                    </View>

                    {this.props.children}

                    <CustomTouchable
                        style={Styles.CustomButton}
                        onPress={onSubmit}>
                        {
                            loading == true ? <ActivityIndicator color="#FFF" size="small" style={{ paddingVertical: 13 }} /> :
                                <TranslatedText style={{ color: '#FFF', textAlign: "center", paddingVertical: 13 }} text={Edit == true ? 'Update': "Add"} />
                        }
                    </CustomTouchable>

                </View>
            </Modal>
        )
    }
}
const Styles = StyleSheet.create({
    subContainer: {
        backgroundColor: 'white',
        borderBottomEndRadius: 22,
        borderBottomLeftRadius: 22,
        borderTopEndRadius: 22,
        borderTopLeftRadius: 22,
        paddingBottom: 0
    },
    CustomButton: {
        backgroundColor: secondColor,
        justifyContent: "center",
        alignItems: "center",
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
        marginBottom: 0
    },
    LinearGradient: {
        width: screenWidth - 40,
        borderRadius: 40,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 15,
        opacity: .99,
        alignSelf: 'center',
        marginBottom: 20
    }
})
export default withLocalize(CustomAddModal)