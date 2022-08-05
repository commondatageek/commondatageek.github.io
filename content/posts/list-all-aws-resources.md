---
title: "List All AWS Resources"
date: 2022-08-04T20:56:41-06:00
draft: false

tags: ["aws", "aws-cli", "jq", "jmespath"]
categories: ["Notes"]
---


# Listing all Resources in Your AWS Account

Certain situations require one to be able to list all resources in an AWS
account.


## Why did I need to list all resources?

Management recently decided to move my team to a different part of the
organization.  The move came with new responsibilities.  This meant that we
would continue to support some of our existing AWS resources, while a different
team would take responsibility for others moving forward.

Before we could begin to have this conversation and make these negotiations, we
needed a list of all the resources in our AWS account.


## `aws resourcegroupstaggingapi get-resources`

The documentation[^1] for the `aws resourcegroupstaggingapi get-resources` call
says that it:

> Returns all the **tagged** or **previously tagged** resources that are located in the
> specified Amazon Web Services Region for the account.

It is currently unclear[^2] to me whether there is any single method that will
provide a definitive list of all resources in an AWS account.  But the
method outlined below works well for us because we have tagged (almost) all of
our resources.

Assuming that the AWS CLI is configured, the following command will provide a
list of all AWS resources.

```bash
aws --profile=prod --region=us-west-2 resourcegroupstaggingapi get-resources
```

One may use `jq` or similar tools (or even a JMESPath query with the `--query` argument)
to further filter and refine the JSON-encoded results.  For example, one can
generate a sorted list of ARNs with the following command.

```bash
aws resourcegroupstaggingapi get-resources \
 | jq -c -r '.ResourceTagMappingList[].ResourceARN' \
 | sort \
 | less
```

[^1]: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/resourcegroupstaggingapi/get-resources.html
[^2]: https://stackoverflow.com/questions/44391817/is-there-a-way-to-list-all-resources-in-aws
