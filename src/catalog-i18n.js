/**
 * Catalogue text for the six languages without written product copy
 * (zh, ko, ja, ar, fr, de). Product records hold Vietnamese and English;
 * the English string is the key here, so names, descriptions and every
 * specification row are shown in the visitor's language instead of falling
 * back to English (customer review, item 1).
 *
 * Specification values are translated per " · " segment: repeated forms
 * ("12.5% max", "20'FCL: approx. 13–14 t", "10 kg cartons" …) use patterns,
 * everything else is listed once. Standards (TCVN, ISO, CODEX …) stay as is.
 */

const LANGS = ["zh", "ko", "ja", "ar", "fr", "de"];

// French and German write decimals with a comma.
const num = (value, lang) => (lang === "fr" || lang === "de" ? value.replace(/(\d)\.(\d)/g, "$1,$2") : value);
const pick = (row, lang) => row[LANGS.indexOf(lang)];

/* ------------------------------------------------------------------ */
/* Whole strings: names and descriptions                               */
/* ------------------------------------------------------------------ */

const TEXT = {
  // Coffee
  "Cleaned screen 13 Robusta for soluble coffee and competitive blends.": ["经清洁的 13 号筛罗布斯塔，适用于速溶咖啡和高性价比拼配。", "클린 처리한 스크린 13 로부스타로 인스턴트 커피와 경쟁력 있는 블렌드에 적합합니다.", "クリーン処理したスクリーン13のロブスタ。インスタントコーヒーや価格競争力のあるブレンド向け。", "روبوستا منظّف بمقاس غربال 13 للقهوة سريعة الذوبان والخلطات ذات السعر التنافسي.", "Robusta calibre 13 nettoyé, pour le café soluble et les mélanges compétitifs.", "Gereinigter Robusta Sieb 13 für löslichen Kaffee und preiswerte Mischungen."],
  "Screen 13 Robusta in standard quality for industrial processing.": ["标准品质 13 号筛罗布斯塔，适用于工业加工。", "산업 가공용 표준 품질 스크린 13 로부스타입니다.", "工業加工向けの標準品質スクリーン13ロブスタ。", "روبوستا بمقاس غربال 13 بجودة قياسية للتصنيع الصناعي.", "Robusta calibre 13 de qualité standard pour la transformation industrielle.", "Robusta Sieb 13 in Standardqualität für die industrielle Verarbeitung."],
  "Cleaned screen 16 Robusta with uniform beans for blends and industrial roasting.": ["经清洁的 16 号筛罗布斯塔，豆粒均匀，适用于拼配和工业烘焙。", "원두 크기가 고른 클린 스크린 16 로부스타로 블렌드와 산업용 로스팅에 적합합니다.", "粒ぞろいのクリーン処理スクリーン16ロブスタ。ブレンドや工業焙煎向け。", "روبوستا منظّف بمقاس غربال 16 بحبوب متجانسة للخلطات والتحميص الصناعي.", "Robusta calibre 16 nettoyé, grains homogènes, pour mélanges et torréfaction industrielle.", "Gereinigter Robusta Sieb 16 mit gleichmäßigen Bohnen für Mischungen und Industrieröstung."],
  "Screen 16 Robusta in standard quality, defect ratio agreed in the contract.": ["标准品质 16 号筛罗布斯塔，缺陷率在合同中约定。", "표준 품질 스크린 16 로부스타이며 결점 비율은 계약으로 확정합니다.", "標準品質のスクリーン16ロブスタ。欠点率は契約で取り決めます。", "روبوستا بمقاس غربال 16 بجودة قياسية، ونسبة العيوب يُتفق عليها في العقد.", "Robusta calibre 16 de qualité standard, taux de défauts fixé au contrat.", "Robusta Sieb 16 in Standardqualität, Fehleranteil laut Vertrag."],
  "Screen 18 Robusta, thoroughly cleaned with low black, broken and foreign matter for premium roasting.": ["彻底清洁的 18 号筛罗布斯塔，黑豆、碎豆和杂质含量低，适用于高端烘焙。", "철저히 클린 처리한 스크린 18 로부스타로 흑두·파쇄두·이물질이 적어 프리미엄 로스팅에 적합합니다.", "入念にクリーン処理したスクリーン18ロブスタ。黒豆・欠け豆・異物が少なく、プレミアム焙煎向け。", "روبوستا بمقاس غربال 18 منظّف بعناية، منخفض الحبوب السوداء والمكسورة والشوائب، للتحميص الفاخر.", "Robusta calibre 18 soigneusement nettoyé, peu de grains noirs, brisés et d’impuretés, pour une torréfaction haut de gamme.", "Sorgfältig gereinigter Robusta Sieb 18 mit wenig schwarzen, gebrochenen Bohnen und Fremdbestandteilen für Premium-Röstung."],
  "Screen 18 Robusta in standard export quality without additional cleaning.": ["标准出口品质 18 号筛罗布斯塔，未经额外清洁。", "추가 클린 공정을 거치지 않은 표준 수출 품질 스크린 18 로부스타입니다.", "追加のクリーン工程を経ない標準輸出品質のスクリーン18ロブスタ。", "روبوستا بمقاس غربال 18 بجودة تصدير قياسية دون تنظيف إضافي.", "Robusta calibre 18 de qualité export standard, sans nettoyage complémentaire.", "Robusta Sieb 18 in Standard-Exportqualität ohne zusätzliche Reinigung."],
  "Green Robusta broken beans": ["罗布斯塔生咖啡碎豆", "로부스타 생두 파쇄두", "ロブスタ生豆 欠け豆", "حبوب روبوستا خضراء مكسورة", "Brisures de Robusta vert", "Grüner Robusta, Bruchbohnen"],
  "Broken and small beans from grading, used for soluble coffee and extraction.": ["分级后的碎豆和小粒豆，用于速溶咖啡和萃取。", "선별 후 나온 파쇄두와 작은 원두로 인스턴트 커피와 추출용입니다.", "選別で出た欠け豆と小粒豆。インスタントコーヒーや抽出用。", "حبوب مكسورة وصغيرة ناتجة عن الفرز، تُستخدم للقهوة سريعة الذوبان والاستخلاص.", "Grains brisés et petits grains issus du calibrage, pour le café soluble et l’extraction.", "Bruch- und Kleinbohnen aus der Sortierung für löslichen Kaffee und Extraktion."],
  "Roasted & ground coffee": ["烘焙咖啡及咖啡粉", "로스팅 및 분쇄 커피", "焙煎・粉砕コーヒー", "قهوة محمّصة ومطحونة", "Café torréfié et moulu", "Gerösteter & gemahlener Kaffee"],
  "Roasted to your profile, whole bean or ground for the brewing method; private-label packing available.": ["按您的烘焙曲线烘焙，可提供整豆或按冲煮方式研磨；可贴牌包装。", "원하시는 프로파일로 로스팅하고 원두 또는 추출 방식에 맞춰 분쇄합니다. 자체 브랜드 포장이 가능합니다.", "ご希望のプロファイルで焙煎し、豆のまま、または抽出方法に合わせて粉砕。プライベートブランド包装に対応。", "تحميص وفق الملف الذي تختاره، حبوبًا كاملة أو مطحونة حسب طريقة التحضير؛ تتوفر تعبئة بعلامتك الخاصة.", "Torréfié selon votre profil, en grains ou moulu selon la méthode d’extraction ; conditionnement en marque propre possible.", "Nach Ihrem Profil geröstet, als ganze Bohne oder passend zur Zubereitung gemahlen; Handelsmarken-Verpackung möglich."],
  // Pepper
  "Black pepper FAQ": ["黑胡椒 FAQ", "흑후추 FAQ", "ブラックペッパー FAQ", "فلفل أسود FAQ", "Poivre noir FAQ", "Schwarzer Pfeffer FAQ"],
  "Fair-average-quality black pepper 500–550 g/l, the most traded export grade.": ["中等平均品质（FAQ）黑胡椒 500–550 g/l，是出口交易量最大的等级。", "평균 품질(FAQ) 흑후추 500–550 g/l로 가장 많이 거래되는 수출 등급입니다.", "平均品質（FAQ）のブラックペッパー 500–550 g/l。最も多く取引される輸出グレード。", "فلفل أسود بجودة متوسطة عادلة (FAQ) بكثافة 500–550 غ/ل، وهو أكثر درجات التصدير تداولًا.", "Poivre noir de qualité moyenne (FAQ) 500–550 g/l, le grade d’export le plus échangé.", "Schwarzer Pfeffer in Durchschnittsqualität (FAQ) 500–550 g/l, die meistgehandelte Exportsorte."],
  "ASTA-cleaned black pepper": ["ASTA 清洁黑胡椒", "ASTA 클린 흑후추", "ASTA クリーン ブラックペッパー", "فلفل أسود منظّف وفق ASTA", "Poivre noir nettoyé ASTA", "ASTA-gereinigter schwarzer Pfeffer"],
  "Black pepper cleaned to ASTA requirements for the US and EU; steam sterilisation available.": ["按 ASTA 要求清洁的黑胡椒，适用于美国和欧盟市场；可提供蒸汽灭菌。", "미국·EU 시장을 위해 ASTA 기준으로 클린 처리한 흑후추이며 스팀 살균이 가능합니다.", "米国・EU向けにASTA基準でクリーン処理したブラックペッパー。蒸気殺菌に対応。", "فلفل أسود منظّف وفق متطلبات ASTA للسوقين الأمريكية والأوروبية؛ يتوفر التعقيم بالبخار.", "Poivre noir nettoyé selon les exigences ASTA pour les États-Unis et l’UE ; stérilisation à la vapeur possible.", "Nach ASTA-Anforderungen gereinigter schwarzer Pfeffer für die USA und die EU; Dampfsterilisation möglich."],
  "White pepper": ["白胡椒", "백후추", "ホワイトペッパー", "فلفل أبيض", "Poivre blanc", "Weißer Pfeffer"],
  "Decorticated white pepper with a clean aroma for premium seasoning and light-coloured foods.": ["去皮白胡椒，香气纯净，适用于高端调味品和浅色食品。", "껍질을 벗긴 백후추로 깔끔한 향이 있어 프리미엄 양념과 밝은 색 식품에 적합합니다.", "外皮を除いたホワイトペッパー。すっきりとした香りで高級調味料や淡色食品向け。", "فلفل أبيض مقشور برائحة نقية للتوابل الفاخرة والأطعمة فاتحة اللون.", "Poivre blanc décortiqué à l’arôme net, pour assaisonnements haut de gamme et aliments clairs.", "Geschälter weißer Pfeffer mit klarem Aroma für Premium-Würzung und helle Lebensmittel."],
  "Light pepper": ["轻胡椒", "경량 후추", "ライトペッパー", "فلفل خفيف", "Poivre léger", "Leichter Pfeffer"],
  "Light, hollow berries from grading, used for oleoresin extraction and value ground pepper.": ["分级后的轻质空心胡椒粒，用于提取胡椒油树脂和经济型胡椒粉。", "선별 후 나온 가볍고 속이 빈 알갱이로 올레오레진 추출과 경제형 분쇄 후추용입니다.", "選別で出た軽く中空の粒。オレオレジン抽出や手頃な粉胡椒向け。", "حبات خفيفة جوفاء ناتجة عن الفرز، تُستخدم لاستخلاص الأوليوريزين والفلفل المطحون الاقتصادي.", "Baies légères et creuses issues du tri, pour l’extraction d’oléorésine et le poivre moulu économique.", "Leichte, hohle Beeren aus der Sortierung für Oleoresin-Extraktion und preiswerten gemahlenen Pfeffer."],
  "Tieu dinh pepper (small berries)": ["小粒胡椒（Tiêu đinh）", "소립 후추(Tiêu đinh)", "小粒胡椒（ティエウ・ディン）", "فلفل حبات صغيرة (Tiêu đinh)", "Poivre petites baies (tiêu đinh)", "Kleinbeeriger Pfeffer (Tiêu đinh)"],
  "Small, firm berries separated after screening; berry size agreed by sample.": ["筛分后分出的小而结实的胡椒粒；粒径按样品确认。", "체 선별 후 분리한 작고 단단한 알갱이이며 크기는 샘플로 확정합니다.", "ふるい分け後に分けた小さく締まった粒。粒径はサンプルで決定。", "حبات صغيرة صلبة تُفصل بعد الغربلة؛ يُتفق على الحجم وفق العينة.", "Petites baies fermes séparées au criblage ; calibre fixé sur échantillon.", "Kleine, feste Beeren aus der Siebung; Beerengröße nach Muster."],
  "Pin pepper (1–2.5 mm)": ["针头胡椒（1–2.5 mm）", "핀 후추(1–2.5 mm)", "ピンペッパー（1–2.5 mm）", "فلفل دبوسي (1–2.5 مم)", "Poivre tête d’épingle (1–2,5 mm)", "Pinhead-Pfeffer (1–2,5 mm)"],
  "Very small 1–2.5 mm berries for grinding and seasoning blends.": ["1–2.5 mm 极小粒胡椒，用于研磨和复合调味料。", "1–2.5 mm의 아주 작은 알갱이로 분쇄와 혼합 양념용입니다.", "1–2.5 mmの極小粒。粉砕やミックススパイス向け。", "حبات صغيرة جدًا 1–2.5 مم للطحن وخلطات التوابل.", "Très petites baies de 1 à 2,5 mm pour le broyage et les mélanges d’épices.", "Sehr kleine Beeren von 1–2,5 mm zum Mahlen und für Gewürzmischungen."],
  // Star anise
  "Whole star anise": ["整朵八角", "통팔각", "ホール八角", "يانسون نجمي كامل", "Badiane entière", "Ganzer Sternanis"],
  "Complete star anise with good colour and strong aroma for whole spice and extraction.": ["角瓣完整、色泽好、香气浓郁的八角，适用于整粒香料和萃取。", "꽃잎이 온전하고 색이 좋으며 향이 진한 팔각으로 통향신료와 추출용입니다.", "形が整い色つやと香りの良い八角。ホールスパイスや抽出向け。", "يانسون نجمي كامل بلون جيد ورائحة قوية للتوابل الكاملة والاستخلاص.", "Badiane complète, belle couleur et arôme intense, pour épice entière et extraction.", "Vollständiger Sternanis mit schöner Farbe und kräftigem Aroma für ganze Gewürze und Extraktion."],
  "Autumn-crop star anise": ["秋季八角", "가을 수확 팔각", "秋収穫八角", "يانسون نجمي محصول الخريف", "Badiane de récolte d’automne", "Sternanis Herbsternte"],
  "Harvested in autumn (Aug–Oct): large, thick petals with high essential-oil content.": ["秋季（8–10 月）采收：角瓣大而厚，精油含量高。", "가을(8–10월)에 수확: 꽃잎이 크고 두꺼우며 정유 함량이 높습니다.", "秋（8～10月）に収穫：大きく厚い花弁で精油含有量が高い。", "يُحصد في الخريف (أغسطس–أكتوبر): بتلات كبيرة وسميكة بمحتوى عالٍ من الزيت العطري.", "Récoltée en automne (août–oct.) : branches grandes et épaisses, riche en huile essentielle.", "Im Herbst geerntet (Aug.–Okt.): große, dicke Zacken mit hohem Gehalt an ätherischem Öl."],
  "Spring-crop star anise": ["春季八角", "봄 수확 팔각", "春収穫八角", "يانسون نجمي محصول الربيع", "Badiane de récolte de printemps", "Sternanis Frühjahrsernte"],
  "Spring crop (Mar–Apr): smaller petals at a competitive price for ground spice.": ["春季（3–4 月）采收：角瓣较小，价格有竞争力，适用于香料粉。", "봄(3–4월) 수확: 꽃잎이 작고 가격 경쟁력이 있어 분말 향신료에 적합합니다.", "春（3～4月）収穫：花弁は小ぶりで、粉末スパイス向けの手頃な価格。", "محصول الربيع (مارس–أبريل): بتلات أصغر وسعر تنافسي للتوابل المطحونة.", "Récolte de printemps (mars–avr.) : branches plus petites, prix compétitif pour l’épice moulue.", "Frühjahrsernte (März–Apr.): kleinere Zacken zu attraktivem Preis für gemahlene Gewürze."],
  "Broken star anise": ["八角碎", "파쇄 팔각", "八角（欠け）", "يانسون نجمي مكسور", "Badiane brisée", "Sternanis-Bruch"],
  "Loose petals and broken stars from grading, for grinding and oil distillation.": ["分级后的散瓣和碎八角，用于研磨和精油蒸馏。", "선별 후 나온 낱꽃잎과 파쇄 팔각으로 분쇄와 정유 증류용입니다.", "選別で出たばらの花弁と欠けた八角。粉砕や精油蒸留向け。", "بتلات منفصلة ونجوم مكسورة ناتجة عن الفرز للطحن وتقطير الزيت.", "Branches détachées et étoiles brisées issues du tri, pour le broyage et la distillation.", "Lose Zacken und gebrochene Sterne aus der Sortierung zum Mahlen und zur Öldestillation."],
  // Cassia
  "Split cassia": ["桂片", "쪼갠 계피", "割りカシア", "قرفة كاسيا مشقوقة", "Cassia fendue", "Gespaltene Cassia"],
  "Flat split cassia of even thickness for whole spice and grinding.": ["厚度均匀的扁平桂片，适用于整料香料和研磨。", "두께가 고른 납작한 쪼갠 계피로 통향신료와 분쇄용입니다.", "厚みのそろった平らな割りカシア。ホールスパイスや粉砕向け。", "قرفة كاسيا مشقوقة مسطحة بسماكة متساوية للتوابل الكاملة والطحن.", "Cassia fendue plate d’épaisseur régulière, pour épice entière et broyage.", "Flach gespaltene Cassia gleichmäßiger Stärke für ganze Gewürze und zum Mahlen."],
  "Broken cassia": ["碎桂皮", "파쇄 계피", "カシア（ブロークン）", "قرفة كاسيا مكسورة", "Brisures de cassia", "Cassia-Bruch"],
  "Broken cassia pieces from grading, an economical input for grinding and extraction.": ["分级后的碎桂皮，是研磨和萃取的经济型原料。", "선별 후 나온 계피 조각으로 분쇄와 추출용 경제적 원료입니다.", "選別で出たカシアの欠片。粉砕や抽出向けの経済的な原料。", "قطع قرفة كاسيا مكسورة ناتجة عن الفرز، مادة اقتصادية للطحن والاستخلاص.", "Morceaux de cassia issus du tri, une matière économique pour le broyage et l’extraction.", "Cassia-Stücke aus der Sortierung, ein günstiger Rohstoff zum Mahlen und Extrahieren."],
  "Tube cassia": ["桂通", "통계피", "チューブカシア", "قرفة كاسيا أنبوبية", "Cassia en tubes", "Cassia-Röhren"],
  "Bark naturally rolled into tubes, attractive for retail and presentation.": ["树皮自然卷成管状，外观美观，适用于零售和摆盘。", "자연스럽게 관 모양으로 말린 껍질로 소매 판매와 요리 장식에 좋습니다.", "樹皮が自然に筒状に巻いたもの。見栄えが良く小売や盛り付けに最適。", "لحاء ملتف طبيعيًا على شكل أنابيب، جذاب للبيع بالتجزئة والتقديم.", "Écorce naturellement enroulée en tubes, attrayante pour la vente au détail et la présentation.", "Natürlich zu Röhren gerollte Rinde, attraktiv für den Einzelhandel und die Präsentation."],
  "Round-cut cassia": ["桂段", "원형 절단 계피", "カットカシア（丸）", "قرفة كاسيا مقطّعة دائرية", "Cassia coupée en tronçons", "Cassia in Stücken (rund)"],
  "Cassia tubes cut into even lengths to order, ready for retail packing.": ["按订单将桂通切成等长段，便于零售包装。", "계피 통을 주문 길이로 고르게 잘라 소매 포장에 바로 쓸 수 있습니다.", "チューブカシアを注文の長さに均一にカット。小売包装にそのまま使用可能。", "أنابيب كاسيا مقطّعة بأطوال متساوية حسب الطلب، جاهزة لتعبئة التجزئة.", "Tubes de cassia coupés à longueur régulière sur commande, prêts pour le conditionnement de détail.", "Cassia-Röhren auf Bestellung gleichmäßig abgelängt, fertig für die Einzelhandelsverpackung."],
  "Scraped cassia": ["刮皮桂皮", "겉껍질 제거 계피", "表皮削りカシア", "قرفة كاسيا مقشورة", "Cassia grattée", "Geschabte Cassia"],
  "Cassia with the outer bark scraped off — lighter colour and a sweeter aroma for demanding markets.": ["刮去外皮的桂皮——色泽更浅、香味更甜，适合高要求市场。", "겉껍질을 벗긴 계피로 색이 밝고 향이 더 달아 까다로운 시장에 적합합니다.", "外皮を削ったカシア。色が明るく甘い香りで、要求の高い市場向け。", "كاسيا أزيلت قشرتها الخارجية — لون أفتح ورائحة أحلى للأسواق المتطلبة.", "Cassia dont l’écorce externe est grattée : teinte plus claire et arôme plus doux pour les marchés exigeants.", "Cassia mit abgeschabter Außenrinde – hellere Farbe und süßeres Aroma für anspruchsvolle Märkte."],
  "Square-cut cassia (unscraped)": ["方块桂皮（带皮）", "사각 절단 계피(껍질 유지)", "角切りカシア（皮付き）", "قرفة كاسيا مربعة (بالقشرة)", "Cassia en carrés (non grattée)", "Cassia in Quadraten (ungeschabt)"],
  "Square-cut cassia with bark retained, for tea, beverages and spice infusions.": ["保留外皮的方块桂皮，适用于茶、饮料和香料茶包。", "겉껍질을 남긴 사각 절단 계피로 차, 음료, 향신료 티백용입니다.", "皮付きの角切りカシア。お茶、飲料、スパイスティー向け。", "قرفة كاسيا مربعة مع الاحتفاظ بالقشرة، للشاي والمشروبات ونقيع التوابل.", "Cassia en carrés avec écorce, pour thés, boissons et infusions d’épices.", "Quadratisch geschnittene Cassia mit Rinde für Tee, Getränke und Gewürzaufgüsse."],
  "Square-cut cassia (scraped)": ["方块桂皮（刮皮）", "사각 절단 계피(겉껍질 제거)", "角切りカシア（表皮削り）", "قرفة كاسيا مربعة (مقشورة)", "Cassia en carrés (grattée)", "Cassia in Quadraten (geschabt)"],
  "Scraped square-cut cassia with even light colour for premium products.": ["刮皮方块桂皮，色泽浅而均匀，适用于高端产品。", "겉껍질을 벗긴 사각 계피로 밝은 색이 고르게 나와 프리미엄 제품에 적합합니다.", "表皮を削った角切りカシア。均一な明るい色でプレミアム製品向け。", "قرفة كاسيا مربعة مقشورة بلون فاتح متجانس للمنتجات الفاخرة.", "Cassia grattée en carrés, teinte claire et homogène, pour produits haut de gamme.", "Geschabte Cassia-Quadrate in gleichmäßig heller Farbe für Premiumprodukte."],
  "Scraped tube cassia": ["刮皮桂通（笛形）", "겉껍질 제거 통계피", "表皮削りチューブカシア", "قرفة كاسيا أنبوبية مقشورة", "Cassia grattée en tubes", "Geschabte Cassia-Röhren"],
  "Scraped cassia rolled into even, flute-like tubes for premium retail.": ["刮皮后卷成均匀笛管状的桂皮，适用于高端零售。", "겉껍질을 벗겨 피리처럼 고르게 말아 프리미엄 소매용으로 좋습니다.", "表皮を削り、笛のように均一に巻いたカシア。高級小売向け。", "كاسيا مقشورة ملفوفة في أنابيب متساوية تشبه الناي للبيع الفاخر بالتجزئة.", "Cassia grattée roulée en tubes réguliers, façon flûte, pour la vente haut de gamme.", "Geschabte Cassia, zu gleichmäßigen, flötenartigen Röhren gerollt, für den Premium-Einzelhandel."],
  "Cigarette cassia": ["烟卷桂", "시가렛 계피", "シガレットカシア", "قرفة كاسيا سيجار", "Cassia cigarette", "Zigaretten-Cassia"],
  "Tightly rolled cigarette cassia of uniform size for retail packing.": ["卷紧的烟卷状桂皮，尺寸统一，适用于零售包装。", "단단하게 말린 시가렛 계피로 크기가 균일해 소매 포장에 적합합니다.", "きつく巻いたシガレット状カシア。サイズが均一で小売包装向け。", "كاسيا ملفوفة بإحكام على شكل سيجار بحجم موحّد لتعبئة التجزئة.", "Cassia cigarette roulée serrée, de taille régulière, pour le conditionnement de détail.", "Fest gerollte Zigaretten-Cassia in einheitlicher Größe für die Einzelhandelsverpackung."],
  // Coconut
  "Desiccated coconut — fine grade": ["椰蓉 — 细粒", "건조 코코넛 — 파인", "乾燥ココナッツ — ファイン", "جوز هند مجفف — ناعم", "Noix de coco râpée — fine", "Kokosraspeln — fein"],
  "Even fine granules for fillings, creams and smooth-textured foods.": ["颗粒细而均匀，适用于馅料、奶油和口感细腻的食品。", "고운 입자가 고르게 나와 필링, 크림, 부드러운 식감의 식품에 적합합니다.", "均一で細かい粒。フィリング、クリーム、なめらかな食感の食品向け。", "حبيبات ناعمة متجانسة للحشوات والكريمات والأطعمة ناعمة القوام.", "Granulés fins et réguliers pour fourrages, crèmes et préparations onctueuses.", "Gleichmäßig feine Körnung für Füllungen, Cremes und Lebensmittel mit glatter Textur."],
  "Desiccated coconut — medium grade": ["椰蓉 — 中粒", "건조 코코넛 — 미디엄", "乾燥ココナッツ — ミディアム", "جوز هند مجفف — متوسط", "Noix de coco râpée — moyenne", "Kokosraspeln — mittel"],
  "Versatile medium granules for confectionery, toppings and cereals.": ["用途广泛的中粒椰蓉，适用于糖果、表面装饰和谷物食品。", "다용도 중간 입자로 제과, 토핑, 시리얼에 적합합니다.", "用途の広いミディアム粒。製菓、トッピング、シリアル向け。", "حبيبات متوسطة متعددة الاستخدامات للحلويات والتزيين ورقائق الحبوب.", "Granulés moyens polyvalents pour confiserie, nappages et céréales.", "Vielseitige mittlere Körnung für Süßwaren, Toppings und Cerealien."],
  "Desiccated coconut — high fat": ["椰蓉 — 高脂", "건조 코코넛 — 고지방", "乾燥ココナッツ — 高脂肪", "جوز هند مجفف — عالي الدهن", "Noix de coco râpée — riche en matières grasses", "Kokosraspeln — fettreich"],
  "High fat content and rich flavour for confectionery and reconstituted coconut milk.": ["脂肪含量高、椰香浓郁，适用于糖果和复原椰奶。", "지방 함량이 높고 코코넛 풍미가 진해 제과와 환원 코코넛 밀크에 적합합니다.", "脂肪分が高く風味豊か。製菓や還元ココナッツミルク向け。", "محتوى دهني مرتفع ونكهة غنية للحلويات وحليب جوز الهند المعاد تكوينه.", "Teneur élevée en matières grasses et saveur intense, pour la confiserie et le lait de coco reconstitué.", "Hoher Fettgehalt und vollmundiger Geschmack für Süßwaren und rekonstituierte Kokosmilch."],
  "Desiccated coconut — low fat": ["椰蓉 — 低脂", "건조 코코넛 — 저지방", "乾燥ココナッツ — 低脂肪", "جوز هند مجفف — قليل الدهن", "Noix de coco râpée — allégée", "Kokosraspeln — fettarm"],
  "Partially defatted for cereals, bakery and reduced-fat products.": ["部分脱脂，适用于谷物食品、烘焙和低脂产品。", "일부 탈지하여 시리얼, 베이커리, 저지방 제품에 적합합니다.", "一部脱脂。シリアル、ベーカリー、低脂肪製品向け。", "منزوع الدهن جزئيًا لرقائق الحبوب والمخبوزات والمنتجات قليلة الدهن.", "Partiellement dégraissée pour céréales, boulangerie et produits allégés.", "Teilentfettet für Cerealien, Backwaren und fettreduzierte Produkte."],
  // Rice
  "Vietnamese white rice IR504, 5% broken": ["越南白米 IR504，5% 碎米", "베트남 백미 IR504, 싸라기 5%", "ベトナム白米 IR504（砕米5%）", "أرز أبيض فيتنامي IR504، 5% مكسور", "Riz blanc vietnamien IR504, 5 % de brisures", "Vietnamesischer Weißreis IR504, 5 % Bruch"],
  "Long-grain IR50404 white rice, 5% broken, well milled — a steady supply for Asian and African markets.": ["IR50404 长粒白米，5% 碎米，精碾——为亚洲和非洲市场稳定供货。", "IR50404 장립종 백미, 싸라기 5%, 정미 — 아시아·아프리카 시장에 안정적으로 공급합니다.", "IR50404 長粒白米、砕米5%、精米 — アジア・アフリカ市場へ安定供給。", "أرز أبيض طويل الحبة IR50404، 5% مكسور، مضروب جيدًا — إمداد ثابت للأسواق الآسيوية والأفريقية.", "Riz blanc long grain IR50404, 5 % de brisures, bien usiné — un approvisionnement régulier pour l’Asie et l’Afrique.", "Langkörniger Weißreis IR50404, 5 % Bruch, gut geschliffen – verlässliche Versorgung für asiatische und afrikanische Märkte."],
  "Vietnamese fragrant rice DT8, 5% broken": ["越南香米 DT8，5% 碎米", "베트남 향미 DT8, 싸라기 5%", "ベトナム香り米 DT8（砕米5%）", "أرز عطري فيتنامي DT8، 5% مكسور", "Riz parfumé vietnamien DT8, 5 % de brisures", "Vietnamesischer Duftreis DT8, 5 % Bruch"],
  "Dai Thom 8 fragrant long-grain rice, soft cooked texture, 5% broken for the fragrant segment.": ["Đài Thơm 8 长粒香米，米饭软糯，5% 碎米，适用于香米市场。", "Đài Thơm 8 장립 향미로 밥이 부드럽고 싸라기 5%로 향미 시장에 적합합니다.", "ダイトム8の長粒香り米。炊き上がりが柔らかく、砕米5%で香り米市場向け。", "أرز داي ثوم 8 العطري طويل الحبة، قوام طري بعد الطهي، 5% مكسور لفئة الأرز العطري.", "Riz parfumé long grain Dai Thom 8, texture tendre à la cuisson, 5 % de brisures pour le segment parfumé.", "Duftender Langkornreis Dai Thom 8, weich gekocht, 5 % Bruch für das Duftreis-Segment."],
};

