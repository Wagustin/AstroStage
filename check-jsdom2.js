const { JSDOM, VirtualConsole } = require('jsdom');
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", (err) => { console.log("JSDOM ERROR:", err.message, err.stack); });
JSDOM.fromURL("http://localhost:4201/", {
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
}).then(dom => {
  setTimeout(() => {
    console.log("HTML:", dom.window.document.body.innerHTML);
  }, 3000);
}).catch(e => console.error(e));
