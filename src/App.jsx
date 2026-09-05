import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import {
  ChevronDown, ChevronLeft, ChevronRight, ArrowUp, MapPin, Phone, Mail,
  Wheat, Leaf, Beef, Building2, Cpu, Sprout, Menu, X, Share2, Play, Camera,
  Send, CheckCircle2, ShieldCheck, Award, Globe, Sparkles, TrendingUp,
  Clock, Package, FileText, ArrowRight, Star, ExternalLink, HelpCircle,
  Truck, Search, BadgeCheck
} from 'lucide-react'

// ============================================================
// SOCIAL ICONS
// ============================================================
const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const ZaloIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor">
    <path d="M24 4C12.95 4 4 12.51 4 23.01c0 5.48 2.45 10.42 6.41 13.91l-1.98 7.33c-.24.89.65 1.63 1.48 1.22l8.47-4.14c1.78.44 3.65.68 5.62.68 11.05 0 20-8.51 20-19.01S35.05 4 24 4zm-7.65 24.37h-3.41c-.55 0-1-.45-1-1v-8.74c0-.55.45-1 1-1h3.41c.55 0 1 .45 1 1v8.74c0 .55-.45 1-1 1zm9.65 0h-4.32c-.55 0-1-.45-1-1v-8.74c0-.55.45-1 1-1h4.32c.55 0 1 .45 1 1v1.32c0 .55-.45 1-1 1h-2.32v1.54h2.12c.55 0 1 .45 1 1v1.32c0 .55-.45 1-1 1h-2.12v1.56h2.32c.55 0 1 .45 1 1v1.32c0 .55-.45 1-1 1zm9.95 0h-1.92c-.37 0-.71-.2-.89-.53l-3.39-5.94v5.47c0 .55-.45 1-1 1h-1.32c-.55 0-1-.45-1-1v-8.74c0-.55.45-1 1-1h1.92c.37 0 .71.2.89.53l3.39 5.94v-5.47c0-.55.45-1 1-1h1.32c.55 0 1 .45 1 1v8.74c0 .55-.45 1-1 1z"/>
  </svg>
)

