import React, { useState, useEffect } from 'react';
import { Shield, Lock, Bell, ArrowRight, FileCheck, Users, Clock, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';

const MotionButton = motion(Button);
const MotionCard = motion(Card);

const TypewriterText = () => {
  const words = ["Compliance", "Security", "Safety", "Privacy", "Protection", "Confidence"];
  const [currentWord, setCurrentWord] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const targetWord = words[currentIndex % words.length];

      if (!isDeleting) {
        setCurrentWord(targetWord.slice(0, currentWord.length + 1));
        if (currentWord === targetWord) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setCurrentWord(targetWord.slice(0, currentWord.length - 1));
        if (currentWord === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => prev + 1);
        }
      }
    }, isDeleting ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [currentWord, currentIndex, isDeleting]);

  return (
    <span className="text-blue-600">
      {currentWord}<span className="animate-pulse">|</span>
    </span>
  );
};

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

  // Updated info cards with more realistic and informative content
  const infoCards = [
    {
      icon: <FileCheck className="w-8 h-8 text-blue-600" />,
      title: "Smart Scanning",
      description: "Quick identification of sensitive data in your files",
      detail: "Emails, Phone Numbers, IDs"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Response Time",
      description: "Streamlined DSAR processing workflow",
      detail: "24-48 hour SLA"
    },
    {
      icon: <Database className="w-8 h-8 text-blue-600" />,
      title: "Data Formats",
      description: "Supporting multiple file formats",
      detail: "CSV, XLSX, JSON"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Team Access",
      description: "Multi-user access management",
      detail: "Admin and user roles"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Your Data. <br />
              <span className="text-blue-600">Ensure </span>
              <TypewriterText />
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Updated Info Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoCards.map((card, index) => (
            <MotionCard 
              key={index} 
              className="text-center hover:shadow-lg"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {card.icon}
                </div>
                <CardTitle className="text-xl font-semibold">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{card.description}</p>
                <p className="text-sm font-medium text-blue-600">{card.detail}</p>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need to manage data privacy and compliance</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <MotionCard 
              key={index} 
              className="hover:shadow-lg"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <CardHeader>
                <div className="p-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
              <CardFooter>
                <MotionButton 
                  variant="ghost" 
                  className="text-blue-600"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </MotionButton>
              </CardFooter>
            </MotionCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;