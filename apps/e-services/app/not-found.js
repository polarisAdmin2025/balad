'use client'

import Image from 'next/image'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div>
        <Image
          src="/images/notfound.webp"
          alt="Not Found"
          width={400}
          height={394}
          className="margin-auto"
        />
        <h2>Page Not Found</h2>
        <p>Sorry, we couldn’t find the page you’re looking for.</p>
      </div>
      <div className="notfound-404">
        <Link href="/" className="btn">
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
