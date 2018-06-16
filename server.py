import http.server 
import socketserver
import os
PORT_NUMBER = 8080


rootdir='D:/Projects/SC_record/'
os.chdir(rootdir)
PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
httpd.serve_forever()