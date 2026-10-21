"use client";

import React from 'react';
import ToolContainer from '../assets/ToolContainer';
import CustomSizes from '../tools/CustomSizes';
import StandardSizes from '../tools/StandardSizes';

const Sizes = ({ subProductData }) => {
    return (
        <div className="flex flex-col gap-2">
            <ToolContainer heading={"Standard sizes"}>
                <StandardSizes data={subProductData} />
            </ToolContainer>
            <ToolContainer heading={"Create custom size"}>
                <CustomSizes />
            </ToolContainer>
        </div>
    );
};

export default Sizes;
