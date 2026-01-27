"use client";

import React, { useState, useEffect } from "react";
import {
  Wheat,
  ShieldCheck,
  IndianRupee,
  TrendingUp,
  Menu,
  X,
  ArrowRight,
  Warehouse,
  Sprout,
  Clock,
  Smartphone,
  ChevronRight,
  Truck,
  AlertTriangle,
  Banknote,
  Users,
  CheckCircle2,
  Leaf,
  Phone,
  Mail,
  MapPin,
  Send,
  Package,
  Scale,
  QrCode,
  CreditCard,
  BadgeCheck,
  FileText,
  Handshake,
  Building2,
  Star,
  ExternalLink,
  ShoppingCart,
  Layers,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("farmer");
  const [activeSection, setActiveSection] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);

  const navItems = ["About", "How It Works", "Plans", "Team", "News", "Contact"];

  // Hero carousel slides with images
  const heroSlides = [
    {
      badge: "सुरक्षित अनाज, समृद्ध किसान",
      title: "Digitizing",
      highlight: "Grains",
      subtitle: "for Farmers",
      description: "Kushagra Bhumitra FPO enables farmers to store grains safely, access instant credit, and sell at the best market prices — all through a simple mobile app.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop"
    },
    {
      badge: "तत्काल लोन, बिना झंझट",
      title: "Instant",
      highlight: "Credit",
      subtitle: "for Your Harvest",
      description: "Get up to 60% instant loan against your stored grains. No collateral needed — your grain is your guarantee. Money directly in your bank account.",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop"
    },
    {
      badge: "सही दाम, सही समय",
      title: "Best Market",
      highlight: "Prices",
      subtitle: "When You Sell",
      description: "No more distress selling! Store your grain, wait for the right price, and sell with one click. We connect you to buyers across India.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop"
    }
  ];

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll spy effect to highlight active navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item =>
        document.getElementById(item.toLowerCase().replace(/\s+/g, '-'))
      );

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].toLowerCase().replace(/\s+/g, '-'));
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 antialiased">

      {/* ========== MODERN HEADER ========== */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 shadow-lg">
        {/* Top Bar: Logo + Company Name + Login */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2.5">
              {/* Logo */}
              <a href="#" className="flex items-center gap-3 group cursor-pointer shrink-0">
                <Image
                  src="/logo_v2.png"
                  alt="Kushagra Bhumitra FPO Logo"
                  width={70}
                  height={70}
                  className="rounded-xl "
                />
                <div className="hidden sm:block">
                  <div className="text-xl font-black/90 font-bold">
                    Kushagra
                  </div>
                  <div className="text-[11px] font-bold tracking-[0.15em] uppercase">
                    Bhumitra FPO
                  </div>
                </div>
              </a>

              {/* Company Name (Center) */}
              <div className="text-center flex-1 px-3 sm:px-6">
                <p className="text-red-700 font-bold text-[11px] sm:text-base lg:text-lg leading-tight drop-shadow-sm">
                  कुशाग्र भूमित्रा बायो एनर्जी किसान प्रोडक्शन कंपनी लिमिटेड
                </p>
                <p className="text-stone-700 font-extrabold text-[9px] sm:text-xs lg:text-sm tracking-wider uppercase leading-tight">
                  Kushagra Bhumitra Bio Energy Farmer Producer Company Limited
                </p>
              </div>

              {/* Login Button (Desktop) + Mobile Menu */}
              <div className="flex items-center gap-2 shrink-0">
                <Link href='/login' className="hidden sm:flex bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 items-center group border border-emerald-500">
                  Login <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button onClick={toggleMenu} className="lg:hidden text-stone-800 hover:text-emerald-700 p-1.5 transition-all rounded-lg hover:bg-stone-100">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slim Navigation Bar (Desktop) */}
        <nav className="bg-emerald-600 hidden lg:block shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-9 gap-1">
              {navItems.map((item) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-');
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item}
                    href={`#${sectionId}`}
                    className={`text-xs font-semibold transition-all duration-200 px-4 py-1 rounded-full ${isActive
                      ? 'text-emerald-900 bg-white/90 shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/20'
                      }`}
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile Menu (Dropdown) */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-stone-200 absolute w-full shadow-2xl">
            <div className="px-5 py-4 space-y-1">
              {navItems.map((item) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-');
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item}
                    href={`#${sectionId}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${isActive
                      ? 'text-white bg-emerald-600 shadow-md'
                      : 'text-stone-700 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                  >
                    {item}
                  </a>
                );
              })}
              {/* Login Button in Mobile Menu */}
              <Link
                href='/login'
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center mt-3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold text-sm shadow-lg"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========== HERO SECTION - FULL WIDTH IMAGE CAROUSEL ========== */}
      <section className="relative h-[60vh] min-h-[600px] overflow-hidden mt-[70px] lg:mt-[100px]">
        {/* Background Image Carousel */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-800 ease-in-out ${heroSlide === idx
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0'
              }`}
          >
            <img
              src={slide.image}
              alt={`${slide.title} ${slide.highlight}`}
              className={`w-full h-full object-cover transition-transform duration-6000 ease-out ${heroSlide === idx ? 'scale-105' : 'scale-100'}`}
            />
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-r from-stone-900/80 via-stone-900/60 to-stone-900/40" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="max-w-2xl">
              {/* Carousel Text Content */}
              {heroSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-600 ease-in-out ${heroSlide === idx
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 absolute pointer-events-none'
                    }`}
                >
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wide mb-4">
                    <ShieldCheck className="w-3 h-3 mr-1.5 text-emerald-400" />
                    {slide.badge}
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-[1.1]">
                    {slide.title} <span className="text-emerald-400">{slide.highlight}</span>
                    <br /> {slide.subtitle}
                  </h1>
                  <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-6 max-w-xl">
                    {slide.description}
                  </p>
                </div>
              ))}

              {/* CTAs - Always visible */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Link href="/register" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center group">
                  Join Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-bold text-sm border border-white/30 hover:border-white/50 transition-all flex items-center justify-center">
                  Watch Video
                </button>
              </div>

              {/* Slide Indicators + Stats Row */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
                {/* Slide Indicators */}
                <div className="flex gap-2">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === idx ? 'w-8 bg-emerald-500' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
                    />
                  ))}
                </div>

                {/* Stats */}
                <div className="hidden sm:flex gap-6">
                  {[
                    { value: "1.5L+", label: "Farmers" },
                    { value: "50+", label: "Warehouses" },
                    { value: "₹10Cr+", label: "Credit" }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-right">
                      <div className="text-lg font-black text-white">{stat.value}</div>
                      <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT US SECTION ========== */}
      < section id="about" className="py-15  bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Visual */}
            <div className="relative">
              <div className="aspect-square bg-stone-100 rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-xl">
                <div className="h-full w-full bg-linear-to-tr from-amber-100 to-emerald-50 flex items-center justify-center p-10">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm">
                    {[
                      { icon: Warehouse, label: "Safe Storage" },
                      { icon: IndianRupee, label: "Instant Credit" },
                      { icon: TrendingUp, label: "Best Prices" },
                      { icon: Smartphone, label: "Mobile App" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
                        <item.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-emerald-600" />
                        <span className="text-sm font-bold text-stone-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl hidden lg:block">
                <div className="text-3xl font-black">5+ Yrs</div>
                <div className="text-sm text-emerald-200">of Trust</div>
              </div>
            </div>

            {/* Right: Text */}
            <div>
              <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-4">About Kushagra Bhumitra FPO</div>
              <h2 className="text-3xl lg:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                Your Grain, <br /><span className="text-emerald-600">Your Bank.</span>
              </h2>
              <div className="space-y-5 text-base lg:text-lg text-stone-600 leading-relaxed">
                <p className="text-justify">
                  <strong className="text-stone-900 text-justify">Kushagra Bhumitra Bio Energy Farmer Producer Company Limited</strong> is a revolutionary Agri-FinTech platform that empowers farmers by digitizing their grain assets. We provide scientifically managed warehouses at the village level, eliminating the need for farmers to travel to distant mandis.
                </p>
                <p className="text-justify">
                  किसान अब अपने अनाज को सुरक्षित गोदाम में जमा कर सकते हैं और उसके बदले <span className="bg-amber-100 px-1 font-semibold text-stone-800">60% तक तत्काल लोन</span> प्राप्त कर सकते हैं। जब भी चाहें, अपनी मर्ज़ी से, सही दाम पर बेच सकते हैं।
                </p>
                <p>
                  Our mission is simple: <span className="font-bold text-emerald-700">"Safe Grain, Prosperous Farmer"</span>. We bridge the gap between traditional farming and modern financial services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ========== CHALLENGES VS SOLUTIONS ========== */}
      < section className="py-15  bg-stone-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-emerald-600 font-bold text-sm tracking-widest mb-3">The Gap We Bridge</div>
            <h3 className="text-3xl lg:text-5xl font-bold text-stone-900">Farmer Challenges <span className="text-emerald-600">Solved</span></h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Column 1: Challenges */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-red-100 p-3 rounded-xl"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
                <div>
                  <h4 className="text-2xl font-bold text-stone-900">Traditional Challenges</h4>
                  <p className="text-stone-400 text-sm">Problems farmers face every season</p>
                </div>
              </div>
              <ul className="space-y-5">
                {[
                  { title: "Distant Warehouses", desc: "गोदाम (Warehouses) शहरों में होते हैं, गाँव से बहुत दूर, जिससे logistics का भारी खर्च उठाना पड़ता है।" },
                  { title: "Distress Selling", desc: "पैसों की तत्काल जरूरत के कारण किसान को harvest के तुरंत बाद कम दाम पर अनाज बेचना पड़ता है।" },
                  { title: "No Credit Access", desc: "पारंपरिक बैंकों से लोन लेना मुश्किल है और साहूकारों से उधार लेने पर ब्याज बहुत ज्यादा होता है।" },
                  { title: "Small Quantity Issues", desc: "छोटे किसान (Small Farmers) की कम मात्रा को मंडी तक ले जाना economical नहीं होता।" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100/50">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-red-100 text-red-500 flex items-center justify-center font-bold text-xs mt-0.5">✕</div>
                    <div>
                      <h5 className="font-bold text-stone-800">{item.title}</h5>
                      <p className="text-stone-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div className="bg-emerald-900 p-8 lg:p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-700 rounded-full blur-3xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10"><CheckCircle2 className="w-7 h-7 text-emerald-300" /></div>
                  <div>
                    <h4 className="text-2xl font-bold">Grainbank Solutions</h4>
                    <p className="text-emerald-300 text-sm">Tech-powered interventions</p>
                  </div>
                </div>
                <ul className="space-y-5">
                  {[
                    { title: "Village-Level Warehouses", desc: "गाँव के पास scientifically managed गोदाम, जहाँ किसान एक बोरी भी जमा कर सकता है।" },
                    { title: "Instant Credit (60%)", desc: "जमा अनाज के मूल्य का 60% तक तत्काल लोन, सीधे बैंक खाते में, बिना किसी guarantee के।" },
                    { title: "Sell Anytime, Best Price", desc: "जब चाहें, अपनी app से 1 क्लिक में अनाज बेचें। 24 घंटे में पैसे खाते में।" },
                    { title: "Digital Inventory", desc: "अपने पूरे stock को app पर देखें — quantity, quality grade, current market value, सब कुछ।" }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-6 h-6 shrink-0 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mt-0.5">✓</div>
                      <div>
                        <h5 className="font-bold text-white">{item.title}</h5>
                        <p className="text-emerald-200 text-sm mt-1">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ========== HOW IT WORKS (DETAILED PROCESS) ========== */}
      < section id="how-it-works" className="py-15 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">The Process</div>
            <h3 className="text-3xl lg:text-5xl font-bold text-stone-900 mb-4">How Grainbank Works</h3>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg">A simple, transparent, and technology-driven process from farm to finance.</p>

            {/* Tabs */}
            <div className="inline-flex bg-stone-100 p-1.5 rounded-full border border-stone-200 mt-10">
              {['farmer', 'buyer'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 capitalize ${activeTab === tab ? "bg-white text-stone-900 shadow-lg" : "text-stone-500 hover:text-stone-900"}`}
                >
                  For {tab}s
                </button>
              ))}
            </div>
          </div>

          {/* Farmer Process */}
          {activeTab === "farmer" && (
            <div className="animate-fadeIn">
              <div className="bg-emerald-900 rounded-3xl p-8 lg:p-12 text-white mb-8">
                <h4 className="text-2xl font-bold mb-3 flex items-center"><Leaf className="w-6 h-6 mr-3 text-emerald-400" />Farmer Journey (किसान प्रक्रिया)</h4>
                <p className="text-emerald-200 max-w-2xl">Ergos' operations are backed by a comprehensive tech platform. Farmers can easily access their digital inventory, check the current offer price, and make transactions with just one click.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { step: "01", icon: Smartphone, title: "Register & Book", desc: "Mobile app या web पर register करें और अपने नजदीकी Grainbank warehouse में space book करें।" },
                  { step: "02", icon: Truck, title: "Deposit Grains", desc: "अपना अनाज warehouse पर लाएँ। हमारी टीम quality check करेगी और उसे safely store करेगी।" },
                  { step: "03", icon: Scale, title: "Quality Check", desc: "अनाज की moisture, grade और weight की proper जाँच होती है और data आपकी app में update होता है।" },
                  { step: "04", icon: QrCode, title: "Get Digital Receipt", desc: "आपको एक unique Digital Grain Receipt मिलती है — यह आपका tradable asset है।" },
                  { step: "05", icon: CreditCard, title: "Avail Credit (Optional)", desc: "जरूरत हो तो जमा अनाज के 60% तक instant loan लें। पैसे सीधे आपके bank account में।" },
                  { step: "06", icon: IndianRupee, title: "Sell & Get Paid", desc: "जब चाहें, app से अनाज बेचें। Best market price पर deal और 24 घंटे में payment।" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-stone-50 p-6 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <item.icon className="w-10 h-10 text-emerald-600" />
                      <span className="text-4xl font-black text-stone-200 group-hover:text-emerald-200 transition-colors">{item.step}</span>
                    </div>
                    <h5 className="text-lg font-bold text-stone-900 mb-2">{item.title}</h5>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buyer Process */}
          {activeTab === "buyer" && (
            <div className="animate-fadeIn">
              <div className="bg-blue-900 rounded-3xl p-8 lg:p-12 text-white mb-8">
                <h4 className="text-2xl font-bold mb-3 flex items-center"><Handshake className="w-6 h-6 mr-3 text-blue-300" />Buyer Advantages (खरीदार के लाभ)</h4>
                <p className="text-blue-200 max-w-2xl">Our platform serves as a gateway, providing access to 1.5 lakh farmers and offering a substantial quantity of quality grains. Our "everyday low-price" offer ensures affordability for all buyers involved.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { step: "01", icon: Users, title: "Access to 1.5L Farmers", desc: "सीधे 1.5 लाख से ज्यादा registered किसानों से जुड़ें। बिचौलियों की जरूरत नहीं।" },
                  { step: "02", icon: BadgeCheck, title: "Quality Assured", desc: "हर अनाज warehouse पर quality check होता है। आपको grade और specs की पूरी जानकारी मिलती है।" },
                  { step: "03", icon: TrendingUp, title: "Everyday Low Prices", desc: "हमारा aggregated model competitive pricing ensure करता है।" },
                  { step: "04", icon: ShoppingCart, title: "Easy Purchase Orders", desc: "App पर order place करें। No upfront fund required for SPOT purchases।" },
                  { step: "05", icon: Truck, title: "Fast Delivery", desc: "Warehouse से direct dispatch। Streamlined logistics for bulk orders।" },
                  { step: "06", icon: FileText, title: "Super-Easy Settlement", desc: "Razorpay integration for fast fund movement। Easy bill settlement process।" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-stone-50 p-6 rounded-2xl border border-stone-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <item.icon className="w-10 h-10 text-blue-600" />
                      <span className="text-4xl font-black text-stone-200 group-hover:text-blue-200 transition-colors">{item.step}</span>
                    </div>
                    <h5 className="text-lg font-bold text-stone-900 mb-2">{item.title}</h5>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section >

      {/* ========== PLANS SECTION ========== */}
      < section id="plans" className="py-15 bg-stone-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">Pricing & Terms</div>
            <h3 className="text-3xl lg:text-5xl font-bold text-stone-900 mb-4">Transparent <span className="text-emerald-600">Plans</span></h3>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg">No hidden fees. Clear terms. Maximum benefit for the farmer.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Main Card */}
            <div className="lg:col-span-3 bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-stone-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-stone-900 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-bl-2xl uppercase tracking-wider">Recommended</div>
              <h4 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2 flex items-center"><Sprout className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-500" />Price Return Policy</h4>
              <p className="text-stone-500 mb-8">Sell your grains anytime and get MSP + Extra based on your storage duration.</p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Long Term (5+ Years)</span>
                  <div className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">MSP + <span className="text-emerald-600">20%</span></div>
                  <p className="text-sm text-stone-500 mt-2">Maximum profitability for patient investors.</p>
                </div>
                <div className="p-6 bg-stone-100 rounded-2xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Short Term (&lt;5 Years)</span>
                  <div className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">MSP + <span className="text-stone-400">10%</span></div>
                  <p className="text-sm text-stone-500 mt-2">Still better than distress selling at harvest.</p>
                </div>
              </div>

              <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
                <Banknote className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900">Example Calculation:</h5>
                  <p className="text-sm text-stone-600">If Wheat MSP in 2029 is ₹2910/quintal, with 15% extra, you receive <strong>₹3346.50/quintal</strong>. This is significantly higher than typical mandi rates.</p>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: "Storage Cost", value: "₹0.20", sub: "per qtl/day", icon: Warehouse },
                { label: "Min Period", value: "6 Mo", sub: "Lock-in", icon: Clock },
                { label: "Loan Limit", value: "60%", sub: "of value", icon: IndianRupee },
                { label: "Interest", value: "1.25%", sub: "per month", icon: BarChart3 }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-emerald-300 transition-colors group text-center">
                  <item.icon className="w-8 h-8 mx-auto mb-3 text-stone-300 group-hover:text-emerald-500 transition-colors" />
                  <span className="block text-3xl font-black text-stone-900">{item.value}</span>
                  <span className="block text-xs font-semibold text-stone-400 uppercase mt-1">{item.label}</span>
                  <span className="block text-xs text-stone-400 mt-0.5">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* ========== TEAM SECTION ========== */}
      < section id="team" className="py-15 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">Leadership</div>
            <h3 className="text-3xl lg:text-5xl font-bold text-stone-900">Meet The <span className="text-emerald-600">Team</span></h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Kishor Kumar Jha", role: "CEO & Director", bio: "Visionary leader driving the Agri-FinTech revolution." },
              { name: "Praveen Kumar", role: "COO & Director", bio: "Operations expert ensuring seamless farmer experience." },
              { name: "Smriti Chandra", role: "Nominee Director", bio: "Strategic advisor with deep industry knowledge." },
              { name: "Rahul Kumar", role: "Independent Director", bio: "Governance and compliance champion." }
            ].map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-40 h-40 rounded-full bg-linear-to-br from-stone-100 to-stone-200 mb-6 overflow-hidden relative shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                    <Users className="w-16 h-16 opacity-40" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-stone-900 mb-0.5 group-hover:text-emerald-600 transition-colors">{member.name}</h4>
                <p className="text-emerald-600 font-semibold text-sm mb-2">{member.role}</p>
                <p className="text-stone-400 text-xs px-4">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ========== NEWS / PRESS SECTION ========== */}
      < section id="news" className="py-15 bg-stone-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-stone-400 font-bold text-sm tracking-widest uppercase mb-3">Press Talk</div>
            <h3 className="text-3xl lg:text-5xl font-bold text-emerald-700">What People Are Saying</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { source: "TechStory.in", date: "Dec 14, 2020", author: "Chhavideep Singh", quote: "Agritech start-up, Ergos bags additional funding of US$ 3million from London based CDC Group Plc in its Series A round." },
              { source: "Economic Times", date: "Oct 8, 2020", author: "ETTech", quote: "Agritech startup Ergos Business Solutions has raised Rs 38.5 crore in Series A funding from Chiratae Ventures and Aavishkar Capital." },
              { source: "Indian Startup News", date: "Oct 7, 2020", author: "Vivek Vishwakarma", quote: "Agritech Startup Ergos Raises $5 Million From Chiratae Ventures And Aavishkaar Capital for expanding its grain storage network." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-shadow group">
                <h4 className="text-xl font-bold text-stone-900 mb-2">{item.source}</h4>
                <p className="text-sm text-red-500 font-semibold mb-4">{item.date} | {item.author}</p>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">"{item.quote}"</p>
                <a href="#" className="text-red-500 font-bold text-sm inline-flex items-center group-hover:underline">
                  Read More <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ========== CONTACT SECTION ========== */}
      < section id="contact" className="py-15 bg-white" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-3">Get in Touch</h3>
            <p className="text-stone-500 text-lg">Have questions or want to partner with us? We'd love to hear from you.</p>
          </div>

          <div className="bg-stone-50 p-8 md:p-12 rounded-3xl shadow-lg border border-stone-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
                  <input type="text" placeholder="Karan Singh" className="w-full px-5 py-4 bg-white rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-stone-800 placeholder-stone-400" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full px-5 py-4 bg-white rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-stone-800 placeholder-stone-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Your Message</label>
                <textarea rows="5" placeholder="How can we help you today?" className="w-full px-5 py-4 bg-white rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-stone-800 placeholder-stone-400 resize-none"></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:shadow-xl transition-all flex items-center justify-center group">
                Send Message <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section >

      {/* ========== FOOTER ========== */}
      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-3 group mb-4">
                <Image
                  src="/logo_v2.png"
                  alt="Kushagra Bhumitra FPO"
                  width={80}
                  height={80}
                  className="rounded-xl transition-transform duration-300 group-hover:scale-105 bg-white p-2"
                />
                <div>
                  <div className="text-xl font-black text-white leading-none">Kushagra</div>
                  <div className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase mt-0.5">Bhumitra FPO</div>
                </div>
              </a>
              <p className="text-stone-500 text-sm leading-relaxed">Empowering farmers through technology. Safe storage, instant credit, and best market prices.</p>
            </div>

            {/* Quick Links */}
            <div className="lg:flex lg:justify-center lg:tems-center flex-col ">
              <h5 className="text-white font-bold mb-4">Quick Links</h5>
              <ul className="space-y-3 text-sm">
                {["About Us", "How It Works", "Plans", "Team", "Contact"].map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-emerald-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div >
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-3 text-sm">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-emerald-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="text-white font-bold mb-4">Contact Us</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="hover:text-emerald-400 transition-colors">+91 98765 43210</p>
                    <p className="hover:text-emerald-400 transition-colors">+91 12345 67890</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href="mailto:info@kushagrafpo.com" className="hover:text-emerald-400 transition-colors">info@kushagrafpo.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p>Jangal Subhan Ali (Tameshwar Chowk) Unaula, Road/Street - Pipraich Road, Gorakhpur, 273152 (U.P), INDIA</p>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-stone-800 pt-4 text-center text-sm">
            © {new Date().getFullYear()} Kushagra Bhumitra Bio Energy Farmer Producer Company Limited. All rights reserved.
          </div>
        </div>
      </footer>
    </div >
  );
}
