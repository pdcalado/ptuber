#!/usr/bin/perl
use strict;
use warnings;

use Path::Class;

sub dir_cycle{
    my $dir = dir(@_); # foo/bar

    # Iterate over the content
    while (my $file = $dir->next) {
	
    	# See if it is a directory and skip
    	if ($file->is_dir()) {
	    if ($file->absolute->stringify eq $dir->absolute->stringify) {
		# ignore same directory
		next;
	    }

	    if ($file->basename eq "..") {
		# ignore .. dir
		next;
	    }

    	    dir_cycle($file);
	    next;
    	}

	# Print out the file name and path
	print $file->stringify . "\n";
    }
}

my $num_args = $#ARGV + 1;

if ($num_args != 1) {
    print "\nUsage: program.pl dir\n";
    exit;
}

dir_cycle($ARGV[0]);
