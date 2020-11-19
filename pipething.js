#!/usr/bin/env node
const Mesh = require('webrtc-mesh').Mesh;
var minimist = require('minimist')
var dedent = require('dedent')

var help = dedent`
    Usage: pipething <topic>
    Examples:
      # TODO
      echo hello | pipething test123
`
var args = minimist(process.argv.slice(2))
var topic = args._[0];

var config = {
  url: 'wss://de.meething.space:443/'+topic,
  key: topic
}
var mesh = Mesh(config);

mesh.pipe( (ev) => {
  process.stdout.write(Buffer.from(ev.data));
  });
process.stdin.on('data', data => { mesh.sendToAll(data) });

