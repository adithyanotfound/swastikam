'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Stethoscope, 
  Clock, 
  Phone, 
  User, 
  Shield, 
  Heart,
  ArrowRight,
  Calendar,
  MessageCircle,
  Zap,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Availability",
      description: "Book appointments anytime, anywhere with our AI assistant"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Voice & Text Support",
      description: "Interact naturally through voice commands or text input"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your health information is protected with enterprise-grade security"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Personalized Care",
      description: "AI-powered recommendations based on your medical history"
    }
  ]

  const specializations = [
    "Renal Transplant",
    "Minimal Invasive Surgery", 
    "Bariatric Surgery",
    "Endoscopy",
    "Cancer Surgery"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-primary p-2 rounded-lg">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  Dr. Kumar Awadhesh
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Consultant Surgeon
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold text-foreground">
                  Dr. Kumar
                </h1>
                <p className="text-xs text-muted-foreground">
                  Surgeon
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                <Link href="/booking">
                  <Button variant="ghost" size="sm">
                    Book Appointment
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="ghost" size="sm">
                    Contact
                  </Button>
                </Link>
              </div>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t border-border/40 bg-background/95"
            >
              <div className="px-4 py-4 space-y-2">
                <Link href="/booking">
                  <Button variant="ghost" className="w-full justify-start">
                    Book Appointment
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="ghost" className="w-full justify-start">
                    Contact
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Advanced Healthcare
                <span className="text-primary block sm:inline"> Meets AI</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto px-4">
                Experience the future of healthcare with our AI-powered appointment booking system. 
                Get personalized care recommendations and seamless scheduling with our intelligent assistant.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4"
            >
              <Link href="/booking" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto">
                  Start Booking
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
            <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Why Choose Our AI Assistant?
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Experience healthcare booking like never before with our intelligent AI system
            </p>
          </div>
          
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-7xl">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Specializations
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Expert care in advanced surgical procedures
            </p>
          </div>
          
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {specializations.map((specialization, index) => (
                <motion.div
                  key={specialization}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Heart className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">{specialization}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Ready to Get Started?
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
                Book your appointment with our AI assistant and experience the future of healthcare
              </p>
              <div className="mt-8 sm:mt-10 flex items-center justify-center">
                <Link href="/booking" className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full sm:w-auto">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="font-bold text-foreground text-sm sm:text-base">Dr. Kumar Awadhesh</span>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
                Consultant Surgeon with expertise in advanced surgical procedures
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Contact</h3>
              <div className="mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <p>Emergency: +91 98765 43210</p>
                <p>Email: info@drkumarclinic.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Services</h3>
              <div className="mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <p>• Renal Transplant</p>
                <p>• Minimal Invasive Surgery</p>
                <p>• Bariatric Surgery</p>
                <p>• Endoscopy</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Technology</h3>
              <div className="mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <p>• AI-Powered Booking</p>
                <p>• Voice Recognition</p>
                <p>• Secure Platform</p>
                <p>• 24/7 Availability</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 border-t border-border/40 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2024 Dr. Kumar Awadhesh Clinic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 