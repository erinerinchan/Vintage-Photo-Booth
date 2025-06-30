"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { HTMLCanvasElement } from "react"

type PhotoboothStage = "intro" | "capture" | "processing" | "addNote" | "customize" | "reveal"

const AuthenticPhotoautomat = () => (
  <svg width="100%" height="100%" viewBox="0 0 600 800" className="mx-auto max-w-sm sm:max-w-md md:max-w-lg">
    {/* Illuminated top strip */}
    <rect x="40" y="40" width="520" height="25" fill="#FFA500" stroke="#FF8C00" strokeWidth="2" rx="4" />
    <circle cx="80" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="120" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="160" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="200" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="240" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="280" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="320" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="360" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="400" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="440" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="480" cy="52" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="520" cy="52" r="3" fill="#FFD700" opacity="0.8" />

    {/* Main frame */}
    <rect x="50" y="65" width="500" height="650" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="3" />

    {/* Top sign */}
    <rect x="60" y="75" width="480" height="60" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="2" rx="4" />
    <text x="300" y="115" textAnchor="middle" fontSize="36" fill="#DC2626" fontWeight="bold">
      Photoautomat
    </text>

    {/* Main red body */}
    <rect x="70" y="145" width="460" height="520" fill="#DC2626" stroke="#B91C1C" strokeWidth="2" />

    {/* Left instruction panel */}
    <rect x="80" y="160" width="140" height="150" fill="#F5F5F5" stroke="#D0D0D0" strokeWidth="2" rx="3" />

    {/* Instruction panel header */}
    <rect x="82" y="165" width="136" height="20" fill="#000000" />
    <text x="150" y="178" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
      PHOTOGRAPHIERE DICH SELBST!
    </text>

    {/* Sample photos grid - bigger rectangles arranged in a centered row */}
    <rect x="82" y="225" width="30" height="35" fill="#FFA500" />
    <rect x="117" y="225" width="30" height="35" fill="#FF6B6B" />
    <rect x="152" y="225" width="30" height="35" fill="#4ECDC4" />
    <rect x="187" y="225" width="30" height="35" fill="#45B7D1" />

    {/* Door handle */}
    <rect x="240" y="400" width="8" height="40" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="1" rx="2" />
    <rect x="245" y="415" width="6" height="10" fill="#E0E0E0" rx="1" />

    {/* Black curtained entrance with bigger white border */}
    <rect x="260" y="160" width="260" height="500" fill="#1F2937" stroke="#FFFFFF" strokeWidth="8" />

    {/* Curtain details */}
    <rect x="260" y="160" width="30" height="500" fill="#374151" />
    <rect x="490" y="160" width="30" height="500" fill="#374151" />

    {/* Curtain folds */}
    <line x1="275" y1="160" x2="275" y2="660" stroke="#4B5563" strokeWidth="1" />
    <line x1="505" y1="160" x2="505" y2="660" stroke="#4B5563" strokeWidth="1" />
    <line x1="285" y1="160" x2="285" y2="660" stroke="#4B5563" strokeWidth="1" />
    <line x1="495" y1="160" x2="495" y2="660" stroke="#4B5563" strokeWidth="1" />

    {/* Photo output slot */}
    <rect x="100" y="450" width="100" height="15" fill="#1F2937" rx="3" />
    <text x="150" y="480" textAnchor="middle" fontSize="10" fill="#92400e">
      Photos appear here
    </text>

    {/* Base/ground */}
    <rect x="40" y="715" width="520" height="35" fill="#6B7280" stroke="#4B5563" strokeWidth="2" rx="4" />
  </svg>
)

const FlashingLightBulb = () => (
  <div className="relative inline-flex items-center justify-center">
    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg">
      <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
      <div className="relative w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-full">
        <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full opacity-80"></div>
      </div>
    </div>
  </div>
)

