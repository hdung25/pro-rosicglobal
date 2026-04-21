import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight, ArrowUp, MapPin, Phone, Mail, Wheat, Leaf, Beef, Building2, Cpu, Sprout, Menu, X, Share2, Play, Camera, Send } from 'lucide-react'

// Social icon SVGs (lucide v0.4+ removed branded icons)
const Facebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const Youtube = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)
const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const Twitter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// ============================================================
// DATA CONSTANTS
// ============================================================

const NAV_ITEMS = [
  {
    label: 'HOME', href: '#home',
    children: [
      { label: 'Trang chủ', href: '#home' },
      { label: 'Giới thiệu', href: '#about' },
    ]
  },
  {
    label: 'SẢN PHẨM', href: '#products',
    children: [
      { label: 'Nông sản tươi', href: '#products' },
      { label: 'Nông sản chế biến', href: '#products' },
      { label: 'Sản phẩm hữu cơ', href: '#products' },
      { label: 'Xuất khẩu', href: '#products' },
    ]
  },
  {
    label: 'GALLERY', href: '#gallery',
    children: [
      { label: 'Hình ảnh', href: '#gallery' },
      { label: 'Video', href: '#gallery' },
    ]
  },
  {
    label: 'BLOG', href: '#blog',
  },
  {
    label: 'LIÊN HỆ', href: '#contact',
  },
]

const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80',
    title: 'HONG TAM',
    subtitle: 'ROSIC GLOBAL',
    tagline: 'NÔNG SẢN SẠCH • HỮU CƠ • CHẤT LƯỢNG CAO',
    cta: 'KHÁM PHÁ NGAY',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80',
    title: 'NÔNG NGHIỆP',
    subtitle: 'BỀN VỮNG',
    tagline: 'KẾT NỐI NÔNG DÂN VIỆT NAM VỚI THỊ TRƯỜNG TOÀN CẦU',
    cta: 'TÌM HIỂU THÊM',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
    title: 'CHẤT LƯỢNG',
    subtitle: 'TIÊU CHUẨN QUỐC TẾ',
    tagline: 'CAM KẾT AN TOÀN VỆ SINH THỰC PHẨM THEO TIÊU CHUẨN QUỐC TẾ',
    cta: 'XEM SẢN PHẨM',
  },
]

const FEATURES = [
  { icon: Wheat,     label: 'Nông Sản', sub: 'Agriculture Products' },
  { icon: Leaf,      label: 'Rau Củ Tươi', sub: 'Fresh Vegetables' },
  { icon: Beef,      label: 'Chăn Nuôi', sub: 'Different Livestock' },
  { icon: Building2, label: 'Nhà Máy', sub: 'Farm Factory' },
  { icon: Cpu,       label: 'Công Nghệ', sub: 'Modern Technique' },
  { icon: Sprout,    label: 'Hữu Cơ', sub: 'Organic Products' },
]

