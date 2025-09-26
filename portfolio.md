import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'hello@lifeshotstudios.com',
      description: 'Drop us a line anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Visit Studio',
      detail: 'New York, NY',
      description: 'By appointment only'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's Create <span className="gradient-text">Together</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your products to life? Get in touch with us to discuss 
            your project and receive a custom quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 shadow-medium">
            <h3 className="text-2xl font-bold text-card-foreground mb-6">
              Send us a message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-card-foreground font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-card-foreground font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-card-foreground font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-card-foreground font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="btn-hero text-primary-foreground w-full flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="card-hover bg-card rounded-3xl p-8 shadow-soft"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-card-foreground mb-2">
                      {info.title}
                    </h4>
                    <p className="text-primary font-semibold text-lg mb-1">
                      {info.detail}
                    </p>
                    <p className="text-muted-foreground">
                      {info.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gradient-primary rounded-3xl p-8 text-white shadow-strong">
              <h4 className="text-2xl font-bold mb-4">
                Quick Response Guarantee
              </h4>
              <p className="text-white/90 leading-relaxed">
                We respond to all inquiries within 4 hours during business days. 
                For urgent projects, call us directly for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;