#!/bin/bash

ffprobe -i $1 -show_format -v quiet | sed -n 's/duration=//p'
