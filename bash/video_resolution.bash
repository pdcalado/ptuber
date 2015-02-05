#!/bin/bash

eval $(ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width $1)
size=${streams_stream_0_width}x${streams_stream_0_height}
echo $size