const ColorOption = ({ color, isSelected, onClick }: { color: string; isSelected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${isSelected ? "border-amber-800" : "border-gray-300"} relative`}
    style={{ backgroundColor: color }}
  >
    {isSelected && (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="12"
          height="12"
          className="sm:w-4 sm:h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </div>
    )}
  </button>
)

export default function PhotoboothApp() {
  const [stage, setStage] = useState<PhotoboothStage>("intro")
  const [countdown, setCountdown] = useState<number | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photoNote, setPhotoNote] = useState("")

  // Customization options
  const [photostripColor, setPhotostripColor] = useState("#F7F4E3") // light cream
  const [backgroundColor, setBackgroundColor] = useState("#E8E5DC") // light beige
  const [showDateStamp, setShowDateStamp] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const photostripColors = [
    "#F7F4E3", // light cream (changed from brown)
    "#E6E6FA", // lavender
    "#FFB6C1", // light pink
    "#000000", // black
  ]

  const backgroundColors = [
    "#E8E5DC", // light beige (changed from brown)
    "#B0C4DE", // light steel blue
    "#FFB6C1", // light pink
    "#F5F5DC", // beige
  ]

  const startCamera = useCallback(async () => {
    try {
      console.log("Starting camera...")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      console.log("Camera started successfully")
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Camera access denied or not available. Please allow camera permissions.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Add flash effect
        const flashDiv = document.createElement("div")
        flashDiv.style.position = "fixed"
        flashDiv.style.top = "0"
        flashDiv.style.left = "0"
        flashDiv.style.width = "100%"
        flashDiv.style.height = "100%"
        flashDiv.style.backgroundColor = "white"
        flashDiv.style.zIndex = "9999"
        flashDiv.style.opacity = "0.8"
        document.body.appendChild(flashDiv)

        setTimeout(() => document.body.removeChild(flashDiv), 200)

        context.drawImage(video, 0, 0)
        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        console.log("Photo captured successfully")
        return photoDataUrl
      }
    }
    console.error("Failed to capture photo")
    return null
  }, [])

  const startCountdown = useCallback(() => {
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval)
          // Capture photo when countdown reaches 0
          const photo = capturePhoto()
          if (photo) {
            setCapturedPhotos((prevPhotos) => {
              const newPhotos = [...prevPhotos, photo]
              // Check if we have 3 photos now
              if (newPhotos.length >= 3) {
                setStage("addNote")
              } else {
                // Start next countdown after a brief pause
                setTimeout(() => startCountdown(), 1000)
              }
              return newPhotos
            })
            setCurrentPhotoIndex((prev) => prev + 1)
          }
          return null
        }
        return prev - 1
      })
    }, 1000)
  }, [capturePhoto])

  const handleStartCapture = () => {
    setStage("capture")
    startCamera().then(() => {
      setTimeout(() => startCountdown(), 1000)
    })
  }

  const handleRestart = () => {
    stopCamera()
    setStage("intro")
    setCountdown(null)
    setCapturedPhotos([])
    setCurrentPhotoIndex(0)
    setPhotoNote("")
    setPhotostripColor("#F7F4E3")
    setBackgroundColor("#E8E5DC")
    setShowDateStamp(true)
  }

  const handleContinueFromNote = () => {
    setStage("customize")
  }

  const handleContinueFromCustomize = () => {
    setStage("reveal")
  }

  const downloadPhotoStrip = () => {
    if (capturedPhotos.length === 0) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calculate dynamic canvas height based on content
    const photoSize = 240
    const photoSpacing = 20
    const topMargin = 60
    const bottomMargin = 60
    const titleHeight = 35

    // Calculate note height
    let noteHeight = 0
    if (photoNote.trim()) {
      const words = photoNote.split(" ")
      const lines = []
      let currentLine = words[0]

      for (let i = 1; i < words.length; i++) {
        const word = words[i]
        // Rough estimate for text width
        if (currentLine.length + word.length < 35) {
          currentLine += " " + word
        } else {
          lines.push(currentLine)
          currentLine = word
        }
      }
      lines.push(currentLine)
      noteHeight = lines.length * 18 + 20 // 18px per line + spacing
    }

    const dateHeight = showDateStamp ? 30 : 0

    // Calculate total height needed
    const totalHeight =
      titleHeight +
      topMargin +
      capturedPhotos.length * photoSize +
      (capturedPhotos.length - 1) * photoSpacing +
      noteHeight +
      dateHeight +
      bottomMargin

    // Create photo strip dimensions with dynamic height
    canvas.width = 300
    canvas.height = totalHeight

    // Apply selected background color
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add photos with proper square dimensions and cropping
    let photosProcessed = 0
    capturedPhotos.forEach((photo, index) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const x = (canvas.width - photoSize) / 2
        const y = topMargin + index * (photoSize + photoSpacing)

        // Calculate crop dimensions to make square from center
        const sourceSize = Math.min(img.width, img.height)
        const sourceX = (img.width - sourceSize) / 2
        const sourceY = (img.height - sourceSize) / 2

        // Draw square photo cropped from center
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize, // Source crop (square from center)
          x,
          y,
          photoSize,
          photoSize, // Destination (square)
        )

        photosProcessed++
        if (photosProcessed === capturedPhotos.length) {
          // Add title with selected photostrip color
          ctx.fillStyle = photostripColor
          ctx.font = "bold 18px Arial"
          ctx.textAlign = "center"
          ctx.fillText("Photoautomat", canvas.width / 2, 35)

          // Add note if provided
          if (photoNote.trim()) {
            ctx.fillStyle = photostripColor
            ctx.font = "14px Arial"
            ctx.textAlign = "center"

            // Word wrap the note
            const words = photoNote.split(" ")
            const lines = []
            let currentLine = words[0]

            for (let i = 1; i < words.length; i++) {
              const word = words[i]
              const testLine = currentLine + " " + word
              const metrics = ctx.measureText(testLine)
              if (metrics.width < 280) {
                currentLine = testLine
              } else {
                lines.push(currentLine)
                currentLine = word
              }
            }
            lines.push(currentLine)

            // Draw the lines
            const startY =
              topMargin + capturedPhotos.length * photoSize + (capturedPhotos.length - 1) * photoSpacing + 30
            lines.forEach((line, lineIndex) => {
              ctx.fillText(line, canvas.width / 2, startY + lineIndex * 18)
            })
          }

          // Add date stamp if enabled
          if (showDateStamp) {
            ctx.fillStyle = photostripColor
            ctx.font = "12px Arial"
            ctx.textAlign = "center"
            const dateY = totalHeight - 20
            ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, dateY)
          }

          // Download
          const link = document.createElement("a")
          link.download = "photobooth-strip.png"
          link.href = canvas.toDataURL()
          link.click()
        }
      }
      img.src = photo
    })
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Dynamic background based on stage
  const getBackgroundStyle = () => {
    if (stage === "capture") {
      return { backgroundColor: "#000000" }
    }
    return { backgroundColor: "#F5F2E9" }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative" style={getBackgroundStyle()}>
      {stage === "intro" && (
        <div className="relative text-center w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div className="h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center">
            <AuthenticPhotoautomat />
          </div>
          {/* START button with flashing light bulb - responsive positioning */}
          <div className="absolute top-[45%] sm:top-[49%] left-[12%] sm:left-[15%]">
            <Button
              onClick={handleStartCapture}
              className="bg-red-800 hover:bg-red-900 text-white px-2 py-1 sm:px-4 sm:py-1.5 text-xs font-bold rounded-full shadow-lg transform hover:scale-105 transition-all"
              size="sm"
            >
              <FlashingLightBulb />
              <span className="ml-0.5 sm:ml-1">START</span>
            </Button>
          </div>
        </div>
      )}

      {stage === "capture" && (
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-square object-cover bg-black rounded-lg shadow-2xl"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera status indicator */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            LIVE
          </div>

          {countdown !== null && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-white text-6xl sm:text-8xl md:text-9xl font-bold animate-pulse">{countdown}</div>
            </div>
          )}

          <div
            className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
            style={{ color: "#F4F2E9", fontFamily: "cursive" }}
          >
            Photo {currentPhotoIndex + 1} of 3
          </div>
        </div>
      )}

      {stage === "addNote" && (
        <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 relative">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center"
            style={{ fontFamily: "cursive", color: "#92400e" }}
          >
            Add a note to your photos
          </h2>

          <div className="mb-4">
            <textarea
              className="w-full h-24 sm:h-32 p-3 sm:p-4 border-2 rounded-lg resize-none focus:outline-none focus:border-amber-900 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              style={{ fontFamily: "cursive", borderColor: "#92400e", backgroundColor: "#E8E5DC" }}
              value={photoNote}
              onChange={(e) => setPhotoNote(e.target.value.slice(0, 150))}
              placeholder="Write your note here..."
            />
            <div className="text-xs sm:text-sm mt-2 text-right" style={{ color: "#F4F2E9", fontFamily: "cursive" }}>
              {photoNote.length}/150 characters
            </div>
          </div>

          <Button
            onClick={handleContinueFromNote}
            className="w-full bg-amber-800 hover:bg-amber-900 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg"
            style={{ color: "#F4F2E9", fontFamily: "cursive" }}
          >
            Continue
          </Button>
        </div>
      )}

      {stage === "customize" && (
        <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 relative">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center"
            style={{ fontFamily: "cursive", color: "#92400e" }}
          >
            Customize your photostrip
          </h2>

          {/* Photostrip Color Selection */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold" style={{ fontFamily: "cursive", color: "#92400e" }}>
                Photostrip
              </h3>
              <div className="flex gap-3 sm:gap-4">
                {photostripColors.map((color, index) => (
                  <ColorOption
                    key={index}
                    color={color}
                    isSelected={photostripColor === color}
                    onClick={() => setPhotostripColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Background Color Selection */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold" style={{ fontFamily: "cursive", color: "#92400e" }}>
                Background
              </h3>
              <div className="flex gap-3 sm:gap-4">
                {backgroundColors.map((color, index) => (
                  <ColorOption
                    key={index}
                    color={color}
                    isSelected={backgroundColor === color}
                    onClick={() => setBackgroundColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Date Stamp Toggle */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold" style={{ fontFamily: "cursive", color: "#92400e" }}>
                Display date stamp
              </h3>
              <div className="flex items-center">
                <button
                  onClick={() => setShowDateStamp(!showDateStamp)}
                  className={`w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-colors duration-200 ${
                    showDateStamp ? "bg-amber-800" : "bg-gray-300"
                  } relative`}
                >
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                      showDateStamp ? "translate-x-7 sm:translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinueFromCustomize}
            className="w-full bg-amber-800 hover:bg-amber-900 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg"
            style={{ color: "#F4F2E9", fontFamily: "cursive" }}
          >
            Continue
          </Button>
        </div>
      )}

      {stage === "reveal" && (
        <div className="text-center space-y-4 sm:space-y-6 w-full max-w-sm sm:max-w-md mx-auto px-4 relative">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-8">
            <FlashingLightBulb />
            <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "cursive", color: "#92400e" }}>
              Photo is printing
            </h2>
          </div>

          {/* White background box with smaller photostrip */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mx-auto">
            {/* Animated photo strip that slides down - smaller scale */}
            <div
              className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-lg w-32 sm:w-40 md:w-48 mx-auto transform transition-all duration-1000 ease-out"
              style={{
                animation: "slideDown 1.5s ease-out forwards",
                transform: "translateY(-50px)",
                opacity: "0",
              }}
            >
              <div className="space-y-1 sm:space-y-2">
                {capturedPhotos.map((photo, index) => (
                  <div key={index} className="overflow-hidden">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-square object-cover filter grayscale"
                    />
                  </div>
                ))}
              </div>

              {showDateStamp && (
                <div className="mt-2 text-[8px] sm:text-xs" style={{ color: "#92400e", fontFamily: "cursive" }}>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              onClick={downloadPhotoStrip}
              className="bg-amber-800 hover:bg-amber-900 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg w-full sm:w-auto"
              style={{ fontFamily: "cursive", color: "#F4F2E9" }}
            >
              Collect Photo
            </Button>
            <Button
              onClick={handleRestart}
              className="bg-gray-600 hover:bg-gray-700 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg w-full sm:w-auto"
              style={{ fontFamily: "cursive", color: "#F4F2E9" }}
            >
              Take new photo
            </Button>
          </div>

          <style jsx>{`
            @keyframes slideDown {
              0% {
                transform: translateY(-50px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
