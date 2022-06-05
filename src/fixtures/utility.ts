import { BaseProvider } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { utils } from 'ethers'
import type { Tiers } from 'src/constants/tier'
import { stakeWithEth, tokenURISim } from './dev-kit'

const falsyOrZero = <T>(num?: T): T | 0 => (num ? num : 0)

const toNaturalBasis = new BigNumber(10).pow(18)

export const toNaturalNumber = (num?: number | string | BigNumber): BigNumber =>
  new BigNumber(falsyOrZero(num)).div(toNaturalBasis)

const fetchBadgeImageSrc = async (opts: {
  provider: BaseProvider
  tokenAddress: string
  amount: number | string
}) => {
  const res = await tokenURISim(opts.provider, opts.tokenAddress, opts.amount)
  const src = res?.image.startsWith('ipfs://')
    ? res.image.replace(/^ipfs:\/\/(.*)/, 'https://cloudflare-ipfs.com/ipfs/$1')
    : res?.image
  return src
}

const fetchEthForDev = async (opts: {
  provider: BaseProvider
  tokenAddress: string
  amount: number | string
}) => {
  const { estimatedEth } = await stakeWithEth(
    opts.provider,
    opts.tokenAddress,
    new BigNumber(opts.amount).toFixed()
  )
  return estimatedEth
}

export const composeTiers = async ({
  sourceTiers,
  provider,
  tokenAddress,
}: {
  sourceTiers: Tiers
  provider: BaseProvider
  tokenAddress: string
}): Promise<{ dev: Tiers; eth: Tiers }> => {
  const forDev = await Promise.all(
    sourceTiers.map(async ({ ...tier }) => {
      const badgeImageSrc =
        tier.badgeImageSrc ??
        (await fetchBadgeImageSrc({
          provider,
          tokenAddress,
          amount: tier.amount,
        }))
      return { ...tier, badgeImageSrc }
    })
  )
  const forEth = await Promise.all(
    forDev.map(async ({ ...tier }) => {
      const amount = await fetchEthForDev({
        provider,
        tokenAddress,
        amount: tier.amount,
      })
      return { ...tier, amount: utils.formatEther(amount) }
    })
  )
  return {
    dev: forDev,
    eth: forEth,
  }
}
