const { JSDOM, VirtualConsole } = require('jsdom');
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", (err) => { console.log("JSDOM ERROR:", err.message, err.stack); });
virtualConsole.on("jsdomError", (err) => { console.log("JSDOM JSDOMERROR:", err.message, err.detail); });
virtualConsole.on("log", (msg) => { console.log("JSDOM LOG:", msg); });

JSDOM.fromURL("http://localhost:4201/", {
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
}).then(dom => {
  setTimeout(() => {
    console.log("HTML length after 2s:", dom.window.document.body.innerHTML.length);
  }, 2000);
}).catch(e => console.error(e));
