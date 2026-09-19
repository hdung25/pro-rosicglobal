import { EXTRA_PRODUCTS } from "./products-extra";

export const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "fruit", label: "Trái cây tươi" },
  { id: "vegetables", label: "Rau củ theo mùa" },
  { id: "nuts", label: "Hạt & ngũ cốc" },
  { id: "processed", label: "Nông sản chế biến" },
];

export const PRODUCTS = [
  {
    id: "mango",
    title: "Xoài chín vàng",
    category: "fruit",
    group: "Trái cây tươi",
    image: "/images/mango.webp",
    alt: "Quả xoài vỏ vàng chín trên nền sáng",
    short: "Sắc vàng ấm áp, hương thơm của mùa nắng.",
    description:
      "Xoài mang hương thơm và vị ngọt đặc trưng của trái cây nhiệt đới. Độ chín, kích cỡ và hình thức đóng gói cần được lựa chọn theo mục đích sử dụng, thời gian vận chuyển và nơi nhận hàng.",
  },
  {
    id: "dragonfruit",
    title: "Thanh long ruột đỏ",
    category: "fruit",
    group: "Trái cây tươi",
    image: "/images/dragonfruit.webp",
    alt: "Thanh long bổ đôi với phần thịt đỏ và hạt đen nhỏ",
    short: "Vị thanh mát trong sắc đỏ tự nhiên.",
    description:
      "Thanh long ruột đỏ nổi bật với màu sắc rực rỡ, phần thịt mọng nước và những hạt nhỏ đặc trưng. Đối tác có thể trao đổi về kích cỡ quả, độ chín mong muốn và cách sắp xếp trong từng thùng hàng.",
  },
  {
    id: "melon",
    title: "Dưa lưới",
    category: "fruit",
    group: "Trái cây tươi",
    image: "/images/melon.webp",
    alt: "Dưa lưới nguyên quả và miếng dưa với phần thịt màu cam",
    short: "Hương dịu nhẹ, từng miếng dưa mát lành.",
    description:
      "Lớp vỏ có đường vân lưới và phần thịt thơm dịu tạo nên nét riêng của dưa lưới. Giống dưa, màu thịt, trọng lượng và độ ngọt có thể khác nhau giữa các lô; những đặc điểm này cần được xác nhận trước khi đặt hàng.",
  },
  {
    id: "avocado",
    title: "Bơ tươi",
    category: "fruit",
    group: "Trái cây tươi",
    image: "/images/avocado.webp",
    alt: "Bơ xanh nguyên quả và nửa quả bơ với phần thịt vàng xanh",
    short: "Mềm mịn, béo dịu và đầy cảm hứng.",
    description:
      "Bơ tươi có thể dùng trong nhiều món ăn và đồ uống nhờ phần thịt mềm cùng vị béo dịu. Giống bơ, kích cỡ và độ chín khi giao hàng là những thông tin nên thống nhất theo lịch sử dụng của đối tác.",
  },
  {
    id: "cashews",
    title: "Hạt điều",
    category: "nuts",
    group: "Hạt & ngũ cốc",
    image: "/images/cashews.webp",
    alt: "Những hạt điều màu kem được bày trên nền sáng",
    short: "Mộc mạc từ hình dáng đến vị bùi thân thuộc.",
    description:
      "Hạt điều là lựa chọn quen thuộc cho ngành thực phẩm, chế biến và bán lẻ. Khi trao đổi đơn hàng, hãy nêu rõ nhu cầu về cỡ hạt, dạng nguyên hạt hay hạt vỡ, cách chế biến và quy cách bao bì.",
  },
  {
    id: "coffee",
    title: "Cà phê rang",
    category: "processed",
    group: "Nông sản chế biến",
    image: "/images/coffee.webp",
    alt: "Hạt cà phê rang màu nâu trên nền sáng",
    short: "Hương rang ấm, mở đầu những câu chuyện.",
    description:
      "Mỗi lựa chọn về giống, cách sơ chế và mức rang đều góp phần tạo nên hương vị cà phê. Hãy chia sẻ phương pháp pha, khẩu vị hướng đến và nhu cầu dùng hạt nguyên hay xay để có cơ sở trao đổi sản phẩm phù hợp.",
  },
  {
    id: "vegetables",
    title: "Rau củ theo mùa",
    category: "vegetables",
    group: "Rau củ theo mùa",
    image: "/images/vegetables.webp",
    alt: "Các loại rau lá xanh, cà chua, cà rốt và ớt chuông tươi",
    short: "Đa sắc, tươi mới và thay đổi cùng mùa vụ.",
    description:
      "Một danh mục rau củ linh hoạt có thể bắt đầu từ nhu cầu bếp ăn, bán lẻ hoặc chế biến. Chủng loại, mức sơ chế, lịch giao và điều kiện bảo quản cần được trao đổi cho từng sản phẩm.",
  },
  {
    id: "cordyceps",
    title: "Đông trùng hạ thảo",
    category: "processed",
    group: "Nông sản chế biến",
    image: "/images/cordyceps.webp",
    alt: "Những sợi đông trùng hạ thảo màu cam trong vật đựng sáng màu",
    short: "Sắc cam đặc trưng, một lựa chọn khác biệt.",
    description:
      "Đông trùng hạ thảo được giới thiệu như một nhóm sản phẩm để đối tác tìm hiểu thêm. Dạng sản phẩm, thành phần, nguồn gốc, cách sử dụng và hồ sơ đi kèm cần được xác nhận cụ thể trước khi lựa chọn.",
  },
  ...EXTRA_PRODUCTS,
];

