#!/usr/bin/perl
use strict;
use warnings;
use Config::IniFiles;

my $config = Config::IniFiles->new( -file => "config.ini" );
my $thumb_dir = $config->val("Main", "Thumbnail Directory");

my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);

    print $thumb_dir . "/" . $line . "\n";
}
