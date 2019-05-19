//mySwitch完整index.js代码
import net from "net";

let Service: any, Characteristic: any;
let onbuf = "turn on"; //cmd: turn on
let offbuf = "turn off"; //cmd: turn off
let inibuf = "check"; //cmd: reset


// 注册Accessory设备
export default function(homebridge: any) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-Lightbulb", "MyLightbulb", MyLightbulb);
}

class MyLightbulb {
  log: Function;
  name: string;
  LightbulbService: any;
  socket: net.Socket;

  constructor(log, config) {
    this.log = log;
    this.name = config["name"];

    const informationService = new Service.AccessoryInformation();
    const LightbulbService = new Service.Lightbulb(this.name);
    LightbulbService
      .getCharacteristic(Characteristic.On)
      .on("get", this.getLightOnCharacteristic.bind(this))
      .on("set", this.setLightOnCharacteristic.bind(this));
    this.LightbulbService = LightbulbService;

    this.socket = new net.Socket();
    this.socket.connect(8989, "localhost", function() {
      console.log("Connecte Server OK!"); //connect ser2net
    });
    this.socket.on("error", console.error); // logs socket error messages
  }

  getServices() {
    const { LightbulbService } = this;
    return [LightbulbService];
  }

  getLightOnCharacteristic(callback: (arg0: any) => void) {
    console.log("**************Get on Function**************");
    callback(null);
  }

  setLightOnCharacteristic(on: boolean, callback: (arg0: any) => void) {
    console.log("**************Set on Function:" + on + "**************");

    if (on) {
      this.socket.write(onbuf);
    } else {
      this.socket.write(offbuf);
    }

    setTimeout(function() {
      console.log(inibuf);
    }, 500); //500ms Rest init statue

    callback(null);
  }
}
