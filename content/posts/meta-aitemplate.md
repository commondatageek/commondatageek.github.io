---
title: "Meta AITemplate Transforms Deep Neural Networks into C++ Code"
date: 2022-10-24T16:54:28Z
draft: false
type: notes

tags: [mlops, deep-neural-networks, c++, performance, gpu, pytorch, nvidia, amd, meta, aitemplate, python, inference, optimization]
categories: ["Machine Learning in Production"]
---

## Summary

InfoQ: [Meta Has Developed an AITemplate Which Transforms Deep Neural Networks into C++ Code](https://www.infoq.com/news/2022/10/meta-aitemplate-gpu/)

Meta created a Python framework called [AITemplate](https://github.com/facebookincubator/AITemplate)
that improves inference performance for deep neural networks by:
- transforming and optimizing the graph
- converting code to C++

<!--more-->

## Details

- created by Meta
- for deep neural networks
- accelerates inference:
    - optimizes models with graph transformations
- does not improve training performance
- Works with AMD and Nvidia GPUs
    - Future compatibility for M-series Apple GPUs as well.
- results compared to "eager mode" in PyTorch:
    - improved performance 12x with Nvidia GPUs
    - improved performance 
- probably only works with PyTorch, not tensorflow?