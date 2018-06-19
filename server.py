import http.server 
import socketserver
import os

rootdir='D:/Projects/SC_record/'
os.chdir(rootdir)
PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
httpd.serve_forever()