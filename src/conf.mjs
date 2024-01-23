
// *** INFO ***
// Conf priority each next - replace previous
// process.argv - command line args
// .env - package base configuration
// {.env.development, .env.production} - package based build type config
// .env.local - local envs
// DEB_ENV_CONF_PATH(/etc/idpengfrnt/conf.conf) - production only distributive conf
// or
// DEB_UNIT_ENV_CONF_PATH(/etc/idpengfrnt@/$UNIT_NAME/env.conf) - production only instantiated distributive conf

// deb
//import Deb from '../lib/deb.mjs'
//const log = Deb({debGroup: 'conf'})

/*import path from "path"
import fs from "fs"
import dotenv from "dotenv"*/

// conf
globalThis.__APP_CONF__??={}
globalThis.__APP_CONF_REQ_PROMISES__??=[]

//log('__APP_CONF__', globalThis.__APP_CONF__, globalThis.__APP_CONF_IS_LOADED__, globalThis.__APP_CONF_IS_LOADING__)
//console.log('window', window)

//export default function (vars={}) {
    // at the server
    if (typeof window === 'undefined') {

        if (!globalThis.__APP_CONF__.isInitialized) {
            globalThis.__APP_CONF__.isInitialized = true

            const path = await import("path")
            const fs = await import("fs")
            const dotenv = await import("dotenv")

            // Promise.all([
            //     import("path"),
            //     import("fs"),
            //     import("dotenv")
            // ]).then(([path, fs, dotenv]) => {
                /*const dotenv = require('dotenv')
            const fs = require('fs')
            const path = require('node:path')*/

                const fReduceVal = (val, vars, keys) => {
                    if (typeof val !== 'string') return val
                    let varsKeys = keys ?? Object.keys(vars).sort((a, b) => b.length - a.length)
                    let newVal = val
                    for (let n = 0; n < varsKeys.length; n++) {
                        let replaced = false
                        const newVarsKeys = []
                        for (let i = 0; i < varsKeys.length; i++) {
                            if (newVal.includes(`$${varsKeys[i]}`)) {
                                replaced = true
                                newVal = newVal.replace(`$${varsKeys[i]}`, vars[varsKeys[i]])
                                //log('replace', val, newVal, `$${varsKeys[i]}`, vars[varsKeys[i]])
                            } else {
                                newVarsKeys.push(varsKeys[i])
                            }
                        }
                        if (!replaced) break
                        varsKeys = newVarsKeys
                    }
                    return newVal
                }

                const fReplaceVars = (from, to) => {
                    const newTo = {...to}
                    const fromKeys = Object.keys(from).sort((a, b) => b.length - a.length)
                    //log('fReplaceVars', from, to, fromKeys)
                    Object.keys(to).forEach((toKey) => {
                        newTo[toKey] = fReduceVal(to[toKey], from, fromKeys)
                    })
                    return newTo
                }

                // process.argv
                globalThis.__APP_CONF__.argvAmount = 0
                process.argv.forEach(function (val, index, array) {
                    const arg = val.split('=')
                    //log('arg', arg)
                    if (arg.length > 1) {
                        const key = arg.splice(0, 1)[0]
                        //log('val', key, arg, arg.join())
                        globalThis.__APP_CONF__[key] = arg.join()
                    } else {
                        globalThis.__APP_CONF__[index] = val
                    }
                    globalThis.__APP_CONF__.argvAmount++
                })

                // service instance
                if (globalThis.__APP_CONF__['0'].endsWith('@')) {
                    globalThis.__APP_CONF__.UNIT_NAME = globalThis.__APP_CONF__['2']
                }
                //globalThis.__APP_CONF__.UNIT_NAME = 'main'

                const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV !== '' ? process.env.NODE_ENV :
                  globalThis.__APP_CONF__.NODE_ENV ? globalThis.__APP_CONF__.NODE_ENV : 'production'

                //console.log('nodeEnv', process.env.NODE_ENV, globalThis.__APP_CONF__.NODE_ENV, nodeEnv)

                //log (10, "process.env.NODE_ENV", process.env.NODE_ENV, nodeEnv)

                globalThis.__APP_CONF__.nodeEnv = nodeEnv
                globalThis.__APP_CONF__.NODE_ENV = nodeEnv

                //console.log('before', vars, globalThis.__APP_CONF__)
                // inject vars
                //globalThis.__APP_CONF__ = Object.assign(globalThis.__APP_CONF__, vars)
                //console.log('after', vars, globalThis.__APP_CONF__)

                //const dirname = nodeEnv === 'development' ? '' : __dirname
                const dirname = ''

                // base config
                const env = '.env'
                const envPath = path.join(dirname, env)
                //log(10, 'envPath', envPath)
                if (fs.existsSync(envPath)) {
                    globalThis.__APP_CONF__.env = env
                    const envs = dotenv.config({path: envPath, override: true})
                    if (!envs.error) {
                        Object.keys(envs.parsed).forEach((key) => {
                            const value = envs.parsed[key]
                            if (value) {
                                globalThis.__APP_CONF__[key] = value
                            }
                        })
                    }
                    globalThis.__APP_CONF__.primaryConf = env
                    //log (10, "envs", envs)
                }

                // custom config
                const customEnv = nodeEnv ? `.env.${nodeEnv}` : undefined
                if (customEnv) {
                    const customEnvPath = path.join(dirname, customEnv)
                    if (fs.existsSync(customEnvPath)) {
                        globalThis.__APP_CONF__.customEnv = customEnv
                        const customEnvs = dotenv.config({path: customEnvPath, override: true})
                        if (!customEnvs.error) {
                            Object.keys(customEnvs.parsed).forEach((key) => {
                                const value = customEnvs.parsed[key]
                                if (value) {
                                    globalThis.__APP_CONF__[key] = value
                                }
                            })
                        }
                        globalThis.__APP_CONF__.primaryConf = customEnv
                        //log(10, "customEnvs", customEnvs)
                    }
                }

                // local config
                const localEnv = '.env.local'
                const localEnvPath = path.join(dirname, localEnv)
                //log(10, 'localEnvPath', localEnvPath)
                if (fs.existsSync(localEnvPath)) {
                    globalThis.__APP_CONF__.localEnv = localEnv
                    const localEnvs = dotenv.config({path: localEnvPath, override: true})
                    if (!localEnvs.error) {
                        Object.keys(localEnvs.parsed).forEach((key) => {
                            const value = localEnvs.parsed[key]
                            if (value) {
                                globalThis.__APP_CONF__[key] = value
                            }
                        })
                    }
                    globalThis.__APP_CONF__.primaryConf = localEnv
                    //log(10, "localEnvs", localEnvs)
                }

                // dist environment config at the production only
                if (nodeEnv === 'production') {
                    const confEnv =
                      globalThis.__APP_CONF__.UNIT_NAME && globalThis.__APP_CONF__.DEB_UNIT_ENV_CONF_PATH &&
                      globalThis.__APP_CONF__.DEB_UNIT_ENV_CONF_PATH !== '' ?
                        globalThis.__APP_CONF__.DEB_UNIT_ENV_CONF_PATH.replace('$UNIT_NAME', globalThis.__APP_CONF__.UNIT_NAME) :
                        globalThis.__APP_CONF__.DEB_ENV_CONF_PATH && globalThis.__APP_CONF__.DEB_ENV_CONF_PATH !== '' ?
                          globalThis.__APP_CONF__.DEB_ENV_CONF_PATH : undefined
                    //log(11, 'confEnv', confEnv, globalThis.__APP_CONF__.UNIT_NAME, globalThis.__APP_CONF__.DEB_UNIT_ENV_CONF_PATH)
                    if (confEnv && !confEnv.includes('$')) {
                        const confEnvPath = path.join('', confEnv)
                        //log(11, 'confEnvPath', confEnv, confEnvPath)
                        if (fs.existsSync(confEnvPath)) {
                            globalThis.__APP_CONF__.confEnv = confEnv
                            const confEnvs = dotenv.config({path: confEnvPath, override: true})
                            if (!confEnvs.error) {
                                Object.keys(confEnvs.parsed).forEach((key) => {
                                    const value = confEnvs.parsed[key]
                                    if (value) {
                                        globalThis.__APP_CONF__[key] = value
                                    }
                                })
                            }
                            globalThis.__APP_CONF__.primaryConf = confEnv
                            //log(11, "confEnvs", confEnvs)
                        }
                    }
                }

                // replace vars
                globalThis.__APP_CONF__ = fReplaceVars(globalThis.__APP_CONF__, globalThis.__APP_CONF__)

                console.info('APP.CONF')
                console.info(globalThis.__APP_CONF__)
            // })
        }
    } else if (!globalThis.__APP_CONF_IS_LOADED__ && !globalThis.__APP_CONF_IS_LOADING__) {
        globalThis.__APP_CONF_IS_LOADING__ = true
        globalThis.__APP_CONF_LOADER_PROMISE__ = new Promise(async (resolve, reject) => {
            //const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : ''
            const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
            //log(11, 'origin', origin)
            //const axios = require('axios')
            const axios = (await import('axios')).default
            try {
                const localNextApiClient = axios.create({
                    baseURL: `${origin}/api/`,
                    responseType: 'json',
                })
                const response = await localNextApiClient.get(`conf`)
                //log('fetchConf.response', response.data)
                globalThis.__APP_CONF__ = response.data
                // inject vars
                //globalThis.__APP_CONF__ = Object.assign(globalThis.__APP_CONF__, vars)
                resolve(globalThis.__APP_CONF__)
            } catch (err) {
                globalThis.__APP_CONF__ = Object.assign(globalThis.__APP_CONF__, {__CONF_ERROR__: err})
                resolve(globalThis.__APP_CONF__)
                //reject(err)
            }
            globalThis.__APP_CONF_IS_LOADED__ = true
            globalThis.__APP_CONF_IS_LOADING__ = false
        })
    }

    // inject vars
    //if (vars) globalThis.__APP_CONF__ = Object.assign(globalThis.__APP_CONF__, vars)

    //return globalThis.__APP_CONF__
//}

export const isInitialized = globalThis.__APP_CONF__.isInitialized
export default globalThis.__APP_CONF__

//console.log("conf.mjs", globalThis.__APP_CONF__)

