const screenshot = require('screenshot-desktop');

screenshot.listDisplays().then((displays) => {
  // displays: [{ id, name }, { id, name }]
  screenshot({ screen: displays[displays.length - 1].id })
    .then((img) => {
        console.log(234234)
      // img: Buffer of screenshot of the last display
    });
})