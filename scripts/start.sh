#!/bin/bash

BASEAPP=/root/justinerictaylor.com

APP1=$BASEAPP/led
APP2=$BASEAPP/bb8

apache2ctl restart

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm use v0.10.38

cd $APP1
node app.js > $BASEAPP/led.log 2> $BASEAPP/led.log &

cd $APP2
node app.js > $BASEAPP/bb8.log 2> $BASEAPP/bb8.log &
