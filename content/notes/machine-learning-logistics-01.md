---
title: "Chapter 01: Why Model Management?"
date: 2022-08-31T05:01:23Z
draft: true

tags: ["mlops", "machine-learning"]
categories: []
---

# Machine Learning Logistics Book

## Chapter 1

### Intro

- "Model management" is a term for the holistic view of the entire machine
  learning system.
- It's not the cool part of Machine Learning, but it's extremely important.
- New practitioners are going to need some practical advice on this matter.


### The Best Tool for Machine Learning

- There are so many tools for machine learning?
- Which is the best one?  It depends.
- Use the right one for the job.  Try new things.  In the end, you'll have a
  short list of tools you keep coming back to.


### Tools for Deep Learning

- There are a lot of tools for Deep Learning.
- But we need some overarching, cross-cutting tools for Data Flow and Model
  Management.


### Fundamental Needs Cut Across Different Projects

- Regardless of which tools and models you use, the fundamental problems of
  logistics will largely be the same from project to project.


### Tensors in the Hen Houe

- They have a friend, Ian, who tried out Deep Learning to solve a problem with
  Blue Jays in his hen house.


### Defining the Problem and Project Goal

- Protect the egss against attacks from blue jays.
- Several lessons learned:
	- Learn what data is available, how it needs to be structured.  Domain
	  knowledge is critical.
	- Retraining and updating models, and deploying new models, is going to
	  happen a lot.
	- Once you have some AI wins, you'll have mission creep and need/want to do
	  it in other places too.


### Real-World Considerations

- "Model management in the real world is a powerful process that deals with
  large-scale changing data and changing goals, and with ways to deal with
models in isolation so that they can be evaluated in specifically customized,
controlled environments."


### Myth of the Unitary Model

- Software engineers tend to think that after you've deployed a model, you're
  done.
- In fact, there are usually multiple models, even after you have something in
  production.
	- Multiple models in production
	- New models being readied to take their place
	- more than one model in development as you try different approaches


### What Should You Ask About Model Management?

- Some sample questions you might ask as you think through machine learning
  logistics and model management
