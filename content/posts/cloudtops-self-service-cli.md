---
title: "Cloudtops Self Service CLI"
date: 2022-09-20T23:19:03-06:00
draft: true

tags: ["ssh", "cli", "charm-sh"]
categories: []
---

## Questions

- Do we want to allow them to have more than one cloudtop running at a time?
    - Probably not.  But maybe we architect for that possibility?
- What instance role should the cloudtop have, if any?
    - S3 access
    - SageMaker permissions
- Can we figure out how to make `saml2aws` work with a keyring so they don't
  have to re-auth every 60 minutes?
- How should they share large file?
    - Right now all they have is the janky S3 location
- Can we actually allow them to use any AMI that they want?
    - I don't think so, because all of our ansible configuration stuff
      (including the stuff that attaches user storage) assumes ubuntu.  Would
      need to take care to make sure it's distro agnostic
    - But then again, we have to install logging software, etc.  I just don't
      think it's feasible to allow other distros right now.
    - So maybe we have a pre-approved list of AMIs to choose from?
- Do we want to establish a policy for backing up their persistent user storage
  volumes?
    - Maybe weekly?
    - Expires weekly


## A List of Things

- a CLI tool written in Go
    - interact with self-service service
    - open connections to the cloudtop
- a long-running configuration service
    - handles all the AWS stuff that needs IAM permissions
    - has an instance role that grants those permissions
    - written in Go with charm.sh Wish backend
    - will run Ansible against the machines
- a cloudtop


## Tasks

- Determine which instance type I want to use
    - specify a minimum amount of CPU and RAM, and it provides a list of
      instance types you might want to use
- Determine which AMI I want to use
- Start a new cloudtop (`ct start`)
    - specify an instance type
    - specify an AMI
- Reboot an existing cloudtop (`ct reboot`)
- Stop (destroy) an existing cloudtop (`ct stop`)
- See the status of any cloudtops I might have open at the time 
    - exists
    - started, stopped
    - connected, not connected
    - time until destroy

- Open a connection to your cloudtop via SSH:
    - a connection for port forwarding
    - a connection for a terminal


## Cloudtop

### Software to Install on the Cloudtop

- RStudio, Jupyter Notebooks
- `saml2aws`
- `aws`
- `gh` (GitHub CLI), also GitLab CLI
- `git`
- `ansible` (mostly for `ansible-pull`)
- `tmux`, `screen`
- `bat`, `ag`
- `htop`, `nload`


### Start-time configuration

- Set up the ubuntu user for administration tasks
    - authorize the `cloudtops-admin` key for `ubuntu` user
- Set up the `aaron-johnson` user
	- create the user
	- authorize their public key
    - Attach the persistent storage volume
- Tell Docker to use a directory on persistent user storage


### Limitations

- Cost protections
    - expensive instance type
        - can't start an instance larger than X
        - alternatively, can only choose instances from a pre-approved list
    - automatically decommissions the instance after being disconnected for N
      hours
        - but this is okay, because all of their work will be saved on their
          persistent user storage EBS volume
    - but maybe you can manually prevent it from going to sleep for up to 12
      hours?

### Security

#### Network Access

- Security Group allows only SSH for incoming connections
    - Access running services on the machine via SSH port forwarding
- Private key authentication


## CLI Tool

### User Interface

I see two options for the user interface:
- a simple CLI interface with commands, arguments, etc.
- a slick TUI using charm.sh libs


### Configuration

Probably a simple configuration file (with accompanying CLI global arguments and
env vars).

- `~/.cloudtops.(json|toml|ya?ml)` or something similar
- JSON, YAML, and TOML supported

| Property               | Type       | Description                                                          | Example                                                                                                      |
| :--------------------- | :--------- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| service_host           | string     | hostname of the configuration server                                 | `cloudtops.psdatum.com`                                                                                      |
| username               | string     | the username of the cloudtops user                                   | `aaron-johnson`                                                                                              |
| identity_file          | string     | the location of the private key to use for connecting to the service | `~/.ssh/cloudtops-aaron-johnson`                                                                             |
| instance_type          | string     | the type of instance that you would like to use                      | `m5.2xlarge`                                                                                                 |
| ami?                   | string     | the AMI to use on this cloudtop                                      | `ami-abcdef1234567`                                                                                          |
| local_port_forwards    | obj(obj)   | a specification of local port forwarding to set up                   | `{ "Jupyter Notebooks": { "local": 3382, "cloudtop": 4567 }, "RStudio": { "local": 4019, "cloudtop": 4019 }` | 
| remote_port_forwards   | obj(obj)   | a specification of remote port forwarding to set up                  | `{ "Staging Database": { "local": "staging-database.vnerd.com:5432", "cloudtop": "5432" }`                   | 


## Service

### Security

#### Attribution

Log everything to CloudWatch.  Probably each session gets its own stream.

- login attempts
    - username
    - public key
    - source IP address
- commands issued


#### Encryption

- Encrypted communication via SSH
- Can we trust charm.sh Wish?
    - built on gldierlabs/ssh
    - wrapper around go/x/ssh
    - so it's as secure as Go's stuff is?


#### Access Control

- AWS recently open-sourced their rule matching engine, so we could do some rule
  matching stuff with that.
- We could also just say:
    - "an owner of a cloudtop has permission to do the full set of things to
      their cloudtop"
    - "an admin can do the full set of things to all the cloudtops"

