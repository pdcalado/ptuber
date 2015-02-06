#!/usr/bin/perl
use strict;
use warnings;

use IPC::Open2;

my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);

    my $cmd = $ARGV[0] . " " . $line;

    print $cmd . "\n";

    my($chld_out, $chld_in);
    my $pid = open2($chld_out, $chld_in, $cmd);

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
