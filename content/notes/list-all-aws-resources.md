---
title: "Listing all Resources in Your AWS Account"
date: 2022-08-04T20:56:41-06:00
draft: false

tags: ["aws", "aws-cli", "jq", "jmespath"]
categories: []
---

## Why did I need to list all resources?

Certain situations require one to be able to list all resources in an AWS
account.

Management recently decided to assign some new responsibilities to my team in a
different part of the organization.  We would continue supporting some of our
existing infrastruction, while a different team would take responsibility for
the remainder.

But we needed to start with a list of all the resources in our AWS account to
form the basis of these negotiations.

<!--more-->

## `aws resourcegroupstaggingapi get-resources`

To be honest, it is currently unclear[^1] to me whether there is any single
method that will provide a definitive list of all resources in an AWS account.

The documentation[^2] for the `aws resourcegroupstaggingapi get-resources` call
says that it:

> Returns **all the tagged or previously tagged resources** that are located in
> the specified Amazon Web Services Region for the account.

So it appears that if you never tagged a specific resource, it won't appear in
this list.

However, having run this command in our account, it returned an awful many
resources that do not currently have tags, and I can't imagine that we tagged
and then intentionally untagged so many resources in our account.

In any case--

The method outlined below works well for us because we have tagged (almost) all
of our resources.


## Examples

Assuming that the AWS CLI is configured, the following command will provide a
list of all AWS resources.

```bash
aws --profile=prod --region=us-west-2 resourcegroupstaggingapi get-resources
```

One may use `jq` or similar tools (or even a JMESPath query with the `--query`
argument) to further filter and refine the JSON-encoded results.  For example,
one can generate a sorted list of ARNs with the following command.

```bash
aws resourcegroupstaggingapi get-resources \
 | jq -c -r '.ResourceTagMappingList[].ResourceARN' \
 | sort \
 | less
```

[^1]: https://stackoverflow.com/questions/44391817/is-there-a-way-to-list-all-resources-in-aws
[^2]: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/resourcegroupstaggingapi/get-resources.html
