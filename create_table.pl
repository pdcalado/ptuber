#!/usr/bin/perl
use strict;
use warnings;
use Config::IniFiles;

# use Config::IniFiles;
# my $config = Config::IniFiles->new( -file => "config.ini" );

sub run_cmd{
    system(@_) == 0
	or die "system @_ failed: $?"
}

sub write_column{
    my @list = @_;
    my $cmd_full = "cat " . $list[0] . " | " . $list[1] . " > " . $list[2];
    print $cmd_full . "\n";
    run_cmd($cmd_full);
}

if ($#ARGV + 1 != 2) {
    print "must provide two files: log file of paths and log file of hashes\n";
    exit;
}

my $config = Config::IniFiles->new( -file => "config.ini" );
my $script_titles = $config->val("Main", "Create Title");
my $script_durations = $config->val("Main", "Create Durations");
my $script_resolutions = $config->val("Main", "Create Resolutions");
my $cmd_perl = $config->val("Main", "Perl Command");
my $cmd_bash = $config->val("Main", "Bash Command");

my $cmd_rm = "rm -f";
my $titles = "titles.log";
my $duration = "durations.log";
my $thumbs = "thumbs.log";
my $resolution = "resolutions.log";

my $bashrun = $cmd_perl . " bash_run.pl \"" . $cmd_bash . " " . $script_durations . "\"";

# write_column($ARGV[0], $cmd_perl . " " . $script_titles, $titles);
write_column($ARGV[0], $bashrun, $duration);
# write_column($ARGV[0], $cmd_bash . " " . $script_resolutions, $resolution);
#write_column($ARGV[0], $cmd_bash . " " . $script_thumbs, $thumbs);
