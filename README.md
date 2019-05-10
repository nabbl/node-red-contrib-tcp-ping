# node-red-contrib-tcp-ping

This node is based on the tcpie nodejs library:
<a href="https://www.npmjs.com/package/tcpie"></a>

## What it does:

Sends a TCP ping to a ip adresse and port and outputs the results. It is great to test multiple servers running on a device.
For example when you have Plex and some Dashboards and so on running on different ports on your Raspberry PI and want to see if they are still running and responding.

## How it works:

### Text Notification

Hook up an Inject-Node to the Input channel and send a trigger to test your tcp adress. Configure the tcp ping node with all the necessary fields. It should output the results in the msg.payload.

host string : the destination host name or IP address. Required.
port number : the destination port. Default: 22.
opts object : options for count, interval and timeout. Defaults: Infinity, 1000, 3000.

### To install: 

Install node-red.

Install this package with "npm install node-red-contrib-tcp-ping --save" in ~./node-red or via the Palette Manager in node-red.

If everything was successfull you should see a new node in the network category in node-red after a restart.
