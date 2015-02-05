#!/usr/bin/perl
use strict;
use warnings;

# use Config::IniFiles;
# my $config = Config::IniFiles->new( -file => "config.ini" );

sub run_cmd{
    system(@_) == 0
	or die "system @_ failed: $?"
}

sub write_column{
    my @list = @_;
    my $cmd_full = "cat " . $list[0] . " | " . $list[1] . " > " . $list[2];
    run_cmd($cmd_full);
}

if ($#ARGV + 1 != 2) {
    print "must provide two files: log file of paths and log file of hashes\n";
    return 0;
}

use Config::IniFiles;
my $config = Config::IniFiles->new( -file => "config.ini" );
my $script_titles = config->get("Main", "Create Title");
my $cmd_perl = config->get("Main", "Perl Command");

my $cmd_rm = "rm -f";
my $titles = "titles.log";
my $duration = "durations.log";
my $thumbs = "thumbs.log";
my $resolution = "resolutions.log";

write_column($ARGV[0], $cmd_perl . " " . $script_titles, $titles);
