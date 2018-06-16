import web3
import binascii
def getHex(string):
	return binascii.hexlify(web3.Web3.sha3(text=string))[0:32]
username = getHex("123")
passwd = getHex("456")
name = getHex("hello")
data =  binascii.hexlify("hello world!".encode("utf8"))
print(	'"0x'+username.decode()+'"', 
		'"0x'+passwd.decode()+'"', 
		'"0x'+name.decode()+'"', 
		'"0x'+data.decode()+'"')
# print(name, passwd, binascii.hexlify("hello world!".encode("utf8")))