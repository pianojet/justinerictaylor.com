#!/bin/bash

BASEAPP=/root/justinerictaylor.com

APP1=$BASEAPP/led
APP2=$BASEAPP/bb8
APP3=$BASEAPP/fit

apache2ctl restart

#export NVM_DIR="/root/.nvm"
#[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

#nvm use v0.10.38

cd $APP1
gulp bower
node app.js > $BASEAPP/led.log 2> $BASEAPP/led.log &

cd $APP2
gulp bower
node app.js > $BASEAPP/bb8.log 2> $BASEAPP/bb8.log &

cd $APP3
gulp bower
node app.js > $BASEAPP/fit.log 2> $BASEAPP/fit.log &
