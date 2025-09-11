'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Star, Zap, Crown, Sparkles, ArrowRight, X } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const plans = [
    {
      id: 1,
      name: "Starter",
      description: "Perfect for trying out AI photography",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      icon: Sparkles,
      color: "from-blue-400 to-cyan-400",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-400/30",
      features: [
        "10 photoshoots per month",
        "Basic style presets",
        "Standard quality (1080p)",
        "Email support",
        "Basic editing tools",
        "Personal use license"
      ],
      notIncluded: [
        "Priority processing",
        "Custom styles",
        "4K resolution",
        "Commercial license"
      ],
      popular: false,
      delay: 0
    },
    {
      id: 2,
      name: "Professional",
      description: "Most popular choice for creators and businesses",
      monthlyPrice: 24.99,
      yearlyPrice: 249.99,
      icon: Crown,
      color: "from-purple-400 to-pink-400",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-400/30",
      features: [
        "50 photoshoots per month",
        "All style presets included",
        "HD quality (1440p)",
        "Priority processing",
        "Advanced editing tools",
        "Email & chat support",
        "Commercial use license",
        "Batch processing"
      ],
      notIncluded: [
        "API access",
        "White-label solution"
      ],
      popular: true,
      delay: 100
    },
    {
      id: 3,
      name: "Studio",
      description: "Unlimited power for agencies and enterprises",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      icon: Zap,
      color: "from-yellow-400 to-orange-400",
      bgColor: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-400/30",
      features: [
        "Unlimited photoshoots",
        "Custom style creation",
        "4K quality resolution",
        "API access included",
        "Priority support 24/7",
        "Team collaboration",
        "White-label solution",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager"
      ],
      notIncluded: [],
      popular: false,
      delay: 200
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card') || '0')
            setVisibleCards(prev => [...prev, cardIndex].filter((v, i, a) => a.indexOf(v) === i))
          }
        })
      },
      { threshold: 0.3 }
    )

    const cardElements = sectionRef.current?.querySelectorAll('[data-card]')
    cardElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getSavings = (plan: typeof plans[0]) => {
    const yearlyMonthly = plan.yearlyPrice / 12
    const savings = ((plan.monthlyPrice - yearlyMonthly) / plan.monthlyPrice * 100).toFixed(0)
    return savings
  }

  return (
    <section id="pricing" className="relative py-10 lg:py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-400/30">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Choose Your Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-gray-800/70 max-w-3xl mx-auto mb-8">
            Start free, scale as you grow. All plans include our core AI features with no hidden costs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-lg font-medium ${!isYearly ? 'text-gray-800' : 'text-gray-800/50'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                isYearly ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform duration-300 ${
                isYearly ? 'transform translate-x-9' : 'transform translate-x-1'
              }`} />
            </button>
            <span className={`text-lg font-medium ${isYearly ? 'text-gray-800' : 'text-gray-800/50'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30 animate-pulse">
                Save up to 40%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              data-card={index}
              className={`
                relative transition-all duration-700 transform
                ${visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
                }
                ${plan.popular ? 'lg:-mt-6' : ''}
              `}
              style={{ transitionDelay: `${plan.delay}ms` }}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-gray-800 px-4 py-2 shadow-lg animate-pulse">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Glassmorphic Card */}
              <div className={`
                relative h-full min-h-[600px] p-8 rounded-3xl
                bg-white/80 backdrop-blur-md border-2 ${plan.borderColor}
                hover:bg-white/90 hover:border-opacity-50
                transition-all duration-500 hover:scale-105
                shadow-2xl hover:shadow-3xl
                ${plan.popular 
                  ? 'bg-gradient-to-b from-purple-500/10 via-transparent to-pink-500/10 border-purple-400/50' 
                  : ''
                }
                ${hoveredCard === plan.id ? 'scale-105' : ''}
                overflow-hidden
              `}>

                {/* Background Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${plan.bgColor} 
                  opacity-0 transition-opacity duration-500 rounded-3xl
                  ${hoveredCard === plan.id ? 'opacity-100' : ''}
                `} />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`
                      inline-flex p-4 rounded-2xl mb-4
                      bg-gradient-to-r ${plan.bgColor}
                      transition-all duration-300
                      ${hoveredCard === plan.id ? 'scale-110' : ''}
                    `}>
                      <plan.icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${plan.color} bg-clip-text`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-800/70 text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold text-gray-800">
                        ${getPrice(plan)}
                      </span>
                      <span className="text-gray-800/70">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && (
                      <div className="text-sm text-green-400">
                        Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)} ({getSavings(plan)}% off)
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-8">
                    <h4 className="text-gray-800 font-semibold mb-4">Everything included:</h4>
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`
                            w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                            bg-gradient-to-r ${plan.color}
                          `}>
                            <Check className="w-3 h-3 text-gray-800" />
                          </div>
                          <span className="text-gray-800/80 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Not Included */}
                    {plan.notIncluded.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-gray-800/60 font-semibold mb-3 text-sm">Not included:</h4>
                        <div className="space-y-2">
                          {plan.notIncluded.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-white/90">
                                <X className="w-3 h-3 text-gray-800/50" />
                              </div>
                              <span className="text-gray-800/50 text-sm leading-relaxed">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button className={`
                    w-full py-4 rounded-2xl font-semibold text-lg
                    transition-all duration-300 hover:scale-105
                    ${plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-800 shadow-2xl hover:shadow-purple-500/25'
                      : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-gray-800 shadow-xl`
                    }
                  `}>
                    {plan.name === 'Starter' ? 'Start Free Trial' : 'Get Started'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Glow Effect */}
                <div className={`
                  absolute inset-0 rounded-3xl blur-xl opacity-0 transition-opacity duration-500
                  bg-gradient-to-r ${plan.color} -z-10
                  ${hoveredCard === plan.id ? 'opacity-20' : ''}
                `} />

                {/* Popular card extra glow */}
                {plan.popular && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-2xl -z-20 animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              Need a custom plan?
            </h3>
            <p className="text-gray-800/70 text-lg mb-6">
              For enterprises and large teams, we offer custom solutions with volume discounts, dedicated support, and tailored features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                Contact Sales
              </Button>
              <Button variant="outline" className="border-white/30 text-gray-800 hover:bg-white/90 px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
                View Enterprise Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}