/* ------------------------------------------------------------------ */
/* Specification segments                                              */
/* ------------------------------------------------------------------ */

const SEGMENT = {
  "Natural greyish green, even colour": ["天然灰绿色，色泽均匀", "자연스러운 회녹색, 균일한 색", "自然な灰緑色、色むらなし", "أخضر رمادي طبيعي بلون متجانس", "Vert grisâtre naturel, couleur homogène", "Natürliches Graugrün, gleichmäßige Farbe"],
  "60 kg jute bags, 50 kg PP bags or bulk liner": ["60 kg 黄麻袋、50 kg PP 袋或散装内衬", "60 kg 황마 포대, 50 kg PP 포대 또는 벌크 라이너", "60 kgジュート袋、50 kg PP袋またはバルクライナー", "أكياس جوت 60 كغ أو أكياس PP ‏50 كغ أو بطانة سائبة", "Sacs de jute de 60 kg, sacs PP de 50 kg ou vrac en liner", "Jutesäcke à 60 kg, PP-Säcke à 50 kg oder Bulk-Liner"],
  "20'FCL: 19.2 t in bags (320 × 60 kg)": ["20'FCL：袋装 19.2 吨（320 × 60 kg）", "20'FCL: 포대 19.2톤(320 × 60 kg)", "20'FCL：袋詰め19.2トン（320 × 60 kg）", "20'FCL: ‏19.2 طن معبأة (320 × 60 كغ)", "20'FCL : 19,2 t en sacs (320 × 60 kg)", "20'FCL: 19,2 t in Säcken (320 × 60 kg)"],
  "21.6 t in bulk": ["散装 21.6 吨", "벌크 21.6톤", "バルク21.6トン", "‏21.6 طن سائبة", "21,6 t en vrac", "21,6 t lose"],
  "Broken beans 80% min": ["碎豆不低于 80%", "파쇄두 최소 80%", "欠け豆 80%以上", "حبوب مكسورة 80% كحد أدنى", "Grains brisés 80 % min", "Bruchbohnen mind. 80 %"],
  "below screen 12": ["通过 12 号筛", "스크린 12 통과", "スクリーン12通過", "تمر من غربال 12", "passant au crible 12", "unter Sieb 12"],
  "Greyish green to light brown": ["灰绿色至浅棕色", "회녹색~연갈색", "灰緑色～薄茶色", "أخضر رمادي إلى بني فاتح", "Vert grisâtre à brun clair", "Graugrün bis hellbraun"],
  "50 kg PP or 60 kg jute bags": ["50 kg PP 袋或 60 kg 黄麻袋", "50 kg PP 포대 또는 60 kg 황마 포대", "50 kg PP袋または60 kgジュート袋", "أكياس PP ‏50 كغ أو جوت 60 كغ", "Sacs PP de 50 kg ou de jute de 60 kg", "PP-Säcke à 50 kg oder Jutesäcke à 60 kg"],
  "No foreign matter": ["无杂质", "이물질 없음", "異物なし", "خالٍ من الشوائب", "Sans impuretés", "Frei von Fremdbestandteilen"],
  "no foreign matter": ["无杂质", "이물질 없음", "異物なし", "خالٍ من الشوائب", "sans impuretés", "frei von Fremdbestandteilen"],
  "no additives": ["无添加剂", "첨가물 없음", "添加物なし", "بدون إضافات", "sans additifs", "ohne Zusatzstoffe"],
  "Whole bean or fine / medium / coarse grind": ["整豆，或细 / 中 / 粗研磨", "원두 또는 고운 / 중간 / 굵은 분쇄", "豆のまま、または細挽き / 中挽き / 粗挽き", "حبوب كاملة أو طحن ناعم / متوسط / خشن", "Grains entiers ou mouture fine / moyenne / grossière", "Ganze Bohne oder fein / mittel / grob gemahlen"],
  "Medium to dark brown by roast level": ["依烘焙度呈中棕至深棕色", "로스팅 정도에 따라 중간~진한 갈색", "焙煎度に応じて中茶色～濃茶色", "بني متوسط إلى داكن حسب درجة التحميص", "Brun moyen à foncé selon la torréfaction", "Mittel- bis dunkelbraun je nach Röstgrad"],
  "One-way valve bags 250 g / 500 g / 1 kg in cartons": ["250 g / 500 g / 1 kg 单向排气阀袋，纸箱包装", "250 g / 500 g / 1 kg 원웨이 밸브 백, 카톤 박스 포장", "250 g / 500 g / 1 kgのワンウェイバルブ袋、段ボール箱入り", "أكياس بصمام أحادي الاتجاه 250 غ / 500 غ / 1 كغ في كراتين", "Sachets à valve 250 g / 500 g / 1 kg en cartons", "Aromaschutzbeutel 250 g / 500 g / 1 kg im Karton"],
  "20'FCL: approx. 8–10 t depending on carton": ["20'FCL：约 8–10 吨（视纸箱规格而定）", "20'FCL: 약 8–10톤(카톤 규격에 따라 다름)", "20'FCL：約8～10トン（箱の仕様による）", "20'FCL: حوالي 8–10 طن حسب الكرتونة", "20'FCL : env. 8–10 t selon le carton", "20'FCL: ca. 8–10 t je nach Karton"],
  "TCVN 5250:2015 (roasted)": ["TCVN 5250:2015（烘焙咖啡）", "TCVN 5250:2015(로스팅 커피)", "TCVN 5250:2015（焙煎コーヒー）", "TCVN 5250:2015 (قهوة محمّصة)", "TCVN 5250:2015 (café torréfié)", "TCVN 5250:2015 (Röstkaffee)"],
  "TCVN 5251:2015 (ground)": ["TCVN 5251:2015（咖啡粉）", "TCVN 5251:2015(분쇄 커피)", "TCVN 5251:2015（粉コーヒー）", "TCVN 5251:2015 (قهوة مطحونة)", "TCVN 5251:2015 (café moulu)", "TCVN 5251:2015 (gemahlener Kaffee)"],
  "Natural black to dark brown": ["天然黑色至深棕色", "자연스러운 검정~짙은 갈색", "自然な黒～濃茶色", "أسود طبيعي إلى بني داكن", "Noir naturel à brun foncé", "Natürlich schwarz bis dunkelbraun"],
  "25 kg or 50 kg PP bags, PE liner on request": ["25 kg 或 50 kg PP 袋，可按要求加 PE 内衬", "25 kg 또는 50 kg PP 포대, 요청 시 PE 내피", "25 kgまたは50 kg PP袋、ご要望でPE内袋", "أكياس PP ‏25 أو 50 كغ، وبطانة PE عند الطلب", "Sacs PP de 25 ou 50 kg, doublure PE sur demande", "PP-Säcke à 25 oder 50 kg, PE-Inliner auf Wunsch"],
  "meets ASTA cleanliness": ["符合 ASTA 清洁标准", "ASTA 청결 기준 충족", "ASTA清浄度基準を満たす", "مطابق لمعايير نظافة ASTA", "conforme à la propreté ASTA", "erfüllt die ASTA-Reinheit"],
  "Uniform black": ["均匀黑色", "균일한 검정", "均一な黒", "أسود متجانس", "Noir uniforme", "Einheitlich schwarz"],
  "Ivory to creamy white": ["象牙白至奶油白", "아이보리~크림색", "アイボリー～クリーム色", "عاجي إلى أبيض كريمي", "Ivoire à blanc crème", "Elfenbein bis cremeweiß"],
  "Dark to light brown": ["深棕色至浅棕色", "짙은 갈색~연갈색", "濃茶色～薄茶色", "بني داكن إلى فاتح", "Brun foncé à clair", "Dunkel- bis hellbraun"],
  "Per contract and approved sample": ["按合同及确认样品", "계약 및 승인 샘플 기준", "契約および承認サンプルに準拠", "وفق العقد والعينة المعتمدة", "Selon contrat et échantillon approuvé", "Gemäß Vertrag und freigegebenem Muster"],
  "per approved sample": ["按确认样品", "승인 샘플 기준", "承認サンプルに準拠", "وفق العينة المعتمدة", "selon échantillon approuvé", "gemäß freigegebenem Muster"],
  "Small berries, size agreed by sample": ["小粒，粒径按样品确认", "작은 알갱이, 크기는 샘플로 확정", "小粒、粒径はサンプルで決定", "حبات صغيرة، يُتفق على الحجم وفق العينة", "Petites baies, calibre fixé sur échantillon", "Kleine Beeren, Größe nach Muster"],
  "Berry size 1–2.5 mm": ["粒径 1–2.5 mm", "알갱이 크기 1–2.5 mm", "粒径1～2.5 mm", "حجم الحبة 1–2.5 مم", "Calibre des baies 1–2,5 mm", "Beerengröße 1–2,5 mm"],
  "Natural reddish brown, mould-free": ["天然红棕色，无霉变", "자연스러운 적갈색, 곰팡이 없음", "自然な赤褐色、カビなし", "بني محمر طبيعي، خالٍ من العفن", "Brun rougeâtre naturel, sans moisissure", "Natürlich rotbraun, schimmelfrei"],
  "10 kg cartons or 20 kg PP bags": ["10 kg 纸箱或 20 kg PP 袋", "10 kg 카톤 박스 또는 20 kg PP 포대", "10 kg段ボール箱または20 kg PP袋", "كراتين 10 كغ أو أكياس PP ‏20 كغ", "Cartons de 10 kg ou sacs PP de 20 kg", "Kartons à 10 kg oder PP-Säcke à 20 kg"],
  "ISO 11178:1995 (Star anise — Specification)": ["ISO 11178:1995（八角 — 规格）", "ISO 11178:1995(팔각 — 규격)", "ISO 11178:1995（八角 — 規格）", "ISO 11178:1995 (اليانسون النجمي — المواصفات)", "ISO 11178:1995 (Badiane — Spécifications)", "ISO 11178:1995 (Sternanis — Spezifikation)"],
  "6–8 petals, whole stars 80% min": ["6–8 角，整朵率不低于 80%", "꽃잎 6–8개, 온전한 팔각 최소 80%", "花弁6～8枚、ホール率80%以上", "6–8 بتلات، النجوم الكاملة 80% كحد أدنى", "6–8 branches, étoiles entières 80 % min", "6–8 Zacken, ganze Sterne mind. 80 %"],
  "Natural deep reddish brown": ["天然深红棕色", "자연스러운 짙은 적갈색", "自然な濃い赤褐色", "بني محمر داكن طبيعي", "Brun rougeâtre foncé naturel", "Natürlich tief rotbraun"],
  "Petals 2.5 cm and up, whole stars 80% min": ["角瓣 2.5 cm 以上，整朵率不低于 80%", "꽃잎 2.5 cm 이상, 온전한 팔각 최소 80%", "花弁2.5 cm以上、ホール率80%以上", "بتلات 2.5 سم فأكثر، النجوم الكاملة 80% كحد أدنى", "Branches de 2,5 cm et plus, étoiles entières 80 % min", "Zacken ab 2,5 cm, ganze Sterne mind. 80 %"],
  "Natural light reddish brown": ["天然浅红棕色", "자연스러운 밝은 적갈색", "自然な明るい赤褐色", "بني محمر فاتح طبيعي", "Brun rougeâtre clair naturel", "Natürlich hell rotbraun"],
  "Petals 2 cm and up, whole stars 80% min": ["角瓣 2 cm 以上，整朵率不低于 80%", "꽃잎 2 cm 이상, 온전한 팔각 최소 80%", "花弁2 cm以上、ホール率80%以上", "بتلات 2 سم فأكثر، النجوم الكاملة 80% كحد أدنى", "Branches de 2 cm et plus, étoiles entières 80 % min", "Zacken ab 2 cm, ganze Sterne mind. 80 %"],
  "Loose petals; broken ratio and size agreed by sample": ["散瓣；碎率和尺寸按样品确认", "낱꽃잎, 파쇄율과 크기는 샘플로 확정", "ばらの花弁。欠け率とサイズはサンプルで決定", "بتلات منفصلة؛ يُتفق على نسبة الكسر والحجم وفق العينة", "Branches détachées ; taux de brisures et calibre fixés sur échantillon", "Lose Zacken; Bruchanteil und Größe nach Muster"],
  "Natural reddish brown bark": ["天然红棕色树皮", "자연스러운 적갈색 껍질", "自然な赤褐色の樹皮", "لحاء بني محمر طبيعي", "Écorce brun rougeâtre naturelle", "Natürlich rotbraune Rinde"],
  "10 kg cartons or 20–25 kg PP bags": ["10 kg 纸箱或 20–25 kg PP 袋", "10 kg 카톤 박스 또는 20–25 kg PP 포대", "10 kg段ボール箱または20～25 kg PP袋", "كراتين 10 كغ أو أكياس PP ‏20–25 كغ", "Cartons de 10 kg ou sacs PP de 20–25 kg", "Kartons à 10 kg oder PP-Säcke à 20–25 kg"],
  "ISO 6538:1997 (Cassia — Vietnamese type)": ["ISO 6538:1997（肉桂 — 越南型）", "ISO 6538:1997(카시아 — 베트남형)", "ISO 6538:1997（カシア — ベトナム型）", "ISO 6538:1997 (الكاسيا — النوع الفيتنامي)", "ISO 6538:1997 (Cassia — type vietnamien)", "ISO 6538:1997 (Cassia — vietnamesischer Typ)"],
  "Pieces 2–10 cm, 1–3 mm thick": ["碎片 2–10 cm，厚 1–3 mm", "조각 2–10 cm, 두께 1–3 mm", "欠片2～10 cm、厚さ1～3 mm", "قطع 2–10 سم بسماكة 1–3 مم", "Morceaux de 2–10 cm, 1–3 mm d’épaisseur", "Stücke 2–10 cm, 1–3 mm stark"],
  "Cut lengths 4–10 cm to order": ["按订单切段 4–10 cm", "주문에 따라 4–10 cm로 절단", "ご注文に応じて4～10 cmにカット", "أطوال مقطوعة 4–10 سم حسب الطلب", "Coupe de 4–10 cm sur commande", "Zuschnitt 4–10 cm auf Bestellung"],
  "Light golden brown (outer bark scraped)": ["浅金棕色（已刮去外皮）", "밝은 황갈색(겉껍질 제거)", "明るい黄金褐色（外皮削り）", "بني ذهبي فاتح (أزيلت القشرة الخارجية)", "Brun doré clair (écorce externe grattée)", "Hell goldbraun (Außenrinde geschabt)"],
  "25 kg PP bags or 10 kg cartons": ["25 kg PP 袋或 10 kg 纸箱", "25 kg PP 포대 또는 10 kg 카톤 박스", "25 kg PP袋または10 kg段ボール箱", "أكياس PP ‏25 كغ أو كراتين 10 كغ", "Sacs PP de 25 kg ou cartons de 10 kg", "PP-Säcke à 25 kg oder Kartons à 10 kg"],
  "Pieces 4 × 4 cm or 5 × 5 cm": ["方块 4 × 4 cm 或 5 × 5 cm", "4 × 4 cm 또는 5 × 5 cm 조각", "4 × 4 cmまたは5 × 5 cmの角切り", "قطع 4 × 4 سم أو 5 × 5 سم", "Carrés de 4 × 4 cm ou 5 × 5 cm", "Stücke 4 × 4 cm oder 5 × 5 cm"],
  "Length 30–40 cm (or cut to order)": ["长 30–40 cm（或按订单切段）", "길이 30–40 cm(또는 주문 절단)", "長さ30～40 cm（またはご注文に応じてカット）", "الطول 30–40 سم (أو يُقطع حسب الطلب)", "Longueur 30–40 cm (ou coupe sur commande)", "Länge 30–40 cm (oder Zuschnitt auf Bestellung)"],
  "Length 8–10 cm (6–30 cm to order)": ["长 8–10 cm（可按订单 6–30 cm）", "길이 8–10 cm(주문 시 6–30 cm)", "長さ8～10 cm（ご注文で6～30 cm）", "الطول 8–10 سم (6–30 سم حسب الطلب)", "Longueur 8–10 cm (6–30 cm sur commande)", "Länge 8–10 cm (6–30 cm auf Bestellung)"],
  "Specks 15 per 100 g max": ["斑点每 100 g 不超过 15 个", "반점 100 g당 최대 15개", "斑点100 gあたり最大15個", "البقع 15 لكل 100 غ كحد أقصى", "Points 15 max pour 100 g", "Stippen max. 15 je 100 g"],
  "Natural white": ["天然白色", "자연스러운 흰색", "自然な白", "أبيض طبيعي", "Blanc naturel", "Naturweiß"],
  "25 kg multi-wall kraft bags with PE liner": ["25 kg 多层牛皮纸袋，带 PE 内衬", "PE 내피가 있는 25 kg 다겹 크라프트 포대", "PE内袋付き25 kg多層クラフト袋", "أكياس كرافت متعددة الطبقات 25 كغ ببطانة PE", "Sacs kraft multiplis de 25 kg avec doublure PE", "Mehrlagige Kraftpapiersäcke à 25 kg mit PE-Inliner"],
  "APCC standard": ["APCC 标准", "APCC 기준", "APCC規格", "معيار APCC", "norme APCC", "APCC-Standard"],
  "Fine grade, approx. 1 mm granules": ["细粒，颗粒约 1 mm", "파인, 입자 약 1 mm", "ファイン、粒径約1 mm", "درجة ناعمة، حبيبات حوالي 1 مم", "Fine, granulés d’env. 1 mm", "Fein, Körnung ca. 1 mm"],
  "Medium grade, approx. 1.5–3 mm": ["中粒，约 1.5–3 mm", "미디엄, 약 1.5–3 mm", "ミディアム、約1.5～3 mm", "درجة متوسطة، حوالي 1.5–3 مم", "Moyenne, env. 1,5–3 mm", "Mittel, ca. 1,5–3 mm"],
  "Fine or medium to order": ["按订单提供细粒或中粒", "주문에 따라 파인 또는 미디엄", "ご注文に応じてファインまたはミディアム", "ناعم أو متوسط حسب الطلب", "Fine ou moyenne sur commande", "Fein oder mittel auf Bestellung"],
  "defect ratio agreed per grade": ["缺陷率按等级约定", "결점 비율은 등급별로 확정", "欠点率はグレードごとに決定", "يُتفق على نسبة العيوب لكل درجة", "taux de défauts fixé par grade", "Fehleranteil je Sorte vereinbart"],
  "Natural white to ivory": ["天然白色至象牙色", "자연스러운 흰색~아이보리", "自然な白～アイボリー", "أبيض طبيعي إلى عاجي", "Blanc naturel à ivoire", "Naturweiß bis elfenbein"],
  "Vacuum or CO₂-flushed PE/PA bags of 22.68 kg (50 lbs) in cartons": ["22.68 kg（50 磅）真空或充 CO₂ PE/PA 袋，纸箱包装", "22.68 kg(50 lbs) 진공 또는 CO₂ 충전 PE/PA 백, 카톤 박스 포장", "22.68 kg（50ポンド）の真空またはCO₂充填PE/PA袋、段ボール箱入り", "أكياس PE/PA مفرغة أو معبأة بثاني أكسيد الكربون 22.68 كغ (50 رطلًا) في كراتين", "Sachets PE/PA sous vide ou sous CO₂ de 22,68 kg (50 lb) en cartons", "Vakuum- oder CO₂-begaste PE/PA-Beutel à 22,68 kg (50 lbs) im Karton"],
  "20'FCL: 700 cartons ≈ 15.88 t": ["20'FCL：700 箱 ≈ 15.88 吨", "20'FCL: 700박스 ≈ 15.88톤", "20'FCL：700箱 ≈ 15.88トン", "20'FCL: ‏700 كرتونة ≈ 15.88 طن", "20'FCL : 700 cartons ≈ 15,88 t", "20'FCL: 700 Kartons ≈ 15,88 t"],
  "Phytosanitary certificate, registered growing area & packhouse codes; GlobalG.A.P./VietGAP per market": ["植物检疫证书、已登记的种植区及包装厂代码；按市场要求提供 GlobalG.A.P./VietGAP", "식물검역증명서, 등록된 재배지 및 포장장 코드, 시장별 GlobalG.A.P./VietGAP", "植物検疫証明書、登録済みの栽培地・包装施設コード、市場に応じてGlobalG.A.P./VietGAP", "شهادة صحة نباتية ورموز مسجلة لمنطقة الزراعة ومحطة التعبئة؛ GlobalG.A.P./VietGAP حسب السوق", "Certificat phytosanitaire, codes de zone de culture et de station de conditionnement ; GlobalG.A.P./VietGAP selon le marché", "Pflanzengesundheitszeugnis, registrierte Anbau- und Packstationscodes; GlobalG.A.P./VietGAP je nach Markt"],
  "300–600 g per fruit, sized to order": ["每个 300–600 g，按订单分级", "개당 300–600 g, 주문에 따라 선별", "1個300～600 g、ご注文に応じてサイズ選別", "300–600 غ للثمرة، تُصنّف حسب الطلب", "300–600 g par fruit, calibré sur commande", "300–600 g pro Frucht, nach Bestellung sortiert"],
  "Green turning yellow with ripeness": ["随成熟由绿转黄", "익으면서 초록에서 노랑으로 변함", "熟すにつれ緑から黄色へ", "أخضر يتحول إلى أصفر مع النضج", "Vert virant au jaune à maturité", "Grün, mit der Reife gelb werdend"],
  "5 kg or 10 kg cartons with foam nets": ["5 kg 或 10 kg 纸箱，配泡沫网套", "5 kg 또는 10 kg 카톤 박스, 폼 네트", "5 kgまたは10 kg段ボール箱、フォームネット付き", "كراتين 5 أو 10 كغ مع شبكات إسفنجية", "Cartons de 5 ou 10 kg avec filets mousse", "Kartons à 5 oder 10 kg mit Schaumnetzen"],
  "Bright red skin, green bracts, red flesh": ["果皮鲜红、鳞片翠绿、红肉", "선명한 빨간 껍질, 초록 비늘, 붉은 과육", "鮮やかな赤い皮、緑のうろこ、赤い果肉", "قشرة حمراء زاهية وقنابات خضراء ولب أحمر", "Peau rouge vif, bractées vertes, chair rouge", "Leuchtend rote Schale, grüne Schuppen, rotes Fruchtfleisch"],
  "5 kg or 10 kg cartons": ["5 kg 或 10 kg 纸箱", "5 kg 또는 10 kg 카톤 박스", "5 kgまたは10 kg段ボール箱", "كراتين 5 أو 10 كغ", "Cartons de 5 ou 10 kg", "Kartons à 5 oder 10 kg"],
  "Even netting, orange flesh": ["网纹均匀，橙色果肉", "고른 그물무늬, 주황색 과육", "均一なネット、オレンジ色の果肉", "شبكة متجانسة ولب برتقالي", "Brodage régulier, chair orange", "Gleichmäßige Netzung, orangefarbenes Fruchtfleisch"],
  "Glossy green skin, buttery yellow flesh": ["果皮亮绿，果肉黄油色", "윤기 나는 초록 껍질, 버터 같은 노란 과육", "つやのある緑の皮、バターのような黄色い果肉", "قشرة خضراء لامعة ولب أصفر زبدي", "Peau verte brillante, chair jaune beurrée", "Glänzend grüne Schale, buttrig gelbes Fruchtfleisch"],
  "Green-to-yellow skin, golden flesh": ["果皮由绿转黄，金黄色果肉", "초록~노랑 껍질, 황금색 과육", "緑～黄色の皮、黄金色の果肉", "قشرة من الأخضر إلى الأصفر ولب ذهبي", "Peau verte à jaune, chair dorée", "Grün-gelbe Schale, goldenes Fruchtfleisch"],
  "Purple skin, yellow pulp": ["紫色果皮，黄色果瓤", "보라색 껍질, 노란 과육", "紫の皮、黄色の果肉", "قشرة بنفسجية ولب أصفر", "Peau violette, pulpe jaune", "Violette Schale, gelbes Fruchtmark"],
  "Fingers 18–24 cm, clusters 1–2 kg": ["果指 18–24 cm，每梳 1–2 kg", "바나나 한 개 18–24 cm, 송이 1–2 kg", "1本18～24 cm、房1～2 kg", "الإصبع 18–24 سم، العنقود 1–2 كغ", "Doigts de 18–24 cm, mains de 1–2 kg", "Finger 18–24 cm, Hände 1–2 kg"],
  "Mature green at shipment": ["出货时为成熟青果", "선적 시 성숙한 녹색", "出荷時は成熟した緑色", "خضراء مكتملة النمو عند الشحن", "Vert mature à l’expédition", "Reif-grün bei Verschiffung"],
  "40'RF: approx. 1,540 cartons ≈ 20 t": ["40'RF：约 1,540 箱 ≈ 20 吨", "40'RF: 약 1,540박스 ≈ 20톤", "40'RF：約1,540箱 ≈ 20トン", "40'RF: حوالي 1,540 كرتونة ≈ 20 طن", "40'RF : env. 1 540 cartons ≈ 20 t", "40'RF: ca. 1.540 Kartons ≈ 20 t"],
  "Green to yellow skin, pink or white segments": ["果皮绿至黄，果瓣粉红或白色", "초록~노랑 껍질, 분홍 또는 흰 과육", "緑～黄色の皮、ピンクまたは白の果肉", "قشرة خضراء إلى صفراء وفصوص وردية أو بيضاء", "Peau verte à jaune, quartiers roses ou blancs", "Grüne bis gelbe Schale, rosa oder weiße Segmente"],
  "Green husk, yellow flesh": ["绿色外壳，黄色果肉", "초록 껍질, 노란 과육", "緑の殻、黄色の果肉", "قشرة خضراء ولب أصفر", "Écorce verte, chair jaune", "Grüne Schale, gelbes Fruchtfleisch"],
  "paddy 10 grains/kg max": ["稻谷每 kg 不超过 10 粒", "벼 알곡 kg당 최대 10립", "籾1 kgあたり最大10粒", "حبات الأرز غير المقشور 10 حبات/كغ كحد أقصى", "paddy 10 grains/kg max", "Rohreis max. 10 Körner/kg"],
  "well milled, double polished": ["精碾，双重抛光", "정미, 2회 연마", "精米、2回研磨", "مضروب جيدًا، ملمّع مرتين", "bien usiné, double polissage", "gut geschliffen, doppelt poliert"],
  "Translucent white, uniform grains": ["白色透亮，米粒均匀", "투명한 흰색, 고른 낟알", "透明感のある白、粒ぞろい", "أبيض شفاف وحبات متجانسة", "Blanc translucide, grains réguliers", "Durchscheinend weiß, gleichmäßige Körner"],
  "25 kg / 50 kg PP bags, private print on request": ["25 kg / 50 kg PP 袋，可按要求定制印刷", "25 kg / 50 kg PP 포대, 요청 시 자체 인쇄", "25 kg / 50 kg PP袋、ご要望で専用印刷", "أكياس PP ‏25 / 50 كغ، طباعة خاصة عند الطلب", "Sacs PP de 25 / 50 kg, impression personnalisée sur demande", "PP-Säcke à 25 / 50 kg, eigener Druck auf Wunsch"],
  "TCVN 11888:2017 (White rice)": ["TCVN 11888:2017（白米）", "TCVN 11888:2017(백미)", "TCVN 11888:2017（白米）", "TCVN 11888:2017 (الأرز الأبيض)", "TCVN 11888:2017 (riz blanc)", "TCVN 11888:2017 (Weißreis)"],
  "Translucent white, light fragrance": ["白色透亮，淡淡清香", "투명한 흰색, 은은한 향", "透明感のある白、ほのかな香り", "أبيض شفاف ورائحة خفيفة", "Blanc translucide, parfum léger", "Durchscheinend weiß, leichter Duft"],
};

