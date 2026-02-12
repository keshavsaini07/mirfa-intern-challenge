"use client";

import { useState } from "react";
import EncryptTab from "../components/tabs/EncryptTab";
import ViewTab from "../components/tabs/ViewTab";
import DecryptTab from "../components/tabs/DecryptTab";

type Tab = "encrypt" | "view" | "decrypt";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("encrypt");

  return (
    <div className="min-h-screen bg-green-50 flex justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Secure Transaction Mini App</h1>

        <div className="flex gap-4">
          {(["encrypt", "view", "decrypt"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === "encrypt" && <EncryptTab />}
        {activeTab === "view" && <ViewTab />}
        {activeTab === "decrypt" && <DecryptTab />}
      </div>
    </div>
  );
}