export const JOURNEY = [
  {
    title: "Bắt đầu từ nguồn trồng",
    description:
      "Hiểu xuất xứ và nhịp mùa vụ để có cơ sở lựa chọn sản phẩm phù hợp với nhu cầu.",
    image: "/images/hero.webp",
    alt: "Những đồi chè xanh trải dài trong ánh nắng",
    caption: "Từ đất lành, câu chuyện bắt đầu.",
  },
  {
    title: "Lựa chọn từng sản phẩm",
    description:
      "Trao đổi về chủng loại, độ chín, kích cỡ và những đặc điểm quan trọng với mỗi đơn hàng.",
    image: "/images/produce.webp",
    alt: "Các loại trái cây, hạt điều và cà phê được bày trên nền sáng",
    caption: "Mỗi nhu cầu, một lựa chọn riêng.",
  },
  {
    title: "Chăm chút cách đóng gói",
    description:
      "Thống nhất cách sơ chế, quy cách bao bì và điều kiện bảo quản theo từng loại nông sản.",
    image: "/images/agri-processing-line.webp",
    alt: "Dây chuyền phân loại và đóng gói nông sản trong không gian sáng",
    caption: "Hiểu sản phẩm để chăm chút đúng cách.",
  },
  {
    title: "Kết nối đến nơi nhận",
    description:
      "Làm rõ lịch giao, điểm nhận và trách nhiệm của các bên để việc phối hợp được thuận lợi.",
    image: "/images/logistics.webp",
    alt: "Không gian nhà kho và khu vực tập kết hàng hóa",
    caption: "Phối hợp rõ ràng trên từng chặng.",
  },
];