/* ------------------------------------------------------------------ */
/* Patterns for repeated forms                                         */
/* ------------------------------------------------------------------ */

const WORD = {
  max: ["最高", "최대", "最大", "كحد أقصى", "max", "max."],
  min: ["不低于", "최소", "以上", "كحد أدنى", "min", "mind."],
  approx: ["约", "약", "約", "حوالي", "env.", "ca."],
  or: ["或", "또는", "または", "أو", "ou", "oder"],
};
const w = (key, lang) => pick(WORD[key], lang);

// "<label> 5% max" / "<label> 80% min" with a translated label.
const LABEL = {
  "black & broken": ["黑豆及碎豆", "흑두·파쇄두", "黒豆・欠け豆", "الحبوب السوداء والمكسورة", "grains noirs et brisés", "Schwarz- & Bruchbohnen"],
  "light berries": ["轻粒", "경량 알갱이", "軽い粒", "الحبات الخفيفة", "baies légères", "leichte Beeren"],
  "black berries": ["黑粒", "검은 알갱이", "黒い粒", "الحبات السوداء", "baies noires", "schwarze Beeren"],
  broken: ["碎米", "싸라기", "砕米", "المكسور", "brisures", "Bruch"],
  FFA: ["游离脂肪酸", "유리지방산", "遊離脂肪酸", "الأحماض الدهنية الحرة", "AGL", "FFA"],
  fat: ["脂肪", "지방", "脂肪", "الدهن", "matières grasses", "Fett"],
  "volatile oil": ["挥发油", "휘발성 오일", "揮発油", "الزيت الطيار", "huile volatile", "ätherisches Öl"],
};

