import React from 'react';
import { View } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import CustomSelector from '../CustomSelector';
import { OpenCamera, OpenMultiSelectImagePicker, ClearTempImage, OpenSingleSelectImagePicker } from '../../utils/Image';

class CustomImagePicker extends React.Component {

    constructor(props) {
        super(props)
        const { translate } = this.props
        this.LibraryOrCameraOptions = [{ Id: 0, Name: translate('Camera') }, { Id: 1, Name: translate('Library') }]
    }

    render() {
        const { onSelect, refrence, multiple } = this.props
        return (
            <View>
                <CustomSelector
                    ref={refrence}
                    options={this.LibraryOrCameraOptions.map(item => item.Name)}
                    onSelect={(index) => {
                        if (index == 0) {

                            OpenCamera(images => {
                                onSelect && onSelect(images)
                            })

                        } else {
                            if (multiple) {

                                OpenMultiSelectImagePicker(images => {
                                    onSelect && onSelect(images)
                                })

                            } else {

                                OpenSingleSelectImagePicker(images => {
                                    onSelect && onSelect(images)
                                })
                                
                            }
                        }
                    }}
                    onDismiss={() => { }}
                />
            </View>
        )
    }
}

export default withLocalize(CustomImagePicker);