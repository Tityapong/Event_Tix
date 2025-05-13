import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-teal-50 to-white border-t border-teal-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-teal-600">Company Name</h3>
            <p className="mb-4 text-gray-600">
              We provide innovative solutions to help businesses grow and thrive in the digital age.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-teal-500 transition-colors hover:text-teal-700">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-teal-500 transition-colors hover:text-teal-700">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-teal-500 transition-colors hover:text-teal-700">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-teal-500 transition-colors hover:text-teal-700">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-teal-600">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 transition-colors hover:text-teal-600 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 transition-colors hover:text-teal-600 hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 transition-colors hover:text-teal-600 hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-600 transition-colors hover:text-teal-600 hover:underline">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 transition-colors hover:text-teal-600 hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 transition-colors hover:text-teal-600 hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-teal-600">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-teal-500" />
                <span className="text-gray-600">123 Business Street, Suite 100, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-teal-500" />
                <span className="text-gray-600">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-teal-500" />
                <span className="text-gray-600">info@companyname.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-teal-600">Newsletter</h3>
            <p className="mb-4 text-gray-600">Subscribe to our newsletter to receive updates and news.</p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="border-teal-300 bg-white text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:ring focus:ring-teal-200"
              />
              <Button className="bg-teal-500 text-white hover:bg-teal-600 transition duration-300">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-teal-600 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-white">© {new Date().getFullYear()} Company Name. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-white hover:text-teal-100 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-white hover:text-teal-100 hover:underline">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-white hover:text-teal-100 hover:underline">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}