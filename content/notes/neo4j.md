---
title: "Developing with Neo4j and JavaScript"
date: 2022-07-20T09:51:23-06:00
draft: false

tags: ["neo4j", "javascript", "d3js"]
categories: ["Tools"]

---

# Neo4j

## Set up development server in a docker container
```
docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    --env=NEO4J_AUTH=none \
    neo4j
```


## use neo4j from javascript
https://neo4j.com/developer/javascript/

```
npm install neo4j-driver
```

```javascript
const neo4j = require('neo4j-driver')

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()
const personName = 'Alice'

try {
  const result = await session.run(
    'CREATE (a:Person {name: $name}) RETURN a',
    { name: personName }
  )

  const singleRecord = result.records[0]
  const node = singleRecord.get(0)

  console.log(node.properties.name)
} finally {
  await session.close()
}

// on application exit:
await driver.close()
```