function limit(value, kind, lang, label) {
  const v = num(value, lang);
  const l = label ? pick(LABEL[label], lang) : "";
  switch (lang) {
    case "zh": return kind === "max" ? `${l}${l ? " " : ""}≤ ${v}` : `${l}${l ? " " : ""}≥ ${v}`;
    case "ko": return `${l}${l ? " " : ""}${w(kind, lang)} ${v}`;
    case "ja": return `${l}${l ? " " : ""}${v}${kind === "max" ? "以下" : "以上"}`;
    case "ar": return `${l}${l ? " " : ""}${v} ${w(kind, lang)}`;
    case "fr": return `${l}${l ? " " : ""}${v.replace("%", " %")} ${w(kind, lang)}`;
    default: return `${l}${l ? " " : ""}${w(kind, lang)} ${v.replace("%", " %")}`;
  }
}

const TONNE = ["吨", "톤", "トン", "طن", "t", "t"];
const KG_CARTONS = (range, lang) => pick([`${range} kg 纸箱`, `${range} kg 카톤 박스`, `${range} kg段ボール箱`, `كراتين ${range} كغ`, `Cartons de ${range} kg`, `Kartons à ${range} kg`], lang);
const KG_PP = (range, lang) => pick([`${range} kg PP 袋`, `${range} kg PP 포대`, `${range} kg PP袋`, `أكياس PP ‏${range} كغ`, `Sacs PP de ${range} kg`, `PP-Säcke à ${range} kg`], lang);
const LENGTH = { Length: ["长", "길이", "長さ", "الطول", "Longueur", "Länge"], width: ["宽", "폭", "幅", "العرض", "largeur", "Breite"], thickness: ["厚", "두께", "厚さ", "السماكة", "épaisseur", "Stärke"], Sticks: ["条长", "스틱 길이", "スティック長さ", "أعواد بطول", "Bâtons de", "Stangen"], "tube Ø": ["管径", "관 직경", "筒径", "قطر الأنبوب", "tube Ø", "Röhren-Ø"] };

