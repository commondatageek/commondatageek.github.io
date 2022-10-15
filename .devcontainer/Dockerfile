FROM ubuntu:20.04

RUN apt-get -y update && apt-get -y install vim git silversearcher-ag curl wget jq less unzip
RUN apt-get -y update && apt-get -y install tmux

RUN yes | unminimize

RUN wget --no-check-certificate -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.102.1/hugo_0.102.1_Linux-ARM64.deb
RUN dpkg -i hugo.deb

ENV PATH=/usr/local/go/bin:$PATH
RUN wget --no-check-certificate -O golang.tar.gz https://go.dev/dl/go1.19.2.linux-arm64.tar.gz
RUN rm -rf /usr/local/go && tar -C /usr/local -xzf golang.tar.gz
RUN echo 'export PATH=/usr/local/go/bin:$PATH' >> $HOME/.bashrc

RUn apt-get -y update && apt-get -y install man-db manpages-posix
