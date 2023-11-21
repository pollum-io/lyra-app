import { gql } from "@apollo/client"

export const PROJECTS = gql`
  query ProjectsQuery(
    $active: Boolean
    $categories: [String]
    $status: [String]
    $sort: [Sort]
    $search: String
    $limit: Int
    $skip: Int
  ) {
    getAllSales(
      active: $active
      categories: $categories
      status: $status
      sort: $sort
      search: $search
      limit: $limit
      skip: $skip
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      sales {
        id
        _id
        bannerImage
        status
        openTime
        closeTime
        closeTime
        releaseTime
        releaseEndTime
        saleAmountUsd
        saleAmountToken
        availableTokens
        saleProgress
        averageUSDPrice
        saleId
        tokenAddress
        address
        icon
        tokenName
        description
        about
        tokenSymbol
        whitepaper
        active
        socialLinks
        categories
      }
    }
  }
`

export const PROJECT = gql`
  query ProjectQuery($address: String!) {
    getSaleByAddress(address: $address) {
      id
      _id
      bannerImage
      status
      openTime
      closeTime
      releaseTime
      releaseEndTime
      saleAmountUsd
      saleAmountToken
      availableTokens
      saleProgress
      averageUSDPrice
      totalRaised
      saleId
      tokenAddress
      address
      icon
      tokenName
      description
      about
      tokenSymbol
      whitepaper
      active
      socialLinks
      categories
    }
  }
`
