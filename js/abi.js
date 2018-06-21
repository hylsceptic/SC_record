address = "0xfDCF0643598Ad42c0e9ac809B7ac5DaC2c3a70B2";
abi = [{"constant":false,"inputs":[{"name":"_username","type":"bytes32"},{"name":"_name","type":"bytes32"},{"name":"_data","type":"string"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"writePublicRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"a1","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"witnesses","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_confirmer","type":"bytes32"},{"name":"_drafter","type":"bytes32"},{"name":"_dataNameHash","type":"bytes32"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"confirm","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"sigs","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"passwords","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_new","type":"address"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"changePasswd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"records","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_username","type":"bytes32"},{"name":"_passwd","type":"address"}],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_eyewitness","type":"bytes32"},{"name":"_confirmer","type":"bytes32"},{"name":"_drafter","type":"bytes32"},{"name":"_dataNameHash","type":"bytes32"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"name":"witness","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_username","type":"bytes32"},{"name":"_name","type":"bytes32"}],"name":"readPublicRecord","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"msgHash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"recoverAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"pure","type":"function"}]
  module.exports.abi = abi;  
  module.exports.address = address; 
  