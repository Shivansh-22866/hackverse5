import React from 'react';
import { Shield, Lock, Bell, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const App = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Data Classification",
      description: "Automatically detect and classify sensitive information in your datasets with advanced pattern recognition."
    },
    {
      icon: <Lock className="w-12 h-12 text-blue-600" />,
      title: "Compliance Workflows",
      description: "Streamline GDPR compliance with automated DSAR handling and compliance report generation."
    },
    {
      icon: <Bell className="w-12 h-12 text-blue-600" />,
      title: "Real-time Monitoring",
      description: "Get instant alerts and notifications about potential data breaches or compliance issues."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Accuracy Rate" },
    { value: "500+", label: "Active Users" },
    { value: "1M+", label: "Records Processed" },
    { value: "<2hrs", label: "Average Response Time" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Your Data. <br />
              <span className="text-blue-600">Ensure Compliance.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Comprehensive data privacy and compliance management platform for modern enterprises.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-blue-600">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need to manage data privacy and compliance</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-blue-600">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to secure your data?</h2>
            <p className="text-xl mb-8">Start your free trial today. No credit card required.</p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;