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

$red->ping || die "no server?";

if ($#ARGV + 1 != 1) {
    print "must provide hash prefix.\n";
    exit;
}

my @userinput = <STDIN>;

my $first_line = 1;
my @fields;

foreach my $line (@userinput) {
    chomp($line);

    if ($first_line) {
	@fields = split(" ", $line);
	$first_line = 0;
	next;
    }

    my $hash = "\"" . $ARGV[0] . ":";
    my $itr = 0;
    
    # Column values
    my @values = split(" ", $line);

    my $cmd;

    foreach my $item (@values) {
	if ($itr == 0) {
	    $hash = $hash . $item . "\"";
	    $itr = $itr + 1;
	    $cmd = $hash;
	    next;
	}

	$cmd = $cmd .", \"" . $fields[$itr] . "\", \"" .  $item . "\"";
	$itr = $itr + 1;
    }

    $cmd = "\$red->hmset(" . $cmd . ");";
    eval( $cmd );
}
