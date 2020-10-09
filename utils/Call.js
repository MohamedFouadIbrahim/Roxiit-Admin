import { Linking, Alert, Platform } from 'react-native';
import { ExternalTranslate } from './Translate.js';

export const PhoneCall = (ActivePhone) => {
    let phoneNumber = ActivePhone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${ActivePhone}`;
    }
    else {
        phoneNumber = `tel:${ActivePhone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert(ExternalTranslate('PhoneAlert'));
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => { });
}


export const Whatsapp = (ActivePhone) => {
    let link = `https://api.whatsapp.com/send?phone=${ActivePhone}`
    Linking.openURL(link)
        .then(supported => {
            if (!supported) {
                Alert.alert(
                    ExternalTranslate('WhatsappAlert')
                );
            } else {
                return Linking.openURL(link);
            }
        }).catch(err => console.error('An error occurred', err));
}