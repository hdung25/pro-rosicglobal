/**
 * UI copy for the v6 catalogue: header, group & product pages, Quick View,
 * search, private label section and the one-step quotation form.
 * Vietnamese is the source; other locales are written for B2B buyers.
 */
const COPY = {
  vi: {
    nav: { privateLabel: "Nhãn hiệu riêng", allProducts: "Tất cả sản phẩm", productsMenu: "Nhóm sản phẩm", openProducts: "Mở danh sách nhóm sản phẩm" },
    theme: { label: "Giao diện", light: "Sáng", dark: "Tối" },
    backTop: "Lên đầu trang",
    home: "Trang chủ",
    products: "Sản phẩm",
    groups: { eyebrow: "NHÓM SẢN PHẨM", title: "Chín nhóm hàng xuất khẩu.", lead: "Chọn một nhóm để xem toàn bộ sản phẩm con, thông số tham chiếu và gửi yêu cầu báo giá ngay trên trang.", count: (n) => (n ? `${n} sản phẩm` : "Đang cập nhật"), quickView: "Xem nhanh", openGroup: "Xem nhóm" },
    finder: { eyebrow: "DANH MỤC SẢN PHẨM", title: "Tìm đúng sản phẩm bạn cần.", lead: "Lọc theo nhóm hoặc nhập tên sản phẩm rồi bấm Tìm.", all: "Tất cả", filter: "Lọc theo nhóm sản phẩm", search: "Nhập tên sản phẩm hoặc nhóm…", searchLabel: "Tìm sản phẩm", submit: "Tìm", clear: "Xóa từ khóa", results: (n, q) => (q ? `${n} kết quả cho “${q}”` : `${n} sản phẩm`), none: "Không tìm thấy sản phẩm phù hợp", noneBody: (q) => `Không có sản phẩm hoặc nhóm nào khớp với “${q}”. Thử tên ngắn hơn, ví dụ “tiêu”, “quế”, “S18”.`, reset: "Xem tất cả sản phẩm", more: (n) => `Xem thêm ${n} sản phẩm` },
    card: { code: "Mã sản phẩm", view: "Xem chi tiết" },
    quick: { title: (g) => `Sản phẩm trong nhóm ${g}`, close: "Đóng xem nhanh", openGroup: "Mở trang nhóm", empty: "Danh sách sản phẩm của nhóm này đang được bổ sung." },
    group: { breadcrumb: "Sản phẩm", eyebrow: "NHÓM SẢN PHẨM", listTitle: "Sản phẩm trong nhóm", quote: "Yêu cầu báo giá nhóm này", other: "Nhóm sản phẩm khác", emptyTitle: "Danh sách đang được bổ sung", emptyBody: "Chúng tôi đang hoàn thiện danh sách chi tiết cho nhóm này. Gửi yêu cầu để nhận danh mục hiện có.", notFound: "Không tìm thấy nhóm sản phẩm", back: "Quay lại danh mục" },
    product: { specs: "Thông số kỹ thuật", quote: "Yêu cầu báo giá", whatsapp: "Hỏi nhanh qua WhatsApp", related: "Sản phẩm cùng nhóm", relatedLead: "Xem tiếp các quy cách khác trong cùng nhóm.", notFound: "Không tìm thấy sản phẩm", zoom: "Phóng to ảnh", imageNote: "Ảnh minh họa. Xuất xứ, mùa vụ và quy cách được xác nhận theo từng lô." },
    privateLabel: {
      eyebrow: "NHÃN HIỆU RIÊNG · OEM/ODM",
      imageAlt: "Hạt điều trong bát gốm cạnh túi kraft dành cho bao bì nhãn riêng",
      title: "Sản phẩm mang thương hiệu của bạn.",
      lead: "Từ nguyên liệu đến bao bì hoàn chỉnh: chúng tôi phát triển quy cách, đóng gói và in nhãn theo thương hiệu của đối tác cho cà phê, gia vị, cơm dừa, hạt điều và gạo.",
      steps: [
        { title: "Chọn sản phẩm & quy cách", body: "Chốt sản phẩm, grade, khối lượng tịnh và thị trường đích." },
        { title: "Thiết kế bao bì", body: "Túi, hộp, thùng in nhãn riêng; artwork được duyệt trước sản xuất." },
        { title: "Mẫu duyệt & hồ sơ", body: "Gửi mẫu, COA và hồ sơ nhãn theo quy định nước nhập khẩu." },
        { title: "Sản xuất & giao hàng", body: "MOQ, lịch sản xuất và điều kiện giao hàng được xác nhận rõ ràng." },
      ],
      cta: "Trao đổi dự án nhãn riêng",
    },
    form: {
      title: "Gửi yêu cầu báo giá",
      lead: "Điền thông tin, xem lại tin nhắn đã soạn sẵn rồi bấm gửi qua WhatsApp hoặc Email.",
      product: "Sản phẩm quan tâm",
      general: "Nhiều sản phẩm / chưa chọn",
      quantity: "Sản lượng dự kiến",
      quantityPh: "",
      market: "Thị trường / cảng nhận",
      marketPh: "",
      message: "Nội dung tin nhắn (có thể chỉnh sửa)",
      messageHelp: "Tin nhắn tự cập nhật theo thông tin bạn nhập. Bấm vào ô để chỉnh sửa trước khi gửi.",
      sendWhatsapp: "Gửi qua WhatsApp",
      sendEmail: "Gửi qua Email",
      copy: "Sao chép tin nhắn",
      copied: "Đã sao chép tin nhắn",
      zalo: "Mở Zalo (dán tin nhắn đã sao chép)",
      edited: "Bạn đã chỉnh tin nhắn — thông tin mới nhập sẽ không ghi đè.",
      resetMessage: "Soạn lại theo thông tin mới",
      sent: "Đã mở ứng dụng. Bấm Gửi trong WhatsApp/Email để hoàn tất.",
      greeting: "Xin chào Hồng Tâm Rosic Global,",
      intro: "Tôi muốn nhận báo giá cho yêu cầu sau:",
      closing: "Xin cảm ơn.",
      lines: { name: "Họ tên", company: "Liên hệ", phone: "Điện thoại/WhatsApp", email: "Email", product: "Sản phẩm", quantity: "Sản lượng", market: "Thị trường/cảng nhận", note: "Ghi chú" },
      sticky: "Yêu cầu báo giá",
    },
  },
  en: {
    nav: { privateLabel: "Private Label", allProducts: "All products", productsMenu: "Product groups", openProducts: "Open the product group list" },
    theme: { label: "Theme", light: "Light", dark: "Dark" },
    backTop: "Back to top",
    home: "Home",
    products: "Products",
    groups: { eyebrow: "PRODUCT GROUPS", title: "Nine export product groups.", lead: "Open a group to see every product in it, reference specifications and send a quotation request on the same page.", count: (n) => (n ? `${n} products` : "Coming soon"), quickView: "Quick view", openGroup: "View group" },
    finder: { eyebrow: "PRODUCT CATALOGUE", title: "Find the exact product you need.", lead: "Filter by group or type a product name and press Search.", all: "All", filter: "Filter by product group", search: "Product or group name…", searchLabel: "Search products", submit: "Search", clear: "Clear search", results: (n, q) => (q ? `${n} results for “${q}”` : `${n} products`), none: "No matching product found", noneBody: (q) => `No product or group matches “${q}”. Try a shorter term such as “pepper”, “cassia” or “S18”.`, reset: "View all products", more: (n) => `Show ${n} more products` },
    card: { code: "Product code", view: "View details" },
    quick: { title: (g) => `Products in ${g}`, close: "Close quick view", openGroup: "Open group page", empty: "The product list for this group is being prepared." },
    group: { breadcrumb: "Products", eyebrow: "PRODUCT GROUP", listTitle: "Products in this group", quote: "Request a quotation for this group", other: "Other product groups", emptyTitle: "List in preparation", emptyBody: "We are finalising the detailed list for this group. Send a request to receive the current range.", notFound: "Product group not found", back: "Back to the catalogue" },
    product: { specs: "Specifications", quote: "Request a quotation", whatsapp: "Quick question on WhatsApp", related: "More from this group", relatedLead: "Continue with other specifications in the same group.", notFound: "Product not found", zoom: "Enlarge image", imageNote: "Illustrative image. Origin, season and specification are confirmed for each lot." },
    privateLabel: {
      eyebrow: "PRIVATE LABEL · OEM/ODM",
      imageAlt: "Cashew kernels in a ceramic bowl beside a kraft pouch for private-label packing",
      title: "Products under your own brand.",
      lead: "From raw material to finished pack: we develop the specification, packing and label for your brand across coffee, spices, desiccated coconut, cashew and rice.",
      steps: [
        { title: "Product & specification", body: "Agree the product, grade, net weight and destination market." },
        { title: "Packaging design", body: "Private-print pouches, boxes and cartons; artwork approved before production." },
        { title: "Approved sample & documents", body: "Samples, COA and label documents for the importing country." },
        { title: "Production & shipment", body: "MOQ, production schedule and delivery terms confirmed in writing." },
      ],
      cta: "Discuss a private label project",
    },
    form: {
      title: "Request a quotation",
      lead: "Fill in your details, review the prepared message and send it via WhatsApp or email.",
      product: "Product of interest",
      general: "Several products / not decided",
      quantity: "Indicative quantity",
      quantityPh: "",
      market: "Market / destination port",
      marketPh: "",
      message: "Message (editable)",
      messageHelp: "The message updates from your details. Click inside to edit it before sending.",
      sendWhatsapp: "Send via WhatsApp",
      sendEmail: "Send via email",
      copy: "Copy message",
      copied: "Message copied",
      zalo: "Open Zalo (paste the copied message)",
      edited: "You edited the message — new details will not overwrite it.",
      resetMessage: "Rebuild from my details",
      sent: "The app is open. Press Send in WhatsApp/email to finish.",
      greeting: "Hello Hong Tam Rosic Global,",
      intro: "I would like a quotation for the following request:",
      closing: "Thank you.",
      lines: { name: "Name", company: "Contact", phone: "Phone/WhatsApp", email: "Email", product: "Product", quantity: "Quantity", market: "Market/port", note: "Notes" },
      sticky: "Request a quotation",
    },
  },
};

