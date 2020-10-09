import AntDesign from './icons/AntDesign.json'
import Entypo from './icons/Entypo.json'
import EvilIcons from './icons/EvilIcons.json'
import Feather from './icons/Feather.json'
import FontAwesome from './icons/FontAwesome.json'
import Foundation from './icons/Foundation.json'
import MaterialCommunityIcons from './icons/MaterialCommunityIcons.json'
import MaterialIcons from './icons/MaterialIcons.json'
import Octicons from './icons/Octicons.json'
import SimpleLineIcons from './icons/SimpleLineIcons.json'
import Zocial from './icons/Zocial.json'
import Ionicons from './icons/Ionicons.json'

export const getIconsArray = () => {
    var iconsArray = []
    Ionicons.map(item => iconsArray.push({ familyName: 'Ionicons', iconName: item }))
    AntDesign.map(item => iconsArray.push({ familyName: 'AntDesign', iconName: item }))
    Entypo.map(item => iconsArray.push({ familyName: 'Entypo', iconName: item }))
    EvilIcons.map(item => iconsArray.push({ familyName: 'EvilIcons', iconName: item }))
    Feather.map(item => iconsArray.push({ familyName: 'Feather', iconName: item }))
    FontAwesome.map(item => iconsArray.push({ familyName: 'FontAwesome', iconName: item }))
    Foundation.map(item => iconsArray.push({ familyName: 'Foundation', iconName: item }))
    MaterialCommunityIcons.map(item => iconsArray.push({ familyName: 'MaterialCommunityIcons', iconName: item }))
    MaterialIcons.map(item => iconsArray.push({ familyName: 'MaterialIcons', iconName: item }))
    Octicons.map(item => iconsArray.push({ familyName: 'Octicons', iconName: item }))
    SimpleLineIcons.map(item => iconsArray.push({ familyName: 'SimpleLineIcons', iconName: item }))
    Zocial.map(item => iconsArray.push({ familyName: 'Zocial', iconName: item }))
    return iconsArray
}