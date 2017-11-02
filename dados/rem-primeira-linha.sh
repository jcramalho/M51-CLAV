#!/bin/bash
# make sure you always put $f in double quotes to avoid any nasty surprises i.e. "$f"
sed 1d "$1" > "temp.csv"
mv "temp.csv" "$1"