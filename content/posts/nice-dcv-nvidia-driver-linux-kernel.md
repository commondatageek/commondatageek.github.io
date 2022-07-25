---
title: "Troubleshooting NICE DCV on AWS EC2 with Nvidia Drivers"
date: 2022-07-14T22:45:38-06:00
draft: false

tags: ["linux", "kernel", "nice-dcv", "nvidia", "drivers", "ubuntu", "20.04"]
---

# NICE DCV Troubleshooting

## Context and Symptoms

- We had been using the boxes and DCV just fine for several days.
- When we deployed 23 of these boxes this morning, we found that we couldn't connect to DCV
- Nobody could connect to NICE DCV.  Blank bluish screen.

## Troubleshooting Attempted

- Looked at logs, but didn't find anything helpful:
	- DCV Client Logs: `~/.local/share/nicedcv/loggy-mcloggerson.log`
	- DCV Server Logs: `/var/log/dcv/server.log`
		- Set the log level to `DEBUG`
		- there was a red herring in there about "certificate not found", but that was completely unrelated
		- there just didn't appear to be anything in the output that indicated that anything had gone wrong
- Decided that it might a problem with an Xserver misconfiguration
	- Xorg Logs: `/var/log/Xorg.0.log`

## The kernel updated and broke the Nvidia driver

Ultimately it was the `/var/log/Xorg.0.log` that helped me figure out what was going on.

- `/var/log/Xorg.0.log` talks about not being able to load the NVIDIA driver:

```
[    28.902] (EE) NVIDIA: Failed to initialize the NVIDIA kernel module. Please see the
[    28.902] (EE) NVIDIA:     system's kernel log for additional error messages and
[    28.902] (EE) NVIDIA:     consult the NVIDIA README for details.
[    28.902] (EE) No devices detected.

...

[    28.907] (EE) Device(s) detected, but none match those in the config file.
[    28.907] (EE)
Fatal server error:
[    28.907] (EE) no screens found(EE)
[    28.907] (EE)
Please consult the The X.Org Foundation support
	 at http://wiki.x.org
 for help.
[    28.907] (EE) Please also check the log file at "/var/log/Xorg.0.log" for additional information.
[    28.908] (EE)
[    28.966] (EE) Server terminated with error (1). Closing log file.
```

- `nvidia-smi` says “NVIDIA-SMI has failed because it couldn’t communicate with the NVIDIA driver. Make sure that the latest NVIDIA driver is installed and running.”
- `ls -al /var/modules` shows TWO kernel versions:
	- `5.13.0-1031-aws` was created on July 8 (probably the day we built the Packer image)
	- `5.15.0-1015-aws` was created on July 15 (today, probably because we ran some unsafe apt upgrade command as part of the Ansible playbooks for application-layer and create-user

## Research

- [Revert to a previous kernel](https://unix.stackexchange.com/questions/465201/how-do-i-roll-back-to-a-previous-ubuntu-kernel-running-ubuntu-16-04)
- [Tainting a resource with Terraform Cloud](https://discuss.hashicorp.com/t/tainting-a-resource-with-terraform-cloud/9481)
- What is `linux-aws` package? https://packages.ubuntu.com/search?keywords=linux-aws
- **What does `upgrade: safe` do in ansible.builtin.apt?** "aptitude safe-upgrade upgrades currently installed packages and can install new packages to resolve new dependencies, but never removes packages"
- See currently installed versions of linux kernel: `dpkg -l | grep linux-aws`
- See currently running version of linux kernel: `uname -r`
- [How to prevent a package from being upgraded](https://askubuntu.com/questions/18654/how-to-prevent-updating-of-a-specific-package#:~:text=Go%20to%20Synaptic%20Package%20Manager,and%20will%20not%20be%20updated.) 
