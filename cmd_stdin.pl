#!/usr/bin/perl
use strict;
use warnings;

use IPC::Open2;

my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);

    my($chld_out, $chld_in);
    my $pid = open2($chld_out, $chld_in, $line);

    waitpid($pid, 0);

    my $output = "";

    my @stdout = <$chld_out>;
    foreach my $item (@stdout) {
	chomp($item);
	$output = $output . $item;
    }

    if (length($output) == 0 || $output =~ /^ *$/) {
	$output = "-1";
    }

    print $output . "\n";
}
