
const express = require('express');
const router = express.Router();

const axios = require('axios')
const pledgeAndNrAddress = 'n1EoNsJNXG1tN3z9rvjwPKoBXbJMqAjmESC'
const voteAddress = 'n1pADU7jnrvpPzcWusGkaizZoWgUywMRGMY'
const getTxUrl = 'https://explorer-backend.nebulas.io/api/tx/'
const getEventByHashUrl = 'https://mainnet.nebulas.io/v1/user/getEventsByHash'
const pledgeAndNrTopic = 'chain.contract.NATToken'
const voteTopic = 'chain.contract.vote'
let map = {}

router.get('/pledge/nat', function (req, res) {
  let start = req.query.start
  let end = req.query.end
  // if (start === undefined || end === undefined || start < 0 || end < 0) {
  //   res.json('parameter error!')
  // }
  let pledgeNat = 0
  let firstParam = {
    params: {
      a: pledgeAndNrAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    for (let i = 1; i <= totalPage; i++) {
      let params = {
        params: {
          a: pledgeAndNrAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        for (let j = 0; j < list.length; j++) {
          if (list[j].status === 1) {
            let hash = list[j].hash
            let json = JSON.parse(list[j].data)
            if (json.function === 'triggerPledge' || json.Function === 'triggerPledge') {
              let item = {
                hash: hash
              }
              console.log('pledgeTxListItem: ', item)
              axios.post(getEventByHashUrl,
                JSON.stringify({hash: hash}),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(response => {
                let events = response.data.result.events
                for (let k = 0; k < events.length; k++) {
                  if (events[k].topic === pledgeAndNrTopic) {
                    let result = JSON.parse(events[k].data)
                    let data = result.Produce.data
                    for (let m = 0; m < data.length; m++) {
                      pledgeNat += parseFloat(data[m].value)
                    }
                  }
                }
              })

            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      pledgeNat: parseInt(pledgeNat / 1000000000000000000),
      start: start,
      end: end
    })
  },10000)
})

router.get('/pledge/address/nat', function (req, res) {
  let start = req.query.start
  let end = req.query.end
  let address = req.query.address
  if (address === undefined || address.length < 0) {
    res.json('parameter error')
  }
  // if (start === undefined || end === undefined || start < 0 || end < 0 || address === undefined || address.length < 0) {
  //   res.json('parameter error!')
  // }
  let pledgeNat = 0;
  let firstParam = {
    params: {
      a: pledgeAndNrAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    for (let i = 1; i <= totalPage; i++) {
      let params = {
        params: {
          a: pledgeAndNrAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        for (let a = 0; a < list.length; a++) {
          if (list[a].status === 1) {
            let hash = list[a].hash
            let json = JSON.parse(list[a].data)
            if (json.function === 'triggerPledge' || json.Function === 'triggerPledge') {
              axios.post(getEventByHashUrl,
                JSON.stringify({hash: hash}),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(response => {
                let events = response.data.result.events
                for (let b = 0; b < events.length; b++) {
                  if (events[b].topic === pledgeAndNrTopic) {
                    let result = JSON.parse(events[b].data)
                    let data = result.Produce.data
                    for (let c = 0; c < data.length; c++) {
                      if (data[c].addr === address) {
                        pledgeNat += parseFloat(data[c].value);
                      }
                    }
                  }
                }
              })
            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      pledgeNat: parseInt(pledgeNat / 1000000000000000000),
      address: address,
      start: start,
      end: end
    })
  }, 10000)
})

router.get('/nr/nat', function (req, res) {
  let start = req.query.start
  let end = req.query.end
  // if (start === undefined || end === undefined || start < 0 || end < 0) {
  //   res.json('parameter error!')
  // }
  let nrNat = 0
  let firstParam = {
    params: {
      a: pledgeAndNrAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    for (let i = 1; i <= totalPage; i++) {
      let params = {
        params: {
          a: pledgeAndNrAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        for (let a = 0; a < list.length; a++) {
          if (list[a].status === 1) {
            let hash = list[a].hash
            let json = JSON.parse(list[a].data)
            if (json.Function === 'triggerNR') {
              let item = {
                hash: hash
              }
              console.log('nrTxListItem', item)
              axios.post(getEventByHashUrl,
                JSON.stringify({hash: hash}),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(response => {
                let events = response.data.result.events
                for (let b = 0; b < events.length; b++) {
                  if (events[b].topic === pledgeAndNrTopic) {
                    let result = JSON.parse(events[b].data)
                    let data = result.Produce.data
                    for (let c = 0; c < data.length; c++) {
                      nrNat += parseFloat(data[c].value)
                    }
                  }
                }
              })
            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      nrNat: parseInt(nrNat / 1000000000000000000),
      start: start,
      end: end
    })
  },12000)
})

router.get('/nr/address/nat', function (req, res) {
  let start = req.query.start
  let end = req.query.end
  let address = req.query.address
  if (address === undefined || address.length < 0) {
    res.json('parameter error')
  }
  // if (start === undefined || end === undefined || start < 0 || end < 0 || address === undefined || address.length < 0) {
  //   res.json('parameter error!')
  // }
  let nrNat = 0;
  let firstParam = {
    params: {
      a: pledgeAndNrAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    for (let i = 1; i <= totalPage; i++) {
      let params = {
        params: {
          a: pledgeAndNrAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        for (let a = 0; a < list.length; a++) {
          if (list[a].status === 1) {
            let hash = list[a].hash
            let json = JSON.parse(list[a].data)
            if (json.Function === 'triggerNR') {
              axios.post(getEventByHashUrl,
                JSON.stringify({hash: hash}),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(response => {
                let events = response.data.result.events
                for (let b = 0; b < events.length; b++) {
                  let result = JSON.parse(events[b].data)
                  let data = result.Produce.data
                  for (let c = 0; c < data.length; c++) {
                    if (data[c].addr === address) {
                      nrNat += parseFloat(data[c].value);
                    }
                  }
                }
              })
            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      nrNat: parseInt(nrNat / 1000000000000000000),
      address: address,
      start: start,
      end: end
    })
  })
})

router.get('/vote/nat', function (req, res) {
  map = {}
  let voteTxList = []
  let start = req.query.start
  let end = req.query.end
  // if (start === undefined || end === undefined || start < 0 || end < 0) {
  //   res.json('parameter error!')
  // }
  let voteRewardNat = 0
  let firstParam = {
    params: {
      a: voteAddress,
      p: 1
    }
  }
  axios.get(getTxUrl, firstParam).then(response => {
    let totalPage = response.data.data.totalPage
    console.log('voteTotalPage: ', totalPage)
    for (let i = 1; i <= totalPage; i++) {
      console.log(i)
      let pageResult = 0
      let params = {
        params: {
          a: voteAddress,
          p: i
        }
      }
      axios.get(getTxUrl, params).then(response => {
        let list = response.data.data.txnList
        console.log('response -> ' + i + ': list :' + JSON.stringify(list))
        for (let a = 0; a < list.length; a++) {
          if (list[a].status === 1) {
            let hash = list[a].hash
            let json = JSON.parse(list[a].data)
            if (json.Function === 'vote') {
              let item = {
                hash: hash,
                timestamp: list[a].timestamp
              }
              voteTxList.push(item)
              axios.post(getEventByHashUrl,
                JSON.stringify({hash: hash}),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(response => {
                let events = response.data.result.events
                for (let b = 0; b < events.length; b++) {
                  if (events[b].topic === voteTopic) {
                    let result = JSON.parse(events[b].data)
                    voteRewardNat += parseFloat(result.reward)
                    pageResult += parseFloat(result.reward)
                  }
                }
              })
            }
          }
        }
      })
    }
  })
  setTimeout(function () {
    res.json({
      voteRewardNat: parseInt(voteRewardNat / 10),
      start: start,
      end: end,
      length: voteTxList.length
    })
  }, 10000)
})

router.get('/get/map', function (req, res) {
  res.json(map)
})

module.exports = router;
