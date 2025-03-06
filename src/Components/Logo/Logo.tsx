"use client"

import { useState, useEffect } from "react"
import styles from "./Logo.module.css"

interface QuizmaniaLogoProps {
  width?: number
  height?: number
  className?: string
  variant?: "default" | "compact" | "icon"
}

export function QuizmaniaLogo({ width = 400, height = 120, className = "", variant = "default" }: QuizmaniaLogoProps) { // Increased width and height
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Start animation after component mounts
    setAnimate(true)

    // Reset animation periodically
    const interval = setInterval(() => {
      setAnimate(false)
      setTimeout(() => setAnimate(true), 100)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (variant === "icon") {
    return (
      <div className={`${styles.logoContainer} ${className}`} style={{ width: height, height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 120 120" // Adjusted viewBox to match new size
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animate ? styles.animate : ""}
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" /> {/* Fuschia */}
              <stop offset="100%" stopColor="#818cf8" /> {/* Darker Fuschia */}
            </linearGradient>
          </defs>

          <circle cx="60" cy="60" r="60" fill="url(#iconGradient)" className={styles.iconBackground} /> {/* Increased radius from 30 to 60 */}

          {/* Centered question mark */}
          <g className={styles.questionMark}>
            <circle cx="60" cy="60" r="40" className={styles.questionCircle} /> {/* Increased radius from 20 to 40 */}
            <path
              d="M52 50C52 45.5817 55.5817 42 60 42C64.4183 42 68 45.5817 68 50C68 54.4183 64.4183 58 60 58V66"
              stroke="#FFD700"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="60" cy="78" r="6" fill="#FFD700" /> {/* Increased radius from 3 to 6 */}
          </g>

          <g className={styles.sparkles}>
            <path
              d="M100 30L104 34M20 90L24 94M100 90L96 94M20 30L16 34"
              stroke="#FFD700"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`${styles.logoContainer} ${className}`} style={{ width, height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 120" // Adjusted viewBox to match new size
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animate ? styles.animate : ""}
        >
          <defs>
            <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF00FF" /> {/* Fuschia */}
              <stop offset="100%" stopColor="#CC00CC" /> {/* Darker Fuschia */}
            </linearGradient>
            <filter id="compactShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Wider background */}
          <rect
            x="10"
            y="10"
            width="280"
            height="100"
            rx="50"
            fill="url(#compactGradient)"
            className={styles.compactBackground}
          />

          {/* Centered question mark */}
          <g className={styles.questionMark}>
            <circle cx="60" cy="60" r="24" className={styles.questionCircle} /> {/* Increased radius from 12 to 24 */}
            <path
              d="M52 52C52 48.6863 54.6863 46 58 46C61.3137 46 64 48.6863 64 52C64 55.3137 61.3137 58 58 58V64"
              stroke="#FFD700"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="58" cy="72" r="3" fill="#FFD700" /> {/* Increased radius from 1.5 to 3 */}
          </g>

          <text x="130" y="76" className={styles.compactText} filter="url(#compactShadow)">
            Quiz
          </text>
        </svg>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`${styles.logoContainer} ${className}`} style={{ width, height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 480 140" // Adjusted viewBox to match new size
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animate ? styles.animate : ""}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#FF00FF" /> {/* Fuschia */}
            <stop offset="100%" stopColor="#CC00CC" /> {/* Darker Fuschia */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Larger background shape with more padding */}
        <path
          d="M20 70C20 39.072 45.072 14 76 14H404C434.928 14 460 39.072 460 70C460 100.928 434.928 126 404 126H76C45.072 126 20 100.928 20 70Z"
          fill="url(#logoGradient)"
          className={styles.logoBackground}
        />

        {/* Centered question mark */}
        <g className={styles.questionMark}>
          <circle cx="76" cy="70" r="40" className={styles.questionCircle} /> {/* Increased radius from 20 to 40 */}
          <path
            d="M68 60C68 55.5817 71.5817 52 76 52C80.4183 52 84 55.5817 84 60C84 64.4183 80.4183 68 76 68V76"
            stroke="#FFD700"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="76" cy="88" r="6" fill="#FFD700" /> {/* Increased radius from 3 to 6 */}
        </g>

        {/* Text with exciting font */}
        <text x="130" y="86" className={styles.logoText} filter="url(#textShadow)">
          Quizmania
        </text>

        {/* Decorative elements - moved further right */}
        <g className={styles.decorativeElements}>
          <circle cx="400" cy="50" r="6" className={styles.dot} /> {/* Increased radius from 3 to 6 */}
          <circle cx="416" cy="70" r="6" className={styles.dot} /> {/* Increased radius from 3 to 6 */}
          <circle cx="400" cy="90" r="6" className={styles.dot} /> {/* Increased radius from 3 to 6 */}
        </g>
      </svg>
    </div>
  )
}

