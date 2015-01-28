#!/usr/bin/perl
use strict;
use warnings;

use Config::IniFiles;
my $config = Config::IniFiles->new( -file => "config.ini" );
my $cmd_mkdir = $config->val("Main", "Make Dir Command");
# name of the file that will hold the video's path
my $path_file_name = $config->val("Thumbnails", "Path File Name");

if ($#ARGV + 1 == 0) {
    print "must provide path\n";
}

sub check_dir{
    my @list = @_;
    if (system($cmd_mkdir . " " . $ARGV[0] . "/" . $list[0] . " &> /dev/null") != 0) {
	print $ARGV[0] . "/" . $list[0] . " already exists.\n";
	return 1;
    }
    else {
	print "Created " . $ARGV[0] . "/" . $list[0] . " dir\n";
	return 0;
    }
}

sub run_cmd{
    system(@_) == 0
	or die "system @_ failed: $?"
}

sub print_to_file{
    my @list = @_;
    my $new_file_path = $ARGV[0] . "/" . $list[0] . "/" . $path_file_name;
#    print "echo " . "\"" . $list[1] . "\"" . " > " . $new_file_path . "\n";
    run_cmd("echo " . "\"" . $list[1] . "\"" . " > " . $new_file_path);

}

my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);
    my($hash, $path) = split("\t", $line);

    if (check_dir($hash) == 0) {
	print_to_file(($hash, $path));
    }
}

