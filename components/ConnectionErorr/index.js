import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { largePagePadding } from '../../constants/Style';
import CustomButton from '../CustomButton';
import FontedText from '../FontedText';

const ConnectionErorr = (props) => {

    const { 
        loading,
        onPress
    } = props

    const [showModal, setShowModal] = useState(true)

    return (
        <Modal isVisible={showModal} {...props} style={{ backgroundColor: 'white', margin: 0, paddingHorizontal: largePagePadding, justifyContent: 'center' }}  >


            <Image source={require('../../assets/images/offline/ConnenctionErorr.png')} style={{
                width:200, 
                height:200,
                alignSelf:'center',
                marginBottom: 10
            }} />

            <View
                style={{
                    alignSelf: 'center',
                    marginVertical: largePagePadding
                }}>

                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 30, marginBottom: 10, alignSelf: 'center' }}>
                    Oh no!!!
                </Text>

                <FontedText style={{fontSize: 15}} >
                    No Internet found, Check you connection or try again.
                </FontedText>
            </View>

            <CustomButton
                onPress={()=> onPress && onPress()}
                title='tryAgain'
                autoTranslate={false}
                loading={loading}
            />

        </Modal>
    )
}

export default ConnectionErorr