---
title: Do I need to make partitions on my EBS volumes?
date: 2022-07-18T22:29:56-06:00
tags:
  - aws-ec2
  - ebs
  - filesystems
  - linux
draft: false
---

No. In most cases, I don't think partitioning EBS volumes is necessary.

## Why do people ever partition in the first place?

Partitioning a drive is useful when:
1. you have an actual, physical computer in front of you
2. you are planning to attach one or more actual, physical hard disks to that computer
3. you want to apportion that space among the various segments of your filesystem (`swap`, `/home`, `/boot`, etc.)

## Why is EBS different?

But EBS volumes aren't actual, physical disks, and you're not plugging them into an actual, physical computer.  They're created and destroyed cheaply.  It's trivial to attach and detach them.

Also, you're not limited to just one or two; you can create as many as you need ([within reason, of course](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/volume_limits.html)).

## Using multiple EBS volumes

So just create multiple EBS volumes and use them for the same kinds of things that you would have used partitions for, and enjoy:

- one less layer of abstraction to reason about
- fewer steps required to get a filesystem ready to go
- decoupling of "partitions" from one another (e.g., making one volume larger does not require you to make other volumes smaller)
- different EBS volume types for specific purposes (optimizing for latency, throughput, etc.)
- and so on

## Links

- [Do I need to make a partition on an EBS volume? What is better](https://askubuntu.com/questions/579891/do-i-need-to-make-a-partition-on-an-ebs-volume-what-is-better)
- [Extend a Linux file system after resizing a volume](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html)
