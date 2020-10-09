import Sound from 'react-native-sound';

export const loadProductPenddingSoundAndPlay = () => {

  const alert = new Sound('alert.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      return;
    }
    // loaded successfully

    // Play the sound with an onEnd callback
    alert.play((success) => {
      if (success) {
      } else {
      }
    });
  });
}