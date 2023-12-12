/**
 * Envconf module.
 * @module @dnclive/envconf
 */

import confVars from '#selfmod/conf.mjs'

const fConf = typeof window !== 'undefined'?
  async () => {
    if (!globalThis.__APP_CONF_IS_LOADED__) {
      return await globalThis.__APP_CONF_LOADER_PROMISE__
    } else {
      return globalThis.__APP_CONF__
    }
  }: () => {
    return globalThis.__APP_CONF__
  }

export const conf = typeof window !== 'undefined'? await fConf(): confVars
export default (vars={}) => Object.assign(conf, vars)

/*
const fConf = typeof window !== 'undefined'?
  async (vars={}) => {
    (await import('./conf.js')).default(vars)
    console.log(global)
    if (!globalThis.__APP_CONF_IS_LOADED__) {
      return await globalThis.__APP_CONF_LOADER_PROMISE__
    } else {
      return globalThis.__APP_CONF__
    }
  }: async (vars={}) => {
    (await import('./conf.js')).default(vars)
    return globalThis.__APP_CONF__
  }

export const conf = await fConf()

export default async (vars) => await fConf(vars)
*/
