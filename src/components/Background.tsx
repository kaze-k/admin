import "@/styles/background.scss"

function Background() {
  return (
    <>
      <div className="background">
        <div className="background-top">
          <svg
            height="1337"
            width="1337"
          >
            <defs>
              <path
                id="path-1"
                opacity="1"
                fillRule="evenodd"
                d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z"
              />
              <linearGradient
                id="linearGradient-2"
                x1="0.79"
                y1="0.62"
                x2="0.21"
                y2="0.86"
              >
                <stop
                  offset="0"
                  stopColor="#28aff0"
                  stopOpacity="1"
                />
                <stop
                  offset="1"
                  stopColor="#120fc4"
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <g opacity="1">
              <use
                xlinkHref="#path-1"
                fill="url(#linearGradient-2)"
                fillOpacity="1"
              />
            </g>
          </svg>
        </div>

        <div className="background-bottom">
          <svg
            height="1337"
            width="1337"
          >
            <defs>
              <path
                id="path-1"
                opacity="1"
                fillRule="evenodd"
                d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z"
              />
              <linearGradient
                id="linearGradient-2"
                x1="0.79"
                y1="0.62"
                x2="0.21"
                y2="0.86"
              >
                <stop
                  offset="0"
                  stopColor="#abe15b"
                  stopOpacity="1"
                />
                <stop
                  offset="1"
                  stopColor="#120fc4"
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <g opacity="1">
              <use
                xlinkHref="#path-1"
                fill="url(#linearGradient-2)"
                fillOpacity="1"
              />
            </g>
          </svg>
        </div>
      </div>
    </>
  )
}

export default Background
