import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { secondColor } from '../../constants/Colors';


const IncrementOrDecrement = ({ containerStyle, onIcrement, onDecrement, children }) => {

    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, { containerStyle }]} >

            <Icons
                onPress={() => { onDecrement && onDecrement() }}
                name={'ios-remove-circle'}
                color={secondColor}
                size={22}
                style={{ margin: 5 }}
            />

            {children}

            <Icons
                onPress={() => { onIcrement && onIcrement() }}
                name={'ios-add-circle'}
                color={secondColor}
                size={22}
                style={{ margin: 5 }}
            />
        </View>
    );
}

export default IncrementOrDecrement;