const PARTIAL = {
  zh: { nav: { privateLabel: "自有品牌", allProducts: "全部产品", productsMenu: "产品类别", openProducts: "打开产品类别列表" }, theme: { label: "主题", light: "浅色", dark: "深色" }, backTop: "返回顶部", home: "首页", products: "产品", groups: { eyebrow: "产品类别", title: "九大出口产品类别。", lead: "打开类别即可查看全部产品、参考规格，并在同一页面提交询价。", count: (n) => (n ? `${n} 款产品` : "即将更新"), quickView: "快速查看", openGroup: "查看类别" }, finder: { eyebrow: "产品目录", title: "快速找到所需产品。", lead: "按类别筛选，或输入产品名称后点击搜索。", all: "全部", filter: "按产品类别筛选", search: "输入产品或类别名称…", searchLabel: "搜索产品", submit: "搜索", clear: "清除关键词", results: (n, q) => (q ? `“${q}”共 ${n} 个结果` : `${n} 款产品`), none: "未找到匹配产品", noneBody: (q) => `没有与“${q}”匹配的产品或类别，请尝试更短的关键词。`, reset: "查看全部产品", more: (n) => `再显示 ${n} 款产品` }, card: { code: "产品编号", view: "查看详情" }, quick: { title: (g) => `${g} 类产品`, close: "关闭快速查看", openGroup: "打开类别页面", empty: "该类别的产品列表正在完善中。" }, group: { breadcrumb: "产品", eyebrow: "产品类别", listTitle: "本类别产品", quote: "为此类别询价", other: "其他产品类别", emptyTitle: "列表完善中", emptyBody: "我们正在完善该类别的详细列表，欢迎询价获取现有产品。", notFound: "未找到产品类别", back: "返回目录" }, product: { specs: "技术参数", quote: "索取报价", whatsapp: "WhatsApp 快速咨询", related: "同类别产品", relatedLead: "继续查看同类别的其他规格。", notFound: "未找到产品", zoom: "放大图片", imageNote: "图片仅供参考，原产地、产季及规格以每批次确认为准。" }, form: { title: "索取报价", lead: "填写信息，确认已生成的消息，然后通过 WhatsApp 或电子邮件发送。", product: "关注产品", general: "多个产品 / 尚未确定", quantity: "预计数量", market: "市场 / 目的港", message: "消息内容（可编辑）", messageHelp: "消息会根据您填写的信息自动更新，可点击修改后再发送。", sendWhatsapp: "通过 WhatsApp 发送", sendEmail: "通过电子邮件发送", copy: "复制消息", copied: "已复制消息", zalo: "打开 Zalo（粘贴已复制消息）", edited: "您已修改消息，新填写的信息不会覆盖。", resetMessage: "按信息重新生成", sent: "应用已打开，请在 WhatsApp/邮件中点击发送。", sticky: "索取报价" } },
  ko: { nav: { privateLabel: "자체 브랜드", allProducts: "전체 제품", productsMenu: "제품군", openProducts: "제품군 목록 열기" }, theme: { label: "테마", light: "라이트", dark: "다크" }, backTop: "맨 위로", home: "홈", products: "제품", groups: { eyebrow: "제품군", title: "9개 수출 제품군.", lead: "제품군을 열어 모든 제품과 참고 사양을 확인하고 같은 페이지에서 견적을 요청하세요.", count: (n) => (n ? `${n}개 제품` : "준비 중"), quickView: "빠른 보기", openGroup: "제품군 보기" }, finder: { eyebrow: "제품 카탈로그", title: "필요한 제품을 정확히 찾으세요.", lead: "제품군으로 필터하거나 제품명을 입력한 뒤 검색을 누르세요.", all: "전체", filter: "제품군 필터", search: "제품 또는 제품군 이름…", searchLabel: "제품 검색", submit: "검색", clear: "검색어 지우기", results: (n, q) => (q ? `“${q}” 검색 결과 ${n}개` : `${n}개 제품`), none: "일치하는 제품이 없습니다", noneBody: (q) => `“${q}”와 일치하는 제품이나 제품군이 없습니다. 더 짧은 검색어를 입력해 보세요.`, reset: "전체 제품 보기", more: (n) => `${n}개 더 보기` }, card: { code: "제품 코드", view: "상세 보기" }, quick: { title: (g) => `${g} 제품`, close: "빠른 보기 닫기", openGroup: "제품군 페이지 열기", empty: "이 제품군의 목록을 준비하고 있습니다." }, group: { breadcrumb: "제품", eyebrow: "제품군", listTitle: "이 제품군의 제품", quote: "이 제품군 견적 요청", other: "다른 제품군", emptyTitle: "목록 준비 중", emptyBody: "상세 목록을 준비하고 있습니다. 요청하시면 현재 제품군을 보내드립니다.", notFound: "제품군을 찾을 수 없습니다", back: "카탈로그로 돌아가기" }, product: { specs: "사양", quote: "견적 요청", whatsapp: "WhatsApp 빠른 문의", related: "같은 제품군의 제품", relatedLead: "같은 제품군의 다른 규격을 계속 확인하세요.", notFound: "제품을 찾을 수 없습니다", zoom: "이미지 확대", imageNote: "참고용 이미지입니다. 원산지, 시즌, 규격은 로트별로 확인됩니다." }, form: { title: "견적 요청", lead: "정보를 입력하고 작성된 메시지를 확인한 뒤 WhatsApp 또는 이메일로 보내세요.", product: "관심 제품", general: "여러 제품 / 미정", quantity: "예상 수량", market: "시장 / 도착항", message: "메시지 (수정 가능)", messageHelp: "입력한 정보에 따라 메시지가 자동으로 작성됩니다. 클릭하여 수정할 수 있습니다.", sendWhatsapp: "WhatsApp으로 보내기", sendEmail: "이메일로 보내기", copy: "메시지 복사", copied: "메시지를 복사했습니다", zalo: "Zalo 열기 (복사한 메시지 붙여넣기)", edited: "메시지를 수정하셨습니다. 새 정보로 덮어쓰지 않습니다.", resetMessage: "정보로 다시 작성", sent: "앱이 열렸습니다. WhatsApp/이메일에서 보내기를 누르세요.", sticky: "견적 요청" } },
  ja: { nav: { privateLabel: "プライベートブランド", allProducts: "すべての商品", productsMenu: "商品グループ", openProducts: "商品グループ一覧を開く" }, theme: { label: "表示", light: "ライト", dark: "ダーク" }, backTop: "ページ上部へ", home: "ホーム", products: "商品", groups: { eyebrow: "商品グループ", title: "9つの輸出商品グループ。", lead: "グループを開くと全商品と参考仕様を確認でき、同じページで見積もりを依頼できます。", count: (n) => (n ? `${n}商品` : "準備中"), quickView: "クイックビュー", openGroup: "グループを見る" }, finder: { eyebrow: "商品カタログ", title: "必要な商品をすばやく。", lead: "グループで絞り込むか、商品名を入力して検索を押してください。", all: "すべて", filter: "商品グループで絞り込む", search: "商品名またはグループ名…", searchLabel: "商品を検索", submit: "検索", clear: "検索語を消去", results: (n, q) => (q ? `「${q}」の検索結果 ${n}件` : `${n}商品`), none: "該当する商品がありません", noneBody: (q) => `「${q}」に一致する商品やグループはありません。短い語で検索してください。`, reset: "すべての商品を見る", more: (n) => `さらに${n}商品を表示` }, card: { code: "商品コード", view: "詳細を見る" }, quick: { title: (g) => `${g}の商品`, close: "クイックビューを閉じる", openGroup: "グループページを開く", empty: "このグループの商品一覧は準備中です。" }, group: { breadcrumb: "商品", eyebrow: "商品グループ", listTitle: "このグループの商品", quote: "このグループの見積もりを依頼", other: "その他の商品グループ", emptyTitle: "一覧を準備中", emptyBody: "詳細一覧を準備しています。ご依頼いただければ現在の商品をご案内します。", notFound: "商品グループが見つかりません", back: "カタログに戻る" }, product: { specs: "仕様", quote: "見積もりを依頼", whatsapp: "WhatsAppで問い合わせ", related: "同じグループの商品", relatedLead: "同じグループの他の規格もご覧ください。", notFound: "商品が見つかりません", zoom: "画像を拡大", imageNote: "イメージ画像です。原産地、時期、仕様はロットごとに確認します。" }, form: { title: "見積もりを依頼", lead: "情報を入力し、作成されたメッセージを確認して WhatsApp またはメールで送信してください。", product: "ご希望の商品", general: "複数商品 / 未定", quantity: "予定数量", market: "市場 / 仕向港", message: "メッセージ（編集可）", messageHelp: "入力内容に合わせてメッセージが自動作成されます。クリックして編集できます。", sendWhatsapp: "WhatsAppで送信", sendEmail: "メールで送信", copy: "メッセージをコピー", copied: "コピーしました", zalo: "Zaloを開く（コピーした文を貼り付け）", edited: "メッセージを編集しました。新しい入力で上書きされません。", resetMessage: "入力内容で作り直す", sent: "アプリを開きました。WhatsApp/メールで送信を押してください。", sticky: "見積もりを依頼" } },
  ar: { nav: { privateLabel: "علامة تجارية خاصة", allProducts: "كل المنتجات", productsMenu: "مجموعات المنتجات", openProducts: "فتح قائمة مجموعات المنتجات" }, theme: { label: "المظهر", light: "فاتح", dark: "داكن" }, backTop: "العودة للأعلى", home: "الرئيسية", products: "المنتجات", groups: { eyebrow: "مجموعات المنتجات", title: "تسع مجموعات منتجات للتصدير.", lead: "افتح مجموعة لعرض جميع منتجاتها والمواصفات المرجعية وإرسال طلب عرض السعر من الصفحة نفسها.", count: (n) => (n ? `${n} منتجات` : "قريبًا"), quickView: "عرض سريع", openGroup: "عرض المجموعة" }, finder: { eyebrow: "كتالوج المنتجات", title: "اعثر على المنتج المناسب.", lead: "صفِّ حسب المجموعة أو اكتب اسم المنتج ثم اضغط بحث.", all: "الكل", filter: "تصفية حسب المجموعة", search: "اسم المنتج أو المجموعة…", searchLabel: "ابحث عن منتج", submit: "بحث", clear: "مسح البحث", results: (n, q) => (q ? `${n} نتيجة لـ «${q}»` : `${n} منتجات`), none: "لم يتم العثور على منتج مطابق", noneBody: (q) => `لا يوجد منتج أو مجموعة تطابق «${q}». جرّب كلمة أقصر.`, reset: "عرض كل المنتجات", more: (n) => `عرض ${n} منتجات أخرى` }, card: { code: "رمز المنتج", view: "عرض التفاصيل" }, quick: { title: (g) => `منتجات ${g}`, close: "إغلاق العرض السريع", openGroup: "فتح صفحة المجموعة", empty: "قائمة منتجات هذه المجموعة قيد الإعداد." }, group: { breadcrumb: "المنتجات", eyebrow: "مجموعة منتجات", listTitle: "منتجات هذه المجموعة", quote: "طلب عرض سعر لهذه المجموعة", other: "مجموعات أخرى", emptyTitle: "القائمة قيد الإعداد", emptyBody: "نعمل على إعداد القائمة التفصيلية. أرسل طلبًا لتصلك المنتجات المتاحة.", notFound: "المجموعة غير موجودة", back: "العودة إلى الكتالوج" }, product: { specs: "المواصفات", quote: "طلب عرض سعر", whatsapp: "استفسار سريع عبر WhatsApp", related: "من المجموعة نفسها", relatedLead: "تابع مواصفات أخرى في المجموعة نفسها.", notFound: "المنتج غير موجود", zoom: "تكبير الصورة", imageNote: "صورة توضيحية. يتم تأكيد المنشأ والموسم والمواصفات لكل دفعة." }, form: { title: "طلب عرض سعر", lead: "املأ بياناتك وراجع الرسالة الجاهزة ثم أرسلها عبر WhatsApp أو البريد الإلكتروني.", product: "المنتج المطلوب", general: "عدة منتجات / غير محدد", quantity: "الكمية التقديرية", market: "السوق / ميناء الوصول", message: "نص الرسالة (قابل للتعديل)", messageHelp: "تتحدّث الرسالة تلقائيًا من بياناتك. اضغط داخلها لتعديلها قبل الإرسال.", sendWhatsapp: "إرسال عبر WhatsApp", sendEmail: "إرسال عبر البريد", copy: "نسخ الرسالة", copied: "تم نسخ الرسالة", zalo: "فتح Zalo (الصق الرسالة المنسوخة)", edited: "عدّلت الرسالة — لن تُستبدل بالبيانات الجديدة.", resetMessage: "إعادة الإنشاء من بياناتي", sent: "تم فتح التطبيق. اضغط إرسال لإكمال الطلب.", sticky: "طلب عرض سعر" } },
  fr: { nav: { privateLabel: "Marque privée", allProducts: "Tous les produits", productsMenu: "Familles de produits", openProducts: "Ouvrir la liste des familles" }, theme: { label: "Thème", light: "Clair", dark: "Sombre" }, backTop: "Haut de page", home: "Accueil", products: "Produits", groups: { eyebrow: "FAMILLES DE PRODUITS", title: "Neuf familles de produits export.", lead: "Ouvrez une famille pour voir tous ses produits, les spécifications de référence et demander un devis sur la même page.", count: (n) => (n ? `${n} produits` : "Bientôt"), quickView: "Aperçu rapide", openGroup: "Voir la famille" }, finder: { eyebrow: "CATALOGUE PRODUITS", title: "Trouvez le produit exact.", lead: "Filtrez par famille ou saisissez un nom puis appuyez sur Rechercher.", all: "Tous", filter: "Filtrer par famille", search: "Nom du produit ou de la famille…", searchLabel: "Rechercher des produits", submit: "Rechercher", clear: "Effacer", results: (n, q) => (q ? `${n} résultats pour « ${q} »` : `${n} produits`), none: "Aucun produit correspondant", noneBody: (q) => `Aucun produit ni famille ne correspond à « ${q} ». Essayez un terme plus court.`, reset: "Voir tous les produits", more: (n) => `Afficher ${n} produits de plus` }, card: { code: "Code produit", view: "Voir le détail" }, quick: { title: (g) => `Produits : ${g}`, close: "Fermer l’aperçu", openGroup: "Ouvrir la page famille", empty: "La liste de cette famille est en préparation." }, group: { breadcrumb: "Produits", eyebrow: "FAMILLE DE PRODUITS", listTitle: "Produits de cette famille", quote: "Demander un devis pour cette famille", other: "Autres familles", emptyTitle: "Liste en préparation", emptyBody: "Nous finalisons la liste détaillée. Envoyez une demande pour recevoir la gamme actuelle.", notFound: "Famille introuvable", back: "Retour au catalogue" }, product: { specs: "Spécifications", quote: "Demander un devis", whatsapp: "Question rapide sur WhatsApp", related: "Dans la même famille", relatedLead: "Découvrez les autres spécifications de cette famille.", notFound: "Produit introuvable", zoom: "Agrandir l’image", imageNote: "Image d’illustration. Origine, saison et spécification confirmées pour chaque lot." }, form: { title: "Demander un devis", lead: "Renseignez vos coordonnées, vérifiez le message préparé puis envoyez-le par WhatsApp ou e-mail.", product: "Produit souhaité", general: "Plusieurs produits / à définir", quantity: "Quantité indicative", market: "Marché / port de destination", message: "Message (modifiable)", messageHelp: "Le message se met à jour avec vos informations. Cliquez pour le modifier avant l’envoi.", sendWhatsapp: "Envoyer par WhatsApp", sendEmail: "Envoyer par e-mail", copy: "Copier le message", copied: "Message copié", zalo: "Ouvrir Zalo (coller le message)", edited: "Vous avez modifié le message — les nouvelles informations ne l’écraseront pas.", resetMessage: "Régénérer depuis mes informations", sent: "L’application est ouverte. Appuyez sur Envoyer pour terminer.", sticky: "Demander un devis" } },
  de: { nav: { privateLabel: "Eigenmarke", allProducts: "Alle Produkte", productsMenu: "Produktgruppen", openProducts: "Liste der Produktgruppen öffnen" }, theme: { label: "Darstellung", light: "Hell", dark: "Dunkel" }, backTop: "Nach oben", home: "Startseite", products: "Produkte", groups: { eyebrow: "PRODUKTGRUPPEN", title: "Neun Export-Produktgruppen.", lead: "Öffnen Sie eine Gruppe, um alle Produkte und Referenzspezifikationen zu sehen und direkt ein Angebot anzufragen.", count: (n) => (n ? `${n} Produkte` : "In Vorbereitung"), quickView: "Schnellansicht", openGroup: "Gruppe ansehen" }, finder: { eyebrow: "PRODUKTKATALOG", title: "Das passende Produkt finden.", lead: "Nach Gruppe filtern oder Produktnamen eingeben und Suchen drücken.", all: "Alle", filter: "Nach Produktgruppe filtern", search: "Produkt- oder Gruppenname…", searchLabel: "Produkte suchen", submit: "Suchen", clear: "Suche löschen", results: (n, q) => (q ? `${n} Treffer für „${q}“` : `${n} Produkte`), none: "Kein passendes Produkt gefunden", noneBody: (q) => `Kein Produkt und keine Gruppe passt zu „${q}“. Versuchen Sie einen kürzeren Begriff.`, reset: "Alle Produkte ansehen", more: (n) => `${n} weitere Produkte anzeigen` }, card: { code: "Produktcode", view: "Details ansehen" }, quick: { title: (g) => `Produkte: ${g}`, close: "Schnellansicht schließen", openGroup: "Gruppenseite öffnen", empty: "Die Produktliste dieser Gruppe wird vorbereitet." }, group: { breadcrumb: "Produkte", eyebrow: "PRODUKTGRUPPE", listTitle: "Produkte dieser Gruppe", quote: "Angebot für diese Gruppe anfragen", other: "Weitere Produktgruppen", emptyTitle: "Liste in Vorbereitung", emptyBody: "Wir erstellen die Detailliste. Senden Sie eine Anfrage, um das aktuelle Sortiment zu erhalten.", notFound: "Produktgruppe nicht gefunden", back: "Zurück zum Katalog" }, product: { specs: "Spezifikationen", quote: "Angebot anfragen", whatsapp: "Kurze Frage per WhatsApp", related: "Aus derselben Gruppe", relatedLead: "Weitere Spezifikationen dieser Gruppe ansehen.", notFound: "Produkt nicht gefunden", zoom: "Bild vergrößern", imageNote: "Illustratives Bild. Herkunft, Saison und Spezifikation werden je Charge bestätigt." }, form: { title: "Angebot anfragen", lead: "Angaben ausfüllen, vorbereitete Nachricht prüfen und per WhatsApp oder E-Mail senden.", product: "Gewünschtes Produkt", general: "Mehrere Produkte / offen", quantity: "Richtmenge", market: "Markt / Zielhafen", message: "Nachricht (bearbeitbar)", messageHelp: "Die Nachricht wird aus Ihren Angaben erstellt. Klicken Sie hinein, um sie vor dem Senden anzupassen.", sendWhatsapp: "Per WhatsApp senden", sendEmail: "Per E-Mail senden", copy: "Nachricht kopieren", copied: "Nachricht kopiert", zalo: "Zalo öffnen (kopierte Nachricht einfügen)", edited: "Sie haben die Nachricht bearbeitet — neue Angaben überschreiben sie nicht.", resetMessage: "Aus meinen Angaben neu erstellen", sent: "Die App ist geöffnet. Drücken Sie Senden, um abzuschließen.", sticky: "Angebot anfragen" } },
};

function deepMerge(base, extra) {
  if (!extra) return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    out[key] = value && typeof value === "object" && !Array.isArray(value) && typeof value !== "function" && base[key] && typeof base[key] === "object"
      ? deepMerge(base[key], value)
      : value;
  }
  return out;
}

/** English fills any key a partial locale has not written yet (e.g. private label steps). */
export function catalogCopyFor(language = "vi") {
  if (COPY[language]) return COPY[language];
  return deepMerge(COPY.en, PARTIAL[language]);
}