const PATTERNS = [
  [/^(\d[\d.,–]*%) (max|min)$/, (m, lang) => limit(m[1], m[2], lang)],
  [/^(black & broken|light berries|black berries|broken|FFA|fat) (\d[\d.,–]*%) (max|min)$/, (m, lang) => limit(m[2], m[3], lang, m[1])],
  [/^(fat|volatile oil) (\d[\d.,–]*%)$/, (m, lang) => `${pick(LABEL[m[1]], lang)} ${num(m[2], lang).replace(/%$/, lang === "fr" || lang === "de" ? " %" : "%")}`],
  [/^(20'FCL|40'HC|40'RF): approx\. ([\d.,–]+) t$/, (m, lang) => {
    const v = num(m[2], lang);
    const t = pick(TONNE, lang);
    if (lang === "zh") return `${m[1]}：${w("approx", lang)} ${v} ${t}`;
    if (lang === "ja") return `${m[1]}：${w("approx", lang)}${v}${t}`;
    if (lang === "ko") return `${m[1]}: ${w("approx", lang)} ${v}${t}`;
    if (lang === "fr") return `${m[1]} : ${w("approx", lang)} ${v} ${t}`;
    return `${m[1]}: ${w("approx", lang)} ${v} ${t}`;
  }],
  [/^Bulk density (.+)$/, (m, lang) => `${pick(["容重", "용적 밀도", "かさ密度", "الكثافة الظاهرية", "Masse volumique", "Schüttdichte"], lang)} ${num(m[1], lang).replace(" or ", ` ${w("or", lang)} `)}`],
  [/^([\d.,–]+) (g|kg) per fruit$/, (m, lang) => {
    const v = `${num(m[1], lang)} ${m[2]}`;
    return pick([`每个 ${v}`, `개당 ${v}`, `1個${v}`, `${v} للثمرة`, `${v} par fruit`, `${v} pro Frucht`], lang);
  }],
  [/^([\d–]+) kg cartons$/, (m, lang) => KG_CARTONS(m[1], lang)],
  [/^([\d–]+) kg PP bags$/, (m, lang) => KG_PP(m[1], lang)],
  [/^(Length|width|thickness|Sticks|tube Ø) ([\d.,–]+) (cm|mm)$/, (m, lang) => `${pick(LENGTH[m[1]], lang)} ${num(m[2], lang)} ${m[3]}`],
  [/^Ø ([\d.,–]+) cm$/, (m, lang) => `Ø ${num(m[1], lang)} cm`],
  [/^Screen (\d+) \(([\d,]+) mm\): 90% min above screen$/, (m, lang) => pick([
    `${m[1]} 号筛（${m[2].replace(",", ".")} mm）：筛上不低于 90%`,
    `스크린 ${m[1]}(${m[2].replace(",", ".")} mm): 스크린 위 최소 90%`,
    `スクリーン${m[1]}（${m[2].replace(",", ".")} mm）：ふるい上90%以上`,
    `غربال ${m[1]} (${m[2].replace(",", ".")} مم): 90% كحد أدنى فوق الغربال`,
    `Crible ${m[1]} (${m[2]} mm) : 90 % min au-dessus du crible`,
    `Sieb ${m[1]} (${m[2]} mm): mind. 90 % über Sieb`,
  ], lang)],
  [/^Average grain length ≥ ([\d,]+) mm$/, (m, lang) => pick([
    `平均粒长 ≥ ${m[1].replace(",", ".")} mm`, `평균 낟알 길이 ≥ ${m[1].replace(",", ".")} mm`, `平均粒長 ≥ ${m[1].replace(",", ".")} mm`,
    `متوسط طول الحبة ≥ ${m[1].replace(",", ".")} مم`, `Longueur moyenne du grain ≥ ${m[1]} mm`, `Durchschnittliche Kornlänge ≥ ${m[1]} mm`,
  ], lang)],
];

