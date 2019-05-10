'use strict';

module.exports = function (RED) {
  // Configuration node
  // function GoogleHomeConfig(n) {
  //   RED.nodes.createNode(this, n);

  //   this.ipaddress = n.ipaddress;
  //   this.language = n.language;
  //   this.name = n.name;

  //   //Prepare language Select Box
  //   var obj = require('./languages');
  //   //map to Array:
  //   var languages = [];
  //   for (var key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       languages.push({
  //         key: key,
  //         value: obj[key]
  //       });
  //     }
  //   };

  //   //Build an API for config node HTML to use
  //   RED.httpAdmin.get('/languages', function (req, res) {
  //     res.json(languages || []);
  //   });

  //   //Known issue: when 'language' is Default/Auto, this will fail & return undefined
  //   this.googlehomenotifier = require('google-home-notify')(this.ipaddress, this.language, 1);

  //   //Build another API to auto detect IP Addresses
  //   discoverIpAddresses('googlecast', function (ipaddresses) {
  //     RED.httpAdmin.get('/ipaddresses', function (req, res) {
  //       res.json(ipaddresses);
  //     });
  //   });
  // };

  // function discoverIpAddresses(serviceType, discoveryCallback) {
  //   var ipaddresses = [];
  //   var bonjour = require('bonjour')();
  //   var browser = bonjour.find({
  //     type: serviceType
  //   }, function (service) {
  //     service.addresses.forEach(function (element) {
  //       if (element.split(".").length == 4) {
  //         var label = "" + service.txt.md + " (" + element + ")";
  //         ipaddresses.push({
  //           label: label,
  //           value: element
  //         });
  //       }
  //     });

  //     //Add a bit of delay for all services to be discovered
  //     if (discoveryCallback)
  //       setTimeout(function () {
  //         discoveryCallback(ipaddresses);
  //       }, 2000);
  //   });
  // }

  // RED.nodes.registerType("googlehome-config-node", GoogleHomeConfig);

  //--------------------------------------------------------

  function TcpPing(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    const tcpie = require('tcpie');
    //Validate config node
    // var config = RED.nodes.getNode(n.server);
    // this.configname = config.name;
    // if (config === null || config === undefined) {
    //   node.status({
    //     fill: "red",
    //     shape: "ring",
    //     text: "please create & select a config node"
    //   });
    //   return;
    // }

    //On Input
    node.on('input', function (msg) {
      
      //override standard node config
      const ip = msg.payload.ip || n.ip;
      const port = msg.payload.port || n.port;
      const count = msg.payload.count || n.count;
      const interval = msg.payload.interval || n.interval;
      const timeout = msg.payload.timeout || n.timeout;

    
      const pie = tcpie(ip, port, {count: count, interval: interval, timeout: timeout});

      pie.on('connect', function(stats) {
        node.status({
          fill: "green",
          shape: "ring",
          text: "Connecting.."
        });
        console.info('connect', stats);
      }).on('error', function(err, stats) {
        node.status({
          fill: "red",
          shape: "ring",
          text: err
        });
        console.error('error', err);
      }).on('timeout', function(stats) {
        node.status({
          fill: "orange",
          shape: "ring",
          text: "Timeout occured"
        });
        console.info('timeout', stats);
      }).on('end', function(stats) {
        node.status({
          fill: "green",
          shape: "ring",
          text: "Finished"
        });
        console.info(stats);
        msg.payload = stats;
        node.send(msg);
        // -> {
        // ->   sent: 10,
        // ->   success: 10,
        // ->   failed: 0,
        // ->   target: { host: 'google.com', port: 443 }
        // -> }
      }).start();

    });

    node.status({
      fill: "blue",
      shape: "dot",
      text: "ready"
    });
  };

  RED.nodes.registerType("tcp-ping", TcpPing);

};
