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
my $script_titles = $config->val("Create Table", "Create Title");
my $script_durations = $config->val("Create Table", "Create Durations");
my $script_resolutions = $config->val("Create Table", "Create Resolutions");
my $script_thumb_path = $config->val("Create Table", "Create Thumb Path");
my $cmd_perl = $config->val("Main", "Perl Command");
my $cmd_bash = $config->val("Main", "Bash Command");
my $cmd_bash_exec = $config->val("Main", "Bash Executor");
my $cmd_rm = $config->val("Main", "Remove File Command");

# log file names
my $titles = "titles.log";
my $duration = "durations.log";
my $thumbs = "thumbs.log";
my $resolution = "resolutions.log";

# Command to execute bash command as argument
my $bash_exec = $cmd_perl . " " . $cmd_bash_exec;

# Duration compute command
my $duration_cmd = $bash_exec . " \"" . $cmd_bash . " " . $script_durations . "\"";
# Resolution compute command
my $resolution_cmd = $bash_exec . " \"" . $cmd_bash . " " . $script_resolutions . "\"";

# Write columns to files
write_column($ARGV[0], $cmd_perl . " " . $script_titles, $titles);
write_column($ARGV[0], $duration_cmd, $duration);
write_column($ARGV[0], $resolution_cmd, $resolution);
write_column($ARGV[1], $cmd_perl . " " . $script_thumb_path, $thumbs);

# Print first line with column names
print "hash filename title duration resolution thumbs\n";

# Paste command to join columns
my $cmd_paste = "paste";

my $cmd_table = $cmd_paste . " " 
    . $ARGV[1] . " "
    . $ARGV[0] . " "
    . $titles . " "
    . $duration . " "
    . $resolution . " "
    . $thumbs;

run_cmd($cmd_table);