// ============================================================
// BESPOKE BRAND LOGO COMPONENT
// Fixes client feedback: Icon & Text perfectly balanced and centered
// ============================================================
function HongTamLogo({ scrolled = false, lightMode = false, size = 'normal' }) {
  const isCompact = size === 'compact'
  
  return (
    <div className="flex items-center gap-3.5 group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
      {/* Precision Engineered Symmetrical Brand Mark */}
      <div className={`relative flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-300 ${
        isCompact ? 'w-10 h-10' : 'w-12 h-12'
      } ${
        scrolled
          ? 'bg-gradient-to-br from-navy-main to-navy-deep shadow-md border border-accent-yellow/30'
          : 'bg-gradient-to-br from-navy-deep/90 to-navy-main/90 backdrop-blur-md shadow-xl border border-accent-yellow/40'
      }`}>
        {/* Subtle glowing ring */}
        <div className="absolute inset-0 rounded-xl bg-accent-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* SVG Emblem: Hong Tam (Heart-Sprout & Global Leaves) */}
        <svg
          viewBox="0 0 48 48"
          className={isCompact ? 'w-6 h-6' : 'w-7 h-7'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe082" />
              <stop offset="50%" stopColor="#e9c46a" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>
            <linearGradient id="logoLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#52b788" />
              <stop offset="100%" stopColor="#1b4332" />
            </linearGradient>
          </defs>

          {/* Outer Global Orbit */}
          <circle cx="24" cy="24" r="21" stroke="url(#logoGold)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.75" />
          <circle cx="24" cy="24" r="17.5" stroke="#ffffff" strokeWidth="0.6" opacity="0.3" />

          {/* Heart-Shaped Organic Bloom (Hong Tam) */}
          <g transform="translate(24, 24)">
            {/* Outer golden heart petal */}
            <path
              d="M0,8 C-7,4 -14,-2 -12,-9 C-10,-15 -2,-13 0,-7 C2,-13 10,-15 12,-9 C14,-2 7,4 0,8 Z"
              fill="url(#logoGold)"
            />
            {/* Inner Emerald Fresh Leaf */}
            <path
              d="M0,5 C-4,1 -8,-3 -7,-7 C-6,-11 -1,-9 0,-5 C1,-9 6,-11 7,-7 C8,-3 4,1 0,5 Z"
              fill="url(#logoLeaf)"
            />
            {/* Core Sun Pearl */}
            <circle cx="0" cy="-5" r="1.8" fill="#ffffff" />
            <path d="M0,5 L0,11" stroke="#e9c46a" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Symmetrical Balanced Brand Typography */}
      <div className="flex flex-col justify-center leading-none text-left">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-heading font-extrabold tracking-wider transition-colors duration-300 ${
              isCompact ? 'text-lg' : 'text-xl'
            } ${
              lightMode
                ? 'text-white'
                : scrolled ? 'text-navy-main' : 'text-white'
            }`}
            style={{ fontWeight: 900, letterSpacing: '0.04em' }}
          >
            HỒNG TÂM
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow inline-block animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={`font-heading font-bold tracking-[3.2px] uppercase text-[10px] sm:text-[11px] transition-colors duration-300 ${
              lightMode
                ? 'text-accent-yellow'
                : scrolled ? 'text-organic-emerald' : 'text-accent-yellow'
            }`}
            style={{ fontWeight: 800 }}
          >
            ROSIC GLOBAL
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// DATA CONSTANTS
// ============================================================

const NAV_ITEMS = [
  {
    label: 'TRANG CHỦ',
    href: '#home',
  },
  {
    label: 'VỀ CHÚNG TÔI',
    href: '#about',
    children: [
      { label: 'Câu Chuyện Hồng Tâm', href: '#about' },
      { label: 'Tầm Nhìn & Sứ Mệnh', href: '#about' },
      { label: 'Năng Lực Sản Xuất', href: '#stats' },
      { label: 'Chứng Nhận Chất Lượng', href: '#certifications' },
    ]
  },
  {
    label: 'HÀNH TRÌNH',
    href: '#journey',
  },
  {
    label: 'SẢN PHẨM',
    href: '#products',
    children: [
      { label: 'Trái Cây Xuất Khẩu', href: '#products' },
      { label: 'Rau Củ Hữu Cơ VietGAP', href: '#products' },
      { label: 'Hạt & Ngũ Cốc Thượng Hạng', href: '#products' },
      { label: 'Nông Sản Chế Biến Cao Cấp', href: '#products' },
    ]
  },
  {
    label: 'ĐỐI TÁC',
    href: '#testimonials',
  },
  {
    label: 'TIN TỨC',
    href: '#blog',
  },
  {
    label: 'LIÊN HỆ',
    href: '#contact',
  },
]

// Hero Slides with Curated High-Vibe Photography
const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=85',
    badge: 'TOP 10 NÔNG SẢN XUẤT KHẨU VIỆT NAM',
    title: 'HỒNG TÂM',
    subtitle: 'ROSIC GLOBAL JSC',
    tagline: 'TIÊN PHONG NÔNG SẢN HỮU CƠ • KẾT NỐI 50+ QUỐC GIA',
    description: 'Chuyên canh và xuất khẩu các dòng nông sản hữu cơ đạt chuẩn USDA, GlobalG.A.P, mang tinh hoa đất Việt vươn tầm các thị trường khó tính nhất thế giới.',
    ctaPrimary: 'KHÁM PHÁ SẢN PHẨM',
    ctaSecondary: 'YÊU CẦU BÁO GIÁ',
    stat: '15+ Năm Đồng Hành Cùng Nông Dân',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=85',
    badge: 'CÔNG NGHỆ NÔNG NGHIỆP THÔNG MINH IOT',
    title: 'CANH TÁC',
    subtitle: 'CHUẨN HỮU CƠ QUỐC TẾ',
    tagline: 'QUY TRÌNH KIỂM SOÁT VI KHÍ HẬU • ZERO DƯ LƯỢNG HÓA HỌC',
    description: 'Ứng dụng hệ thống nhà màng khép kín hiện đại, nguồn nước khoáng tự nhiên và dinh dưỡng sinh học chuẩn châu Âu cho chất lượng vượt trội.',
    ctaPrimary: 'XEM QUY TRÌNH',
    ctaSecondary: 'THAM QUAN NÔNG TRƯỜNG',
    stat: '1,200+ Hecta Vùng Trồng Sinh Thái',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1920&q=85',
    badge: 'TRÁI CÂY NHIỆT ĐỚI THƯỢNG HẠNG',
    title: 'TƯƠI NGON',
    subtitle: 'ĐẬM ĐÀ VỊ TỰ NHIÊN',
    tagline: 'DƯA LƯỚI • THANH LONG • XOÀI CÁT CHU • BƠ 034 SÁP',
    description: 'Từng quả nông sản được thu hái đúng độ ngọt Brix lý tưởng, bảo toàn trọn vẹn dưỡng chất và độ giòn ngọt thanh mát tự nhiên.',
    ctaPrimary: 'BỘ SƯU TẬP TRÁI CÂY',
    ctaSecondary: 'TẢI CATALOGUE',
    stat: '100% Thu Hoạch Tươi Mới Trong Ngày',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=85',
    badge: 'CHUỖI CUNG ỨNG LẠNH HIỆN ĐẠI',
    title: 'XUẤT KHẨU',
    subtitle: 'VƯƠN TẦM TOÀN CẦU',
    tagline: 'HỆ THỐNG KHO LẠNH ÂM SÂU • VẬN CHUYỂN AIR & SEA ĐẠT CHUẨN FDA',
    description: 'Bảo quản nhiệt độ chính xác từ nông trại đến cảng biển quốc tế tại Nhật Bản, Hàn Quốc, Hoa Kỳ, EU và các nước Trung Đông.',
    ctaPrimary: 'LIÊN HỆ HỢP TÁC B2B',
    ctaSecondary: 'CHỨNG NHẬN XUẤT KHẨU',
    stat: '50+ Thị Trường Quốc Tế Tin Dùng',
  },
]

// Global Certifications Marquee Data
const CERTIFICATIONS = [
  { name: 'USDA ORGANIC', region: 'Hoa Kỳ', desc: 'Chuẩn hữu cơ nghiêm ngặt nhất thế giới', code: 'NOP-8492' },
  { name: 'GLOBAL G.A.P', region: 'Toàn Cầu', desc: 'Thực hành nông nghiệp chuẩn quốc tế', code: 'GGN-4059' },
  { name: 'VIETGAP CHẤT LƯỢNG CAO', region: 'Việt Nam', desc: 'Chứng nhận nông sản sạch an toàn', code: 'VG-2024' },
  { name: 'ISO 22000:2018', region: 'Quốc Tế', desc: 'Hệ thống an toàn vệ sinh thực phẩm', code: 'FSMS-991' },
  { name: 'HACCP CODEX', region: 'Châu Âu & Mỹ', desc: 'Kiểm soát mối nguy hại thực phẩm', code: 'HACCP-EX' },
  { name: 'FDA REGISTERED', region: 'Hoa Kỳ', desc: 'Đăng ký Cục Thực phẩm & Dược phẩm Mỹ', code: 'FDA-REG' },
  { name: 'HALAL CERTIFIED', region: 'Trung Đông', desc: 'Chứng nhận thị trường Hồi giáo', code: 'HL-2024' },
  { name: 'EU ORGANIC BIO', region: 'Châu Âu', desc: 'Tiêu chuẩn canh tác sinh học châu Âu', code: 'BIO-EU' },
]

// Core Value Marquee
const CORE_VALUES = [
  '🌱 100% NÔNG SẢN HỮU CƠ THUẦN KHIẾT',
  '🚜 VÙNG TRỒNG SINH THÁI ĐẠT CHUẨN GLOBAL G.A.P',
  '🌍 XUẤT KHẨU UY TÍN TỚI 50+ QUỐC GIA',
  '❄️ CÔNG NGHỆ BẢO QUẢN LẠNH HIỆN ĐẠI CHÂU ÂU',
  '🤝 CAM KẾT ĐỒNG HÀNH BỀN VỮNG CÙNG BÀ CON NÔNG DÂN',
  '🛡️ KIỂM NGHIỆM ĐỊNH KỲ ZERO HÓA CHẤT ĐỘC HẠI',
  '💎 UY TÍN TẬN TÂM - CHẤT LƯỢNG XỨNG TẦM',
]

// 6 Strengths
const FEATURES = [
  {
    icon: Sprout,
    label: 'Nông Sản Hữu Cơ',
    sub: '100% Organic Certified',
    desc: 'Canh tác tự nhiên trên thổ nhưỡng màu mỡ, sử dụng phân bón sinh học và chế phẩm hữu cơ vi sinh.',
  },
  {
    icon: Leaf,
    label: 'Rau Củ Tươi Sạch',
    sub: 'Fresh Daily Harvest',
    desc: 'Thu hái vào sáng sớm tinh mơ, chuyển thẳng về trung tâm sơ chế giữ trọn độ giòn ngọt tự nhiên.',
  },
  {
    icon: Cpu,
    label: 'Công Nghệ Nông Nghiệp IoT',
    sub: 'Smart Agriculture 4.0',
    desc: 'Hệ thống cảm biến đo độ ẩm, độ pH đất và tưới tự động nhỏ giọt Israel chuẩn xác đến từng mili-lít.',
  },
  {
    icon: Building2,
    label: 'Nhà Máy Đóng Gói Chuẩn ISO',
    sub: 'Modern Processing Hub',
    desc: 'Dây chuyền rửa ozone diệt khuẩn, chiếu xạ an toàn và đóng gói chân không bảo quản nhiệt độ lạnh.',
  },
  {
    icon: Truck,
    label: 'Logistics Toàn Cầu',
    sub: 'Cold Chain Supply',
    desc: 'Hệ thống xe lạnh và container thông minh vận chuyển tức thì đến các cảng hàng không và cảng biển.',
  },
  {
    icon: Award,
    label: 'Cam Kết Vàng Chất Lượng',
    sub: 'Global Trust & Quality',
    desc: 'Được chứng thực bởi các chứng nhận khắt khe: USDA Organic, GlobalG.A.P, FDA và ISO 22000.',
  },
]

// Product Categories
const CATEGORIES = ['Tất Cả', 'Trái Cây Xuất Khẩu', 'Rau Củ Hữu Cơ', 'Hạt & Ngũ Cốc', 'Chế Biến Cao Cấp']

// Products Data with High-Res Images & Real Specs
const PRODUCTS = [
  {
    id: 1,
    title: 'Dưa Lưới Hoàng Kim Hữu Cơ',
    category: 'Trái Cây Xuất Khẩu',
    brix: '14 - 16 Brix',
    origin: 'Vùng trồng công nghệ cao Đà Lạt',
    cert: 'GlobalG.A.P / VietGAP',
    packaging: 'Thùng 5 - 10kg, màng bọc chống xước',
    image: 'https://images.unsplash.com/photo-1598025362919-626084094a1b?w=700&q=85',
    desc: 'Thịt dưa màu cam vàng óng ả, vân lưới đều đẹp mắt, độ giòn tan ngọt lịm với mùi thơm thanh nhã độc đáo. Rất được ưa chuộng tại thị trường Nhật Bản và Singapore.',
  },
  {
    id: 2,
    title: 'Thanh Long Ruột Đỏ Bình Thuận',
    category: 'Trái Cây Xuất Khẩu',
    brix: '13 - 15 Brix',
    origin: 'Trang trại sinh thái Bình Thuận',
    cert: 'USDA Organic / GlobalG.A.P',
    packaging: 'Thùng carton xuất khẩu 4kg & 9kg',
    image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=700&q=85',
    desc: 'Ruột đỏ mọng nước giàu vitamin C và chất chống oxy hóa tự nhiên, vỏ đỏ tươi tai xanh cứng cáp, đáp ứng quy chuẩn chiếu xạ xuất khẩu vào Hoa Kỳ và EU.',
  },
  {
    id: 3,
    title: 'Xoài Cát Chu Bến Tre Hảo Hạng',
    category: 'Trái Cây Xuất Khẩu',
    brix: '16 - 18 Brix',
    origin: 'Huyện Chợ Lách, Bến Tre',
    cert: 'VietGAP Xuất Khẩu',
    packaging: 'Hộp quà biếu cao cấp & thùng 5kg',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=700&q=85',
    desc: 'Hương thơm nức mũi, thịt quả dẻo mịn không xơ, vị ngọt đậm đà lưu luyến. Tuyển chọn từng trái đồng đều trọng lượng từ 350g - 450g.',
  },
  {
    id: 4,
    title: 'Bơ 034 Sáp Đặc Biệt Lâm Đồng',
    category: 'Trái Cây Xuất Khẩu',
    brix: 'Dẻo Béo Ngậy',
    origin: 'Bảo Lộc, Lâm Đồng',
    cert: 'Hữu Cơ Sinh Thái',
    packaging: 'Khay mút 3kg & 5kg',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=700&q=85',
    desc: 'Dáng trái thon dài đặc trưng, vỏ xanh bóng, hạt cực lép, cơm vàng ruộm dẻo quánh, chứa hàm lượng dầu bơ tự nhiên cao rất tốt cho sức khỏe tim mạch.',
  },
  {
    id: 5,
    title: 'Hạt Điều Bình Phước Rang Muối',
    category: 'Hạt & Ngũ Cốc',
    brix: 'Hạt W240 Cồ Nhất',
    origin: 'Bình Phước - Thủ phủ hạt điều',
    cert: 'ISO 22000 / HACCP / Halal',
    packaging: 'Hũ thủy tinh 500g & Túi hút chân không 1kg',
    image: 'https://images.unsplash.com/photo-1509912760195-4560731215bb?w=700&q=85',
    desc: 'Tuyển chọn hạt điều loại 1 vỏ lụa, rang củi thủ công giữ trọn vị bùi ngậy giòn rụm tự nhiên, lượng muối cực nhẹ tốt cho người ăn kiêng lành mạnh.',
  },
  {
    id: 6,
    title: 'Cà Phê Arabica Cầu Đất Thượng Hạng',
    category: 'Chế Biến Cao Cấp',
    brix: 'Specialty Coffee 85+',
    origin: 'Cầu Đất, Đà Lạt (Độ cao 1,650m)',
    cert: 'Organic Agriculture Standard',
    packaging: 'Túi van 1 chiều 250g & 500g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=700&q=85',
    desc: 'Được trồng trên đỉnh núi sương mù Tây Nguyên, sơ chế ướt khắt khe tạo nên hương hoa quả nhiệt đới, hậu vị ngọt thanh tinh tế đạt chuẩn cà phê đặc sản.',
  },
  {
    id: 7,
    title: 'Rau Củ Tươi Nhà Màng VietGAP',
    category: 'Rau Củ Hữu Cơ',
    brix: 'Thu Hái Trong Ngày',
    origin: 'Nhà màng công nghệ cao Đơn Dương',
    cert: 'VietGAP / TCVN 11041',
    packaging: 'Túi màng thở sinh học 500g',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=85',
    desc: 'Ớt chuông Sweet Palerma, cà chua bi cherry socola, xà lách thủy canh ngậm sương giòn ngọt, tuyệt đối không sử dụng thuốc diệt cỏ hay hóa chất tăng trưởng.',
  },
  {
    id: 8,
    title: 'Nấm Đông Trùng Hạ Thảo Sinh Khối',
    category: 'Chế Biến Cao Cấp',
    brix: 'Dược Tính Đậm Đặc',
    origin: 'Viện Công Nghệ Sinh Học Hồng Tâm',
    cert: 'FDA / GMP Thực Phẩm',
    packaging: 'Lọ sấy thăng hoa 20g & 50g',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=700&q=85',
    desc: 'Nuôi cấy trong phòng sạch chuẩn ISO Class 1000 với cơ chất nhộng tằm hữu cơ và gạo lứt huyết rồng, hàm lượng Cordycepin và Adenosine đạt mức cao nhất thị trường.',
  },
]

// 4-Step Farm to Table Journey
const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Thổ Nhưỡng & Giống Hữu Cơ',
    sub: 'Nền Móng Bền Vững',
    desc: 'Kiểm nghiệm mẫu đất và nguồn nước tự nhiên đạt chuẩn không kim loại nặng, tuyển chọn 100% giống cây F1 thuần chủng kháng sâu bệnh tự nhiên.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
    metrics: '99.9% Đất sạch chuẩn USDA',
  },
  {
    step: '02',
    title: 'Canh Tác Thông Minh IoT',
    sub: 'Kiểm Soát 24/7',
    desc: 'Ứng dụng cảm biến đo độ ẩm, độ quang hợp và hệ thống tưới dinh dưỡng tự động theo chu kỳ sinh trưởng của cây trồng.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
    metrics: 'Tiết kiệm 60% nguồn nước',
  },
  {
    step: '03',
    title: 'Thu Hoạch & Phân Loại Quang Học',
    sub: 'Độ Ngọt Chuẩn Xác',
    desc: 'Thu hái thủ công tỉ mỉ vào sáng sớm mát mẻ. Phân loại quang học tự động theo độ Brix, kích thước và màu sắc đồng nhất.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
    metrics: '100% Thu hái đúng độ chín',
  },
  {
    step: '04',
    title: 'Chuỗi Lạnh & Xuất Khẩu Toàn Cầu',
    sub: 'Giao Hàng Thần Tốc',
    desc: 'Quy trình tiền lạnh (Pre-cooling) ngay sau 2 giờ thu hoạch, bảo quản trong kho lạnh âm sâu và vận chuyển đường biển/hàng không đến tay đối tác.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    metrics: 'Thời gian tươi ngon kéo dài 45 ngày',
  },
]

// Testimonials from International Importers
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ông Kenji Takahashi',
    role: 'Giám Đốc Nhập Khẩu Nông Sản • Tokyo Food Corp (Nhật Bản)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    quote: 'Chúng tôi đã nhập khẩu dưa lưới và thanh long từ Hồng Tâm Rosic Global trong suốt 4 năm qua. Các lô hàng luôn vượt qua 100% các bài kiểm nghiệm nghiêm ngặt của Hải quan Nhật Bản. Độ giòn ngọt và bao bì bảo quản cực kỳ chuyên nghiệp.',
    rating: 5,
    country: '🇯🇵 Tokyo, Nhật Bản',
  },
  {
    id: 2,
    name: 'Bà Elena Rostova',
    role: 'Trưởng Ban Thu Mua Chuỗi Thực Phẩm Sạch • BioMart Europe (Đức)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
    quote: 'Hồng Tâm Rosic là đối tác nông sản Việt Nam đáng tin cậy nhất mà chúng tôi từng hợp tác. Cam kết hữu cơ thực chất, truy xuất nguồn gốc mã QR rõ ràng và hệ thống logistics lạnh duy trì chất lượng hoàn hảo khi cập cảng Hamburg.',
    rating: 5,
    country: '🇩🇪 Berlin, Đức',
  },
  {
    id: 3,
    name: 'Ông Nguyễn Quốc Huy',
    role: 'Chủ Tịch Hiệp Hội Chuỗi Nhà Hàng Hữu Cơ Organic Green (Việt Nam)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    quote: 'Nông sản của Hồng Tâm Phát đã giúp hệ thống nhà hàng của chúng tôi xây dựng được niềm tin vững chắc với thực khách cao cấp. Nguồn cung ổn định quanh năm, rau củ và trái cây luôn tươi mới như vừa hái tại vườn.',
    rating: 5,
    country: '🇻🇳 TP. Hồ Chí Minh, Việt Nam',
  },
]

// Blog Posts
const BLOG_POSTS = [
  {
    id: 1,
    day: '15',
    month: 'Tháng 4',
    year: '2026',
    category: 'Thị Trường Xuất Khẩu',
    title: 'Nông Sản Hữu Cơ Việt Nam Chinh Phục Các Tiêu Chuẩn Khắt Khe Tại Thị Trường Nhật Bản',
    excerpt: 'Hành trình vượt qua hơn 300 chỉ tiêu kiểm định dư lượng hóa chất để đưa trái cây hữu cơ Hồng Tâm Rosic hiện diện tại các kệ siêu thị cao cấp Tokyo...',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
  },
  {
    id: 2,
    day: '28',
    month: 'Tháng 4',
    year: '2026',
    category: 'Công Nghệ Nông Nghiệp',
    title: 'Ứng Dụng IoT Và Cảm Biến Quang Học Trong Chuỗi Bảo Quản Lạnh Nông Sản Tươi',
    excerpt: 'Giải pháp bảo quản lạnh thông minh giúp kéo dài độ tươi ngon của trái cây xuất khẩu lên tới 45 ngày mà không cần bất kỳ chất bảo quản hóa học nào...',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
  },
  {
    id: 3,
    day: '05',
    month: 'Tháng 5',
    year: '2026',
    category: 'Phát Triển Bền Vững',
    title: 'Hồng Tâm Rosic Mở Rộng Hợp Tác Với 1,000 Nông Hộ Chuyển Đổi Canh Tác Thuần Tự Nhiên',
    excerpt: 'Chính sách bao tiêu đầu ra với mức giá cao hơn 30% thị trường giúp bà con nông dân yên tâm cam kết 100% quy trình hữu cơ bền vững...',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
  },
]

// ============================================================
// ANIMATIONS
// ============================================================
const fadeUp = {
  hidden: { opacity: 0, y: 35 },
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
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } }
}

// ============================================================
// NAVBAR COMPONENT
// ============================================================
function Navbar({ onOpenQuoteModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Notice Bar */}
      <div className="bg-navy-deep text-white/80 text-xs py-2 px-6 border-b border-navy-card hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-accent-yellow font-medium">
              <Sparkles size={13} />
              <span>Tiên phong nông sản hữu cơ xuất khẩu chuẩn USDA & GlobalG.A.P</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1.5 hover:text-accent-yellow transition-colors">
              <Phone size={12} className="text-accent-yellow" />
              <span>Hotline B2B: +84 (0) 28 1234 5678</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-accent-yellow" />
              <span>contact@hongtamrosic.com</span>
            </span>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-yellow text-navy-deep">VI</span>
              <span className="text-[10px] text-white/60 hover:text-white cursor-pointer transition-colors">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-0 md:top-8 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-nav shadow-2xl py-3 border-b border-accent-yellow/20'
            : 'bg-gradient-to-b from-navy-deep/80 via-navy-deep/40 to-transparent py-4'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Symmetrical Balanced Brand Logo */}
          <a href="#home" className="flex items-center">
            <HongTamLogo scrolled={scrolled} />
          </a>

          {/* Desktop Navigation Menu */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="nav-item relative">
                <a
                  href={item.href}
                  className={`flex items-center gap-1 px-3.5 py-2 font-heading font-bold text-xs tracking-wider uppercase transition-colors duration-200 hover:text-accent-yellow ${
                    scrolled ? 'text-white/90' : 'text-white'
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {item.label}
                  {item.children && <ChevronDown size={13} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />}
                </a>

                {item.children && (
                  <div className="nav-dropdown absolute top-full left-0 min-w-[230px] bg-navy-main/95 backdrop-blur-xl shadow-2xl border border-accent-yellow/30 rounded-xl overflow-hidden p-2 mt-1">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-xs font-medium text-white/80 hover:text-accent-yellow hover:bg-white/5 rounded-lg transition-colors duration-150"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onOpenQuoteModal()}
              className="shimmer-btn bg-gradient-to-r from-accent-yellow via-amber-400 to-accent-gold text-navy-deep font-heading font-extrabold text-xs tracking-wider px-5 py-2.5 rounded-lg shadow-lg hover:shadow-gold-glow transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ fontWeight: 800 }}
            >
              YÊU CẦU BÁO GIÁ
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile navigation"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-navy-main/98 backdrop-blur-2xl border-b border-accent-yellow/20 shadow-2xl"
            >
              <div className="px-6 py-6 space-y-4">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="border-b border-white/10 pb-3">
                    <a
                      href={item.href}
                      className="block font-heading font-bold text-sm tracking-wider text-white hover:text-accent-yellow"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="pl-4 mt-2 space-y-2">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="block text-xs text-white/70 hover:text-accent-yellow"
                            onClick={() => setMobileOpen(false)}
                          >
                            • {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      onOpenQuoteModal()
                    }}
                    className="w-full bg-accent-yellow text-navy-deep py-3 rounded-lg font-heading font-extrabold text-xs tracking-widest text-center"
                  >
                    YÊU CẦU BÁO GIÁ XUẤT KHẨU
                  </button>
                  <div className="flex justify-center gap-4 pt-2 text-white/60">
                    <a href="#" className="hover:text-accent-yellow"><FacebookIcon size={18} /></a>
                    <a href="#" className="hover:text-accent-yellow"><YoutubeIcon size={18} /></a>
                    <a href="#" className="hover:text-accent-yellow"><InstagramIcon size={18} /></a>
                    <a href="#" className="hover:text-accent-yellow"><ZaloIcon size={18} /></a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

// ============================================================
// CONTINUOUS MARQUEE: CERTIFICATIONS TICKER
// ============================================================
function CertificationsMarquee() {
  return (
    <section id="certifications" className="py-5 bg-navy-deep border-y border-accent-yellow/25 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent-yellow text-xs font-heading font-bold tracking-widest uppercase">
          <ShieldCheck size={16} className="text-accent-yellow animate-pulse" />
          <span>HỆ THỐNG TIÊU CHUẨN & CHỨNG NHẬN QUỐC TẾ KHẮT KHE</span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-white/50 tracking-wider">
          (Kiểm định độc lập định kỳ bởi các tổ chức uy tín toàn cầu)
        </span>
      </div>

      {/* Infinite Horizontal Running Track */}
      <div className="marquee-container py-2">
        <div className="marquee-content animate-marquee flex items-center gap-4">
          {[...CERTIFICATIONS, ...CERTIFICATIONS].map((cert, idx) => (
            <div
              key={`${cert.name}-${idx}`}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-navy-card/90 border border-accent-yellow/20 hover:border-accent-yellow/60 transition-all duration-300 shadow-md hover:scale-105 flex-shrink-0 cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-yellow/20 to-organic-emerald/30 border border-accent-yellow/30 flex items-center justify-center text-accent-yellow flex-shrink-0">
                <BadgeCheck size={19} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-sm text-white tracking-wider">
                    {cert.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-organic-emerald/40 text-organic-mint font-semibold">
                    {cert.region}
                  </span>
                </div>
                <p className="text-[11px] text-white/60 line-clamp-1">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CONTINUOUS MARQUEE: CORE VALUES & SLOGAN TICKER
// ============================================================
function CoreValuesMarquee() {
  return (
    <div className="py-3 bg-gradient-to-r from-navy-main via-organic-green to-navy-main border-y border-white/10 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content animate-marquee-reverse flex items-center gap-8 text-white font-heading font-bold text-xs tracking-widest">
          {[...CORE_VALUES, ...CORE_VALUES].map((val, i) => (
            <span key={i} className="flex items-center gap-6 whitespace-nowrap text-accent-yellow hover:text-white transition-colors duration-200">
              {val}
              <span className="text-white/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// HERO BANNER SECTION
// ============================================================
function HeroBanner({ onOpenQuoteModal, onOpenVideoModal }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = (index, dir) => {
    setDirection(dir)
    setCurrent(index)
  }

  const next = () => {
    goTo((current + 1) % HERO_SLIDES.length, 1)
  }

  const prev = () => {
    goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, -1)
  }

  useEffect(() => {
    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  }, [current])

  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Images Slider with Smooth Fade and Subtle Scale */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SLIDES[current].image})` }}
          />
          {/* Premium Multi-layer Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/75 to-navy-deep/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-navy-deep/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-navy-deep/30 to-navy-deep/80" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-8 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-yellow/15 border border-accent-yellow/40 backdrop-blur-md">
                  <Sparkles size={14} className="text-accent-yellow" />
                  <span className="font-heading font-extrabold text-[11px] tracking-widest text-accent-yellow uppercase">
                    {HERO_SLIDES[current].badge}
                  </span>
                </div>

                {/* Big Titles */}
                <div>
                  <h1
                    className="hero-title text-white font-heading font-extrabold leading-none tracking-tight uppercase"
                    style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900 }}
                  >
                    {HERO_SLIDES[current].title}
                  </h1>
                  <h2
                    className="hero-title text-gradient-gold font-heading font-black tracking-wide uppercase mt-1"
                    style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)', fontWeight: 900 }}
                  >
                    {HERO_SLIDES[current].subtitle}
                  </h2>
                </div>

                {/* Tagline & Description */}
                <p className="font-heading font-bold text-xs sm:text-sm text-accent-yellow tracking-[3px] uppercase">
                  {HERO_SLIDES[current].tagline}
                </p>

                <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl font-body">
                  {HERO_SLIDES[current].description}
                </p>

                {/* CTA Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <a
                    href="#products"
                    className="shimmer-btn bg-gradient-to-r from-accent-yellow via-amber-400 to-accent-gold text-navy-deep font-heading font-extrabold text-xs tracking-widest px-8 py-4 rounded-xl shadow-xl hover:shadow-gold-glow transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                    style={{ fontWeight: 800 }}
                  >
                    <span>{HERO_SLIDES[current].ctaPrimary}</span>
                    <ArrowRight size={15} />
                  </a>

                  <button
                    onClick={() => onOpenVideoModal()}
                    className="glass-pill px-6 py-4 rounded-xl text-white font-heading font-bold text-xs tracking-wider hover:bg-white/15 transition-all duration-300 inline-flex items-center gap-2.5 border border-white/20"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow">
                      <Play size={11} className="fill-current ml-0.5" />
                    </div>
                    <span>XEM VIDEO NÔNG TRƯỜNG 360°</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Floating Highlight Card */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-5">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-6 rounded-2xl relative overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-organic-emerald/40 border border-organic-mint/30 flex items-center justify-center text-organic-mint">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-white font-heading font-extrabold text-lg">50+ Thị Trường</p>
                  <p className="text-accent-yellow text-xs font-semibold">Xuất Khẩu Toàn Cầu</p>
                </div>
              </div>
              <p className="text-white/70 text-xs leading-relaxed">
                Các thị trường chủ lực: Nhật Bản, Hàn Quốc, Hoa Kỳ, Đức, Hà Lan, Các Tiểu Vương Quốc Ả Rập Thống Nhất.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="glass-card p-6 rounded-2xl relative overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-accent-yellow/20 border border-accent-yellow/40 flex items-center justify-center text-accent-yellow">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-white font-heading font-extrabold text-lg">100% Đạt Chuẩn</p>
                  <p className="text-organic-mint text-xs font-semibold">USDA & GlobalG.A.P</p>
                </div>
              </div>
              <p className="text-white/70 text-xs leading-relaxed">
                Quy trình canh tác thuần tự nhiên, đất và nguồn nước không tồn dư kim loại nặng, nói không với hóa chất tổng hợp.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-8 left-6 right-6 z-30 max-w-7xl mx-auto flex items-center justify-between">
        {/* Dots with Labels */}
        <div className="flex items-center gap-3">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`transition-all duration-300 flex items-center gap-2 py-1.5 px-3 rounded-full ${
                i === current
                  ? 'bg-accent-yellow text-navy-deep font-bold text-xs shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 text-xs'
              }`}
              aria-label={`Slide ${i + 1}`}
            >
              <span>0{i + 1}</span>
              {i === current && <span className="hidden sm:inline text-[11px] font-semibold">{slide.title}</span>}
            </button>
          ))}
        </div>

        {/* Prev & Next Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-accent-yellow hover:text-navy-deep text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 border border-white/15"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-accent-yellow hover:text-navy-deep text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 border border-white/15"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// ABOUT SECTION
// ============================================================
function AboutSection({ onOpenVideoModal }) {
  return (
    <section id="about" className="py-28 bg-white relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-organic-soft/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-warm-gray blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Image Collage & Video Tour */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=85"
                alt="Nông trường hữu cơ Hồng Tâm Rosic"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />

              {/* Play Video Button Overlay */}
              <button
                onClick={onOpenVideoModal}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-accent-yellow text-navy-deep flex items-center justify-center shadow-gold-glow hover:scale-110 transition-transform duration-300"
                aria-label="Xem video nông trường"
              >
                <Play size={24} className="fill-current ml-1" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-heading font-extrabold text-lg">Nông Trường Sinh Thái Tây Nguyên</p>
                <p className="text-white/80 text-xs">Vùng trồng chuyên canh đạt chuẩn xuất khẩu Châu Âu</p>
              </div>
            </div>

            {/* Overlapping Floating Stats Card */}
            <div className="absolute -bottom-8 -right-6 sm:bottom-6 sm:-right-8 bg-navy-main text-white p-6 rounded-2xl shadow-2xl border border-accent-yellow/30 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent-yellow text-navy-deep flex items-center justify-center font-black">
                  15+
                </div>
                <div>
                  <p className="font-heading font-extrabold text-sm text-white">NĂM KINH NGHIỆM</p>
                  <p className="text-[11px] text-accent-yellow">Khẳng Định Vị Thế Xuất Khẩu</p>
                </div>
              </div>
              <p className="text-white/70 text-xs leading-relaxed">
                Đồng hành bền vững cùng hơn 1,000 hộ nông dân chuyển đổi xanh.
              </p>
            </div>
          </div>

          {/* Right Column: Brand Story */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-block font-heading font-extrabold text-xs text-organic-emerald tracking-[3.5px] uppercase mb-2">
                VỀ HỒNG TÂM ROSIC GLOBAL
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black text-navy-deep leading-tight">
                Khát Vọng Nâng Tầm Nông Sản Việt Trên Bản Đồ Thế Giới
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed font-body text-sm sm:text-base">
              <strong>Công ty Cổ phần Hồng Tâm Rosic Global (Hồng Tâm Phát)</strong> được thành lập với tâm nguyện kết nối giá trị tinh túy từ bàn tay người nông dân Việt Nam đến các bàn ăn trên khắp thế giới. Chúng tôi tin rằng nông sản sạch và hữu cơ không chỉ là xu thế tiêu dùng, mà là cam kết đạo đức vì sức khỏe con người và sự bền vững của Mẹ Thiên Nhiên.
            </p>

            <p className="text-gray-500 leading-relaxed text-sm">
              Với hệ sinh thái hơn 1,200 hecta vùng nguyên liệu trải dài từ Tây Nguyên đến Đồng bằng sông Cửu Long, Hồng Tâm Rosic tiên phong ứng dụng công nghệ tưới nhỏ giọt Israel, nhà màng IoT và quy trình kiểm định zero hóa chất.
            </p>

            {/* Checklist of Quality Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                '100% Đất sạch không tồn dư kim loại',
                'Nguồn nước khoáng tự nhiên kiểm định',
                'Hệ thống kho lạnh âm sâu chuẩn ISO',
                'Truy xuất nguồn gốc minh bạch QR Code',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-navy-deep text-xs font-semibold">
                  <CheckCircle2 size={16} className="text-organic-emerald flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-6">
              <a
                href="#journey"
                className="bg-navy-main hover:bg-navy-deep text-white font-heading font-bold text-xs tracking-wider px-7 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>XEM HÀNH TRÌNH 4 BƯỚC</span>
                <ArrowRight size={14} />
              </a>

              <a
                href="#contact"
                className="text-organic-emerald hover:text-navy-deep font-heading font-extrabold text-xs tracking-wider border-b-2 border-organic-emerald pb-1 transition-colors"
              >
                TẢI HỒ SƠ NĂNG LỰC (PDF)
              </a>
            </div>
          </div>
        </div>

        {/* 6 Core Strength Feature Cards */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-organic-emerald font-heading font-extrabold text-xs tracking-[3px] uppercase">
              NĂNG LỰC CỐT LÕI
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-navy-deep font-heading mt-2">
              Tại Sao Đối Tác Quốc Tế Chọn Hồng Tâm Rosic?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat) => (
              <div
                key={feat.label}
                className="feature-card p-8 rounded-2xl bg-warm-surface border border-gray-100 hover:bg-white hover:border-accent-yellow/40 transition-all duration-300 group shadow-sm hover:shadow-card-hover"
              >
                <div className="w-14 h-14 rounded-2xl bg-organic-soft group-hover:bg-navy-main text-organic-emerald group-hover:text-accent-yellow flex items-center justify-center transition-all duration-300 mb-6">
                  <feat.icon size={28} />
                </div>
                <h4 className="font-heading font-extrabold text-lg text-navy-deep group-hover:text-organic-emerald transition-colors mb-1">
                  {feat.label}
                </h4>
                <p className="text-xs font-bold text-accent-gold uppercase tracking-wider mb-3">
                  {feat.sub}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// STATS COUNTER BANNER
// ============================================================
function StatsBanner() {
  const stats = [
    { value: '15+', label: 'NĂM KINH NGHIỆM', sub: 'Khẳng định uy tín thương hiệu' },
    { value: '50+', label: 'QUỐC GIA XUẤT KHẨU', sub: 'Châu Á, Châu Âu, Bắc Mỹ, Trung Đông' },
    { value: '500+', label: 'ĐỐI TÁC TOÀN CẦU', sub: 'Hệ thống siêu thị & nhà phân phối' },
    { value: '15,000+', label: 'TẤN NÔNG SẢN/NĂM', sub: 'Cung ứng ổn định bốn mùa' },
  ]

  return (
    <section id="stats" className="py-20 bg-gradient-to-r from-navy-deep via-navy-main to-navy-deep relative overflow-hidden border-y border-accent-yellow/20">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center p-4 border-r border-white/10 last:border-none">
              <p
                className="font-heading text-4xl sm:text-6xl text-gradient-gold font-black mb-2"
                style={{ fontWeight: 900 }}
              >
                {stat.value}
              </p>
              <p className="font-heading font-extrabold text-white text-xs sm:text-sm tracking-wider uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-white/60 text-xs hidden sm:block">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FARM-TO-TABLE 4-STEP JOURNEY
// ============================================================
function FarmJourney() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="journey" className="py-28 bg-warm-gray relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-organic-emerald font-heading font-extrabold text-xs tracking-[3.5px] uppercase">
            QUY TRÌNH KIỂM SOÁT KHÉP KÍN
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-navy-deep font-heading mt-2">
            Hành Trình Nông Sản Từ Nông Trại Đến Bàn Ăn Toàn Cầu
          </h2>
          <p className="text-gray-500 text-sm mt-4">
            Mỗi công đoạn đều được giám sát khắt khe bởi đội ngũ kỹ sư nông nghiệp và hệ thống truy xuất nguồn gốc minh bạch.
          </p>
        </div>

        {/* Step Tabs Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {JOURNEY_STEPS.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(i)}
              className={`text-left p-5 rounded-2xl transition-all duration-300 border ${
                activeStep === i
                  ? 'bg-navy-main text-white border-accent-yellow shadow-xl scale-[1.02]'
                  : 'bg-white text-navy-deep border-gray-200 hover:border-accent-yellow/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-heading font-black text-2xl ${activeStep === i ? 'text-accent-yellow' : 'text-gray-300'}`}>
                  {s.step}
                </span>
                {activeStep === i && <BadgeCheck size={18} className="text-accent-yellow" />}
              </div>
              <p className="font-heading font-extrabold text-sm line-clamp-1">{s.title}</p>
              <p className={`text-xs mt-1 ${activeStep === i ? 'text-white/70' : 'text-gray-400'}`}>{s.sub}</p>
            </button>
          ))}
        </div>

        {/* Active Step Showcase */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-organic-soft text-organic-emerald text-xs font-bold">
              <span>BƯỚC {JOURNEY_STEPS[activeStep].step} TRONG QUY TRÌNH</span>
            </div>
            <h3 className="text-3xl font-heading font-black text-navy-deep">
              {JOURNEY_STEPS[activeStep].title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {JOURNEY_STEPS[activeStep].desc}
            </p>
            <div className="p-4 rounded-xl bg-warm-surface border-l-4 border-accent-yellow">
              <p className="text-xs font-heading font-bold text-navy-deep uppercase tracking-wider">
                Chỉ số cam kết:
              </p>
              <p className="text-sm font-extrabold text-organic-emerald mt-0.5">
                {JOURNEY_STEPS[activeStep].metrics}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
              <img
                src={JOURNEY_STEPS[activeStep].image}
                alt={JOURNEY_STEPS[activeStep].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// PRODUCT CATALOG & QUICK VIEW MODAL
// ============================================================
function ProductCatalog({ onSelectProduct }) {
  const [selectedCat, setSelectedCat] = useState('Tất Cả')

  const filtered = selectedCat === 'Tất Cả'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCat)

  return (
    <section id="products" className="py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-organic-emerald font-heading font-extrabold text-xs tracking-[3.5px] uppercase">
              DANH MỤC SẢN PHẨM HẢO HẠNG
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-navy-deep font-heading mt-2">
              Nông Sản Xuất Khẩu & Hữu Cơ
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-md mt-4 md:mt-0">
            Tất cả sản phẩm đều được kiểm định dư lượng hóa chất 0% và truy xuất nguồn gốc lô hàng chi tiết.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full font-heading font-bold text-xs tracking-wider transition-all duration-200 whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-navy-main text-accent-yellow shadow-md scale-105'
                  : 'bg-warm-surface text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="product-item rounded-2xl bg-white border border-gray-100 overflow-hidden group cursor-pointer shadow-sm hover:border-accent-yellow/40 transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-navy-main/80 backdrop-blur-md text-[10px] font-extrabold text-accent-yellow uppercase">
                  {item.category}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-organic-emerald/90 text-white text-[10px] font-bold">
                  {item.cert.split('/')[0]}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-base text-navy-deep group-hover:text-organic-emerald transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-accent-gold">
                    {item.brix}
                  </span>
                  <span className="text-xs font-heading font-bold text-navy-main group-hover:text-accent-yellow inline-flex items-center gap-1">
                    <span>Xem Chi Tiết</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// PRODUCT DETAIL MODAL (QUICK VIEW)
// ============================================================
function ProductModal({ product, onClose, onOpenQuote }) {
  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-accent-yellow/30 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-navy-main text-white flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-accent-yellow text-xs font-heading font-bold tracking-widest uppercase">
              {product.category}
            </span>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-md">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-warm-surface border border-gray-200">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Độ ngọt / Đặc tính:</span>
                <p className="font-extrabold text-navy-deep text-sm">{product.brix}</p>
              </div>
              <div className="p-3 rounded-xl bg-warm-surface border border-gray-200">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Vùng trồng / Xuất xứ:</span>
                <p className="font-extrabold text-navy-deep text-sm">{product.origin}</p>
              </div>
              <div className="p-3 rounded-xl bg-warm-surface border border-gray-200">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Chứng nhận kiểm nghiệm:</span>
                <p className="font-extrabold text-organic-emerald text-sm">{product.cert}</p>
              </div>
              <div className="p-3 rounded-xl bg-warm-surface border border-gray-200">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Quy cách đóng gói:</span>
                <p className="font-extrabold text-navy-deep text-sm">{product.packaging}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-extrabold text-sm text-navy-deep uppercase tracking-wider mb-2">
              Mô Tả Chi Tiết Sản Phẩm
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.desc}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-warm-surface border-t border-gray-100 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-600 font-heading font-bold text-xs hover:bg-gray-200 transition-colors"
          >
            ĐÓNG
          </button>
          <button
            onClick={() => {
              onClose()
              onOpenQuote(product.title)
            }}
            className="bg-accent-yellow hover:bg-amber-400 text-navy-deep font-heading font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
          >
            YÊU CẦU BÁO GIÁ CHO SẢN PHẨM NÀY
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// TESTIMONIALS & PARTNERS
// ============================================================
function TestimonialsSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="testimonials" className="py-28 bg-navy-deep text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent-yellow font-heading font-extrabold text-xs tracking-[3.5px] uppercase">
            ĐỐI TÁC TOÀN CẦU NÓI VỀ CHÚNG TÔI
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-heading mt-2">
            Uy Tín Được Khẳng Định Bằng Chất Lượng Bền Lâu
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 sm:p-12 rounded-3xl relative">
            <div className="flex items-center gap-1 text-accent-yellow mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-current" />
              ))}
            </div>

            <p className="text-lg sm:text-2xl text-white/90 font-heading italic leading-relaxed mb-8">
              "{TESTIMONIALS[active].quote}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <img
                  src={TESTIMONIALS[active].avatar}
                  alt={TESTIMONIALS[active].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-accent-yellow"
                />
                <div>
                  <h4 className="font-heading font-extrabold text-white text-base">
                    {TESTIMONIALS[active].name}
                  </h4>
                  <p className="text-accent-yellow text-xs font-medium">
                    {TESTIMONIALS[active].role}
                  </p>
                  <p className="text-white/50 text-[11px] mt-0.5">
                    {TESTIMONIALS[active].country}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActive((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent-yellow hover:text-navy-deep text-white flex items-center justify-center transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActive((active + 1) % TESTIMONIALS.length)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent-yellow hover:text-navy-deep text-white flex items-center justify-center transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// BLOG / NEWS SECTION
// ============================================================
function BlogSection() {
  return (
    <section id="blog" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-organic-emerald font-heading font-extrabold text-xs tracking-[3.5px] uppercase">
              TIN TỨC & TRI THỨC NÔNG NGHIỆP
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-navy-deep font-heading mt-2">
              Thông Tin Thị Trường & Mùa Vụ
            </h2>
          </div>
          <a
            href="#contact"
            className="text-organic-emerald font-heading font-bold text-xs tracking-wider uppercase border-b-2 border-organic-emerald pb-1 self-start mt-4 md:mt-0 hover:text-navy-deep"
          >
            XEM TẤT CẢ BÀI VIẾT
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl bg-warm-surface border border-gray-100 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-navy-main/85 backdrop-blur-sm text-accent-yellow font-extrabold text-[10px] uppercase px-2.5 py-1 rounded">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-medium">
                    <span>{post.day} {post.month}, {post.year}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-lg text-navy-deep group-hover:text-organic-emerald transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between text-xs font-bold text-navy-main group-hover:text-accent-gold">
                  <span>Đọc tiếp</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CONTACT & RFQ SECTION
// ============================================================
function ContactSection({ prefilledProduct = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: prefilledProduct || 'Dưa Lưới Hoàng Kim Hữu Cơ',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (prefilledProduct) {
      setFormData((prev) => ({ ...prev, product: prefilledProduct }))
    }
  }, [prefilledProduct])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-28 bg-warm-gray relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200">
          {/* Left Column: Office & Export Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-navy-deep via-navy-main to-navy-deep text-white p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-accent-yellow font-heading font-extrabold text-xs tracking-widest uppercase">
                KẾT NỐI VỚI CHÚNG TÔI
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mt-2 mb-6">
                Đồng Hành Cùng Nông Sản Việt Vươn Ra Toàn Cầu
              </h2>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-8">
                Quý khách hàng, nhà nhập khẩu quốc tế và đối tác cần tư vấn xuất khẩu, báo giá đơn hàng B2B hoặc hợp tác vùng trồng, vui lòng liên hệ trực tiếp:
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-yellow flex-shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-xs tracking-wider uppercase">TRỤ SỞ CHÍNH</p>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed mt-0.5">
                      Tòa nhà Hong Tam Rosic, Đường Nông Nghiệp Công Nghệ Cao, TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-yellow flex-shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-xs tracking-wider uppercase">HOTLINE XUẤT KHẨU (24/7)</p>
                    <p className="text-white/90 text-sm font-extrabold mt-0.5">+84 (0) 28 1234 5678</p>
                    <p className="text-accent-yellow text-xs">Hỗ trợ Zalo, WhatsApp, WeChat</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-yellow flex-shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-xs tracking-wider uppercase">EMAIL TIẾP NHẬN BÁO GIÁ</p>
                    <p className="text-white/80 text-sm mt-0.5">export@hongtamrosic.com</p>
                    <p className="text-white/80 text-xs">contact@hongtamrosic.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/10">
              <p className="text-xs text-white/50 mb-3">KẾT NỐI TRÊN CÁC MẠNG XÃ HỘI</p>
              <div className="flex gap-3">
                {[
                  { Icon: FacebookIcon, label: 'Facebook' },
                  { Icon: YoutubeIcon, label: 'YouTube' },
                  { Icon: InstagramIcon, label: 'Instagram' },
                  { Icon: ZaloIcon, label: 'Zalo' },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-accent-yellow hover:text-navy-deep text-white flex items-center justify-center transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: RFQ Quote Form */}
          <div className="lg:col-span-7 p-8 sm:p-12">
            <span className="text-organic-emerald font-heading font-extrabold text-xs tracking-widest uppercase">
              YÊU CẦU BÁO GIÁ & HỢP TÁC
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-navy-deep font-heading mt-1 mb-8">
              Gửi Yêu Cầu Cho Đội Ngũ Xuất Khẩu
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-organic-soft text-center space-y-4 border border-organic-mint">
                <CheckCircle2 size={48} className="text-organic-emerald mx-auto" />
                <h4 className="font-heading font-black text-xl text-navy-deep">
                  Gửi Yêu Cầu Thành Công!
                </h4>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Cảm ơn bạn đã quan tâm đến nông sản của <strong>Hồng Tâm Rosic Global</strong>. Chuyên viên phụ trách xuất khẩu sẽ liên hệ lại với bạn trong vòng 2 giờ làm việc.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-navy-main text-white font-heading font-bold text-xs"
                >
                  GỬI THÊM YÊU CẦU KHÁC
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-navy-deep uppercase mb-1.5">
                      Họ Và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-warm-surface border border-gray-200 text-navy-deep text-sm outline-none focus:border-accent-yellow transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep uppercase mb-1.5">
                      Số Điện Thoại / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+84 912 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-warm-surface border border-gray-200 text-navy-deep text-sm outline-none focus:border-accent-yellow transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-navy-deep uppercase mb-1.5">
                      Email Liên Hệ *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-warm-surface border border-gray-200 text-navy-deep text-sm outline-none focus:border-accent-yellow transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-deep uppercase mb-1.5">
                      Sản Phẩm Quan Tâm
                    </label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-warm-surface border border-gray-200 text-navy-deep text-sm outline-none focus:border-accent-yellow transition-colors"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                      <option value="Đơn hàng tổng hợp">Đơn hàng tổng hợp theo mùa vụ</option>
                      <option value="Hợp tác vùng trồng">Hợp tác gia công & bao tiêu vùng trồng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-deep uppercase mb-1.5">
                    Yêu Cầu Chi Tiết (Khối lượng dự kiến, cảng đến, tiêu chuẩn bao bì...)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Vui lòng cho chúng tôi biết nhu cầu khối lượng dự kiến (tấn), quy cách đóng gói và thời gian giao hàng mong muốn..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-warm-surface border border-gray-200 text-navy-deep text-sm outline-none focus:border-accent-yellow transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="shimmer-btn w-full bg-gradient-to-r from-accent-yellow via-amber-400 to-accent-gold text-navy-deep font-heading font-black text-xs tracking-widest py-4 rounded-xl shadow-lg hover:shadow-gold-glow transition-all duration-300 hover:scale-[1.01]"
                >
                  GỬI YÊU CẦU BÁO GIÁ NGAY
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subOk, setSubOk] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    setSubOk(true)
    setTimeout(() => {
      setSubOk(false)
      setNewsletterEmail('')
    }, 4000)
  }

  return (
    <footer className="bg-navy-deep text-white border-t border-accent-yellow/20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Symmetrical Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <HongTamLogo lightMode={true} />
            
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm pt-2">
              <strong>Công ty Cổ phần Hồng Tâm Rosic Global (Hồng Tâm Phát)</strong> — Doanh nghiệp tiên phong trong chuỗi giá trị nông sản sạch, nông sản hữu cơ công nghệ cao đạt chuẩn quốc tế vươn tầm thế giới.
            </p>

            <div className="text-xs text-white/50 space-y-1 pt-2">
              <p>Mã số doanh nghiệp: 0317894562 do Sở KH&ĐT TP.HCM cấp</p>
              <p>Giấy phép xuất khẩu nông sản số: 489/XNK-BNN</p>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="font-heading font-extrabold text-sm tracking-wider text-accent-yellow uppercase mb-4">
              Về Chúng Tôi
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#about" className="hover:text-accent-yellow transition-colors">• Câu Chuyện Thương Hiệu</a></li>
              <li><a href="#journey" className="hover:text-accent-yellow transition-colors">• Quy Trình 4 Bước Khép Kín</a></li>
              <li><a href="#stats" className="hover:text-accent-yellow transition-colors">• Năng Lực Cung Ứng B2B</a></li>
              <li><a href="#certifications" className="hover:text-accent-yellow transition-colors">• Chứng Nhận Quốc Tế</a></li>
              <li><a href="#testimonials" className="hover:text-accent-yellow transition-colors">• Khách Hàng Toàn Cầu</a></li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div>
            <h4 className="font-heading font-extrabold text-sm tracking-wider text-accent-yellow uppercase mb-4">
              Nông Sản Nổi Bật
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#products" className="hover:text-accent-yellow transition-colors">• Dưa Lưới Hoàng Kim</a></li>
              <li><a href="#products" className="hover:text-accent-yellow transition-colors">• Thanh Long Ruột Đỏ</a></li>
              <li><a href="#products" className="hover:text-accent-yellow transition-colors">• Xoài Cát Chu Bến Tre</a></li>
              <li><a href="#products" className="hover:text-accent-yellow transition-colors">• Bơ 034 Sáp Đặc Biệt</a></li>
              <li><a href="#products" className="hover:text-accent-yellow transition-colors">• Hạt Điều Rang Muối</a></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h4 className="font-heading font-extrabold text-sm tracking-wider text-accent-yellow uppercase mb-4">
              Bản Tin Mùa Vụ
            </h4>
            <p className="text-white/70 text-xs leading-relaxed mb-4">
              Đăng ký để nhận báo giá mùa vụ mới nhất và xu hướng thị trường xuất khẩu.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="email@cuaban.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-accent-yellow"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-accent-yellow text-navy-deep font-heading font-black text-xs hover:bg-amber-400 transition-colors"
              >
                {subOk ? 'ĐÃ ĐĂNG KÝ THÀNH CÔNG!' : 'ĐĂNG KÝ NHẬN BÁO GIÁ'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© 2026 Hong Tam Rosic Global JSC (Hồng Tâm Phát). Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent-yellow">Chính Sách Chất Lượng</a>
            <a href="#" className="hover:text-accent-yellow">Tiêu Chuẩn Bao Bì</a>
            <a href="#" className="hover:text-accent-yellow">Bảo Mật Thông Tin</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// FLOATING ACTION WIDGETS
// ============================================================
function FloatingWidgets({ onOpenQuoteModal }) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {/* Hotline Quick Call Button */}
      <a
        href="tel:+842812345678"
        aria-label="Gọi ngay Hotline"
        className="flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform duration-200 group"
      >
        <Phone size={18} className="animate-bounce" />
        <span className="hidden sm:inline font-heading font-extrabold text-xs tracking-wider">
          HOTLINE: +84 (0) 28 1234 5678
        </span>
      </a>

      {/* Zalo Direct Chat */}
      <a
        href="https://zalo.me"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200"
      >
        <ZaloIcon size={24} />
      </a>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            aria-label="Lên đầu trang"
            className="w-11 h-11 rounded-full bg-navy-main hover:bg-accent-yellow hover:text-navy-deep text-white flex items-center justify-center shadow-xl border border-accent-yellow/30 transition-all duration-200"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// VIDEO TOUR MODAL (LIGHTBOX)
// ============================================================
function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-navy-deep rounded-3xl overflow-hidden shadow-2xl border border-accent-yellow/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-accent-yellow hover:text-navy-deep text-white flex items-center justify-center transition-colors"
          aria-label="Đóng Video"
        >
          <X size={20} />
        </button>

        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Thước phim nông trường Hồng Tâm Rosic"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6 bg-navy-main text-white flex items-center justify-between">
          <div>
            <h4 className="font-heading font-extrabold text-lg text-white">
              Hành Trình Sinh Thái Hữu Cơ • Hồng Tâm Rosic Global
            </h4>
            <p className="text-xs text-accent-yellow">
              Khám phá hệ thống nhà màng thông minh và vùng trồng chè, cà phê, trái cây sạch
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-accent-yellow text-navy-deep font-heading font-bold text-xs"
          >
            HOÀN TẤT
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN ROOT APPLICATION
// ============================================================
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [prefilledProduct, setPrefilledProduct] = useState('')
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const handleOpenQuoteModal = (productTitle = '') => {
    setPrefilledProduct(productTitle)
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="font-body min-h-screen bg-white selection:bg-accent-yellow selection:text-navy-deep">
      {/* Navigation Header */}
      <Navbar onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Hero Section */}
      <HeroBanner
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenVideoModal={() => setVideoModalOpen(true)}
      />

      {/* Infinite Horizontal Running Marquee 1: Global Certifications */}
      <CertificationsMarquee />

      {/* About Section */}
      <AboutSection onOpenVideoModal={() => setVideoModalOpen(true)} />

      {/* Stats Counter Banner */}
      <StatsBanner />

      {/* Infinite Horizontal Running Marquee 2: Slogan / Core Values */}
      <CoreValuesMarquee />

      {/* Farm to Table 4-Step Journey */}
      <FarmJourney />

      {/* Product Catalog Grid */}
      <ProductCatalog onSelectProduct={(prod) => setSelectedProduct(prod)} />

      {/* International Testimonials & Partners */}
      <TestimonialsSection />

      {/* Blog & News Section */}
      <BlogSection />

      {/* Contact & RFQ Section */}
      <ContactSection prefilledProduct={prefilledProduct} />

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <FloatingWidgets onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Product Detail Lightbox Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={(title) => handleOpenQuoteModal(title)}
      />

      {/* Video Tour Lightbox */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  )
}
