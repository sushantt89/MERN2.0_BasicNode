import React from 'react'
import NavBar from '../components/NavBar'
import Cards from '../components/Cards'

const Home = () => {
  return (
    <>
    <NavBar/>
    <div className='flex flex-wrap justify-evenly mt-10'>

    <Cards/>
    <Cards/>
    <Cards/>
    <Cards/>
    <Cards/>
    <Cards/>
    <Cards/>
    <Cards/>
    </div>
    </>
  )
}

export default Home