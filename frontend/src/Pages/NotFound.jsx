import React from 'react'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { color, gradientBg } from '../theme'

const NotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen px-4' style={{ background: color.bg }}>
      <div className='max-w-[500px] mb-6'>
        <img src="https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769683311/404_lfdmsm" alt="page-not-found" className="w-full" />
      </div>
      <div className="text-center max-w-lg">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: color.text }}>
          Oops! You've strayed off the field.
        </h1>
        <p className="text-sm md:text-base mt-2 mb-6" style={{ color: color.textSoft }}>
          The page you are looking for has been harvested or never planted. Let's get you back to familiar ground.
        </p>
        <Link to="/" className='inline-block'>
          <button
            className="cursor-pointer py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2"
            style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }}
          >
            <FontAwesomeIcon icon={faHouse} /> Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound