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
//process.stdin.on('data', data => { mesh.sendToAll(data) });
//mesh.pipe( (ev) => { process.stdout.write(Buffer.from(ev.data)) });

var meshedStream = mesh.getStream();
mesh.pipe(meshedStream.push.bind(meshedStream));
process.stdin.pipe(meshedStream).pipe(process.stdout);

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}
