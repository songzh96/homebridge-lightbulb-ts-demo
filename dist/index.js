'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var net = _interopDefault(require('net'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var Service, Characteristic;
var onbuf = "turn on"; //cmd: turn on

var offbuf = "turn off"; //cmd: turn off

var inibuf = "check"; //cmd: reset
// 注册Accessory设备

function index (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-Lightbulb", "MyLightbulb", MyLightbulb);
}

var MyLightbulb =
/*#__PURE__*/
function () {
  function MyLightbulb(log, config) {
    _classCallCheck(this, MyLightbulb);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "LightbulbService", void 0);

    _defineProperty(this, "socket", void 0);

    this.log = log;
    this.name = config["name"];
    var informationService = new Service.AccessoryInformation();
    var LightbulbService = new Service.Lightbulb(this.name);
    LightbulbService.getCharacteristic(Characteristic.On).on("get", this.getLightOnCharacteristic.bind(this)).on("set", this.setLightOnCharacteristic.bind(this));
    this.LightbulbService = LightbulbService;
    this.socket = new net.Socket();
    this.socket.connect(8989, "localhost", function () {
      console.log("Connecte Server OK!"); //connect ser2net
    });
    this.socket.on("error", console.error); // logs socket error messages
  }

  _createClass(MyLightbulb, [{
    key: "getServices",
    value: function getServices() {
      var LightbulbService = this.LightbulbService;
      return [LightbulbService];
    }
  }, {
    key: "getLightOnCharacteristic",
    value: function getLightOnCharacteristic(callback) {
      console.log("**************Get on Function**************");
      callback(null);
    }
  }, {
    key: "setLightOnCharacteristic",
    value: function setLightOnCharacteristic(on, callback) {
      console.log("**************Set on Function:" + on + "**************");

      if (on) {
        this.socket.write(onbuf);
      } else {
        this.socket.write(offbuf);
      }

      setTimeout(function () {
        console.log(inibuf);
      }, 500); //500ms Rest init statue

      callback(null);
    }
  }]);

  return MyLightbulb;
}();

module.exports = index;
