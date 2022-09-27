import BaseClass from './baseClass'
import type * as mT from '../types/shop'

/**
 * @description 商铺
 */
export default class Shop extends BaseClass {
  /**
   * @name checkShopUserUsingPOST
   * @description 切换店铺
   */
  checkShopUser: mT.CheckShopUser = shopRequestBDDTO => {
    const url = '/shop/checkShopUser'
    const config = { url, body: shopRequestBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name shopListByUserUsingGET
   * @description 获取TheUser管理的TheStoreList
   */
  shopListByUser: mT.ShopListByUser = () => {
    const url = '/shop/shopListByUser'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name marketListByUserUsingGET
   * @description 获取TheUser管理的ShoppingList
   */
  marketListByUser: mT.MarketListByUser = () => {
    const url = '/shop/marketListByUser'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name shopListByMarketUserUsingPOST
   * @description 获取TheUser管理的TheStoreList
   */
  shopListByMarketUser: mT.ShopListByMarketUser = shopListRequestBDDTO => {
    const url = '/shop/shopListByMarketUser'
    const config = { url, body: shopListRequestBDDTO, method: 'post' }
    return this.request(config)
  }
}

export const shop = new Shop()
