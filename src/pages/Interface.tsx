
import { useState } from "react";
import { 
  Globe, 
  Menu, 
  Database, 
  BarChart3, 
  Settings, 
  MessageCircle,
  User,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Interface = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white" />
            <div className="flex items-center">
              <Globe className="h-6 w-6 text-cyan-400 mr-2" />
              <span className="text-xl font-bold text-white">Phoenix 4.0</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white" />
            <Settings className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-16 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-center py-6 space-y-6">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
          </div>
          <div className="p-2 hover:bg-slate-700/50 rounded-lg cursor-pointer">
            <Database className="h-6 w-6 text-gray-400 hover:text-white" />
          </div>
          <div className="p-2 hover:bg-slate-700/50 rounded-lg cursor-pointer">
            <Globe className="h-6 w-6 text-gray-400 hover:text-white" />
          </div>
          <div className="p-2 hover:bg-slate-700/50 rounded-lg cursor-pointer">
            <MessageCircle className="h-6 w-6 text-gray-400 hover:text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <div className="px-8 py-6 border-b border-slate-700/50">
            <h1 className="text-2xl font-bold text-white mb-2">
              No-Code IDE for Planetary Scale Satellite Data Analysis
            </h1>
          </div>

          {/* Query Input */}
          <div className="px-8 py-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Give me the semi Sentinel-2 multispectral data from 9 calendar from 20th November 2023 to 30th Jan 2024"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="mt-4">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2">
                Submit Query
              </Button>
            </div>
          </div>

          {/* Globe Visualization */}
          <div className="flex-1 px-8 pb-8">
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 h-full flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-32 w-32 text-cyan-400/50 mx-auto mb-4 animate-spin" style={{ animationDuration: '20s' }} />
                <p className="text-gray-400 text-lg">Global Satellite Data Visualization</p>
                <p className="text-gray-500 text-sm mt-2">Submit a query to see planetary-scale analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
