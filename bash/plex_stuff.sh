#!/bin/bash

docker run -it --rm --net="host" -v /home/calado/deleteme/plex-config:/config -v /home/calado/deleteme:/data -v /home/calado/ready:/data/ready -p 32400:32400  timhaak/plex /bin/bash /start.sh

# decrypt with permissions: encfs -o allow_other ~/.xx ~/xx