export const ARTICLES = [
  {
    id: "chon-nong-san-theo-mua",
    title: "Chọn đúng mùa, hiểu đúng sản phẩm.",
    category: "Câu chuyện mùa vụ",
    readTime: 2,
    image: "/images/hero.webp",
    alt: "Đồi chè xanh trong ánh nắng tự nhiên",
    excerpt:
      "Một danh mục nông sản phù hợp bắt đầu từ việc hiểu nhu cầu sử dụng và những thay đổi của mùa vụ.",
    sections: [
      {
        title: "Bắt đầu từ nơi sản phẩm sẽ đến",
        body: "Sản phẩm dùng cho bán lẻ, bếp ăn hay chế biến sẽ có những yêu cầu khác nhau. Hãy ghi lại mục đích sử dụng, thời điểm cần hàng và các đặc điểm bạn ưu tiên, chẳng hạn kích cỡ, độ chín hoặc hình thức bên ngoài.",
      },
      {
        title: "Trao đổi về mùa vụ và khả năng thay thế",
        body: "Thời điểm thu hoạch và nguồn hàng có thể thay đổi theo vùng trồng. Khi lên kế hoạch, hãy hỏi về giai đoạn có hàng, khả năng cung ứng dự kiến và lựa chọn thay thế nếu sản phẩm bạn cần chưa phù hợp vào thời điểm đó.",
      },
      {
        title: "Xác nhận thông tin của lô hàng",
        body: "Tên gọi chung và ảnh giới thiệu chưa thể hiện mọi đặc điểm của một lô nông sản. Trước khi đặt hàng, hai bên nên thống nhất mô tả sản phẩm, xuất xứ, quy cách và cách đánh giá khi nhận hàng; có thể trao đổi mẫu khi cần.",
      },
    ],
  },
  {
    id: "dong-goi-va-van-chuyen",
    title: "Một hành trình tốt cần cách gói phù hợp.",
    category: "Góc nhìn sản phẩm",
    readTime: 2,
    image: "/images/agri-processing-line.webp",
    alt: "Dây chuyền phân loại và đóng gói nông sản trong không gian sáng",
    excerpt:
      "Bao bì và kế hoạch giao nhận là những chi tiết nên được trao đổi cùng sản phẩm ngay từ đầu.",
    sections: [
      {
        title: "Bao bì bắt đầu từ đặc tính sản phẩm",
        body: "Trái cây, rau lá và hạt khô có những đặc điểm khác nhau. Thay vì chỉ chọn một kích cỡ thùng, hãy trao đổi về vật liệu, khối lượng mỗi đơn vị, cách sắp xếp và yêu cầu bảo quản của sản phẩm cụ thể.",
      },
      {
        title: "Nhìn vào toàn bộ chặng đường",
        body: "Thời gian từ lúc chuẩn bị hàng đến khi sử dụng là thông tin cần thiết để bàn về đóng gói. Hai bên nên làm rõ phương thức vận chuyển, các điểm trung chuyển, lịch nhận hàng và điều kiện bảo quản ở nơi nhận.",
      },
      {
        title: "Thống nhất cách nhận và kiểm tra",
        body: "Quy cách nhãn, số lượng kiện và thông tin lô hàng giúp việc đối chiếu thuận tiện hơn. Hãy thống nhất trước người nhận, cách kiểm tra, thời điểm phản hồi và đầu mối xử lý nếu có điểm cần làm rõ khi giao hàng.",
      },
    ],
  },
  {
    id: "bat-dau-don-hang-b2b",
    title: "Đơn hàng đầu tiên bắt đầu bằng sự rõ ràng.",
    category: "Kết nối đối tác",
    readTime: 2,
    image: "/images/produce.webp",
    alt: "Danh mục trái cây, hạt điều và cà phê được sắp xếp cùng nhau",
    excerpt:
      "Một bản yêu cầu ngắn gọn nhưng đủ thông tin giúp cuộc trao đổi giữa các đối tác đi vào đúng nhu cầu.",
    sections: [
      {
        title: "Mô tả điều bạn đang tìm kiếm",
        body: "Hãy bắt đầu bằng tên sản phẩm, mục đích sử dụng và khối lượng dự kiến. Nếu đã có yêu cầu về kích cỡ, cách chế biến hoặc bao bì, bạn nên ghi rõ; nếu chưa, hãy nêu những điểm cần được tư vấn thêm.",
      },
      {
        title: "Cung cấp thời gian và nơi nhận",
        body: "Thời điểm cần hàng, địa điểm nhận và tần suất mua dự kiến giúp hai bên trao đổi sát thực tế hơn. Với đơn hàng quốc tế, hãy nêu thị trường đích và những hồ sơ mà phía nhận hàng yêu cầu để cùng đối chiếu.",
      },
      {
        title: "Chốt lại nội dung đã thống nhất",
        body: "Trước khi xác nhận đơn hàng, hãy đối chiếu sản phẩm, số lượng, giá, quy cách, lịch giao và các điều kiện đã trao đổi. Một bản tổng hợp rõ ràng giúp mỗi bên biết mình cần chuẩn bị gì cho bước tiếp theo.",
      },
    ],
  },
];
