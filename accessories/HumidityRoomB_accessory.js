var Humidity = 0.0;

// MQTT Setup
var mqtt = require('mqtt');
console.log("Connecting to MQTT broker...");
var mqtt = require('mqtt');
var options = {
    port: 1883,
    host: '10.0.1.1',
    clientId: 'RoomBHumiditySensor'
};
var client = mqtt.connect(options);
client.subscribe('RoomBHumidity');
client.on('message', function (topic, message) {
    Humidity = parseFloat(message);
});

var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;

var sensorUUID = uuid.generate('hap-nodejs:accessories:roomb-humidity-sensor');
var sensor = exports.accessory = new Accessory('Humidity Sensor', sensorUUID);

sensor
    .addService(Service.HumiditySensor, "Humidity")
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .on('get', function (callback) {
        // return our current value
        callback(null, Humidity);
    });

setInterval(function () {
    sensor
        .getService(Service.HumiditySensor)
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, Humidity);
}, 5000);
