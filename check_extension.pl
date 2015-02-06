#!/usr/bin/perl
use strict;
use warnings;

use Config::IniFiles;

my $config = Config::IniFiles->new( -file => "config.ini" );

my @video_ext = split(',', $config->val("Extensions", "Video"));
my @photo_ext = split(',', $config->val("Extensions", "Photo"));

# remove spaces
foreach my $some (@video_ext) {
    $some =~ s/^\s+//;
}

my @videos;
my @photos;
my @unid;

my $flags = '';

# Process options
if ($#ARGV + 1 == 0) {
    $flags = "vup";
}
elsif ($ARGV[0] eq '-v')
{
    $flags = $flags . 'v';
}
elsif ($ARGV[0] eq '-u')
{
    $flags = $flags . 'u';
}
elsif ($ARGV[0] eq '-p')
{
    $flags = $flags . 'p';
}

my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);
    my $rind = rindex($line, '.');
    my $ext = substr($line, $rind + 1, 7);

    push(@unid, $line);

    if (index($flags, 'v') >= 0) {
	foreach my $vext (@video_ext) {
	    if ($vext eq $ext) {
		push(@videos, $line);
		pop(@unid);
		last;
	    }
	}
    }

    if (index($flags, 'p') >= 0) {
	foreach my $pext (@photo_ext) {
	    if ($pext eq $ext) {
		push(@photos, $line);
		pop(@unid);
		last;
	    }
	}
    }
}

if (index($flags, 'v') >= 0) {
    foreach my $vid (@videos) {
	print $vid . "\n";
    }
}

if (index($flags, 'p') >= 0) {
    foreach my $phot (@photos) {
	print $phot . "\n";
    }
}

if (index($flags, 'u') >= 0) {
    foreach my $unid (@unid) {
	print $unid . "\n";
    }
}
