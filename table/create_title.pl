#!/usr/bin/perl
use strict;
use warnings;

my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);

    my $dot = rindex($line, ".");
    my $slash = rindex($line, "/");

    my $title = "";

    if ($dot <= $slash || $dot < 0 || $slash < 0 || $dot - $slash - 1 <= 0) {
	$title = "Random_Name";
    }
    else {
	$title = substr($line, $slash + 1, $dot - $slash - 1);
    }

    print $title . "\n";
}
