"use client";

import animationData from "@/components/Animation/Animations.json";
import { useLottie } from "lottie-react";

const LottieAnimation = () => {

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View } = useLottie(defaultOptions);

  return (
    <>
      <div className="">
        <div className="w-full">{View}</div>
      </div>
    </>
  );
};

export default LottieAnimation;
