import type { CSSProperties } from "react";

// Runs before first paint. Plays the intro once per browser session and hands
// the visitor's current time to the CSS as hand angles.
const setup = `try{var r=document.documentElement,d=new Date(),s=d.getSeconds()+3,m=d.getMinutes()+s/60,h=d.getHours()%12+m/60;r.style.setProperty("--intro-h",h*30+"deg");r.style.setProperty("--intro-m",m*6+"deg");r.style.setProperty("--intro-s",s*6+"deg");if(sessionStorage.getItem("arzoo.intro")){r.dataset.intro="seen"}else{sessionStorage.setItem("arzoo.intro","1")}}catch(e){}`;

const R = 150;

function mark(i: number) {
  return { "--i": i } as CSSProperties;
}

/** Opening clock animation, driven by the `.intro` rules in globals.css. */
export function IntroSplash() {
  return (
    <>
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: setup }}
      />
      <div className="intro" aria-hidden>
        <svg viewBox="-200 -200 400 400" className="h-[min(86vw,86vh,680px)] w-[min(86vw,86vh,680px)]">
          <defs>
            <radialGradient id="intro-face" cx="0.4" cy="0.35" r="0.75">
              <stop offset="0" stopColor="#16324d" />
              <stop offset="1" stopColor="#070a10" />
            </radialGradient>
            <linearGradient id="intro-bezel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f2f5f8" />
              <stop offset="0.5" stopColor="#7d8793" />
              <stop offset="1" stopColor="#2c3138" />
            </linearGradient>
          </defs>

          {/* case and dial */}
          <g className="intro-case">
            <circle r={R + 22} fill="url(#intro-bezel)" />
            <circle r={R + 12} fill="#05070b" />
            <circle r={R + 8} fill="url(#intro-face)" />
          </g>

          {/* minute track, hour markers and numerals */}
          {Array.from({ length: 60 }, (_, i) => {
            const hour = i % 5 === 0;
            const numeral = i % 15 === 0;
            return (
              <g key={i} className="intro-mark" style={mark(i)} transform={`rotate(${i * 6})`}>
                <line
                  y1={-R}
                  y2={-R + (hour ? 16 : 6)}
                  stroke="#fff"
                  strokeWidth={hour ? 3 : 0.9}
                  strokeOpacity={hour ? 1 : 0.5}
                  strokeLinecap="round"
                />
                {numeral && (
                  <text
                    y={-R + 46}
                    transform={`rotate(${-i * 6} 0 ${-R + 37})`}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="26"
                    fontWeight="300"
                    fontFamily="var(--font-geist-sans), sans-serif"
                  >
                    {i === 0 ? 12 : i / 5}
                  </text>
                )}
              </g>
            );
          })}

          <text
            className="intro-word"
            y="-52"
            textAnchor="middle"
            fill="#fff"
            fontSize="15"
            fontWeight="500"
            letterSpacing="5"
            fontFamily="var(--font-geist-sans), sans-serif"
          >
            ARZOO
          </text>

          {/* hands */}
          <g className="intro-hour">
            <path d="M-4.5 14L-3 -84L0 -90L3 -84L4.5 14z" fill="#f4f6f8" />
          </g>
          <g className="intro-minute">
            <path d="M-3.2 18L-2 -124L0 -131L2 -124L3.2 18z" fill="#f4f6f8" />
          </g>
          <g className="intro-second">
            <line y1="34" y2={-R + 8} stroke="#ff3344" strokeWidth="1.6" strokeLinecap="round" />
            <circle cy="34" r="5" fill="#ff3344" />
          </g>
          <circle r="7" fill="#ff3344" />
          <circle r="2" fill="#05070b" />
        </svg>
      </div>
    </>
  );
}
