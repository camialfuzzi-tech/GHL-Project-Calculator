/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Calculator from "./components/Calculator";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            GHL Project Quote Calculator
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Find out how much it would cost to implement your system in GoHighLevel.
          </p>
        </div>
        
        <Calculator />
      </div>
    </div>
  );
}
