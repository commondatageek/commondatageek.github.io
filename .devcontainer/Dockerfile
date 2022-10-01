FROM ubuntu:20.04

RUN apt-get -y update && apt-get -y install vim git silversearcher-ag curl wget jq less unzip
RUN apt-get -y update && apt-get -y install tmux

RUN yes | unminimize

RUN wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.102.1/hugo_0.102.1_Linux-ARM64.deb
RUN dpkg -i hugo.deb

RUn apt-get -y update && apt-get -y install man-db manpages-posix
