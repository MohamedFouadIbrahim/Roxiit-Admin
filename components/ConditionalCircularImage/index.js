import React from 'react';
import ConditionalRemoteImage from '../ConditionalRemoteImage';
import { Image } from 'react-native';

export default (props) => {
    const {
        remote = false, // if a remote image or not
        style,
        size = 56,
        dimension = 250,
        uri,
        ...otherProps
    } = props;
    return (
        <ConditionalRemoteImage
            remote={remote}
            uri={uri}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                ...style
            }}
            dimension={dimension}
            wide={false}
            {...otherProps} />
    )
}