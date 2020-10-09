import React from 'react';
import { View } from 'react-native';
import CustomLoader from '../CustomLoader/index';
import CircularImage from '../CircularImage/index';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { mainColor } from '../../constants/Colors';
import { largePagePadding } from '../../constants/Style'
const CircularImageWithLoader = (props) => {
    const {
        uploadingImage,
        imageSize,
        editingMode,
        picker_image_uri,
        ImageUrl,
        prossesEvent
    } = props
    if (editingMode == true) {
        return (
            <View>
                <CircularImage
                    uri={picker_image_uri || ImageUrl}
                    size={imageSize} />

                <FontAwesome
                    style={{
                        position: 'absolute',
                        right: 2,
                        bottom: 2,
                    }}
                    name={`camera`}
                    size={20}
                    color={mainColor} />

                {uploadingImage == true ?
                    <CustomLoader
                        size={imageSize - 30}
                        progress={prossesEvent == 0 ? prossesEvent : prossesEvent}
                    />
                    : null
                }
            </View>
        )
    } else {
        return (
            <View
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#aaaaaa',
                    margin: largePagePadding,
                    width: imageSize,
                    height: imageSize,
                    borderRadius: imageSize / 2,
                }}

            >
                {
                    picker_image_uri ? <CircularImage
                        uri={picker_image_uri}
                        size={imageSize} /> : <Ionicons
                            name={`ios-add`}
                            size={45}
                            color={'white'} />
                }

                {
                    uploadingImage == true ?
                        <CustomLoader
                            size={imageSize - 30}
                            progress={prossesEvent == 0 ? prossesEvent : prossesEvent}
                        />
                        : null
                }
            </View>
        )
    }

}
export default CircularImageWithLoader
