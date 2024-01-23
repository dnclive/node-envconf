
//import {test, expect} from  "@jest/globals"

import Conf, {conf, isInitialized} from "#selfmod/index.mjs"
//import  from "#selfmod/index.mjs"

console.log('Conf', Conf, conf, isInitialized)

const conf2 = Conf({
  var1: 'val1',
  var2: 2,
  var3:{
    debGroups: ["first", "second", "third"],
    debLevels: [0, 10, 12],
    logLevel: 4
  },
  debGroup: "first"
})

/*
test('adds 1 + 2 to equal 3', () => {
  expect(deb(0, "deb_message", "message")).toBeInstanceOf(String)
})*/


console.log('conf', conf2)

//import {conf as} from "../src/index.js"