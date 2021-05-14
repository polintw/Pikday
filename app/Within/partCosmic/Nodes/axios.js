export function _axios_get_usedNodes(cancelToken){
  let header = {
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  };
  if(!!window.localStorage['token']){ // has token
    header['token'] = window.localStorage['token'];
  };

  return axios({
    method: 'get',
    url: '/router/nouns/list/assigned',
    params: {
      map: true
    },
    headers: header,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
