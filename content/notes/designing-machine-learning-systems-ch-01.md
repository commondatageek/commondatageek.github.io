---
title: "Designing Machine Learning Systems - Chapter 01"
date: 2022-08-16T23:03:45-06:00
draft: true

tags: ["mlops"]
categories: ["MLOps", "Designing Machine Learning Systems"]
---

## Key Vocab

- **MLOps:** a set of tools and best practices for bringing ML into production.
- **ML Systems Design:** takes a system approach to MLOps, considering the
  whole system holistically.
- **Machine Learning:**
    1. learn
    2. complex patterns
    3. from existing data
    4. to make predictions
    5. on unseen data
- supervised learning

Words

- MLOps
- holistic approach
- ML Systems Design
- production ML
- research ML
- zero-shot learning or zero-data learning
- few-shot learning
- continual learning
- online learning


## Major Ideas

### What the book is about

- A machine learning system is so much more than just the algorithm and the
  model.
    - business requirements
    - user interfaces for both developers and end users
    - data stack
    - logic for developing, monitoring, and updating models
    - infrastructure for delivering that logic
- We can't just focus on algorithms and model artifacts.  We must consider the
  entire system holistically.
- This book aims to provide you with a framework for considering the entire
  machine learning system holistically as you bring it into production.


### When and When Not to Use Machine Learning

- ML can't solve all problems, and it might not be the optimal solution anyway.
- Before starting an ML project, ask:
    - Is ML possible in this context?
    - Is it necessary?
    - Is it cost effective?
    - (It is never sufficient.)

- For ML to hit a home run:
    - there must be data
    - it must be collectable
    - the captured dataset must capture patterns
    - those patterns should be complex ("Is it necessary?")
    - the algorithm must be able to detect the patterns from the data
    - the data that you will be predicting on must have a similar distribution
      and similar patterns

- ML Sweet Spots
    - there's a lot of data/examples to collect
    - learning complex patterns
    - when you can benefit from a large quantity of cheap but approximate
      predictions
    - compute-intensive problems that can be retrained as predictive
    - it's repetitive
    - the cost of wrong predictions is cheap (e.g., recommender systems)
        - or the benefit of getting it right is high enough that it outweighs
          the cost of getting it wrong occasionally (e.g., self-driving cars)
    - it's at scale -- we can use and reuse these solutions for a lot of work
    - the patterns are constantly changing (e.g., email spam classification)
    
- Don't use ML when:
    - it's unethical
    - a simpler solution can do (almost) just as well
    - it's not cost-effective

### Differences Between Research ML and Production ML
