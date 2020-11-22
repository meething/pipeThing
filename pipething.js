#!/usr/bin/env node
const Mesh = require('webrtc-mesh').Mesh;
var minimist = require('minimist')
var dedent = require('dedent')
var bulk = require('bulk-write-stream')

var help = dedent`
    Usage: pipething <topic> <optional server>
    Examples:
      # TODO
      echo hello | pipething test123
`
var args = minimist(process.argv.slice(2))
var topic = args._[0] || 'pipething';
var url = args._[1] || 'wss://de.meething.space:443/'+topic;

var config = {
  url: url,
  key: topic,
  debug: false
}
var mesh = Mesh(config);

var meshedStream = mesh.getStream();
mesh.pipe(meshedStream.push.bind(meshedStream));
process.stdin.pipe(meshedStream).pipe(process.stdout);
