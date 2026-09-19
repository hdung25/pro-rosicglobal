import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { CONTACT } from "../contact-config";

const GENERAL_REQUEST = "Đơn hàng tổng hợp theo mùa vụ";
const PARTNERSHIP_REQUEST = "Hợp tác vùng trồng & cung ứng";

function requestText(request) {
  return [
    "YÊU CẦU BÁO GIÁ - HỒNG TÂM ROSIC GLOBAL",
    "",
    `Họ và tên: ${request.name}`,
    `Số điện thoại / WhatsApp: ${request.phone}`,
    `Email liên hệ: ${request.email}`,
    `Sản phẩm quan tâm: ${request.product}`,
    "",
    "Nội dung yêu cầu:",
    request.message ||
      "Vui lòng trao đổi thêm về quy cách và nhu cầu cung ứng.",
  ].join("\n");
}

export default function Contact({
  prefilledProduct = "",
  prefillKey = 0,
  products = [],
}) {
  const productSelect = useRef(null);
  const resultPanel = useRef(null);
  const [draft, setDraft] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");
  const productTitles = products.map((product) => product.title);
  const initialProduct = productTitles.includes(prefilledProduct)
    ? prefilledProduct
    : GENERAL_REQUEST;
  const visibleDraft =
    draft?.prefill === prefilledProduct && draft?.prefillKey === prefillKey
      ? draft
      : null;
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT.email)
    ? CONTACT.email
    : "";
  const phone = /^\+?[\d\s().-]+$/.test(CONTACT.phone) ? CONTACT.phone : "";
  const zalo = /^https:\/\/(?:zalo\.me|chat\.zalo\.me)(?:\/|$)/i.test(
    CONTACT.zalo,
  )
    ? CONTACT.zalo
    : "";

  useEffect(() => {
    if (productSelect.current && prefilledProduct) {
      const available = Array.from(productSelect.current.options).some(
        (option) => option.value === prefilledProduct,
      );
      if (available) productSelect.current.value = prefilledProduct;
    }
  }, [prefilledProduct, prefillKey]);

  useEffect(() => {
    if (visibleDraft) resultPanel.current?.focus({ preventScroll: true });
  }, [visibleDraft]);

  function clearDraft() {
    if (draft) setDraft(null);
    if (copyStatus) setCopyStatus("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const request = Object.fromEntries(
      ["name", "phone", "email", "product", "message"].map((field) => [
        field,
        String(fields.get(field) || "").trim(),
      ]),
    );
    const phoneField = form.elements.namedItem("phone");
    const phoneDigits = request.phone.replace(/\D/g, "");
    const isPhoneValid =
      /^\+?[\d\s().-]+$/.test(request.phone) &&
      phoneDigits.length >= 8 &&
      phoneDigits.length <= 15;
    phoneField.setCustomValidity(
      isPhoneValid
        ? ""
        : "Vui lòng nhập số điện thoại gồm 8–15 chữ số, có thể kèm mã quốc gia.",
    );
    const nameField = form.elements.namedItem("name");
    nameField.setCustomValidity(
      request.name ? "" : "Vui lòng nhập họ và tên của bạn.",
    );
    if (!form.reportValidity()) return;

    setDraft({
      ...request,
      text: requestText(request),
      prefill: prefilledProduct,
      prefillKey,
    });
    setCopyStatus("");
  }

  function downloadRequest() {
    if (!visibleDraft) return;
    const file = new Blob(["\uFEFF", visibleDraft.text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yeu-cau-bao-gia-hong-tam.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyRequest() {
    if (!visibleDraft) return;
    try {
      await navigator.clipboard.writeText(visibleDraft.text);
      setCopyStatus("Đã sao chép nội dung yêu cầu.");
    } catch {
      setCopyStatus(
        "Chưa thể sao chép tự động. Bạn có thể chọn nội dung bên dưới hoặc tải bản yêu cầu.",
      );
    }
  }

  return (
    <section
      id="contact"
      className="contact-section section-pad"
      aria-labelledby="contact-heading"
    >
      <div className="container contact-grid">
        <div className="contact-intro">
          <h2 id="contact-heading" className="section-heading">
            Cùng mở ra
            <br />
            <span>mùa vụ mới.</span>
          </h2>
          <p>
            Một cuộc trao đổi hôm nay, một cơ hội hợp tác ngày mai. Chia sẻ nhu
            cầu của bạn để bắt đầu câu chuyện cung ứng cùng Hồng Tâm.
          </p>
          <ul className="contact-points">
            <li>
              <ArrowUpRight size={20} aria-hidden="true" />
              <span>
                <strong>Dành cho đối tác B2B</strong>
                <br />
                Nhà nhập khẩu, nhà phân phối và đơn vị thu mua.
              </span>
            </li>
            <li>
              <ArrowUpRight size={20} aria-hidden="true" />
              <span>
                <strong>Bắt đầu từ nhu cầu thực tế</strong>
                <br />
                Sản phẩm, sản lượng, quy cách và thị trường của bạn.
              </span>
            </li>
          </ul>
          {(email || phone || zalo) && (
            <div className="contact-channels">
              {email && (
                <a href={`mailto:${email}`}>
                  <Mail size={18} aria-hidden="true" />
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
              )}
              {zalo && (
                <a href={zalo} target="_blank" rel="noopener noreferrer">
                  Trao đổi qua Zalo{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
          <p className="form-note">
            Thông tin được dùng để tạo bản yêu cầu ngay trên thiết bị của bạn.
            Chỉ khi bạn chủ động gửi qua email hoặc kênh liên hệ, nội dung mới
            được chuyển đi.
          </p>
        </div>

        <div className="contact-form">
          <h3>Hãy kể về nhu cầu của bạn.</h3>
          <form onSubmit={handleSubmit} onChange={clearDraft}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="contact-name">
                  Họ và tên <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tên của bạn"
                  required
                  maxLength={100}
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                />
              </div>
              <div className="field">
                <label htmlFor="contact-phone">
                  Số điện thoại / WhatsApp <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Số điện thoại kèm mã quốc gia"
                  required
                  minLength={8}
                  maxLength={25}
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                />
              </div>
              <div className="field">
                <label htmlFor="contact-email">
                  Email liên hệ <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email của bạn hoặc doanh nghiệp"
                  required
                  maxLength={200}
                />
              </div>
              <div className="field">
                <label htmlFor="contact-product">Sản phẩm quan tâm</label>
                <select
                  ref={productSelect}
                  id="contact-product"
                  name="product"
                  defaultValue={initialProduct}
                >
                  <option value={GENERAL_REQUEST}>{GENERAL_REQUEST}</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.title}>
                      {product.title}
                    </option>
                  ))}
                  <option value={PARTNERSHIP_REQUEST}>
                    {PARTNERSHIP_REQUEST}
                  </option>
                </select>
              </div>
              <div className="field field-full">
                <label htmlFor="contact-message">Yêu cầu chi tiết</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  maxLength={4000}
                  placeholder="Sản lượng dự kiến, quy cách đóng gói, nơi nhận và thời gian mong muốn…"
                />
              </div>
            </div>
            <button type="submit" className="button button-primary">
              {email ? "Soạn email yêu cầu" : "Tạo yêu cầu báo giá"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
            <p id="contact-form-note" className="form-note">
              Các mục có dấu * là bắt buộc. Bạn có thể kiểm tra nội dung trước
              khi gửi.
            </p>
          </form>

          {visibleDraft && (
            <div
              className="request-result"
              ref={resultPanel}
              tabIndex={-1}
              role="region"
              aria-labelledby="request-result-title"
            >
              <h4 id="request-result-title">
                <Check size={19} aria-hidden="true" />
                Bản yêu cầu đã sẵn sàng.
              </h4>
              <p>
                {email
                  ? "Yêu cầu chưa được gửi. Kiểm tra nội dung bên dưới, sau đó mở ứng dụng email để hoàn tất việc gửi."
                  : "Yêu cầu chưa được gửi. Bạn có thể tải xuống và gửi cho đầu mối Hồng Tâm đang trao đổi."}
              </p>
              <pre className="request-summary">{visibleDraft.text}</pre>
              <div className="request-actions">
                {email && (
                  <a
                    className="button button-primary"
                    href={`mailto:${email}?subject=${encodeURIComponent(`Yêu cầu báo giá - ${visibleDraft.product}`)}&body=${encodeURIComponent(visibleDraft.text)}`}
                  >
                    <Mail size={17} aria-hidden="true" />
                    Mở ứng dụng email
                  </a>
                )}
                <button
                  type="button"
                  className="button button-outline"
                  onClick={downloadRequest}
                >
                  <ArrowDownToLine size={17} aria-hidden="true" />
                  Tải yêu cầu .txt
                </button>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={copyRequest}
                >
                  <Copy size={17} aria-hidden="true" />
                  Sao chép nội dung
                </button>
              </div>
              {email && (
                <p className="form-note">
                  Nếu thiết bị chưa cài ứng dụng email, hãy tải hoặc sao chép
                  nội dung và gửi đến {email}.
                </p>
              )}
              <p className="form-note" role="status" aria-live="polite">
                {copyStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
