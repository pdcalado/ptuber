#!/usr/bin/perl
use strict;
use warnings;

use Redis::Client;

# read stuff from config
use Config::IniFiles;
my $config = Config::IniFiles->new( -file => "config.ini" );

# Database endpoint
my $db_hostname = $config->val("DB", "Database Hostname");
my $db_port = $config->val("DB", "Database Port");
# Videos database prefix
my $vid_prefix = $config->val("DB", "Videos Prefix");

# Thumbnail directory
my $thumb_dir = $config->val("Main", "Thumbnail Directory");

# Connect to database
my $red = Redis::Client->new( host => $db_hostname,
			      port => $db_port,
			      name => "perl_connection");

my @list = $red->hmget("videos:17251fe7685832ec7e9a7365f8b14519", "filename" , "thumbs");

foreach my $item (@list) {
    print $item . " ";
}

# my @userinput = <STDIN>;
# foreach my $line (@userinput) {
#     chomp($line);
#     my($hash, $path) = split("\t", $line);
#     $red->hmset($vid_prefix . ":" . $hash, 
# 		"filename", $path,
# 		"thumbs", $thumb_dir . "/" . $hash);
# }

$red->quit();
