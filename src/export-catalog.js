export const EXPORT_CATEGORIES = [
  {
    id: "cashew-kernel",
    number: "01",
    title: "Hạt điều nhân",
    shortTitle: "Hạt điều",
    image: "/images/cashews.webp",
    alt: "Hạt điều nhân màu kem trong bát gốm sáng",
    description:
      "Điều nhân theo grade, phù hợp cho nguyên liệu thực phẩm, bán lẻ và chế biến sâu.",
    overview:
      "Chọn grade theo mục đích sử dụng, sau đó chốt chỉ tiêu an toàn và quy cách bao gói của từng lô.",
    forms: "Nguyên hạt, hạt vỡ, rang hoặc theo yêu cầu.",
    specGroups: [
      {
        title: "Phân hạng",
        items: [
          { label: "Grade", value: "WW180, WW210, WW240, WW320, WW450 và nhóm hạt vỡ" },
          { label: "Ngoại quan", value: "Màu, kích cỡ, tỷ lệ lỗi được chốt theo grade" },
        ],
      },
      {
        title: "An toàn lô hàng",
        items: [
          { label: "COA", value: "Độ ẩm, aflatoxin và chỉ tiêu vi sinh theo từng lô" },
          { label: "Mẫu duyệt", value: "Đối chiếu cảm quan và tỷ lệ khuyết tật trước khi xuất" },
        ],
      },
      {
        title: "Đóng gói",
        items: [
          { label: "Bao gói", value: "Túi PE hút chân không hoặc hộp theo yêu cầu" },
          { label: "Nhãn hàng", value: "Thông tin truy xuất và artwork được duyệt trước sản xuất" },
        ],
      },
    ],
    checks: ["Grade", "Độ ẩm", "Aflatoxin", "Vi sinh", "Tỷ lệ lỗi"],
  },
  {
    id: "cassia",
    number: "02",
    title: "Quế cassia",
    shortTitle: "Quế",
    image: "/images/cassia-export.webp",
    alt: "Quế cassia thanh và vỏ quế trên bề mặt đá sáng",
    description:
      "Quế thanh, quế cắt và quế bột cho ngành gia vị, đồ uống và thực phẩm.",
    overview:
      "Dạng thanh và dạng bột có bộ chỉ tiêu riêng, đặc biệt ở kích thước và hàm lượng dầu bay hơi.",
    forms: "Thanh nguyên, thanh cắt, nghiền hoặc bột mịn.",
    specGroups: [
      {
        title: "Quế thanh",
        items: [
          { label: "Độ ẩm tham chiếu", value: "Tối đa 13,5%" },
          { label: "Tạp chất tham chiếu", value: "Tối đa 0,5%" },
          { label: "Kích thước", value: "Chiều dài và đường kính theo grade đã duyệt" },
        ],
      },
      {
        title: "Quế bột",
        items: [
          { label: "Độ ẩm tham chiếu", value: "Tối đa 12%" },
          { label: "Dầu bay hơi", value: "Khoảng 2-4%, tùy quy cách" },
          { label: "Cảm quan", value: "Màu tự nhiên, không nấm mốc" },
        ],
      },
      {
        title: "Đóng gói",
        items: [
          { label: "Dạng thanh", value: "Carton 10-20 kg hoặc bao PP theo hợp đồng" },
          { label: "Dạng bột", value: "Bao PP, PE hoặc kraft 20-25 kg theo yêu cầu" },
        ],
      },
    ],
    checks: ["Độ ẩm", "Tạp chất", "Kích thước", "Dầu bay hơi", "Nấm mốc"],
  },
  {
    id: "black-pepper",
    number: "03",
    title: "Hạt tiêu",
    shortTitle: "Hạt tiêu",
    image: "/images/pepper.webp",
    alt: "Hạt tiêu đen nguyên hạt cùng chùm tiêu xanh",
    description:
      "Tiêu đen và tiêu trắng theo độ rời, sàng và mức làm sạch cần cho mỗi thị trường.",
    overview:
      "Thông số cần đọc theo mã grade. Không dùng một mức độ ẩm hoặc độ rời cho mọi loại tiêu.",
    forms: "Tiêu đen, tiêu trắng, nguyên hạt hoặc xay.",
    specGroups: [
      {
        title: "Ví dụ grade tiêu đen",
        items: [
          { label: "P500", value: "Độ rời khoảng 500-550 g/L" },
          { label: "Độ ẩm", value: "Tối đa 13% với quy cách P500 tham chiếu" },
          { label: "Tạp chất", value: "Khoảng 0,5-1%, theo grade" },
        ],
      },
      {
        title: "Grade làm sạch cao",
        items: [
          { label: "Sàng", value: "Có thể yêu cầu kích thước 5 mm" },
          { label: "Độ ẩm", value: "Tối đa 12,5% ở một số grade" },
          { label: "Tạp chất", value: "Có thể chốt mức tối đa 0,2%" },
        ],
      },
      {
        title: "Cần xác nhận",
        items: [
          { label: "Chỉ tiêu", value: "Độ rời, sàng, tạp chất, đen vỡ và vi sinh" },
          { label: "Bao gói", value: "Bao PP, kraft hoặc lớp lót theo thị trường nhận" },
        ],
      },
    ],
    checks: ["Độ rời", "Sàng", "Độ ẩm", "Tạp chất", "Hạt đen vỡ"],
  },
  {
    id: "star-anise",
    number: "04",
    title: "Hoa hồi",
    shortTitle: "Hoa hồi",
    image: "/images/star-anise-export.webp",
    alt: "Hoa hồi nguyên cánh trên nền đá sáng",
    description:
      "Hoa hồi nguyên cánh, hồi vụ thu, hồi vụ xuân và hồi vỡ cho chuỗi gia vị.",
    overview:
      "Thời điểm thu hoạch, kích thước cánh và tỷ lệ hồi vỡ làm nên khác biệt giữa các quy cách.",
    forms: "Nguyên cánh, hồi vỡ hoặc dầu hồi theo hồ sơ riêng.",
    specGroups: [
      {
        title: "Hồi nguyên cánh",
        items: [
          { label: "Độ ẩm tham chiếu", value: "Tối đa 13,5%" },
          { label: "Tạp chất tham chiếu", value: "Tối đa 0,5%" },
          { label: "Màu và bề mặt", value: "Màu tự nhiên, không nấm mốc" },
        ],
      },
      {
        title: "Kích thước",
        items: [
          { label: "Vụ thu", value: "Cánh từ 2,5 cm, tối thiểu 80% theo quy cách tham chiếu" },
          { label: "Vụ xuân", value: "Cánh từ 2 cm, tối thiểu 80% theo quy cách tham chiếu" },
          { label: "Hồi vỡ", value: "Tỷ lệ vỡ và kích thước được chốt bằng mẫu" },
        ],
      },
      {
        title: "Đóng gói",
        items: [
          { label: "Nguyên cánh", value: "Carton 10 hoặc 20 kg theo thỏa thuận" },
          { label: "Hồi vỡ", value: "Bao PP 20-30 kg theo thỏa thuận" },
        ],
      },
    ],
    checks: ["Vụ hàng", "Độ ẩm", "Tạp chất", "Kích thước", "Tỷ lệ vỡ"],
  },
  {
    id: "coffee-bean",
    number: "05",
    title: "Cà phê hạt",
    shortTitle: "Cà phê",
    image: "/images/green-coffee-export.webp",
    alt: "Hạt cà phê nhân xanh trong khay gốm sáng màu",
    description:
      "Cà phê hạt theo sàng, phương pháp sơ chế và bộ chỉ tiêu phù hợp với hợp đồng xuất khẩu.",
    overview:
      "Sàng, độ ẩm, tạp chất và tỷ lệ hạt đen vỡ nên được đọc cùng nhau, không tách rời grade.",
    forms: "Robusta, Arabica, nhân xanh hoặc rang theo nhu cầu.",
    specGroups: [
      {
        title: "Robusta sàng 16-18",
        items: [
          { label: "Tỷ lệ giữ sàng", value: "Tối thiểu 90% ở grade S16 hoặc S18 tham chiếu" },
          { label: "Độ ẩm", value: "Tối đa 12,5% ở quy cách tham chiếu" },
          { label: "Tạp chất", value: "Tối đa 0,5% ở quy cách tham chiếu" },
        ],
      },
      {
        title: "Phân loại lỗi",
        items: [
          { label: "Đen và vỡ", value: "Tối đa 2% ở một số grade S16 hoặc S18" },
          { label: "Grade làm sạch", value: "Có thể yêu cầu tạp chất và lỗi thấp hơn" },
        ],
      },
      {
        title: "Đóng gói",
        items: [
          { label: "Bao gói", value: "Bao đay 60 kg hoặc quy cách đã thống nhất" },
          { label: "Hồ sơ", value: "Mẫu, COA và yêu cầu rang xay được đối chiếu trước xuất" },
        ],
      },
    ],
    checks: ["Sàng", "Độ ẩm", "Tạp chất", "Đen vỡ", "Sơ chế"],
  },
  {
    id: "desiccated-coconut",
    number: "06",
    title: "Cơm dừa sấy",
    shortTitle: "Cơm dừa",
    image: "/images/desiccated-coconut-export.webp",
    alt: "Cơm dừa sấy trắng trong bát gốm, cạnh trái dừa bổ đôi",
    description:
      "Cơm dừa sấy mịn hoặc thô, high-fat hoặc low-fat cho thực phẩm và bánh kẹo.",
    overview:
      "Tỷ lệ béo, độ ẩm, acid béo tự do và giới hạn sulfite cần được chốt chính xác theo từng quy cách.",
    forms: "Fine, medium hoặc dạng theo yêu cầu ứng dụng.",
    specGroups: [
      {
        title: "High-fat fine",
        items: [
          { label: "Hàm lượng béo tham chiếu", value: "Từ 62%" },
          { label: "Độ ẩm tham chiếu", value: "Tối đa 3%" },
          { label: "FFA tham chiếu", value: "Tối đa 0,3%" },
        ],
      },
      {
        title: "Low-fat fine",
        items: [
          { label: "Hàm lượng béo tham chiếu", value: "Từ 25%" },
          { label: "Độ ẩm tham chiếu", value: "Tối đa 4,5%" },
          { label: "Vi sinh", value: "Yêu cầu kiểm tra theo COA và thị trường nhận" },
        ],
      },
      {
        title: "Bao gói và phụ gia",
        items: [
          { label: "Bao gói", value: "Kraft nhiều lớp, PE trong và PP ngoài theo quy cách" },
          { label: "SO₂", value: "Giới hạn được chốt theo hợp đồng và COA lô hàng" },
        ],
      },
    ],
    checks: ["Độ béo", "Độ ẩm", "FFA", "SO₂", "Vi sinh"],
  },
  {
    id: "dried-fruit",
    number: "07",
    title: "Trái cây sấy",
    shortTitle: "Trái cây sấy",
    image: "/images/dried-fruit-export.webp",
    alt: "Xoài sấy, chuối sấy và dứa sấy trong khay gốm sáng",
    description:
      "Dòng chip và dẻo từ xoài, mít, chuối, dứa cùng công thức phù hợp từng kênh bán.",
    overview:
      "Với trái cây sấy, quy trình, công thức và hạn dùng quan trọng không kém nguyên liệu đầu vào.",
    forms: "Chip giòn, sấy dẻo, lát hoặc miếng theo sản phẩm.",
    specGroups: [
      {
        title: "Công thức",
        items: [
          { label: "Nguyên liệu", value: "Loại quả và tỷ lệ thành phần được công bố theo SKU" },
          { label: "Phụ gia", value: "Đường, dầu, chất điều chỉnh acid hoặc chất bảo quản phải ghi rõ" },
        ],
      },
      {
        title: "Chất lượng",
        items: [
          { label: "Kiểm tra", value: "Độ ẩm hoặc aw, vi sinh, ngoại quan và độ đồng đều" },
          { label: "Hạn dùng", value: "Khoảng 3-6 tháng tùy công thức và cách sấy" },
        ],
      },
      {
        title: "Lưu kho",
        items: [
          { label: "Bảo quản", value: "Nơi khô ráo, mát và đóng kín sau khi mở" },
          { label: "Bao bì", value: "Khối lượng, vật liệu cản ẩm và nhãn theo kênh bán" },
        ],
      },
    ],
    checks: ["Công thức", "Độ ẩm hoặc aw", "Vi sinh", "Hạn dùng", "Bao bì"],
  },
  {
    id: "fresh-fruit",
    number: "08",
    title: "Trái cây tươi",
    shortTitle: "Trái cây tươi",
    image: "/images/produce.webp",
    alt: "Danh mục trái cây tươi Việt Nam trên nền sáng",
    description:
      "Trái cây nhiệt đới theo mùa cho kênh nhập khẩu, bán lẻ, foodservice và chế biến.",
    overview:
      "Giống, vùng trồng, độ chín, kích cỡ và chuỗi lạnh cần được thống nhất theo thị trường đích.",
    forms: "Nguyên quả, phân loại theo size hoặc sơ chế theo yêu cầu.",
    specGroups: [
      {
        title: "Danh mục theo mùa",
        items: [
          { label: "Trái cây", value: "Xoài, thanh long, dừa, bơ, dứa, chanh dây và các dòng theo mùa" },
          { label: "Phân loại", value: "Giống, trọng lượng, độ chín và ngoại quan theo mẫu duyệt" },
        ],
      },
      {
        title: "Sau thu hoạch",
        items: [
          { label: "Kiểm tra", value: "Dư lượng, dịch hại, truy xuất và hồ sơ vùng trồng theo thị trường" },
          { label: "Bảo quản", value: "Nhiệt độ và thông gió được chốt theo từng loại quả" },
        ],
      },
      {
        title: "Đóng gói và giao nhận",
        items: [
          { label: "Bao gói", value: "Khay, lưới, thùng carton hoặc quy cách bán lẻ theo hợp đồng" },
          { label: "Lịch hàng", value: "Kế hoạch thu hoạch, đóng gói và vận chuyển theo cửa sổ mùa vụ" },
        ],
      },
    ],
    checks: ["Mùa vụ", "Kích cỡ", "Độ chín", "Dư lượng", "Chuỗi lạnh"],
  },
  {
    id: "other",
    number: "09",
    title: "Other",
    shortTitle: "Other",
    image: "/images/finished-cashew-export.webp",
    alt: "Sản phẩm nông nghiệp chế biến và đóng gói theo yêu cầu",
    description:
      "Nhóm sản phẩm mở cho nguyên liệu, hàng chế biến và dự án nhãn riêng theo yêu cầu riêng.",
    overview:
      "Nhóm Other tiếp nhận yêu cầu ngoài danh mục chuẩn, từ lựa chọn nguyên liệu đến phát triển quy cách OEM/ODM.",
    forms: "Nguyên liệu, bán thành phẩm, thành phẩm hoặc OEM/ODM.",
    specGroups: [
      {
        title: "Phạm vi sản phẩm",
        items: [
          { label: "Yêu cầu", value: "Tên hàng, ứng dụng, thị trường đích và khối lượng dự kiến" },
          { label: "Mẫu", value: "Mẫu tham chiếu hoặc brief kỹ thuật được xác nhận trước báo giá" },
        ],
      },
      {
        title: "Phát triển quy cách",
        items: [
          { label: "Chất lượng", value: "Bộ chỉ tiêu được xây dựng theo sản phẩm và yêu cầu pháp lý" },
          { label: "OEM/ODM", value: "Công thức, khối lượng tịnh, artwork và bao bì theo dự án" },
        ],
      },
      {
        title: "Xác nhận trước sản xuất",
        items: [
          { label: "Hồ sơ", value: "Mẫu duyệt, nhãn, chứng từ và điều kiện giao hàng" },
          { label: "Tiến độ", value: "MOQ và lịch sản xuất được xác nhận theo từng yêu cầu" },
        ],
      },
    ],
    checks: ["Ứng dụng", "Thị trường", "MOQ", "Mẫu duyệt", "Artwork"],
  },
];

export const EXPORT_SPEC_NOTICE =
  "Các chỉ tiêu là khung tham chiếu để bắt đầu yêu cầu báo giá. Quy cách cuối cùng được xác nhận bằng hợp đồng, mẫu duyệt và COA của từng lô hàng.";
