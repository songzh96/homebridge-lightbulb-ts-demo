// 1 引入模块
const net = require("net");
// 2 创建服务器
let clientArr = [];
const server = net.createServer();
// 3 绑定链接事件
server.on("connection", person => {
  console.log(clientArr.length);
  // 记录链接的进程
  person.id = clientArr.length;
  clientArr.push(person);
  person.setEncoding("utf8");
  // 客户socket进程绑定事件
  person.on("data", chunk => {
    console.log(chunk);
    clientArr.forEach(val => {
      // 数据写入全部客户进程中
      val.write(chunk);
    });
  });
  person.on("close", p1 => {
    clientArr[p1.id] = null;
  });
  person.on("error", p1 => {
    clientArr[p1.id] = null;
  });
});
server.listen(8989);
