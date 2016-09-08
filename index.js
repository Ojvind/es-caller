var elasticsearch = require('elasticsearch');

config = {
  host: 'http://localhost:9200',
  index: 'oneweb-favoritehotels',
}

function calculateUsers(numberOfHotels) {
  var client = new elasticsearch.Client({
    host: config.host,
  });

  return client.search({
		index: config.mairBlogIndexName,
		body: {
      filter : {
          script : {
              script : "_source.hotelList.size() > " + numberOfHotels
          }
      }
		}
	}).then(function (searchResp) {
    return {
      searchResp: searchResp.hits.total,
      numberOfHotels
    };
	});
}

var index = [];

for (var i = 1; i < 10; i++) {
  index.push(i);
}

var p = index.map(i => {
  return calculateUsers(i);
});

Promise.all(p).then(arr => {
  arr.forEach( item => {
    console.log(`${item.searchResp}    ${item.numberOfHotels}`);
  })
});
