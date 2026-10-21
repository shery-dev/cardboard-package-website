"use client";

import React from "react";
import { FaRotateRight, FaTriangleExclamation } from "react-icons/fa6";

export default class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Caught WebGL / 3D Canvas error:", error?.message || error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[55vh] flex flex-col items-center justify-center p-6 bg-[#FAF8F5] rounded-xl border border-[#DCCFC2] text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-3">
            <FaTriangleExclamation />
          </div>
          <h3 className="text-base font-bold text-[#2B211B] mb-1">
            3D WebGL Viewport Paused
          </h3>
          <p className="text-xs text-[#6B584D] max-w-md mb-4 leading-relaxed">
            The browser ran out of active 3D graphics contexts or the graphics driver refreshed during live editing.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-[#2B211B] hover:bg-[#A94F32] text-[#FFFDFC] text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <FaRotateRight className="text-[11px]" />
              <span>Reinitialize 3D Viewport</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.location.reload();
              }}
              className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Refresh Tab
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
