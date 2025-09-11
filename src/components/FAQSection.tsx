'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, HelpCircle, Zap, CreditCard, Settings, Shield } from 'lucide-react'
import { Badge } from './ui/badge'

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([0]) // First item open by default
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleSection, setVisibleSection] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle, color: 'from-purple-400 to-pink-400' },
    { id: 'general', name: 'General', icon: HelpCircle, color: 'from-blue-400 to-cyan-400' },
    { id: 'technical', name: 'Technical', icon: Settings, color: 'from-green-400 to-emerald-400' },
    { id: 'pricing', name: 'Pricing', icon: CreditCard, color: 'from-yellow-400 to-orange-400' },
    { id: 'support', name: 'Support', icon: Shield, color: 'from-pink-400 to-rose-400' }
  ]

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: "How does the AI photography generation work?",
      answer: "Our AI uses advanced machine learning models trained on millions of professional photographs. Simply upload your image, choose a style, and our AI analyzes the composition, lighting, and subject matter to generate stunning professional photos. The entire process takes just 30-60 seconds.",
      gradient: "from-purple-400 to-blue-400"
    },
    {
      id: 2,
      category: 'general',
      question: "What types of photos can I create?",
      answer: "You can create a wide variety of professional photos including business portraits, fashion shots, product photography, lifestyle images, architectural photos, and more. We support over 100+ different styles ranging from corporate headshots to artistic fashion photography.",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      id: 3,
      category: 'technical',
      question: "What image formats and sizes do you support?",
      answer: "We support JPG, PNG, HEIC, and WebP formats. Input images can range from 512px to 4096px. Output images are available in multiple resolutions up to 4K (4096x4096) depending on your plan. We automatically optimize images for the best quality.",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      id: 4,
      category: 'technical',
      question: "How long does it take to generate photos?",
      answer: "Most photos are generated within 30-60 seconds. Complex styles or high-resolution outputs may take up to 2 minutes. Professional plan users get priority processing for faster results. You'll receive real-time updates during the generation process.",
      gradient: "from-teal-400 to-blue-400"
    },
    {
      id: 5,
      category: 'pricing',
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no cancellation fees. Your plan will remain active until the end of your current billing period. You'll retain access to all generated photos even after cancellation.",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      id: 6,
      category: 'pricing',
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with the results within the first 30 days, contact our support team for a full refund. Free trial users can upgrade or downgrade at any time.",
      gradient: "from-orange-400 to-red-400"
    },
    {
      id: 7,
      category: 'general',
      question: "Can I use generated photos commercially?",
      answer: "Yes! Professional and Studio plans include full commercial licensing. This means you can use generated photos for business websites, marketing materials, social media, and even resale. Starter plan includes personal use only.",
      gradient: "from-pink-400 to-purple-400"
    },
    {
      id: 8,
      category: 'technical',
      question: "Is my data secure and private?",
      answer: "Absolutely. We use enterprise-grade encryption for all uploads and storage. Your images are processed securely and automatically deleted after 30 days unless you choose to save them. We never share your data with third parties.",
      gradient: "from-violet-400 to-purple-400"
    },
    {
      id: 9,
      category: 'support',
      question: "What kind of support do you provide?",
      answer: "We offer email support for all users, with priority chat support for Professional and Studio plans. Our support team typically responds within 24 hours (faster for premium users). We also have extensive documentation and video tutorials.",
      gradient: "from-pink-400 to-rose-400"
    },
    {
      id: 10,
      category: 'support',
      question: "Do you have an API for developers?",
      answer: "Yes! Studio plan includes full API access with comprehensive documentation. You can integrate our AI photography generation directly into your applications, websites, or workflows. We provide SDKs for popular programming languages.",
      gradient: "from-indigo-400 to-purple-400"
    },
    {
      id: 11,
      category: 'general',
      question: "Can I create custom styles?",
      answer: "Professional and Studio plans allow style customization. You can adjust lighting, composition, background, and artistic effects. Studio plan users can create completely custom styles by providing reference images and detailed specifications.",
      gradient: "from-emerald-400 to-teal-400"
    },
    {
      id: 12,
      category: 'technical',
      question: "What happens if generation fails?",
      answer: "If a generation fails due to technical issues, it doesn't count against your monthly quota. We'll automatically retry the process or provide troubleshooting guidance. Our system has a 99.9% success rate for properly formatted images.",
      gradient: "from-cyan-400 to-blue-400"
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const isOpen = (id: number) => openItems.includes(id)

  return (
    <section id="faq" className="relative py-10 lg:py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          visibleSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge className="mb-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border-indigo-400/30">
            FAQ
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-xl text-gray-800/70 max-w-3xl mx-auto">
            Find answers to common questions about our AI photography platform, features, and pricing.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${
          visibleSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Search Bar */}
          <div className="relative mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-800 placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/95 transition-all duration-300"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105
                  ${activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-gray-800 shadow-lg`
                    : 'bg-white/80 backdrop-blur-md border border-gray-300 text-gray-800/70 hover:bg-white/90 hover:text-gray-800'
                  }
                `}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className={`space-y-4 transition-all duration-1000 delay-400 ${
          visibleSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl p-8">
                <HelpCircle className="w-16 h-16 text-gray-800/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800/70 mb-2">No questions found</h3>
                <p className="text-gray-800/50">Try adjusting your search terms or category filter.</p>
              </div>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className={`
                  bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl overflow-hidden
                  hover:bg-white/8 hover:border-white/20 transition-all duration-300
                  ${isOpen(faq.id) ? 'bg-white/8 border-white/20' : ''}
                `}
                style={{ 
                  transitionDelay: visibleSection ? `${index * 50}ms` : '0ms'
                }}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/90 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`
                      w-2 h-2 rounded-full mt-3 bg-gradient-to-r ${faq.gradient}
                      ${isOpen(faq.id) ? 'animate-pulse' : ''}
                    `} />
                    <h3 className="text-lg font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown className={`
                    w-6 h-6 text-gray-800/70 transition-transform duration-300 flex-shrink-0
                    ${isOpen(faq.id) ? 'transform rotate-180' : ''}
                  `} />
                </button>

                {/* Answer Content */}
                <div className={`
                  overflow-hidden transition-all duration-500 ease-in-out
                  ${isOpen(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="px-6 pb-6">
                    <div className="pl-6 border-l-2 border-white/10">
                      <p className="text-gray-800/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Support CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${
          visibleSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl p-8 max-w-2xl mx-auto">
            <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-800/70 mb-6">
              Our support team is here to help you get the most out of our AI photography platform.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-800 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-purple-500/25">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}