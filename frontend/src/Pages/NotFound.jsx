import React from 'react'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='max-w-125'><img src="https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769683311/404_lfdmsm" alt="page-not-found" /></div>
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Oops! You've strayed off the field.</h1>
        <p className="text-gray-500 font-medium text-sm md:text-md lg:text-lg w-full text-center">The page you are looking for has been harvested or never planted. Let's get you back to familiar ground.</p>
        <Link to="/" className='flex justify-center'><button className="mt-4 cursor-pointer bg-[#03a74f] py-2 px-3 lg:py-3 rounded-lg font-medium text-white hover:bg-[#38864b] hover:-translate-y-2 transition-transform duration-300 active:scale-95"><FontAwesomeIcon icon={faHouse} className="mr-2" /> Back to Home</button></Link>
      </div>
    </div>
  )
}

export default NotFound