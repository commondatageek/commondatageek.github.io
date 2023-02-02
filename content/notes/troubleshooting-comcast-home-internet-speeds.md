---
title: "Troubleshooting Comcast Home Internet Speeds"
date: 2023-02-01T21:31:53-07:00
draft: false
type: notes

tags: [comcast, router, troubleshooting]
categories: [Random]
---

_It turns out the problem was my third-party router, but I had some trouble
testing it at first._

<!--more-->

## The Problem

- Home internet speed was very slow.
- Speed tests showed I was getting significantly less than what I was paying
  for.


## My Setup

- Comcast Xfinity 200mbps
- cable modem (from Comcast, running in Bridge mode)
- a third-party router


## Troubleshooting

- Comcast tech support said, "Everything looks good on our end. Is it your
  router?"
- Needed to do a speed test without my router, but how?
- I connected my laptop directly to my cable modem via ethernet adapter dongle.
  (**This can be a big security problem -- don't leave it this way.**)
- My laptop kept saying: "No IP address assigned"


## The Solution

- Found out that when the cable modem is in Bridge mode, it will only assign an
  IP address to the first device that connects to it.  Usually that is my 3P
  router.
- I needed to first reboot the cable modem and plug my laptop into it before
  any other device in order to get an IP address so I could run the speed test.
- Guess what?  It WAS my router!  When I connected directly to the cable modem
  and ran a speed test, I got the speeds I was paying for.

