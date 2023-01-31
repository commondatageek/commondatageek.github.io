---
title: "Devcontainer Minimal Setup"
date: 2022-09-21T13:40:46-06:00
draft: true

tags: ["devcontainer"]
categories: ["development"]
---

# aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
ADD zscaler-bundle.pem /usr/local/aws-cli/v2/2.4.11/dist/awscli/botocore/cacert.pem
ENV AWS_DEFAULT_REGION='us-west-2'

ENV LANG C.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL C.UTF-8

# Python
poetry
python
pyenv
pyenv-virtualenv

# Jupyter
jupyter

# R
R
Rstudio

ansible

# get bash completion for git
RUN echo 'source /usr/share/bash-completion/completions/git' >> /root/.bashrc


- Compression: tar, gzip. zip
- AWS CLI
- GitHub CLI, GitLab CLI
- System stuff: man pages, less, ag, bat, cloc
- Programming tools: golang, clojure, rust, 
- Zscaler things


## Masoud

- you said "almost anything"
- if they are doing very simple things, what is the value add for DS?
    - Memory, CPU, GPU
    - Data Locality
    - Network Bandwidth
    - Sharing code and data with others
    - Standardization
        - Save the model in S3 ("It's in S3, go use it there!")
        - 
- Problems with SageMaker
    - It was making Masoud's life MUCH MUCH harder
    - Had a hard time getting access to GPUs
    - Memory issues


## Other

- having a more consistent experience would be helpful, as DS is mostly a bunch of disconnected islands right now
