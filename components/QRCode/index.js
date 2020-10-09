import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const QR = ({ size, value, ...resPorps }) => (

    <QRCode
        {...resPorps}
        size={size}
        value={value}
    />

)
export default QR