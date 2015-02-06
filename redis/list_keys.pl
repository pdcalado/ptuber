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

# Connect to database
my $red = Redis::Client->new( host => $db_hostname,
			      port => $db_port,
			      name => "perl_connection");

my @list = $red->keys($ARGV[0] . ":*");

foreach my $item (@list) {
    print substr($item, length($ARGV[0]) + 1) . "\n";
}
