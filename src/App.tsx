import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ photo, height, weight })
  }

  return (
    <div className="profile-container">
      <h1>퍼스널 스타일리스트</h1>
      <p className="subtitle">프로필을 입력해주세요</p>

      <form onSubmit={handleSubmit} className="profile-form">
        <div
          className="photo-upload"
          onClick={() => fileInputRef.current?.click()}
        >
          {photo ? (
            <img src={photo} alt="프로필 사진" className="photo-preview" />
          ) : (
            <div className="photo-placeholder">
              <span className="photo-icon">+</span>
              <span>사진 추가</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
        </div>

        <div className="input-group">
          <label htmlFor="height">키 (cm)</label>
          <input
            id="height"
            type="number"
            placeholder="170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="weight">몸무게 (kg)</label>
          <input
            id="weight"
            type="number"
            placeholder="65"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          프로필 저장
        </button>
      </form>
    </div>
  )
}

export default App
