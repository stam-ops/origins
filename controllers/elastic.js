const { Client } = require('@elastic/elasticsearch')

const clientElastic = new Client({
  cloud: {
    id: 'origins:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDA5ZjA0YzZkZGY1MDRhZjFhNTI4MTJhODVkNzJlMGFiJDI4NzI1OGE3ZjQ5ZTQzMmM5ZjhhN2ZmNTY0MjY1NDgz',
  },
  auth: {
    username: 'elastic',
    password: 'YmFRZ3FxnAwPtBfcHuFBywHD'
  }
})

/*clientElastic.info()
.then(response => console.log(response))
.catch(error => console.error(error))*/


exports.run = async  (name,description) =>  {
  await clientElastic.index({
    index: 'video',
    body: {
      name: name,
      description: description
    }
  })

  await clientElastic.indices.refresh({index: 'video'})
}

exports.updateVideo = async  (id,name,description) =>  {
  await clientElastic.update({
    index: 'video',
    id: id,
    body: {
      name: name,
      description: description
    }
  })

  await clientElastic.indices.refresh({index: 'video'})

  const { body } = await clientElastic.get({
    index: 'video',
    id: id
  })

  console.log(body)
}


exports.read = async  (name) =>  {
  const { body } = await clientElastic.search({
    index: 'video',
    body: {
      query: {
        match: { name: name }
      }
    }
  })
  console.log(body.hits.hits)
  return body.hits.hits[0]._id;

}

exports.addTag = async  (id,tag) =>  {

  // console.log("update elastic id = "+id+ " tag = "+tag);

  await clientElastic.update({
    index: 'video',
    id: id,
    body: {
      "script": "if (ctx._source.tags != null) {ctx._source.tags.add(\""+tag+"\");} else {ctx._source.tags = ['"+tag+"']}",
    }
  })

  const { body } = await clientElastic.get({
    index: 'video',
    id: id
  })

  console.log(body)
}

exports.removetag = async  (id,tag) =>  {

  console.log("remove elastic id = "+id+ " tag = "+tag);

  await clientElastic.update({
    index: 'video',
    id: id,
    body: {
      "script" : {
        "inline": "if (ctx._source.tags!=null) for(int i=0;i<ctx._source.tags.size();i++){if(ctx._source.tags[i]==params.tag){ctx._source.tags.remove(i)}}",
        "lang": "painless",
        "params":{
          "tag":tag
        }
      }
    }
  })

  /*const { body } = await clientElastic.get({
  index: 'video',
  id: id
})

console.log(body)*/
}
