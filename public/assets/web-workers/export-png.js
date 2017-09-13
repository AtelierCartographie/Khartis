self.addEventListener('message', function(e) {
  var data = e.data;
  var port = e.ports[0];
  postMessage(window.localStorage.getItem("khartis-project"));

  // // Do your stuff here.
  // if (port) {
  //   // Message sended throught a worker created with 'open' method.
  //   port.postMessage({ foo: 'foo' });
  // } else {
  //   // Message sended throught a worker created with 'send' or 'on' method.
  //   postMessage({ bar: 'bar' });
  // }
}, false);

// Ping the Ember service to say that everything is ok.
postMessage(true);
