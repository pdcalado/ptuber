#!/bin/bash

for item in $*
do
    curl -f $DB_URL/encrypted?name="$item" > /dev/null 2>&1
    rc=$?

    if [ $rc -eq 0 ]
    then
	echo "Found $item in encrypted."
    else
	echo "UNABLE TO FIND $item in encrypted."
    fi

    hash_name=$(bash hash_name.sh $item)

    curl -f $DB_URL/uploaded?id="$hash_name" > /dev/null 2>&1
    rc=$?

    if [ $rc -eq 0 ]
    then
	echo "Found $item in uploaded."
    else
	echo "UNABLE TO FIND $item in uploaded."
    fi

    skicka ls Brno/$hash_name.enc > /dev/null 2>&1
    rc=$?

    if [ $rc -eq 0 ]
    then
	echo "Found $item in Drive."
    else
	echo "UNABLE TO FIND $item in Drive."
    fi
done
