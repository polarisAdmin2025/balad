'use client'

import Image from 'next/image'
import Link from 'next/link'

const Error = ({ reset }) => {
  return (
    <div className="notfound-container">
      <div>
        <Image
          src="/images/connection-error.webp"
          alt="Not Found"
          width={400}
          height={394}
          className="margin-auto"
        />
        <h2>Something went wrong</h2>
        <p>We are working to solve the problem.</p>
      </div>
      <div className="notfound-404">
        <Link href="/" onClick={() => reset()} className="btn">
          Try Again
        </Link>
      </div>
    </div>
  )
}

export default Error
