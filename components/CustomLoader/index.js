import React from 'react';
import { secondColor } from '../../constants/Colors.js';
import * as Progress from 'react-native-progress';


const CustomLoader = (props) => {
    const {
        size,
        progress,
        style,
        otherProps
    } = props
    return (
        <Progress.Circle
            size={size || 60}
            style={[{ position: 'absolute', backgroundColor: 'white', borderRadius: 60 }, style]}
            progress={progress}
            animated
            showsText={true}
            strokeCap='round'
            color={secondColor}
            {...otherProps}
        />
    )
}





export default CustomLoader