'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <nav className="nav-content flex-center">
      <div className="flex-1">
        <Link href="/">
          <Image
            className="margin-auto"
            src="/images/logo.webp"
            alt="Logo of Balad Website"
            width={181.91}
            height={75}
          />
        </Link>
      </div>
      <div className="nav-list flex-center">
        <ul className="nav-list flex-center" role="list">
          <Link href="/">
            <li>Home Page</li>
          </Link>
          <Link href="/services">
            <li>Services</li>
          </Link>
          <Link href="#">
            <li>Payment</li>
          </Link>
          <Link href="#">
            <li>Employees</li>
          </Link>
          <Link href="#">
            <li>Contact Us</li>
          </Link>
        </ul>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <div className="profile-container flex-1" ref={dropdownRef}>
        <div
          className="user-profile flex-center"
          tabIndex="0"
          onClick={toggleDropdown}
        >
          <Image
            src="/images/user-image.webp"
            alt="Profile"
            width={40}
            height={40}
            className="profile-image"
          />
          <h2 className="user-name">
            Mohammad Abdul Ghafour
            <p className="user-dis">Position</p>
          </h2>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link href="#" className="dropdown-item">
                <li>Profile</li>
              </Link>
              <Link href="#" className="dropdown-item">
                <li>Settings</li>
              </Link>
              <Link href="#" className="dropdown-item">
                <li>Logout</li>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header