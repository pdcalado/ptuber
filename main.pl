#!/usr/bin/perl
use strict;
use warnings;

use Config::IniFiles;
my $config = Config::IniFiles->new( -file => "config.ini" );
my $cmd_mkdir = get_config("Make Dir Command");
my $cmd_perl = get_config("Perl Command");

sub get_config{
    return $config->val("Main", @_);
}

sub run_cmd{
    system(@_) == 0
	or die "system @_ failed: $?"
}

sub perl_suffix{
    my @list = @_;
    return ($cmd_perl . " " . $list[0] . " ");
}

sub check_dir{
    my @list = @_;
    if (system($cmd_mkdir . " " . $list[0] . " &> /dev/null") != 0) {
	# exists
	return 1;
    }
    else {
	# does not exist
	return 0;
    }
}

if ($#ARGV + 1 == 0) {
    print "must provide path\n";
}

# Atomic commands
my $cmd_cycle = get_config("Cycle Files");
my $cmd_vid_ext = get_config("Check Extension") . " -v";
my $cmd_photo_ext = get_config("Check Extension") . " -p";
my $cmd_gen_hash = get_config("Generate Hashes");
my $cmd_update_thumbs = get_config("Update Thumbs");
my $thumb_dir = get_config("Thumbnail Directory");

# Log files for videos and hashes
my $logfile_vid = get_config("Video Log File");
my $logfile_vid_hash = get_config("Video Hash Log File");

# Cycle through directory
my $perl_cycle = perl_suffix($cmd_cycle . " " . $ARGV[0]);
# Log video file names
my $perl_get_vids = perl_suffix($cmd_vid_ext . " > " . $logfile_vid);

# run command
run_cmd($perl_cycle . " | " . $perl_get_vids);

# Generate hashes command
my $perl_generate_hash = perl_suffix($cmd_gen_hash);

# command to generate hashes
my $cmd_cat_vid = "cat " . $logfile_vid;
run_cmd($cmd_cat_vid . " | " . $perl_generate_hash . " > " . $logfile_vid_hash);

# Check for thumbs folder
if (check_dir($thumb_dir) == 0) {
    print STDERR "Created " . $thumb_dir . " folder.\n";
}

# make two columns of hash and path to video file
my $perl_thumbs = perl_suffix($cmd_update_thumbs) . " " . $thumb_dir;
# And run the thumbnail program
run_cmd("paste " . $logfile_vid_hash . " " . $logfile_vid . " | " . $perl_thumbs);
