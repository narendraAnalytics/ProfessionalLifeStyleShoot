'use client'

import { useState, useEffect, useRef } from 'react'
import { SignedOut, SignedIn, SignInButton, useUser } from '@clerk/nextjs'
import { Check, Star, Zap, Crown, Sparkles, ArrowRight, X, Gift, Infinity } from 'lucide-react'

export default function NewPricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const plans = [
    {
      id: 1,
      clerkPlanId: "free",
      name: "Free",
      description: "Always free to get started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Gift,
      color: "from-green-400 to-emerald-400",
      bgColor: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-400/30",
      features: [
        "2 AI images monthly",
        "1 image merge",
        "Square aspect ratio 1:1",
        "Standard quality",
        "Basic templates",
        "Community support"
      ],
      notIncluded: [
        "Multiple aspect ratios",
        "HD quality",
        "Priority processing",
        "Advanced templates",
        "Commercial license"
      ],
      popular: false,
      delay: 0,
      badge: "Always Free"
    },
    {
      id: 2,
      clerkPlanId: "pro_plan",
      name: "Pro Plan",
      description: "Perfect for content creators",
      monthlyPrice: 4,
      yearlyPrice: 40,
      icon: Crown,
      color: "from-purple-400 to-pink-400",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-400/30",
      features: [
        "15 AI Generations/month",
        "8 Image Merges/month",
        "All Aspect Ratios",
        "HD quality output",
        "Priority processing",
        "Advanced templates",
        "Email support",
        "Billed annually"
      ],
      notIncluded: [
        "Unlimited generation",
        "24/7 priority support",
        "Commercial license"
      ],
      popular: true,
      delay: 100,
      badge: "Most Popular"
    },
    {
      id: 3,
      clerkPlanId: "max_ultimate",
      name: "Max Ultimate",
      description: "For power users and professionals",
      monthlyPrice: 18,
      yearlyPrice: 180,
      icon: Infinity,
      color: "from-orange-400 to-red-400",
      bgColor: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-400/30",
      features: [
        "UNLIMITED Everything",
        "Early Access Features",
        "All aspect ratios",
        "4K quality output",
        "24/7 Priority Support",
        "Premium templates",
        "Commercial license",
        "API access",
        "Custom branding",
        "Billed annually"
      ],
      notIncluded: [],
      popular: false,
      delay: 200,
      badge: "Best Value"
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card') || '0')
            setVisibleCards(prev => [...new Set([...prev, cardIndex])])
          }
        })
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    const cardElements = sectionRef.current?.querySelectorAll('[data-card]')
    cardElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return 0
    const yearlyMonthly = plan.yearlyPrice / 12
    const savings = ((plan.monthlyPrice - yearlyMonthly) / plan.monthlyPrice * 100).toFixed(0)
    return savings
  }


  return (
    <>
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes floating {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <section id="pricing" className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div ref={sectionRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg mb-6">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700 font-medium">Pricing Plans</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Choose Your</span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Start free, scale as you grow. All plans include our core AI features with transparent pricing.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className={`text-lg font-medium transition-colors duration-300 ${!isYearly ? 'text-gray-800' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  isYearly 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' 
                    : 'bg-gray-200 border border-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform duration-300 shadow-lg ${
                  isYearly ? 'transform translate-x-9' : 'transform translate-x-1'
                }`} />
              </button>
              <span className={`text-lg font-medium transition-colors duration-300 ${isYearly ? 'text-gray-800' : 'text-gray-500'}`}>
                Yearly
              </span>
              {isYearly && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 backdrop-blur-sm border border-green-300 animate-pulse">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium text-sm">Save up to 17%</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 mb-16">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                data-card={index}
                className={`relative transition-all duration-1000 transform ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                } ${plan.popular ? 'lg:-mt-6 lg:scale-105' : ''}`}
                style={{ 
                  transitionDelay: `${plan.delay}ms`,
                  animation: visibleCards.includes(index) 
                    ? `cardSlideIn 1s ease-out ${plan.delay}ms both, floating 6s ease-in-out ${plan.delay + 1000}ms infinite` 
                    : 'none'
                }}
                onMouseEnter={() => setHoveredCard(plan.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg animate-pulse">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">{plan.badge}</span>
                    </div>
                  </div>
                )}

                {/* Plan Badge */}
                {!plan.popular && plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${plan.color} text-white shadow-lg font-medium`}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Card Container */}
                <div className={`group relative h-full min-h-[650px] p-8 rounded-3xl transition-all duration-700 cursor-pointer overflow-hidden ${
                  plan.popular 
                    ? 'bg-white/90 backdrop-blur-md border-2 border-purple-300 hover:border-purple-400 hover:bg-white shadow-xl' 
                    : 'bg-white/80 backdrop-blur-md border border-gray-200 hover:border-gray-300 hover:bg-white shadow-lg'
                } hover:scale-105 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular ? 'hover:shadow-purple-200/50' : 'hover:shadow-gray-200/50'
                }`}>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className={`inline-flex p-4 rounded-2xl mb-4 bg-gradient-to-r ${plan.bgColor} backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <plan.icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${plan.color} bg-clip-text relative z-10`} />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-bold text-gray-900">
                          ${getPrice(plan)}
                        </span>
                        <span className="text-gray-600">
                          {plan.monthlyPrice === 0 ? '' : `/${isYearly ? 'year' : 'month'}`}
                        </span>
                      </div>
                      {isYearly && plan.monthlyPrice > 0 && (
                        <div className="text-sm text-green-600">
                          Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(0)} ({getSavings(plan)}% off)
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1 mb-8">
                      <h4 className="text-gray-800 font-semibold mb-6">Everything included:</h4>
                      <div className="space-y-4">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-gradient-to-r ${plan.color} shadow-lg`}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Not Included */}
                      {plan.notIncluded.length > 0 && (
                        <div className="mt-8">
                          <h4 className="text-gray-500 font-semibold mb-4 text-sm">Not included:</h4>
                          <div className="space-y-3">
                            {plan.notIncluded.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-gray-200">
                                  <X className="w-3 h-3 text-gray-500" />
                                </div>
                                <span className="text-gray-500 leading-relaxed">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className={`group/btn relative w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl active:scale-95 overflow-hidden ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-purple-500/25'
                            : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-gray-900 shadow-xl`
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-lg"></div>
                          
                          <div className="relative flex items-center justify-center space-x-3">
                            <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                            <span className="group-hover/btn:tracking-wide transition-all duration-300">
                              {plan.name === 'Free' ? 'Start Free' : 'Get Started'}
                            </span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </div>
                          
                          <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </button>
                      </SignInButton>
                    </SignedOut>

                    <SignedIn>
                      <button 
                        onClick={() => {
                          if (plan.clerkPlanId === 'free') {
                            // For free plan, redirect to dashboard
                            window.location.href = '/dashboard'
                          } else {
                            // For paid plans, open Clerk user account management
                            // This simulates clicking on the user profile to open account management
                            const userButton = document.querySelector('[data-clerk-user-button]')
                            if (userButton) {
                              (userButton as HTMLElement).click()
                            } else {
                              // Fallback: redirect to dashboard and show a message
                              alert('Please click on your profile icon and go to "Manage account" → "Billing" to upgrade your plan.')
                              window.location.href = '/dashboard'
                            }
                          }
                        }}
                        className={`group/btn relative w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl active:scale-95 overflow-hidden ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-purple-500/25'
                            : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-gray-900 shadow-xl`
                        }`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-lg"></div>
                        
                        <div className="relative flex items-center justify-center space-x-3">
                          <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span className="group-hover/btn:tracking-wide transition-all duration-300">
                            {plan.name === 'Free' ? 'Start Free' : 'Get Started'}
                          </span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </div>
                        
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </button>
                    </SignedIn>
                  </div>

                  {/* Background Glow */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-5 transition-all duration-700 -z-10 blur-xl group-hover:blur-2xl group-hover:scale-110`} />
                  
                  {/* Popular card extra effects */}
                  {plan.popular && (
                    <>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-2xl -z-20 animate-pulse" />
                      <div className="absolute inset-0 rounded-3xl border border-purple-200/30 animate-pulse" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>


          {/* Enterprise Section */}
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-orange-500" />
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Need a custom solution?
                </h3>
              </div>
              
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                For enterprises and large teams, we offer custom solutions with volume discounts, 
                dedicated support, and tailored features.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>Contact Sales</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
                
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-800 hover:bg-gray-50 rounded-full font-bold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  View Enterprise Features
                </button>
              </div>
            </div>
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-30" />
            <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-500 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-orange-500 rounded-full animate-bounce opacity-30" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-30" style={{ animationDelay: '3s' }} />
          </div>
        </div>
      </section>
    </>
  )
}