'use client'

const LoadingBar = ({ gridCol, gridRow }) => {
  return (
    <div
      className="shimmer"
      style={{
        height: '32px',
        gridColumn: gridCol,
        gridRow: gridRow,
        textAlign: 'center',
        alignContent: 'center'
      }}
    >
      Loading ...
    </div>
  )
}

export default LoadingBar
