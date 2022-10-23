---
title: "Chapter 02: What Matters in Model Management"
date: 2022-08-31T05:19:06Z
draft: false

tags: ["mlops", "machine-learning"]
categories: []
---

## Chapter 02

- Logistics and model management need to be flexible to handle many different use cases and scenarios.
- But you don't want it to be so complicated that it is also a hindrance to people getting work done.




### Ingredients of the Rendezvous Approach

- "The rendezvous architecture takes advantage of **data streams** and
  geo-distributed stream replication to maintain a responsive and flexible way
  to collect and save data, including raw data, and to make data and multiple
  models available when and where needed."
- "The design strongly supports ongoing model evaluation and multi-model
  comparison. It's a new approach to managing models that reduces the burden of
  logistics while providing exceptional levels of monitoring so that you know
  what's happening."
<!--more-->
- Some ingredients:
    - streams
    - containers
    - DataOps style of design
    - decoy models
    - canary models


### DataOps Provides Flexibility and Focus

- Don't be rigid and siloed in your teams and responsibilities.
- DataOps style emphasizes better collaboration and communication.
- Cross-functional teams.
- Like DevOps, but with emphasis also on data engineering and data science.
- Architecture and Product Management too.


### Stream Based Microservices

- Microservices allow more independence and agility.
- You can do synchronous REST calls, etc., but more and more it makes sense to
  use a message stream.
- Can your stream transport do the following?
	- support multiple data producers and consumers
	- provide message persistence with high performance
	- decouple producers and consumers
- Why persistence?
	- Get past the "use it or lose it" and "data exhaust" mentalities
	- persistence is required to decouple producers and consumers
- Apache Kafka is a great messaging layer for this kind of stuff
- **MARKETING MATERIAL:** MapR also has something for this!!!


### Streams Offer More

- Need an event-by-event replayable history?  Streams!
- Also, send raw data to more than one model.
- Streams are excellent for model logistics. (See Chapter 03.)


### Building a Global Data Fabric

- Data Fabric goes beyond and is better than a data lake:
	- efficient way to access all data and types
	- no silos
	- fine-grained control over access control and locality
	- across multiple data centers
	- geo-distributed data
- **MARKETING MATERIAL:** Use our MapR Converged Data Platform!!!


### Making Life Predictable: Containers

- Containers are regular, consistent, and flexible.
- They are particularly important for model management.
- But containers need data.  They should read from and persist data to a data
  platform.
- Might use Cassandra or HDFS ... or ... **MARKETING MATERIAL:** MapR Converged
  Data Platform!!!


### Canaries and Decoys

- Need to accurately record the input data for a model.
- Enter Decoy Models:
    - Appears to be an ML model, but it's not.
    - It's only job is to persist the input data that it receives.
	- "The decoy sits in exactly the same position in a data flow as the actual
	  model or models being developed, but the decoy doesn't do anything except
      look at its input data and record it, preferably in a data stream."
    - See Chapter 04 for more info on decoy models
