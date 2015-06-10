#!/bin/bash

APP1=/root/justinerictaylor.com/led
APP1=/root/justinerictaylor.com/bb8

nvm use v0.10.38

cd APP1
node app.js &

cd APP2
node app.js &
