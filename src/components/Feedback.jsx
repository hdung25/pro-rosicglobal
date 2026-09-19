import { useState } from "react";
import { Quote } from "lucide-react";
import "./Feedback.css";

// Clearly labelled layout samples, never attributed to real people or businesses.
const SAMPLES = [
  {
    role: "Đối tác phân phối",
    initials: "PP",
    topic: "Danh mục sản phẩm",
    text: "Một danh mục rõ ràng giúp chúng tôi dễ chọn sản phẩm phù hợp cho từng mùa và từng nhóm khách hàng.",
  },
  {
    role: "Đơn vị bán lẻ",
    initials: "BL",
    topic: "Thông tin sản phẩm",
    text: "Chúng tôi trân trọng cách giới thiệu ngắn gọn, hình ảnh đúng sản phẩm và những thông tin dễ đối chiếu.",
  },
  {
    role: "Đối tác nhập khẩu",
    initials: "NK",
    topic: "Trao đổi nhu cầu",
    text: "Việc làm rõ quy cách và lịch nhận ngay từ đầu là nền tảng cho một cuộc hợp tác thuận lợi.",
  },
  {
    role: "Nhà hàng & dịch vụ",
    initials: "NH",
    topic: "Lựa chọn theo mùa",
    text: "Những gợi ý theo mùa giúp đội ngũ có thêm cảm hứng xây dựng thực đơn và lựa chọn nguyên liệu.",
  },
  {
    role: "Đơn vị chế biến",
    initials: "CB",
    topic: "Quy cách nguyên liệu",
    text: "Điều chúng tôi quan tâm là sự rõ ràng về nguyên liệu, mẫu sản phẩm và cách chuẩn bị cho từng đơn hàng.",
  },
  {
    role: "Đối tác vùng trồng",
    initials: "VT",
    topic: "Kết nối lâu dài",
    text: "Một mối quan hệ tốt bắt đầu từ việc lắng nghe nhu cầu của nhau và cùng thống nhất hướng đi.",
  },
  {
    role: "Đơn vị thu mua",
    initials: "TM",
    topic: "Chuẩn bị đơn hàng",
    text: "Có thể tổng hợp nhu cầu trong một bản yêu cầu giúp việc trao đổi giữa các bộ phận trở nên thuận tiện hơn.",
  },
  {
    role: "Đối tác thực phẩm",
    initials: "TP",
    topic: "Sự đồng hành",
    text: "Chúng tôi luôn tìm kiếm những kết nối coi trọng sự minh bạch, trao đổi cởi mở và tinh thần đồng hành.",
  },
];

function FeedbackCard({ item, tone }) {
  return (
    <article className={`feedback-card feedback-tone-${tone}`}>
      <div className="feedback-card-top">
        <Quote size={25} strokeWidth={1.2} aria-hidden="true" />
        <span>{item.topic}</span>
      </div>
      <blockquote>{item.text}</blockquote>
      <div className="feedback-author">
        <span className="feedback-avatar" aria-hidden="true">
          {item.initials}
        </span>
        <div>
          <h4>{item.role}</h4>
          <p>Phản hồi minh họa</p>
        </div>
      </div>
    </article>
  );
}

export default function Feedback() {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className={`feedback-section ${paused ? "feedback-paused" : ""}`}
      aria-labelledby="feedback-title"
    >
      <div className="feedback-heading container">
        <div>
          <h3 id="feedback-title">Lắng nghe để cùng phát triển.</h3>
          <p className="feedback-disclosure">
            Nội dung minh họa cách trình bày phản hồi, chưa phải đánh giá khách
            hàng thực tế.
          </p>
        </div>
      </div>
      <div
        className="feedback-rails"
        tabIndex={0}
        role="region"
        aria-label="Phản hồi minh họa"
        aria-description="Chạm hoặc nhấn Enter để dừng hay tiếp tục. Di chuột hoặc đặt tiêu điểm vào đây để dừng chuyển động."
        onClick={() => setPaused((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setPaused((value) => !value);
          }
        }}
      >
        {[SAMPLES.slice(0, 4), SAMPLES.slice(4)].map((row, rowIndex) => (
          <div
            className={`feedback-rail feedback-rail-${rowIndex}`}
            key={rowIndex}
          >
            <div className="feedback-track">
              {[0, 1].map((copy) => (
                <div
                  className="feedback-set"
                  key={copy}
                  aria-hidden={copy ? true : undefined}
                >
                  {row.map((item, index) => (
                    <FeedbackCard
                      item={item}
                      tone={(index + rowIndex) % 3}
                      key={item.initials}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
