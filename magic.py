import os
import ftplib

from sys import exit
from git import Repo

url = "ftp.voxeo.net"
user = "npip107"
passwd = "weird.suntan92"

repo = Repo('.')

repo_files = repo.untracked_files + [ item.a_path for item in repo.index.diff(None) ]

if len(repo_files) > 0:
    session = ftplib.FTP(url, user, passwd)
    for file in repo_files:
        if file.endswith(".vxml") or file.endswith(".jsgf"):
            print("Uploading: {}".format(file))
            with open(file, 'rb') as f:
                session.storbinary('STOR www/{}'.format(file), f)     # send the file
                
    session.quit()
else:
    print("Nothing to upload")
    exit()
