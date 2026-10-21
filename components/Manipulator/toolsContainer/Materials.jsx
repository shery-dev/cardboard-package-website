import React from 'react'
import ToolContainer from '../assets/ToolContainer'
import MaterialList from '../tools/MaterialList'

const Materials = () => {
  return (
    <>
      <ToolContainer
        heading={"Select material"}
      >
        <MaterialList />
      </ToolContainer>
    </>
  )
}

export default Materials