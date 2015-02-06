#!/usr/bin/perl
use strict;
use warnings;

use Config::IniFiles;

my $section = "Thumbnails";
my $config = Config::IniFiles->new( -file => "config.ini" );
my $cmd_mkdir = $config->val("Main", "Make Dir Command");
my $cmd_rmdir = $config->val("Main", "Remove Dir Command");
my $cmd_thumb = $config->val($section, "Program");
my $log_dir = $config->val("Main", "Log Directory");
my $program_log_file = $log_dir . $config->val($section, "Program Log File");
my $flag_i = $config->val($section, "Input File Flag");
my $flag_o = $config->val($section, "Output File Flag");
my $flag_perc = $config->val($section, "Percentage Flag");
my $flag_format = $config->val($section, "Format Flag");
my $output_format = $config->val($section, "Output File Format");
my $number_pixels = $config->val($section, "Number of Pixels");
my $perc_shots = $config->val($section, "Percentage Shots");
my $failed_log_file = $log_dir . $config->val($section, "Failed Video Log File");
# name of the file that will hold the video's path
my $path_file_name = $config->val($section, "Path File Name");

if ($#ARGV + 1 == 0) {
    print "must provide path\n";
}

sub check_dir{
    my @list = @_;
    my $target_path = $ARGV[0] . "/" . $list[0];
    if (system($cmd_mkdir . " " . $target_path . " &> /dev/null") != 0) {
	print $target_path . " already exists.\n";
	return 1;
    }
    else {
	print "Created " . $target_path . " dir\n";
	return 0;
    }
}

sub rm_dir{
    my @list = @_;
    my $target_path = $ARGV[0] . "/" . $list[0];
    if (system($cmd_rmdir . " " . $target_path . " &> /dev/null") != 0) {
	print "Failed to remove " . $target_path . ".\n";
    }
    else {
	print "Removed dir " . $target_path . ".\n";
    }
}

sub run_cmd{
    system(@_) == 0
	or die "system @_ failed: $?"
}

sub print_to_file{
    my @list = @_;
    my $new_file_path = $ARGV[0] . "/" . $list[0] . "/" . $path_file_name;
    run_cmd("echo " . "\"" . $list[1] . "\"" . " > " . $new_file_path);
}

sub create_thumbs{
    my @list = @_;
    my $target_path = $ARGV[0] . "/" . $list[0];
    my $input = $flag_i . " " . $list[1];
    my $format = $flag_format . " " . $output_format;
    my $pixels = $number_pixels;

    # start forming the string for creating the thumbnails
    my $prog_str = $cmd_thumb . " " . $format . " " . $pixels . " " . $input . " ";

    my @all_shots = split(",", $perc_shots);

    foreach my $shot (@all_shots) {
	my $perc = $flag_perc . " " . $shot;
	my $output = $flag_o . " " . $target_path . "/" . $shot . "." . $output_format;
	my $prog_str = $prog_str . $output . " " . $perc;

	if (system($prog_str . " &>> " . $program_log_file) != 0) {
	    return 0;
	}
    }

    return 1;
}

# clear program log file
run_cmd("rm -f " . $program_log_file);

# create list for failed videos
my @failed_list;

# get hash and path pair from standard input
my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);
    my($hash, $path) = split("\t", $line);

    # check if the dir exists
    if (check_dir($hash) == 0) {
	# create file with path of the video
	print_to_file(($hash, $path));

	# create thumbs for video
	if (create_thumbs(($hash, $path)) == 0) {
	    print "Failed to produce for " . $path . "\n";
	    push(@failed_list, $path);
	    rm_dir($hash);
	}
	else {
	    print "Produced successfully for " . $path . "\n"
	}
    }
}

# clear list of failed videos
run_cmd("rm -f " . $failed_log_file);

foreach my $vid (@failed_list) {
    run_cmd("echo \"" . $vid . "\" >> " . $failed_log_file);
}
