#!/usr/bin/perl
use strict;
use warnings;

use Digest::MD5;

my $md5 = Digest::MD5->new;

my @userinput = <STDIN>;
foreach my $line (@userinput) {
    chomp($line);
    $md5->add($line);
    my $string = $md5->clone->digest;
    $string =~ s/(.)/sprintf("%x",ord($1))/eg;
    print $string . "\n";
}
