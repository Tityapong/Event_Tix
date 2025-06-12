"use client"

import { Users, Building2, Award, Globe, ArrowRight, Briefcase, Coffee, ChevronDown } from "lucide-react"

import { useState } from "react"

export default function About() {
  const [activeTab, setActiveTab] = useState("company")

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "",
      bio: "With over 15 years of industry experience, Sarah leads our vision and strategic direction.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/chanthea.jpg",
      bio: "Michael brings technical expertise and innovation to our product development.",
    },
    {
      name: "Ava Rodriguez",
      role: "Design Director",
      image: "/api/placeholder/150/150",
      bio: "Ava ensures our products are both beautiful and intuitive to use.",
    },
    {
      name: "James Wilson",
      role: "Marketing Lead",
      image: "/samedi.jpg",
      bio: "James crafts our brand story and connects our solutions with customers worldwide.",
    },
  ]

  const values = [
    {
      title: "Innovation",
      description: "We push boundaries and embrace new technologies to solve complex problems.",
      icon: <Award className="w-8 h-8 text-teal-400" />,
    },
    {
      title: "Collaboration",
      description: "We believe great ideas come from diverse teams working together toward common goals.",
      icon: <Users className="w-8 h-8 text-teal-400" />,
    },
    {
      title: "Quality",
      description: "We're committed to excellence in everything we create and deliver.",
      icon: <Building2 className="w-8 h-8 text-teal-400" />,
    },
    {
      title: "Global Perspective",
      description: "We design solutions with a global mindset, respecting diverse cultures and needs.",
      icon: <Globe className="w-8 h-8 text-teal-400" />,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modernized */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white text-gray-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-teal-400 opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 right-20 w-80 h-80 bg-indigo-500 opacity-5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-teal-300 px-4 py-1.5 rounded-full text-sm mb-8 backdrop-blur-sm">
              About Us
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              We build{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                experiences
              </span>{" "}
              that matter
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
              At our core, we are dreamers and builders passionate about creating digital solutions that transform how
              people interact with technology.
            </p>
            <button className="group bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white px-8 py-3.5 rounded-lg font-medium flex items-center transition-all">
              Our journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Modernized */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          <button
            onClick={() => setActiveTab("company")}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === "company" ? "bg-gradient-to-r from-teal-500 to-teal-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Our Company
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === "team" ? "bg-gradient-to-r from-teal-500 to-teal-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Our Team
          </button>
          <button
            onClick={() => setActiveTab("values")}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === "values" ? "bg-gradient-to-r from-teal-500 to-teal-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Our Values
          </button>
        </div>

        {/* Company Tab - Modernized */}
        {activeTab === "company" && (
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-gray-900">
              <div className="inline-flex items-center bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-teal-300 px-4 py-1.5 rounded-full text-sm mb-6">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                From a small idea <br />
                to a global impact
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2018, we began with a simple vision: to create technology that makes a meaningful difference
                in people is lives. What started as a small team of four has now grown into a thriving company with
                offices in three countries.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our journey has not always been easy, but our commitment to innovation and excellence has remained
                unwavering. Today, we are proud to serve clients around the globe.
              </p>
              <div className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-teal-300 px-6 py-3 rounded-lg text-sm font-medium cursor-pointer group transition-all">
                Learn more about our mission
                <ChevronDown className="ml-2 w-5 h-5 group-hover:rotate-180 transition-transform" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 backdrop-blur-sm border border-gray-200 hover:border-teal-500/30 transition-all shadow-sm hover:shadow-md">
                <div className="bg-gradient-to-br from-teal-500/20 to-teal-400/5 rounded-xl p-4 mb-4 w-14 h-14 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">200+</div>
                <p className="text-gray-500 text-sm">Projects delivered successfully</p>
              </div>
              <div className="bg-white rounded-2xl p-6 backdrop-blur-sm border border-gray-200 hover:border-teal-500/30 transition-all shadow-sm hover:shadow-md">
                <div className="bg-gradient-to-br from-teal-500/20 to-teal-400/5 rounded-xl p-4 mb-4 w-14 h-14 flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
                <p className="text-gray-500 text-sm">Team members worldwide</p>
              </div>
              <div className="bg-white rounded-2xl p-6 backdrop-blur-sm border border-gray-200 hover:border-teal-500/30 transition-all shadow-sm hover:shadow-md">
                <div className="bg-gradient-to-br from-teal-500/20 to-teal-400/5 rounded-xl p-4 mb-4 w-14 h-14 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">15+</div>
                <p className="text-gray-500 text-sm">Countries with active clients</p>
              </div>
              <div className="bg-white rounded-2xl p-6 backdrop-blur-sm border border-gray-200 hover:border-teal-500/30 transition-all shadow-sm hover:shadow-md">
                <div className="bg-gradient-to-br from-teal-500/20 to-teal-400/5 rounded-xl p-4 mb-4 w-14 h-14 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">∞</div>
                <p className="text-gray-500 text-sm">Cups of coffee consumed</p>
              </div>
            </div>
          </div>
        )}

        {/* Team Tab - Modernized */}
        {activeTab === "team" && (
          <div>
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-teal-300 px-4 py-1.5 rounded-full text-sm mb-6">
                Our People
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Meet the team behind our success</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Talented individuals with diverse backgrounds and expertise, united by a shared passion for innovation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all hover:border-teal-500/30 hover:translate-y-1 hover:shadow-lg hover:shadow-teal-900/10 shadow-sm hover:shadow-md">
                    <div className="h-52 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
                      <img
                        src={member.image || "/api/placeholder/150/150"}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                          <p className="text-teal-400 text-sm">{member.role}</p>
                        </div>
                        <div className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Values Tab - Modernized */}
        {activeTab === "values" && (
          <div>
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-teal-300 px-4 py-1.5 rounded-full text-sm mb-6">
                Our Principles
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">The values that drive us forward</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core principles shape our culture and guide every decision we make.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-teal-500/30 transition-all hover:bg-gray-50 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-5">
                    <div className="bg-gradient-to-br from-teal-500/20 to-teal-400/5 flex-shrink-0 p-3 rounded-xl">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-teal-400 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact CTA - Modernized */}
      <div className="bg-white mt-16 mb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-10 text-center relative overflow-hidden border border-gray-200">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-500 opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-teal-300 px-4 py-1.5 rounded-full text-sm mb-6 backdrop-blur-sm">
                Get Started
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to collaborate?</h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Let is connect and explore how we can help bring your vision to life with innovative solutions.
              </p>
              <button className="group bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white px-8 py-3.5 rounded-lg font-medium transition-all inline-flex items-center">
                Get in touch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
