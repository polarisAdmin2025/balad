'use client'

const ThreeColSkeleton = () => {
  return (
    <div className="content-container">
      <form className="form-content">
        <div className="grid grid-col-3">
          <div
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 2, gridRow: 1 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 3, gridRow: 1 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>

          <div
            className="field-container"
            style={{ gridColumn: 1, gridRow: 2 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 2, gridRow: 2 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 3, gridRow: 2 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 1, gridRow: 3 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 2, gridRow: 3 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 3, gridRow: 3 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 1, gridRow: 4 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 2, gridRow: 4 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
          <div
            className="field-container"
            style={{ gridColumn: 3, gridRow: 4 }}
          >
            <div
              className="shimmer"
              style={{ width: '180px', height: '20px' }}
            />
            <div
              className="select-tag shimmer"
              style={{ height: '40px', border: 'none' }}
            />
          </div>
        </div>
      </form>
      <div className="wizard-buttons">
        <p className="shimmer" style={{ width: '180px', height: '37px' }} />
        <p className="shimmer" style={{ width: '180px', height: '37px' }} />
        <p className="shimmer" style={{ width: '180px', height: '37px' }} />
        <p className="shimmer" style={{ width: '180px', height: '37px' }} />
      </div>
    </div>
  )
}

export default ThreeColSkeleton
