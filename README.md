# 📸 Kodaki Studio

A premium, highly aesthetic web-based photobooth application built with Next.js and Tailwind CSS. Kodaki Studio allows users to capture memories right from their browser, customize them with over 18+ gorgeous presets, arrange them into various layouts, decorate them with stickers, and export high-resolution digital photo strips.

## ✨ Features

- **18+ Premium Aesthetic Presets**
  Beautiful, handcrafted themes including:
  - *Classic & Film:* Classic Strip, Red Room (Film Strip), Director Cut, Studio Noir
  - *Vintage & Retro:* Retro Instant (Polaroid), Retro Green, Vintage Stamp, Vintage Cam, Woodgrain, Photomatics
  - *Playful & Y2K:* Y2K Party, Pixel Heart, Teal Photoism
  - *Creative Frames:* Newspaper, Store Receipt, Airmail Letter, Movie Ticket, Social App

- **7 Dynamic Layout Options**
  - Single Shot (1 pose)
  - Mini Strip (2 poses)
  - Triple Shot (3 poses)
  - Photo Strip (4 poses)
  - Double Strip (4 poses - prints dual strips)
  - Square Grid (4 poses)
  - Six Grid (6 poses)

- **Interactive Editor**
  - **Live Camera Capture:** Countdown timers, flash effects, and live filtering.
  - **Drag-and-Drop Stickers:** Decorate your photos with interactive emoji/icon stickers using Framer Motion.
  - **Filter Application:** Apply Instagram-style color grading (B&W, Sepia, Vintage, Vibrant, Soft Focus).

- **Premium UI & UX**
  - Fully responsive across desktop, tablet, and mobile.
  - Auto-scaling live preview canvas prevents clipping on any screen size.
  - Beautiful visual layout selectors, smooth animations, and a polished design system.
  - Universal "KODAKI" watermark blending dynamically on both light and dark strips.

- **High-Quality Export**
  - Instant rendering of the final customized photobooth strip.
  - Downloads directly as a high-resolution PNG using `html-to-image`.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Camera:** [react-webcam](https://www.npmjs.com/package/react-webcam)
- **Exporting:** [html-to-image](https://github.com/bubkoo/html-to-image)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd kodaki
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the photobooth in action.

## 📱 Responsiveness & Browser Support

Kodaki Studio is built with a mobile-first approach but features a dedicated, expansive desktop layout:
- **Mobile Devices:** Uses a dynamic aspect-ratio scaling algorithm to ensure tall photo strips never clip horizontally or vertically on narrow phone screens.
- **Desktop/Tablets:** Expands to a beautiful split-panel view (`max-w-[1400px]`) allowing users to easily access customization tools while seeing a large live preview.
- **Camera Access:** Note that browser privacy policies require the app to be served over HTTPS (or localhost) for webcam access to function correctly.

## 🎨 Design Philosophy

Every preset in Kodaki Studio is hand-coded using raw CSS `linear-gradient`, `box-shadow`, and `mask-image` techniques to guarantee pixel-perfect rendering without relying heavily on massive image assets. 

This ensures that the final exported images render flawlessly, text remains crisp, and performance stays incredibly fast.

---
*Built with love for capturing every moment. ✧ Kodaki Studio ✧*
