
import { Check, X, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Basic satellite data access",
      "5 queries per month",
      "Standard processing speed",
      "Community support",
      "Basic visualizations"
    ],
    highlighted: false
  },
  {
    name: "Pro",
    price: "$100",
    period: "/month",
    description: "For professional analysts",
    features: [
      "Full satellite data access",
      "Unlimited queries",
      "High-speed processing",
      "Priority support",
      "Advanced AI insights",
      "Custom notebooks",
      "Team collaboration"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations at scale",
    features: [
      "Everything in Pro",
      "Dedicated infrastructure",
      "Custom integrations",
      "24/7 support",
      "SLA guarantees",
      "On-premise deployment"
    ],
    highlighted: false
  }
];

const competitors = [
  {
    name: "AxionOrbital",
    coding: "No",
    dataIntegration: "Yes (Sentinel-2, Landsat & many more)",
    pricing: "$0 → $100/mo",
    highlighted: true
  },
  {
    name: "ArcGIS Pro/Online",
    coding: "Optional",
    dataIntegration: "Limited (pay per dataset)",
    pricing: "$700/seat/yr"
  },
  {
    name: "Google Earth Engine",
    coding: "Yes (JS/Python)",
    dataIntegration: "Yes (quotas)",
    pricing: "$500+/mo (commercial)"
  },
  {
    name: "QGIS (Open-source)",
    coding: "More Coding",
    dataIntegration: "Low Integration",
    pricing: "Free license, but paid plug-ins + cloud hosting for large datasets"
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 via-blue-950/20 to-cyan-950/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Pricing Plans */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-8">
            <Sparkles className="h-4 w-4 text-cyan-400 mr-2" />
            <span className="text-cyan-400 text-sm font-medium">Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Free,
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Scale as You Grow
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            No hidden fees, no per-dataset charges. Pay only for what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${
                plan.highlighted 
                  ? 'bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-cyan-400/60 scale-105 shadow-2xl shadow-cyan-500/20' 
                  : 'bg-slate-900/50 border-slate-700/50'
              } backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className={`text-xl ${plan.highlighted ? 'text-cyan-100' : 'text-white'}`}>
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`ml-1 ${plan.highlighted ? 'text-cyan-200' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`${plan.highlighted ? 'text-cyan-200' : 'text-gray-300'}`}>
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-center ${plan.highlighted ? 'text-gray-200' : 'text-gray-300'}`}>
                      <Check className="h-4 w-4 text-cyan-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Competitive Positioning */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why Choose
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AxionOrbital?
            </span>
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The only IDE that's truly no-code and end-to-end for satellite data analysis
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-white font-semibold">Solution</th>
                <th className="text-left p-4 text-white font-semibold">Coding Required</th>
                <th className="text-left p-4 text-white font-semibold">Data Integration</th>
                <th className="text-left p-4 text-white font-semibold">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor, index) => (
                <tr 
                  key={index}
                  className={`border-b border-slate-700/30 ${
                    competitor.highlighted 
                      ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20' 
                      : 'hover:bg-slate-800/30'
                  } transition-colors`}
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      {competitor.highlighted && (
                        <Sparkles className="h-4 w-4 text-cyan-400 mr-2" />
                      )}
                      <span className={`font-medium ${
                        competitor.highlighted ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {competitor.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      {competitor.coding === 'No' ? (
                        <Check className="h-4 w-4 text-green-400 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-400 mr-2" />
                      )}
                      <span className="text-gray-300">{competitor.coding}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{competitor.dataIntegration}</td>
                  <td className="p-4">
                    <span className={`${
                      competitor.highlighted ? 'text-cyan-400 font-semibold' : 'text-gray-300'
                    }`}>
                      {competitor.pricing}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <p className="text-cyan-400 font-semibold text-lg">
            AxionOrbital = No code + Built-in data + Cloud Compute → fastest & smartest IDE in the market
          </p>
        </div>
      </div>
    </section>
  );
};
