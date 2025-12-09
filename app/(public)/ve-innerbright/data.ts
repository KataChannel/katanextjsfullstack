import { VeInnerbrightPageData } from "./types";

// Default data for Ve InnerBright page
export const defaultPageData: VeInnerbrightPageData = {
  hero: {
    slides: [
      {
        id: 1,
        title: "CÂU CHUYỆN",
        subtitle: "về INNERBRIGHT",
        description: "InnerBright Training & Coaching",
        subDescription: "được thành lập từ năm 2020",
        badge: "Bởi nhà đào tạo\nCHLOE QUÝ CHÂU",
        image: "/ve-innerbright/ve-innerbright-section1-2.webp",
        avatar: "/api/minio-proxy/innerbright/1763602085989-jm48us.webp",
        nameBackground: "/api/minio-proxy/innerbright/1763744032611-92q332.webp"
      }
    ]
  },
  missionVision: {
    mission: {
      title: "SỨ MỆNH",
      description: "Tạo dựng cuộc sống thịnh vượng hơn cho người người Việt Nam bằng việc khai phóng tiềm năng và giúp phát huy tối đa nội lực của mỗi cá nhân."
    },
    vision: {
      title: "TẦM NHÌN",
      description: "Trang bị cho mỗi người Việt Nam đủ sở hữu tư duy phát triển bản thân đúng đắn, hiệu quả và bền vững."
    },
    coreValues: {
      title: "GIÁ TRỊ CỐT LÕI",
      values: ["Hệ thống", "Hợp nhất", "Từ tế"]
    }
  },
  personalDevelopment: {
    title: "PHÁT TRIỂN BẢN THÂN",
    subtitle: "LÀ SỨC MẠNH ĐỂ THAY ĐỔI THẾ GIỚI",
    description: "Thế giới của mỗi người chính là bề sinh trắc, nơi mỗi chúng ta sống và làm việc cùng các cộng đồng. Tại InnerBright, điều quan trọng không chỉ là được thành công cá nhân, mà còn là sử dụng sức mạnh này để tạo ra sự khác biệt và ảnh hưởng đến hệ sinh thái của riêng bạn. Bằng cách phát triển bản thân, chúng ta tự trở thành người cảm trích và sẽ thay đổi cả thế giới.",
    highlight: "Chúng tôi - những con người tại InnerBright rất tự hào và sẵn sàng đồng hành cùng bạn trên hành trình này để khai phóng tiềm năng và giúp phát huy tối đa nội lực của riêng Bạn",
    image: "/api/minio-proxy/innerbright/1763602098838-btb47.webp",
    imageAlt: "InnerBright - Phát triển bản thân"
  },
  certificationSystem: {
    mainTitle: "HỆ THỐNG CHỨNG NHẬN",
    yearBadge: {
      number: "5",
      text: "NĂM"
    },
    description: [
      "InnerBright Training & Coaching tự hào là thành viên chính thức và uy tín của Hiệp Hội NLP Hoa Kỳ (ABNLP) trong hơn 5 năm liên tục. ABNLP với vai trò là tổ chức lớn nhất và lâu đời nhất về Lập Trình Ngôn Ngữ Tư Duy (NLP - Neuro Linguistic Programming) tại Hoa Kỳ, có chứng nhận sự chuyên nghiệp và chất lượng đào tạo của InnerBright.",
      "Đặc biệt, InnerBright là đơn vị tiên phong tại Việt Nam được Ban Cố Vấn (Board of Advisors) của Hiệp Hội ABNLP chứng thực bằng chương trình NLP Master Coach Quốc Tế. Điều này đảm bảo rằng không chỉ về kiến thức chuyên môn, mà còn về đạo đức nghề nghiệp, InnerBright mang đến chương trình đào tạo NLP Coaching chuẩn quốc tế tại Việt Nam."
    ],
    certificates: [
      {
        id: 1,
        title: "HỌC VIÊN ĐÀO TẠO NLP",
        image: "/api/minio-proxy/innerbright/1763602544272-majm8r.webp",
        imageAlt: "Chứng chỉ Học viên Đào tạo NLP"
      },
      {
        id: 2,
        title: "HỌC VIÊN ĐÀO TẠO NLP COACHING",
        image: "/api/minio-proxy/innerbright/1763602544456-bdhxwe.webp",
        imageAlt: "Chứng chỉ Học viên Đào tạo NLP Coaching"
      }
    ]
  },
  whyInnerBright: {
    title: "Vì sao InnerBright",
    subtitle: "là lựa chọn khác biệt?",
    nlpTitle: "NLP",
    nlpSubtitle: "(Neuro Linguistic Programming)",
    description: "Lập trình ngôn ngữ tư duy, không chỉ là một tập hợp các kỹ thuật, mà là một hành trình khám phá sức mạnh nội tại để tạo ra sự chuyển hóa sâu sắc. Để ứng dụng NLP hiệu quả, sự thấu hiểu cội nguồn và nguyên lý hoạt động là then chốt.",
    image: "/api/minio-proxy/innerbright/1763611178370-rxn0rl.webp",
    imageAlt: "Vì sao chọn InnerBright"
  },
  fiveFoundations: {
    mainTitle: "5 NỀN TẢNG TẠO NÊN SỰ KHÁC BIỆT",
    subtitle: "TRONG MỖI KHÓA HỌC TẠI INNERBRIGHT",
    foundations: [
      {
        id: 1,
        number: "1",
        title: "KHAI PHÁ TIỀM NĂNG NÃO BỘ",
        description: "Thay vì chỉ truyền tải kiến thức một chiều, chúng tôi kích hoạt bộ não của bạn để việc học trở nên tự nhiên và hiệu quả. Các phương pháp giảng dạy được thiết kế dựa trên cách bộ não tiếp thu và xử lý thông tin, giúp bạn nắm bắt kiến thức một cách sâu sắc và ghi nhớ lâu dài, giảm thiểu sự phụ thuộc vào việc ghi chép thu động.",
        color: "orange"
      },
      {
        id: 2,
        number: "2",
        title: "HỌC THÔNG QUA TRẢI NGHIỆM",
        description: "Thay vì chỉ nghe giảng, bạn sẽ được trải nghiệm và thực hành ngay trong lớp học. Mỗi bài học đều được thiết kế với các hoạt động tương tác, giúp bạn không chỉ hiểu mà còn cảm nhận và vận dụng kiến thức một cách tự nhiên và hiệu quả nhất.",
        color: "blue"
      },
      {
        id: 3,
        number: "3",
        title: "PHÁT TRIỂN TƯ DUY LOGIC",
        description: "Chúng tôi không chỉ dạy bạn kỹ thuật, mà còn giúp bạn xây dựng nền tảng tư duy logic vững chắc. Điều này giúp bạn có khả năng phân tích, đánh giá và giải quyết vấn đề một cách có hệ thống, sáng tạo và hiệu quả trong mọi tình huống.",
        color: "orange"
      },
      {
        id: 4,
        number: "4",
        title: "THỰC HÀNH ỨNG DỤNG THỰC TẾ",
        description: "Mỗi khóa học đều tích hợp các tình huống thực tế và bài tập ứng dụng, giúp bạn không chỉ học mà còn biết cách áp dụng ngay vào cuộc sống và công việc. Đây là cách tốt nhất để biến kiến thức thành kỹ năng thực sự.",
        color: "blue"
      },
      {
        id: 5,
        number: "5",
        title: "ĐỒNG HÀNH VÀ HỖ TRỢ BỀN VỮNG",
        description: "Sau khóa học, chúng tôi không để bạn tự mình đi tiếp. Chúng tôi luôn sẵn sàng đồng hành, hỗ trợ và tạo cơ hội để bạn tiếp tục phát triển. Cộng đồng InnerBright là nơi bạn luôn tìm thấy sự hỗ trợ và động lực để tiến xa hơn.",
        color: "orange"
      }
    ]
  },
  atInnerBright: {
    title: "TẠI INNERBRIGHT",
    introText: "chúng tôi không chỉ trang bị cho bạn kiến thức NLP, chúng tôi dẫn dắt bạn thực sự thấu suốt bản chất của từng công cụ. Bạn sẽ hiểu tại sao chúng hoạt động, khi nào nên sử dụng và làm thế nào để tích hợp chúng một cách linh hoạt vào cuộc sống.",
    mainDescription: "Với tầm huyết truyện tài tinh thần chính trực của NLP, InnerBright không đơn thuần mang đến một hệ thống bài bản. Chúng tôi kiến tạo một hành trình phát triển bản thân toàn diện, hấp nhất sức mạnh nội tại của bạn với sự trưởng thành ở cả bốn khía cạnh then chốt: trí tuệ lý trí (mental intelligence), trí tuệ cảm xúc (emotional intelligence), trí tuệ thể chất (physical intelligence) và trí tuệ tâm linh (spiritual intelligence).",
    secondaryDescription: "Chúng tôi nuôi dưỡng những giá trị cốt lõi của bạn, tạo nên một hệ sinh thái nội tại vững mạnh và bền vững, giúp bạn phát triển toàn diện và sống một cuộc đời trọn vẹn.",
    image: "/api/minio-proxy/innerbright/1763602544802-4u2nuh.webp",
    imageAlt: "InnerBright Team - Đội ngũ đào tạo"
  },
  trainer: {
    badge: "CHUYÊN GIA ĐÀO TẠO",
    name: "Chloe Quý Châu",
    titles: [
      "NLP Coach Trainer",
      "ABNLP | Time Line Therapy ®"
    ],
    description: [
      "Trong quá trình học tập và huấn luyện tại Việt Nam, Chloe Quý Châu là chuyên gia nguyên vật liệu, kiến trúc ABNLP Coaching Division cấp phép đào tạo NLP Master Coach. Chloe tập trung truyền tải nguyên bản công cụ NLP để học viên hiểu rõ, đúng, đủ và ứng dụng linh hoạt vào cuộc sống.",
      "Chloe cũng là một trong số ít người Việt đầu tiên được chứng nhận đào tạo Time Line Therapy® trực tiếp từ hiệp hội, một phương pháp mạnh mẽ giúp xử lý sâu sắc các cảm xúc"
    ],
    image: "/api/minio-proxy/innerbright/1763602545461-ewwycu.webp",
    imageAlt: "Chloe Quý Châu - Chuyên gia đào tạo NLP"
  },
  certifications: {
    headerText: "Hành trình chuyên nghiệp của Chloe được xây dựng trên nền tảng kinh nghiệm khai vấn (coaching) được chứng nhận bởi hàng loạt các tổ chức uy tín trên thế giới, bao gồm:",
    certifications: [
      {
        id: 1,
        logo: "/api/minio-proxy/innerbright/1763602554133-uyfzx.webp",
        name: "HIỆP HỘI ABNLP",
        description: "Chứng nhận năng lực khai vấn bằng công cụ NLP."
      },
      {
        id: 2,
        logo: "/api/minio-proxy/innerbright/1763602554318-301m9.webp",
        name: "TỔ CHỨC HUẤN LUYỆN DOANH NGHIỆP ACTIONCOACH",
        description: "Chứng nhận khả năng huấn luyện và phát triển doanh nghiệp."
      },
      {
        id: 3,
        logo: "/api/minio-proxy/innerbright/1763602560452-zahjek.webp",
        name: "HIỆP HỘI TIME LINE THERAPY®",
        description: "Chứng nhận năng lực trị liệu và khai vấn bằng kỹ thuật Time Line Therapy."
      },
      {
        id: 4,
        logo: "/api/minio-proxy/innerbright/1763602561852-kd2qgi.webp",
        name: "TƯ VẤN HÌNH ẢNH FIRST IMPRESSIONS IMAGE INTERNATIONAL (SINGAPORE)",
        description: "Mở rộng phạm vi chuyên môn, hỗ trợ sự phát triển toàn diện cho cá nhân và doanh nghiệp."
      }
    ],
    backToTopText: "Trở lại đầu trang"
  }
};
