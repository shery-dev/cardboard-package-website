import React from 'react'
import ToolContainer from '../assets/ToolContainer'
import ProductsList from '../tools/ProductsList'

const Products = () => {
  return (
    <>
      <ToolContainer
        heading={"Select a product"}
      >
        <ProductsList />
      </ToolContainer>
    </>
  )
}

export default Products