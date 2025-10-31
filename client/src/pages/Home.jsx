import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'

export default class Home extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <HeroSection />
        <AboutSection />
      </div>
    )
  }
}
