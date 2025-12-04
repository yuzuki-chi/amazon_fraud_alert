#!/bin/bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)

SRC_DIR="src"
ZIP_DIR="src"

if [ -e $SCRIPT_DIR/$ZIP_DIR.zip ]; then
    rm -r $SCRIPT_DIR/$ZIP_DIR.zip
fi

zip -r $SCRIPT_DIR/$ZIP_DIR.zip $SCRIPT_DIR/$SRC_DIR/