const PRODUCTS = [
  { id: 1, title: 'Blueberry Hữu Cơ', category: 'Trái Cây', image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&q=80' },
  { id: 2, title: 'Rau Thơm & Cà Chua', category: 'Rau Củ', image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&q=80' },
  { id: 3, title: 'Lúa Mạch', category: 'Ngũ Cốc', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80' },
  { id: 4, title: 'Ớt Chuông', category: 'Rau Củ', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80' },
  { id: 5, title: 'Cà Chua & Gia Vị', category: 'Rau Củ', image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600&q=80' },
  { id: 6, title: 'Chuối Vàng', category: 'Trái Cây', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80' },
  { id: 7, title: 'Trái Cây Nhiệt Đới', category: 'Trái Cây', image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&q=80' },
  { id: 8, title: 'Rau Củ Quả Tươi', category: 'Rau Củ', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80' },
]

const BLOG_POSTS = [
  { id: 1, day: '16', month: 'Tháng 3', year: '2024', category: 'Nông Sản', comments: 5,
    title: 'Xu Hướng Nông Nghiệp Hữu Cơ Tại Việt Nam',
    excerpt: 'Nông nghiệp hữu cơ đang nổi lên như một xu hướng tất yếu trong thời đại mới. Người tiêu dùng ngày càng ưa chuộng các sản phẩm sạch...',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80' },
  { id: 2, day: '20', month: 'Tháng 3', year: '2024', category: 'Xuất Khẩu', comments: 3,
    title: 'Nông Sản Việt Nam Chinh Phục Thị Trường Quốc Tế',
    excerpt: 'Với chất lượng ngày càng được nâng cao và quy trình sản xuất hiện đại, nông sản Việt Nam đã và đang khẳng định vị thế trên thị trường quốc tế...',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80' },
  { id: 3, day: '25', month: 'Tháng 3', year: '2024', category: 'Công Nghệ', comments: 8,
    title: 'Ứng Dụng Công Nghệ Cao Trong Trồng Trọt',
    excerpt: 'Công nghệ IoT, AI và big data đang được ứng dụng rộng rãi vào sản xuất nông nghiệp, giúp tăng năng suất và giảm lãng phí tài nguyên...',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80' },
  { id: 4, day: '28', month: 'Tháng 3', year: '2024', category: 'Rau Củ', comments: 2,
    title: 'Bí Quyết Bảo Quản Rau Củ Tươi Ngon Lâu Hơn',
    excerpt: 'Để rau củ giữ được độ tươi ngon trong thời gian dài, cần áp dụng đúng kỹ thuật bảo quản và nhiệt độ thích hợp cho từng loại sản phẩm...',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80' },
  { id: 5, day: '02', month: 'Tháng 4', year: '2024', category: 'Trái Cây', comments: 6,
    title: 'Mùa Vụ Trái Cây Nhiệt Đới Đặc Sản',
    excerpt: 'Việt Nam với khí hậu nhiệt đới thuận lợi là nơi sản sinh ra những loại trái cây đặc sản nổi tiếng thế giới như xoài, nhãn, vải thiều...',
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&q=80' },
  { id: 6, day: '08', month: 'Tháng 4', year: '2024', category: 'Ngũ Cốc', comments: 4,
    title: 'Lúa Hữu Cơ - Hành Trình Từ Ruộng Đồng Đến Bàn Ăn',
    excerpt: 'Câu chuyện về những người nông dân tâm huyết ở Đồng bằng sông Cửu Long với hành trình trồng lúa hữu cơ bền vững theo tiêu chuẩn quốc tế...',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80' },
]

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Nguyễn Văn Minh',
    title: 'Giám Đốc Siêu Thị Co.opmart',
    quote: 'Hong Tam Rosic là đối tác nông sản uy tín nhất mà chúng tôi từng làm việc. Chất lượng sản phẩm luôn đạt tiêu chuẩn cao nhất, giao hàng đúng hạn và dịch vụ hậu mãi tuyệt vời.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
  },
  {
    id: 2,
    name: 'Trần Thị Lan Anh',
    title: 'Chủ Chuỗi Nhà Hàng Organic Kitchen',
    quote: 'Tôi đánh giá rất cao cam kết về an toàn vệ sinh thực phẩm của Hong Tam Rosic. Các sản phẩm hữu cơ của họ đã trở thành nguồn nguyên liệu không thể thiếu trong nhà hàng chúng tôi.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&q=80',
  },
  {
    id: 3,
    name: 'Phạm Đức Hòa',
    title: 'Nhà Nhập Khẩu Singapore',
    quote: 'Chúng tôi đã hợp tác với Hong Tam Rosic trong suốt 3 năm qua. Đây là đơn vị xuất khẩu nông sản Việt Nam đáng tin cậy với chất lượng ổn định và quy trình kiểm soát chuyên nghiệp.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
]

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

// ============================================================
// SCROLL REVEAL WRAPPER
// ============================================================
function RevealOnScroll({ children, variants = fadeUp, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span
              className={`font-heading font-900 text-xl tracking-widest transition-colors duration-300 ${scrolled ? 'text-organic-green' : 'text-white'}`}
              style={{ fontWeight: 900 }}
            >
              HONG TAM
            </span>
            <span
              className={`font-heading font-900 text-sm tracking-[4px] transition-colors duration-300 ${scrolled ? 'text-dark-charcoal' : 'text-white/80'}`}
              style={{ fontWeight: 700 }}
            >
              ROSIC GLOBAL
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="nav-item relative">
              <a
                href={item.href}
                className={`flex items-center gap-1 px-4 py-2 font-heading font-600 text-sm tracking-widest transition-colors duration-300 hover:text-accent-yellow ${
                  scrolled ? 'text-dark-charcoal' : 'text-white'
                }`}
                style={{ fontWeight: 600, fontSize: '13px' }}
              >
                {item.label}
                {item.children && <ChevronDown size={13} />}
              </a>

              {item.children && (
                <div className="nav-dropdown absolute top-full left-0 min-w-[200px] bg-white shadow-2xl border-t-2 border-accent-yellow rounded-b-lg overflow-hidden">
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="nav-sub-item block px-5 py-3 text-sm font-body text-dark-charcoal hover:text-organic-green hover:bg-warm-gray transition-colors duration-200"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#contact"
            className={`border-2 px-6 py-2 font-heading font-700 text-xs tracking-[3px] transition-all duration-300 hover:bg-accent-yellow hover:border-accent-yellow hover:text-dark-charcoal ${
              scrolled
                ? 'border-organic-green text-organic-green'
                : 'border-white text-white'
            }`}
            style={{ fontWeight: 700 }}
          >
            GET IN TOUCH
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 transition-colors ${scrolled ? 'text-dark-charcoal' : 'text-white'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white shadow-xl"
          >
            <div className="px-6 py-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    className="block font-heading font-700 text-sm tracking-widest text-dark-charcoal py-2 border-b border-gray-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                  {item.children && item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block pl-4 py-1.5 text-sm text-organic-green"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              ))}
              <a href="#contact" className="block mt-4 bg-organic-green text-white text-center py-3 font-heading tracking-widest text-xs font-700">
                GET IN TOUCH
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ============================================================
// HERO BANNER
// ============================================================
function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [flashing, setFlashing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = (index, dir) => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(dir)
    setFlashing(true)
    setTimeout(() => setFlashing(false), 400)
    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
    }, 300)
  }

  const prev = () => {
    const newIndex = (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    goTo(newIndex, -1)
  }

  const next = () => {
    const newIndex = (current + 1) % HERO_SLIDES.length
    goTo(newIndex, 1)
  }

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [current])

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, rotate: dir * 1.5, scale: 1.02 }),
    center: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ opacity: 0, rotate: dir * -1.5, scale: 0.98, transition: { duration: 0.4, ease: 'easeIn' } }),
  }

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      {/* Flash overlay */}
      {flashing && (
        <div className="hero-flash absolute inset-0 bg-white z-30 pointer-events-none" />
      )}

      {/* Slides */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="hero-slide"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SLIDES[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/55" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-heading text-accent-yellow text-xs tracking-[6px] uppercase mb-5" style={{ fontWeight: 600 }}>
              {HERO_SLIDES[current].tagline}
            </p>
            <h1
              className="hero-title font-heading text-white uppercase leading-none mb-3"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 800, letterSpacing: '-0.01em', fontFamily: "'Nunito Sans', sans-serif" }}
            >
              {HERO_SLIDES[current].title}
            </h1>
            <h2
              className="hero-title font-heading text-white/90 uppercase tracking-widest mb-10"
              style={{ fontSize: 'clamp(1rem, 3.5vw, 2.4rem)', fontWeight: 700, fontFamily: "'Nunito Sans', sans-serif" }}
            >
              {HERO_SLIDES[current].subtitle}
            </h2>
            <a
              href="#about"
              className="inline-block bg-accent-yellow text-dark-charcoal font-heading font-800 text-xs tracking-[4px] px-10 py-4 hover:bg-white transition-all duration-300 hover:scale-105"
              style={{ fontWeight: 800 }}
            >
              {HERO_SLIDES[current].cta}
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev/Next Buttons — Clean side arrows */}
      <button
        onClick={prev}
        id="hero-prev"
        aria-label="Previous slide"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 group flex items-center gap-0 overflow-hidden"
      >
        {/* Vertical accent bar */}
        <div className="w-1 h-16 bg-accent-yellow group-hover:h-20 transition-all duration-300" />
        {/* Content */}
        <div className="flex flex-col items-start px-4 py-5 bg-black/30 group-hover:bg-black/50 backdrop-blur-sm transition-all duration-300">
          <ChevronLeft
            size={22}
            className="text-white group-hover:text-accent-yellow group-hover:-translate-x-1 transition-all duration-300"
          />
          <span
            className="text-white/80 group-hover:text-accent-yellow transition-colors duration-300 mt-1"
            style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '3px' }}
          >
            PREV
          </span>
        </div>
      </button>

      <button
        onClick={next}
        id="hero-next"
        aria-label="Next slide"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 group flex items-center gap-0 overflow-hidden"
      >
        {/* Content */}
        <div className="flex flex-col items-end px-4 py-5 bg-black/30 group-hover:bg-black/50 backdrop-blur-sm transition-all duration-300">
          <ChevronRight
            size={22}
            className="text-white group-hover:text-accent-yellow group-hover:translate-x-1 transition-all duration-300"
          />
          <span
            className="text-white/80 group-hover:text-accent-yellow transition-colors duration-300 mt-1"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '3px' }}
          >
            NEXT
          </span>
        </div>
        {/* Vertical accent bar */}
        <div className="w-1 h-16 bg-accent-yellow group-hover:h-20 transition-all duration-300" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`dot ${i === current ? 'active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

// ============================================================
// ABOUT SECTION
// ============================================================
function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial="hidden" animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.p variants={fadeLeft} className="section-label">Về Chúng Tôi</motion.p>
            <motion.h2 variants={fadeLeft} className="section-title text-5xl lg:text-6xl mb-6">
              AgriCom<br />Farm Ecology<br />Products
            </motion.h2>
            <motion.p variants={fadeLeft} className="text-gray-500 text-base leading-relaxed mb-4 max-w-lg">
              Hong Tam Rosic Global JSC tự hào là một trong những công ty nông nghiệp hàng đầu Việt Nam, chuyên sản xuất và xuất khẩu các sản phẩm nông sản sạch, hữu cơ đạt tiêu chuẩn quốc tế.
            </motion.p>
            <motion.p variants={fadeLeft} className="text-gray-400 text-sm leading-relaxed mb-8">
              Chúng tôi cam kết mang đến những sản phẩm tốt nhất từ thiên nhiên, được trồng trọt và chăm sóc theo quy trình nghiêm ngặt, bảo đảm an toàn vệ sinh thực phẩm cho người tiêu dùng trong và ngoài nước.
            </motion.p>
            <motion.a
              variants={fadeLeft}
              href="#products"
              className="inline-flex items-center gap-2 text-organic-green font-heading font-700 text-xs tracking-[3px] uppercase border-b-2 border-accent-yellow pb-1 hover:text-dark-charcoal transition-colors duration-300"
            >
              XEM SẢN PHẨM
            </motion.a>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial="hidden" animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="grid grid-cols-3 gap-6"
          >
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.label}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center p-4 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full border-2 border-organic-light flex items-center justify-center mb-3 group-hover:bg-organic-green group-hover:border-organic-green transition-all duration-300">
                  <feat.icon size={24} className="text-organic-green group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="font-heading font-700 text-sm text-dark-charcoal group-hover:text-organic-green transition-colors">{feat.label}</p>
                <p className="text-xs text-gray-400 mt-1">{feat.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// PRODUCT GRID
// ============================================================
function ProductGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="products" className="py-0 bg-warm-gray" ref={ref}>
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
          {/* Text Column */}
          <motion.div
            initial="hidden" animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="lg:col-span-1 flex flex-col justify-center px-10 py-16"
          >
            <motion.p variants={fadeLeft} className="section-label">Sản Phẩm</motion.p>
            <motion.h2 variants={fadeLeft} className="section-title text-4xl mb-4">Our Products</motion.h2>
            <motion.p variants={fadeLeft} className="text-gray-500 text-sm leading-relaxed mb-6">
              Những sản phẩm nông nghiệp chất lượng cao, được tuyển chọn kỹ lưỡng từ các vùng đất màu mỡ nhất Việt Nam.
            </motion.p>
            <motion.a
              variants={fadeLeft}
              href="#"
              className="text-organic-green font-heading font-700 text-xs tracking-[3px] uppercase border-b border-organic-green pb-1 self-start hover:text-accent-gold transition-colors"
            >
              VIEW GALLERY
            </motion.a>
          </motion.div>

          {/* Product Grid */}
          <motion.div
            initial="hidden" animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 grid-rows-2"
          >
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                className="product-card relative overflow-hidden group cursor-pointer"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="overlay absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-heading font-700 text-sm leading-tight">{product.title}</p>
                  <p className="text-xs text-white/70 mt-0.5">{product.category}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// BLOG POSTS
// ============================================================
function BlogPosts() {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <div className="mb-12">
            <p className="section-label">Tin Tức</p>
            <h2 className="section-title text-5xl">Blog Posts</h2>
          </div>
        </RevealOnScroll>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0"
        >
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              variants={fadeUp}
              custom={i}
              className="blog-card group cursor-pointer border border-gray-100"
            >
              {/* Card content: alternating image/text */}
              {i % 2 === 0 ? (
                <>
                  {/* Date + Text */}
                  <div className="p-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-heading text-6xl font-900 text-organic-green leading-none" style={{ fontWeight: 900 }}>
                        {post.day}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-heading font-700 text-sm text-dark-charcoal">{post.month}</span>
                        <span className="font-heading font-500 text-xs text-gray-400">{post.year}</span>
                      </div>
                    </div>
                    <h3 className="font-heading font-800 text-xl text-dark-charcoal mb-1 group-hover:text-organic-green transition-colors text-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-organic-light font-600 mb-3">
                      {post.category} | {post.comments} Comments
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed text-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  {/* Image */}
                  <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                </>
              ) : (
                <>
                  {/* Image */}
                  <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  {/* Date + Text */}
                  <div className="p-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-heading text-6xl font-900 text-organic-green leading-none" style={{ fontWeight: 900 }}>
                        {post.day}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-heading font-700 text-sm text-dark-charcoal">{post.month}</span>
                        <span className="font-heading font-500 text-xs text-gray-400">{post.year}</span>
                      </div>
                    </div>
                    <h3 className="font-heading font-800 text-xl text-dark-charcoal mb-1 group-hover:text-organic-green transition-colors text-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-organic-light font-600 mb-3">
                      {post.category} | {post.comments} Comments
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed text-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// TESTIMONIALS (PARALLAX)
// ============================================================
function Testimonials() {
  const [current, setCurrent] = useState(0)
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden" id="testimonials">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80)`,
          y: bgY,
          scale: 1.15,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-dark-bg/80" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <p className="section-label text-accent-yellow">Đánh Giá Khách Hàng</p>
            <h2 className="font-heading text-4xl lg:text-5xl text-white font-900">What People Says</h2>
          </div>
        </RevealOnScroll>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-accent-yellow shadow-2xl">
                <img
                  src={TESTIMONIALS[current].avatar}
                  alt={TESTIMONIALS[current].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Quote */}
            <div>
              <p className="text-4xl text-accent-yellow font-heading leading-none mb-4" style={{ fontFamily: 'Georgia, serif' }}>"</p>
              <blockquote className="text-white/90 text-lg leading-relaxed font-body italic mb-6">
                {TESTIMONIALS[current].quote}
              </blockquote>
              <div>
                <p className="font-heading font-800 text-white text-lg">{TESTIMONIALS[current].name}</p>
                <p className="text-accent-yellow text-sm font-body">{TESTIMONIALS[current].title}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`dot ${i === current ? 'active' : ''}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CONTACT SECTION
// ============================================================
function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]" style={{ minHeight: '580px' }}>
      {/* Left — Green */}
      <RevealOnScroll variants={fadeLeft}>
        <div className="bg-organic-green h-full flex flex-col justify-center px-12 py-16" style={{ background: 'linear-gradient(135deg, #0d2137 0%, #1a4480 100%)' }}>
          <p className="section-label text-accent-yellow">Liên Hệ</p>
          <h2 className="font-heading text-4xl lg:text-5xl text-white font-900 mb-8">Hãy Liên Hệ<br />Với Chúng Tôi</h2>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MapPin size={15} className="text-white" />
              </div>
              <div>
                <p className="font-heading font-700 text-white text-sm tracking-wider mb-1">ĐỊA CHỈ</p>
                <p className="text-white/80 text-sm leading-relaxed">123 Đường Nông Nghiệp, Quận 1,<br />TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Phone size={15} className="text-white" />
              </div>
              <div>
                <p className="font-heading font-700 text-white text-sm tracking-wider mb-1">ĐIỆN THOẠI</p>
                <p className="text-white/80 text-sm">+84 (0) 28 1234 5678</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Mail size={15} className="text-white" />
              </div>
              <div>
                <p className="font-heading font-700 text-white text-sm tracking-wider mb-1">EMAIL</p>
                <p className="text-white/80 text-sm">info@hongtamrosic.com</p>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-10">
            {[
              { Icon: Facebook, href: '#', label: 'Facebook' },
              { Icon: Youtube,  href: '#', label: 'YouTube' },
              { Icon: Instagram,href: '#', label: 'Instagram' },
              { Icon: Twitter,  href: '#', label: 'Twitter' },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} className="w-9 h-9 border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-accent-yellow hover:border-accent-yellow hover:text-dark-charcoal transition-all duration-300">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* Right — Dark Form */}
      <RevealOnScroll variants={fadeRight}>
        <div className="bg-dark-charcoal h-full flex flex-col justify-center px-12 py-16">
          <p className="section-label text-accent-yellow">Gửi Tin Nhắn</p>
          <h2 className="font-heading text-3xl text-white font-900 mb-10">Send A Message</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <input
                type="text"
                placeholder="TÊN CỦA BẠN"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                id="contact-name"
                className="line-input"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="EMAIL"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                id="contact-email"
                className="line-input"
              />
            </div>
            <div>
              <textarea
                placeholder="NỘI DUNG TIN NHẮN"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                id="contact-message"
                className="line-input resize-none"
              />
            </div>
            <button
              type="submit"
              id="contact-submit"
              className="w-full bg-accent-yellow text-dark-charcoal font-heading font-800 text-xs tracking-[4px] py-4 hover:bg-white transition-all duration-300 hover:scale-[1.02] active:scale-100"
              style={{ fontWeight: 800 }}
            >
              SEND A MESSAGE
            </button>
          </form>
        </div>
      </RevealOnScroll>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const [email, setEmail] = useState('')
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      {/* Google Map */}
      <div className="w-full h-80 overflow-hidden">
        <iframe
          title="Hong Tam Rosic Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946!2d106.6974!3d10.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1fd3%3A0x1c671e5d8dd7e4e5!2zSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(30%) contrast(1.1) hue-rotate(20deg)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Footer Content */}
      <footer className="bg-dark-bg text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Logo + copyright */}
            <div>
              <div className="mb-4">
                <p className="font-heading font-900 text-2xl text-white tracking-widest" style={{ fontWeight: 900 }}>HONG TAM</p>
                <p className="font-heading font-700 text-xs text-accent-yellow tracking-[4px]">ROSIC GLOBAL</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Công ty Cổ phần Hồng Tâm Rosic Global – Kết nối nông nghiệp Việt Nam với thị trường toàn cầu.
              </p>
              <p className="text-gray-600 text-xs">© 2024 Hong Tam Rosic Global JSC.<br />All rights reserved.</p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-heading font-800 text-sm tracking-[3px] text-white uppercase mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {['Trang Chủ', 'Về Chúng Tôi', 'Sản Phẩm', 'Gallery', 'Blog', 'Liên Hệ'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 text-sm hover:text-accent-yellow transition-colors duration-300 flex items-center gap-2">
                      <span className="w-3 h-px bg-organic-light inline-block" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Additional */}
            <div>
              <h4 className="font-heading font-800 text-sm tracking-[3px] text-white uppercase mb-5">Sản Phẩm</h4>
              <ul className="space-y-3">
                {['Nông Sản Tươi', 'Rau Củ Hữu Cơ', 'Trái Cây', 'Ngũ Cốc', 'Sản Phẩm Chế Biến', 'Xuất Khẩu'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 text-sm hover:text-accent-yellow transition-colors duration-300 flex items-center gap-2">
                      <span className="w-3 h-px bg-organic-light inline-block" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h4 className="font-heading font-800 text-sm tracking-[3px] text-white uppercase mb-5">Nhận Tin Tức</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Đăng ký nhận thông tin mới nhất về nông sản và những ưu đãi đặc biệt từ Hong Tam Rosic.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('Đăng ký thành công!')
                  setEmail('')
                }}
                className="flex"
              >
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="newsletter-email"
                  className="newsletter-input"
                />
                <button
                  type="submit"
                  id="newsletter-subscribe"
                  className="border-2 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-dark-charcoal font-heading font-800 text-xs tracking-[2px] px-5 py-3 transition-all duration-300 whitespace-nowrap flex-shrink-0"
                  style={{ fontWeight: 800 }}
                >
                  SUBSCRIBE
                </button>
              </form>

              {/* Social in footer */}
              <div className="flex gap-3 mt-6">
                {[Facebook, Youtube, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 border border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:border-accent-yellow hover:text-accent-yellow transition-all duration-300">
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-gray-600 text-xs">Designed with ❤️ for Hong Tam Rosic Global JSC</p>
            <div className="flex gap-6">
              {['Chính Sách Bảo Mật', 'Điều Khoản Dịch Vụ'].map((t) => (
                <a key={t} href="#" className="text-gray-600 text-xs hover:text-accent-yellow transition-colors">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="back-to-top"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================
// STATS BANNER
// ============================================================
function StatsBanner() {
  const stats = [
    { value: '15+', label: 'Năm Kinh Nghiệm' },
    { value: '500+', label: 'Đối Tác Toàn Cầu' },
    { value: '50+', label: 'Quốc Gia Xuất Khẩu' },
    { value: '1000+', label: 'Nông Hộ Hợp Tác' },
  ]
  return (
    <section className="py-14" style={{ background: 'linear-gradient(90deg, #0d2137 0%, #1a4480 50%, #0d2137 100%)' }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="text-center"
          >
            <p className="font-heading text-5xl text-accent-yellow mb-2" style={{ fontWeight: 800, fontFamily: "'Nunito Sans', sans-serif" }}>{stat.value}</p>
            <p className="font-body text-white/80 text-sm tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  return (
    <div className="font-body">
      <Navbar />
      <HeroBanner />
      <AboutSection />
      <StatsBanner />
      <ProductGrid />
      <BlogPosts />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  )
}