/* Cashew records follow one template: size × form. */
const CASHEW_FORM = {
  whole: ["整粒", "통알", "ホール", "كاملة", "entières", "ganz"],
  splits: ["对半", "반쪽", "スプリット", "أنصاف", "moitiés", "Hälften"],
  pieces: ["碎粒", "조각", "ピース", "قطع", "brisures", "Bruch"],
};
const cashewSize = (size, lang) => size.replace("green", pick(["青", "그린", "グリーン", "خضراء", "vert", "grün"], lang));

const TEMPLATES = [
  [/^Green Robusta size (\d+) – (Clean|Non-clean)$/, (m, lang) => {
    const clean = m[2] === "Clean";
    return pick([
      `罗布斯塔生咖啡豆 ${m[1]} 号筛 – ${clean ? "清洁" : "未清洁"}`,
      `로부스타 생두 스크린 ${m[1]} – ${clean ? "클린" : "논클린"}`,
      `ロブスタ生豆 スクリーン${m[1]} – ${clean ? "クリーン" : "ノンクリーン"}`,
      `بن روبوستا أخضر غربال ${m[1]} – ${clean ? "منظّف" : "غير منظّف"}`,
      `Robusta vert calibre ${m[1]} – ${clean ? "nettoyé" : "non nettoyé"}`,
      `Grüner Robusta Sieb ${m[1]} – ${clean ? "gereinigt" : "ungereinigt"}`,
    ], lang);
  }],
  [/^Cashew ([\w ]+?) · (whole|splits|pieces)$/, (m, lang) => {
    const size = cashewSize(m[1], lang);
    const form = pick(CASHEW_FORM[m[2]], lang);
    return pick([`腰果 ${size} · ${form}`, `캐슈넛 ${size} · ${form}`, `カシューナッツ ${size} · ${form}`, `كاجو ${size} · ${form}`, `Noix de cajou ${size} · ${form}`, `Cashewkerne ${size} · ${form}`], lang);
  }],
  [/^Cashew kernels size ([\w ]+?), (whole|splits|pieces)\. Export grade, defect ratio and physical sample are confirmed before quotation\.$/, (m, lang) => {
    const size = cashewSize(m[1], lang);
    const form = pick(CASHEW_FORM[m[2]], lang);
    return pick([
      `腰果仁 ${size} 号，${form}。出口等级、缺陷率和实物样品在报价前确认。`,
      `캐슈넛 사이즈 ${size}, ${form}. 수출 등급, 결점 비율과 실물 샘플은 견적 전에 확정합니다.`,
      `カシューナッツ サイズ${size}、${form}。輸出グレード、欠点率、現物サンプルは見積り前に確認します。`,
      `كاجو مقاس ${size}، ${form}. تُؤكَّد درجة التصدير ونسبة العيوب والعينة الفعلية قبل عرض السعر.`,
      `Noix de cajou calibre ${size}, ${form}. Grade export, taux de défauts et échantillon physique confirmés avant devis.`,
      `Cashewkerne Größe ${size}, ${form}. Exportsorte, Fehleranteil und physisches Muster werden vor dem Angebot bestätigt.`,
    ], lang);
  }],
  [/^Size ([\w ]+?) · (whole|splits|pieces) \(confirmed by sample, not auto-mapped to WW grades\)$/, (m, lang) => {
    const size = cashewSize(m[1], lang);
    const form = pick(CASHEW_FORM[m[2]], lang);
    return pick([
      `${size} 号 · ${form}（以样品确认，不自动对应 WW 等级）`,
      `사이즈 ${size} · ${form}(샘플로 확인, WW 등급으로 자동 환산하지 않음)`,
      `サイズ${size} · ${form}（サンプルで確認、WWグレードへの自動換算なし）`,
      `مقاس ${size} · ${form} (يُؤكَّد بالعينة، دون مطابقة تلقائية لدرجات WW)`,
      `Calibre ${size} · ${form} (confirmé sur échantillon, sans correspondance automatique WW)`,
      `Größe ${size} · ${form} (per Muster bestätigt, nicht automatisch WW-Sorten zugeordnet)`,
    ], lang);
  }],
];

