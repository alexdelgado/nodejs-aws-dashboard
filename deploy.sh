#!/bin/bash

# ==========
# Install Nginx
#
# @url https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
# ==========

apt-get update
apt-get install nginx

# ==========
# Install NodeJs
#
# @url https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
# ==========

cd ~
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt-get install nodejs
apt-get install build-essential

# Install PM2
cd /var/www/awsdashboard.dev/
npm install -g pm2
pm2 start server.js --watch
pm2 startup systemd
env PATH=$PATH:/usr/bin /usr/local/bin/pm2 startup systemd -u $USER --hp $HOME

#  Set Up Nginx as a Reverse Proxy Server
sudo su
    cp ./config/awsdashboard.dev /etc/nginx/sites-available/awsdashboard.dev
    ln -s /etc/nginx/sites-available/awsdashboard.dev /etc/nginx/sites-enabled/awsdashboard.dev
    systemctl restart nginx
exit
