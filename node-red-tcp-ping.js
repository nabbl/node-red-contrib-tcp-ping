'use strict';

module.exports = function (RED) {

  function TcpPing(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    const tcpie = require('tcpie');
    //On Input
    node.on('input', function (msg) {
      
      //override standard node config
      const ip = msg.payload.ip || n.ip;
      const port = msg.payload.port || n.port;
      const count = msg.payload.count || n.count;
      const interval = msg.payload.interval || n.interval;
      const timeout = msg.payload.timeout || n.timeout;

      msg.topic = msg.topic || n.topic;

    
      const pie = tcpie(ip, parseInt(port), {count: parseInt(count), interval: parseInt(interval), timeout: parseInt(timeout)});

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
