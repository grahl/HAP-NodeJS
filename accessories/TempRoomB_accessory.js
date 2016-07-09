var Temperature = 0.0;

// MQTT Setup
var mqtt = require('mqtt');
console.log("Connecting to MQTT broker...");
var mqtt = require('mqtt');
var options = {
    port: 1883,
    host: '10.0.1.1',
    clientId: 'RoomBTemperatureSensor'
};
var client = mqtt.connect(options);
client.subscribe('RoomBTemperature');
client.on('message', function (topic, message) {
    Temperature = parseFloat(message);
});

var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;

var sensorUUID = uuid.generate('hap-nodejs:accessories:roomb-temperature-sensor');
var sensor = exports.accessory = new Accessory('Temperature Sensor', sensorUUID);

sensor
    .addService(Service.TemperatureSensor, "Thermometer")
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', function (callback) {
        callback(null, Temperature);
    });

setInterval(function () {
    sensor
        .getService(Service.TemperatureSensor)
        .setCharacteristic(Characteristic.CurrentTemperature, Temperature)
}, 5000);
