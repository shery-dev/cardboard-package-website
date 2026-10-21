import React from 'react'
import ToolContainer from '../assets/ToolContainer'
import QuantityInput from '../tools/QuantityInput'

const Quantity = () => {
  return (
    <>
      <ToolContainer
        heading={"Select quantity"}
      >
        <QuantityInput />
      </ToolContainer>
    </>
  )
}

export default Quantity