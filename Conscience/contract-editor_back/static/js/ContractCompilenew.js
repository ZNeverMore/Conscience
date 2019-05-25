"use strict";

import Web3 from 'web3'
import axios from 'axios'
const IOST = require('iost')
export async function compileIostContract(code, fileName = 'test.js') {
  let source = {};
  source[fileName] = {
    content: code
  };
  let input = {
    language: 'JavaScript',
    sources: source,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  const response = await axios.post('/api/iost/compile', {
    input: JSON.stringify(input)
  });
  return response.data;
}

export async function compileSolContract(code, fileName = 'test.sol') {
  let source = {};
  source[fileName] = {
    content: code
  };
  let input = {
    language: 'Solidity',
    sources: source,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  const response = await axios.post('/api/solidity/compile', {
    input: JSON.stringify(input)
  });
  return response.data;
}

export function generateIostContractHierachy(index, compileFile, abi) {
  let hierachy = {
    id: index,
    label: "Contract:" + compileFile,
    children: []
  };
  abi.forEach(func => {
    hierachy.children.push({
      label: `f(${func.args.join(', ')}): ${func.name}`
    });
  });
  return hierachy;
}

export function deployContract(code,abi) {
  // let contractName = input.name;
  // let compileValue = input.value;

    // TODO: rewrite for IOST
    console.log("enter iost deploy");
    // abi2=abi;
    // code2=code;
    //
    var abi2="{\n" +
        "    \"lang\": \"javascript\",\n" +
        "    \"version\": \"1.0.0\",\n" +
        "    \"abi\": [\n" +
        "        {\n" +
        "            \"name\": \"hello\",\n" +
        "            \"args\": [\n" +
        "                \"string\"\n" +
        "            ],\n" +
        "            \"amountLimit\": [],\n" +
        "            \"description\": \"\"\n" +
        "        }\n" +
        "    ]\n" +
        "}\n";
    var code2="class HelloWorld {\n" +
        "    init() {} // needs to provide an init function that will be called during deployment\n" +
        "    hello(someone) {\n" +
        "        return \"hello, \"+ someone\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "module.exports = HelloWorld;\n";
    console.log(abi.replace(/ /g,'').trim());
    console.log(abi2.replace(/ /g,'').trim());
    if(abi.replace(/ /g,'')==abi2.replace(/ /g,'')){

        console.log("yes abi ");
    }
    console.log("------------------");

    console.log(code.replace(/ /g,''));
    console.log(code.replace(/ /g,''));
    if(code.replace(/ /g,'')==code2.replace(/ /g,'')){

        console.log("yes coee ");
    }
    var infot="\"info\"";
    var codet="\"code\"";
    var newtest1="{"+infot+":"+abi2+","+codet+":"+JSON.stringify(code2)+"}";
    var newtest1t=[newtest1];

    console.log(newtest1t);


    window.IWalletJS.enable().then((account) => {
        if(!account) return; // not login

        const iost = window.IWalletJS.newIOST(IOST);
        // if (!iost.currentAccount()) {
        //     this.$notify.error({
        //         title: '插件异常',
        //         message: '请先安装MetaMask并解锁您的钱包！'
        //     });
        // }

        let contractAddress1= "system.iost";
        const ctx1 = iost.callABI(contractAddress1, "setCode",newtest1t);
        ctx1.setGas(100,4000000);

        //const ctx = iost.setCode(contractAddress, "hello",newtest2t);

        // let rpgre = iost.currentRPC;
        //  console.log(rpgre);
        iost.signAndSend(ctx1).on('pending', (trx) => {
            console.log(trx, 'contract is deploying');
            // reset();

        })
            .on('success', (result) => {
                console.log(result, 'result')
                layer.msg('Contract Deploy successfully!');
            })
            .on('failed', (failed) => {
                console.log(failed, 'failed')
                layer.msg('Contract failed to merge!');
            })

    })
}