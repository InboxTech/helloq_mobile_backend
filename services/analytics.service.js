const amplitude = require('amplitude-js');

amplitude.getInstance().init('YOUR_AMPLITUDE_KEY');

const track = (event, props = {}) => {
  amplitude.getInstance().logEvent(event, props);
};

module.exports = { track };