const FRUIT_SHORT = /^(.+) from Vietnam's growing regions, sized, ripened and packed to destination requirements\.$/;

function segment(text, lang) {
  if (SEGMENT[text]) return pick(SEGMENT[text], lang);
  for (const [pattern, render] of PATTERNS) {
    const match = text.match(pattern);
    if (match) return render(match, lang);
  }
  // Standards and codes (TCVN, ISO, CODEX, ASTA, AFI, ESA …) read the same everywhere.
  if (/^(TCVN|ISO|CODEX|ASTA|AFI|ESA)\b/.test(text)) return text;
  return null;
}

/**
 * Translate one catalogue string from English. Returns the English text when
 * no translation is known (for example copy typed in Admin).
 * `name` is the product's localised name, used by the fresh-fruit template.
 */
export function translateCatalogText(text, lang, name) {
  if (!text || !LANGS.includes(lang)) return text;
  if (TEXT[text]) return pick(TEXT[text], lang);
  for (const [pattern, render] of TEMPLATES) {
    const match = text.match(pattern);
    if (match) return render(match, lang);
  }
  const fruit = text.match(FRUIT_SHORT);
  if (fruit) {
    const n = name || fruit[1];
    return pick([
      `${n}来自越南产区，按目的市场要求分级、催熟和包装。`,
      `베트남 산지의 ${n}로, 도착 시장 요건에 맞춰 선별·숙성·포장합니다.`,
      `ベトナム産地の${n}。仕向け市場の要件に合わせて選別・追熟・包装します。`,
      `${n} من مناطق الزراعة في فيتنام، يُصنَّف ويُنضَج ويُعبّأ وفق متطلبات سوق الوصول.`,
      `${n} des régions de culture du Vietnam, calibré, mûri et conditionné selon les exigences du marché de destination.`,
      `${n} aus den Anbaugebieten Vietnams, sortiert, gereift und nach den Anforderungen des Ziellandes verpackt.`,
    ], lang);
  }
  const parts = text.split(" · ");
  const translated = parts.map((part) => segment(part, lang));
  return translated.every((part) => part !== null) ? translated.join(" · ") : text;
}

/** Specification notice for every language (vi/en live in catalog-v6.js). */
export const SPEC_NOTICE_I18N = {
  zh: "以上数据为询价参考指标，最终规格以合同、确认样品及每批货物的 COA 为准。",
  ko: "수치는 견적 문의를 위한 참고 규격입니다. 최종 규격은 계약, 승인 샘플 및 각 로트의 COA로 확정합니다.",
  ja: "数値はお見積り用の参考規格です。最終規格は契約、承認サンプル、各ロットのCOAで確定します。",
  ar: "الأرقام مواصفات مرجعية للاستفسار. تُؤكَّد المواصفات النهائية بالعقد والعينة المعتمدة وشهادة التحليل (COA) لكل دفعة.",
  fr: "Les valeurs sont des spécifications de référence pour une demande de prix. Les spécifications finales sont confirmées par contrat, échantillon approuvé et COA de chaque lot.",
  de: "Die Werte sind Referenzspezifikationen für eine Anfrage. Die endgültigen Spezifikationen werden durch Vertrag, freigegebenes Muster und das COA jeder Partie bestätigt.",
};
