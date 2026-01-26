"use client";

import React, { useState } from "react";
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

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("farmer");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a href="#" className="flex items-center space-x-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-200">
                <Wheat className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-stone-900 tracking-tight leading-none">
                  Kushagra
                </span>
                <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase mt-0.5">
                  Bhumitra FPO
                </span>
              </div>
            </a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-8 items-center">
              {["About", "How It Works", "Plans", "Team", "News", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-semibold text-stone-500 hover:text-emerald-600 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <Link href='/login' className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-200 flex items-center group">
                Login <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={toggleMenu} className="text-stone-900 hover:text-emerald-600 p-2 transition-colors rounded-lg hover:bg-stone-50">
                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-100 absolute w-full shadow-2xl animate-fadeIn">
            <div className="px-6 py-8 space-y-2">
              {["About", "How It Works", "Plans", "Team", "News", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setIsMenuOpen(false)} className="block py-4 text-lg font-semibold text-stone-800 border-b border-stone-50 hover:text-emerald-600 transition-colors">
                  {item}
                </a>
              ))}
              <Link href="/login" className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-100">
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide mb-6">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                सुरक्षित अनाज, समृद्ध किसान
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-stone-900 mb-6 tracking-tight leading-[1.1]">
                Digitizing <span className="text-emerald-600 relative">
                  Grains
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-emerald-200" viewBox="0 0 100 15" preserveAspectRatio="none"><path d="M0 8 Q 25 0 50 8 T 100 8" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                </span>
                <br /> for Farmers
              </h1>
              <p className="text-lg sm:text-xl text-stone-500 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Kushagra Bhumitra FPO enables farmers to store grains safely, access instant credit, and sell at the best market prices — all through a simple mobile app.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/register" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center group">
                  Join Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 bg-white hover:bg-stone-50 text-stone-900 rounded-full font-bold text-lg border-2 border-stone-200 hover:border-stone-300 transition-all flex items-center justify-center">
                  Watch Video
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 pt-8 border-t border-stone-100 flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-4">
                {[
                  { value: "1.5L+", label: "Farmers Registered" },
                  { value: "50+", label: "Warehouses" },
                  { value: "₹10Cr+", label: "Credit Disbursed" }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <div className="text-3xl font-black text-stone-900">{stat.value}</div>
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual - Phone Mockup with Transactions */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
                {/* Phone Mockup */}
                <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 rounded-[2.5rem] p-2 shadow-2xl shadow-stone-400/30 border border-stone-700">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-stone-900 rounded-b-xl z-20 flex items-center justify-center">
                    <div className="w-8 h-1.5 bg-stone-700 rounded-full"></div>
                  </div>

                  {/* Screen */}
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-emerald-600 px-5 pt-6 pb-3 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm"><Wheat className="w-4 h-4" /></div>
                          <span className="font-bold text-sm">Kushagra FPO</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-semibold text-emerald-100">Online</span>
                        </div>
                      </div>
                      <div className="text-xs text-emerald-200">Welcome back, Karan Singh</div>
                      <div className="text-2xl font-black mt-1">₹1,25,480</div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-emerald-600 px-4 pb-4">
                      <div className="bg-white rounded-2xl p-3 shadow-lg grid grid-cols-4 gap-1">
                        {[
                          { icon: Package, label: "Deposit", color: "text-blue-600", bg: "bg-blue-50" },
                          { icon: ArrowRight, label: "Withdraw", color: "text-orange-600", bg: "bg-orange-50" },
                          { icon: IndianRupee, label: "Loan", color: "text-purple-600", bg: "bg-purple-50" },
                          { icon: ShoppingCart, label: "Sell", color: "text-pink-600", bg: "bg-pink-50" }
                        ].map((action, idx) => (
                          <div key={idx} className="flex flex-col items-center p-1.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer">
                            <div className={`${action.bg} p-2 rounded-xl mb-1`}>
                              <action.icon className={`w-4 h-4 ${action.color}`} />
                            </div>
                            <span className="text-[9px] font-bold text-stone-600">{action.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transactions List */}
                    <div className="px-4 py-3 bg-stone-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-stone-900">Transaction History</span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">View All →</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { type: "Grain Deposit", desc: "Wheat • Grade A", amount: "+80 Qtl", time: "Today, 10:30 AM", icon: Package, color: "text-blue-600", bg: "bg-blue-100", amountColor: "text-blue-600" },
                          { type: "Instant Loan", desc: "Against 50 Qtl", amount: "+₹32,500", time: "Today, 9:15 AM", icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-100", amountColor: "text-purple-600" },
                          { type: "Sell Order", desc: "Sold to Buyer #42", amount: "-25 Qtl", time: "Yesterday", icon: ShoppingCart, color: "text-pink-600", bg: "bg-pink-100", amountColor: "text-pink-600" },
                          { type: "Payment Received", desc: "For Sell Order", amount: "+₹48,750", time: "Yesterday", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100", amountColor: "text-emerald-600" },
                          { type: "Cash Withdraw", desc: "To Bank Account", amount: "-₹15,000", time: "Jan 24", icon: ArrowRight, color: "text-orange-600", bg: "bg-orange-100", amountColor: "text-orange-600" },
                          { type: "Loan Repayment", desc: "EMI Payment", amount: "-₹5,200", time: "Jan 22", icon: Banknote, color: "text-red-600", bg: "bg-red-100", amountColor: "text-red-500" },
                          { type: "Grain Deposit", desc: "Rice • Grade B", amount: "+120 Qtl", time: "Jan 20", icon: Package, color: "text-blue-600", bg: "bg-blue-100", amountColor: "text-blue-600" },
                          { type: "Quality Bonus", desc: "For Grade A wheat", amount: "+₹2,400", time: "Jan 18", icon: Star, color: "text-yellow-600", bg: "bg-yellow-100", amountColor: "text-yellow-600" },
                        ].map((tx, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-xl border border-stone-100 hover:border-emerald-200 hover:shadow-sm transition-all">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg ${tx.bg}`}><tx.icon className={`w-3.5 h-3.5 ${tx.color}`} /></div>
                              <div>
                                <div className="text-[11px] font-bold text-stone-800 leading-tight">{tx.type}</div>
                                <div className="text-[9px] text-stone-400">{tx.desc} • {tx.time}</div>
                              </div>
                            </div>
                            <div className={`text-xs font-bold ${tx.amountColor}`}>{tx.amount}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification Cards */}
                <div className="absolute -left-12 top-16 bg-white p-2.5 rounded-xl shadow-xl border border-stone-100 hidden lg:flex items-center gap-2 animate-bounce">
                  <div className="bg-blue-500 p-1.5 rounded-lg"><Package className="w-3 h-3 text-white" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-stone-900">New Deposit!</div>
                    <div className="text-[8px] text-stone-400">+80 Qtl Wheat</div>
                  </div>
                </div>
                <div className="absolute -right-8 top-1/3 bg-white p-2.5 rounded-xl shadow-xl border border-stone-100 hidden lg:flex items-center gap-2">
                  <div className="bg-purple-500 p-1.5 rounded-lg"><IndianRupee className="w-3 h-3 text-white" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-stone-900">Loan Approved!</div>
                    <div className="text-[8px] text-stone-400">₹32,500 credited</div>
                  </div>
                </div>
                <div className="absolute -left-6 bottom-24 bg-white p-2.5 rounded-xl shadow-xl border border-stone-100 hidden lg:flex items-center gap-2">
                  <div className="bg-emerald-500 p-1.5 rounded-lg"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-stone-900">Sold!</div>
                    <div className="text-[8px] text-stone-400">₹48,750 received</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT US SECTION ========== */}
      <section id="about" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Visual */}
            <div className="relative">
              <div className="aspect-square bg-stone-100 rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-xl">
                <div className="h-full w-full bg-gradient-to-tr from-amber-100 to-emerald-50 flex items-center justify-center p-10">
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
                <div className="text-sm text-emerald-200">Of Trust</div>
              </div>
            </div>

            {/* Right: Text */}
            <div>
              <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-4">About Kushagra Bhumitra FPO</div>
              <h2 className="text-3xl lg:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                Your Grain, <br /><span className="text-emerald-600">Your Bank.</span>
              </h2>
              <div className="space-y-5 text-base lg:text-lg text-stone-600 leading-relaxed">
                <p>
                  <strong className="text-stone-900">Kushagra Bhumitra Bio Energy Farmer Producer Company Limited</strong> is a revolutionary Agri-FinTech platform that empowers farmers by digitizing their grain assets. We provide scientifically managed warehouses at the village level, eliminating the need for farmers to travel to distant mandis.
                </p>
                <p>
                  किसान अब अपने अनाज को सुरक्षित गोदाम में जमा कर सकते हैं और उसके बदले <span className="bg-amber-100 px-1 font-semibold text-stone-800">60% तक तत्काल लोन</span> प्राप्त कर सकते हैं। जब भी चाहें, अपनी मर्ज़ी से, सही दाम पर बेच सकते हैं।
                </p>
                <p>
                  Our mission is simple: <span className="font-bold text-emerald-700">"Safe Grain, Prosperous Farmer"</span>. We bridge the gap between traditional farming and modern financial services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CHALLENGES VS SOLUTIONS ========== */}
      <section className="py-20 lg:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">The Gap We Bridge</div>
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
      </section>

      {/* ========== HOW IT WORKS (DETAILED PROCESS) ========== */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
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
      </section>

      {/* ========== PLANS SECTION ========== */}
      <section id="plans" className="py-20 lg:py-28 bg-stone-50">
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
      </section>

      {/* ========== TEAM SECTION ========== */}
      <section id="team" className="py-20 lg:py-28 bg-white">
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
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 mb-6 overflow-hidden relative shadow-lg group-hover:shadow-xl transition-shadow">
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
      </section>

      {/* ========== NEWS / PRESS SECTION ========== */}
      <section id="news" className="py-20 lg:py-28 bg-stone-50">
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
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section id="contact" className="py-20 lg:py-28 bg-white">
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

            <div className="mt-10 pt-8 border-t border-stone-200 grid md:grid-cols-3 gap-6 text-center">
              <div><Phone className="w-6 h-6 text-emerald-500 mx-auto mb-2" /><span className="text-sm font-bold text-stone-800">+91 987 654 3210</span></div>
              <div><Mail className="w-6 h-6 text-emerald-500 mx-auto mb-2" /><span className="text-sm font-bold text-stone-800">info@anajbank.com</span></div>
              <div><MapPin className="w-6 h-6 text-emerald-500 mx-auto mb-2" /><span className="text-sm font-bold text-stone-800">Gurugram, India</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="md:col-span-2">
              <a href="#" className="flex items-center space-x-3 mb-6">
                <div className="bg-emerald-500 p-2 rounded-lg"><Wheat className="h-6 w-6 text-white" /></div>
                <span className="text-xl sm:text-2xl font-black text-white">Kushagra Bhumitra FPO</span>
              </a>
              <p className="text-stone-500 leading-relaxed max-w-md">Kushagra Bhumitra Bio Energy Farmer Producer Company Limited — Empowering farmers through technology. Safe storage, instant credit, and best market prices.</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Quick Links</h5>
              <ul className="space-y-3 text-sm">
                {["About Us", "How It Works", "Plans", "Team", "Contact"].map(link => (<li key={link}><a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-emerald-400 transition-colors">{link}</a></li>))}
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-3 text-sm">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(link => (<li key={link}><a href="#" className="hover:text-emerald-400 transition-colors">{link}</a></li>))}
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center text-sm">
            © {new Date().getFullYear()} Kushagra Bhumitra Bio Energy Farmer Producer Company Limited. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
