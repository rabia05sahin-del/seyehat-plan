import { TravelPlan, TravelPlanRequest, MustSeePlace, DayItinerary, LocalDish } from '../types/travel';

// Knowledge base for iconic domestic & international destinations
interface CityKnowledge {
  name: string;
  tagline: string;
  mustSee: MustSeePlace[];
  cuisine: LocalDish[];
  transit: string;
  visaNote: string;
}

const DESTINATION_DATABASE: Record<string, CityKnowledge> = {
  kapadokya: {
    name: 'Kapadokya (Nevşehir)',
    tagline: 'Peri bacaları, yeraltı şehirleri ve gökyüzünde süzülen renkli balonlar',
    mustSee: [
      {
        id: 'kap-1',
        name: 'Göreme Açık Hava Müzesi',
        category: 'museum',
        shortDescription: 'Kaya içine oyulmuş 10. yüzyıl Bizans kiliseleri ve korunmuş freskler.',
        whyVisit: 'UNESCO Dünya Mirası listesinde yer alan en görkemli manastır yerleşimi.',
        estimatedDuration: '2 - 2.5 saat',
        costCategory: 'medium',
        ticketPriceEstimated: 'Müzekart geçerli',
        bestTimeToVisit: 'Sabah 08:30 (tur otobüslerinden önce)',
        insiderTip: 'Karanlık Kilise\'nin duvar freskleri gün ışığı görmediği için dün boyanmış gibi canlıdır.',
        googleMapsQuery: 'Goreme Open Air Museum Cappadocia',
      },
      {
        id: 'kap-2',
        name: 'Aşk Vadisi (Love Valley) & Balon Seyir Tepesi',
        category: 'viewpoint',
        shortDescription: 'Devasa silindirik peri bacaları ve gün doğumu balon manzarası.',
        whyVisit: 'Yüzlerce balonun peri bacaları arasından kalkışını en iyi görebileceğiniz nokta.',
        estimatedDuration: '1.5 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Ücretsiz',
        bestTimeToVisit: 'Gün doğumu (05:45 - 07:00)',
        insiderTip: 'Yanınıza termosla sıcak kahve alın, sabah serinliğinde balon kalkışını izlemek büyüleyicidir.',
        googleMapsQuery: 'Love Valley Goreme Cappadocia',
      },
      {
        id: 'kap-3',
        name: 'Uçhisar Kalesi',
        category: 'historic',
        shortDescription: 'Bölgenin en yüksek noktası olan devasa doğal kaya kütlesi.',
        whyVisit: '360 derece tüm vadileri ve Erciyes Dağı\'nı aynı anda görebileceğiniz zirve.',
        estimatedDuration: '1 - 1.5 saat',
        costCategory: 'low',
        ticketPriceEstimated: 'Uygun belediye bileti / Öğrenci indirimi var',
        bestTimeToVisit: 'Gün batımından 1 saat önce',
        insiderTip: 'Zirveye tırmanırken spor ayakkabı tercih edin; merdivenler yer yer dikleşir.',
        googleMapsQuery: 'Uchisar Castle Cappadocia',
      },
      {
        id: 'kap-4',
        name: 'Derinkuyu Yeraltı Şehri',
        category: 'historic',
        shortDescription: '85 metre derinliğe inen 8 katlı antik yeraltı sığınağı.',
        whyVisit: 'Havalandırma bacaları ve taş kapılarıyla binlerce insanın yeraltında nasıl yaşadığını gösteren mühendislik harikası.',
        estimatedDuration: '1.5 saat',
        costCategory: 'medium',
        ticketPriceEstimated: 'Müzekart geçerli',
        bestTimeToVisit: 'Öğle saatleri (yeraltı yaz-kış 13°C serindir)',
        insiderTip: 'Dar tünellerden geçerken hafif bir hırka giymek iyi olur.',
        googleMapsQuery: 'Derinkuyu Underground City Cappadocia',
      },
      {
        id: 'kap-5',
        name: 'Paşabağ (Keşişler Vadisi)',
        category: 'nature',
        shortDescription: 'Çok başlı ve şapkalı en karakteristik peri bacaları.',
        whyVisit: 'Aziz Simeon\'un inzivaya çekildiği kaya hücrelerini yakından görmek için.',
        estimatedDuration: '1 saat',
        costCategory: 'medium',
        ticketPriceEstimated: 'Müzekart geçerli',
        bestTimeToVisit: 'İkindi vakti (16:00)',
        insiderTip: 'Vadi girişindeki taze sıkılmış nar-portakal suyunu deneyin.',
        googleMapsQuery: 'Pasabag Monks Valley Cappadocia',
      },
      {
        id: 'kap-6',
        name: 'Avanos Çömlek Atölyeleri & Kızılırmak',
        category: 'food',
        shortDescription: 'Hititlerden miras kalan Kızılırmak kiliyle geleneksel çömlek yapımı.',
        whyVisit: 'Çömlek ustalarının tezgâhında ücretsiz çark deneyimi yaşayabilirsiniz.',
        estimatedDuration: '2 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Atölye ziyareti ücretsiz',
        bestTimeToVisit: 'Öğleden sonra',
        insiderTip: 'Kızılırmak üzerindeki sallanan tahta köprüden geçip kazları izleyin.',
        googleMapsQuery: 'Avanos Kizilirmak Cappadocia',
      },
    ],
    cuisine: [
      {
        dishName: 'Testi Kebabı',
        description: 'Kuzu eti ve sebzelerin kille mühürlenmiş toprak testide közde saatlerce pişirilip masada çekiçle kırılması.',
        whereToEat: 'Göreme ve Uçhisar yerel restoranları',
        budgetFriendly: false,
      },
      {
        dishName: 'Nevşehir Tavası',
        description: 'Kuzu kıyması, sarımsak, domates ve biberin taş fırında güveçte kızarması.',
        whereToEat: 'Nevşehir Merkez ve Avanos taş fırınları',
        budgetFriendly: true,
      },
      {
        dishName: 'Kapadokya Mantısı & Gözleme',
        description: 'İncecik hamur, nohutlu veya kıymalı iç harç, sarımsaklı yoğurt ve kızgın tereyağlı nane.',
        whereToEat: 'Çavuşin köyü kadın kooperatifi',
        budgetFriendly: true,
      },
    ],
    transit: 'Göreme, Avanos ve Ürgüp arasında dolmuşlar sıktır. Vadilerin iç patikaları yürüyerek veya ATV turuyla keşfedilir.',
    visaNote: 'Yurt içi seyahat olduğu için T.C. Kimlik kartınız ve Müzekart\'ınız yeterlidir.',
  },
  istanbul: {
    name: 'İstanbul',
    tagline: 'İki kıtayı birleştiren bin yıllık imparatorluklar başkenti',
    mustSee: [
      {
        id: 'ist-1',
        name: 'Tarihi Yarımada & Sultanahmet Camii',
        category: 'historic',
        shortDescription: 'Bizans ve Osmanlı mirasının kalbi, hipodrom ve anıtsal meydan.',
        whyVisit: 'İstanbul\'un yüzyıllara meydan okuyan silüetini hissetmek için.',
        estimatedDuration: '2.5 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Meydan ücretsiz, müze kısımları girişli',
        bestTimeToVisit: 'Sabah 09:00',
        insiderTip: 'Sultanahmet Köftecisi\'nde irmik helvası ve piyazla mola verin.',
        googleMapsQuery: 'Sultanahmet Square Istanbul',
      },
      {
        id: 'ist-2',
        name: 'Ayasofya & Yerebatan Sarnıcı',
        category: 'historic',
        shortDescription: '1500 yıllık mimari şaheser ve sular altındaki Medusa sütunları.',
        whyVisit: 'Dünya mimarlık tarihinin en önemli kubbeli yapılarından biri.',
        estimatedDuration: '2 saat',
        costCategory: 'medium',
        ticketPriceEstimated: 'Müzekart & Ziyaretçi bileti',
        bestTimeToVisit: 'Öğle saatleri',
        insiderTip: 'Yerebatan Sarnıcı\'nın loş ışıklandırması ve akustiği fotoğraf için büyüleyicidir.',
        googleMapsQuery: 'Basilica Cistern Istanbul',
      },
      {
        id: 'ist-3',
        name: 'Galata Kulesi & Karaköy Sokakları',
        category: 'viewpoint',
        shortDescription: 'Cenevizlilerden kalan tarihi kule ve 360 derece Haliç manzarası.',
        whyVisit: 'İstanbul\'un en ikonik manzarasını gün batımında izlemek için.',
        estimatedDuration: '1.5 saat',
        costCategory: 'medium',
        ticketPriceEstimated: 'Müzekart geçerli',
        bestTimeToVisit: 'Gün batımı saatleri',
        insiderTip: 'Kuledan indikten sonra Karaköy\'ün ara sokaklarındaki 3. nesil kahvecilere uğrayın.',
        googleMapsQuery: 'Galata Tower Istanbul',
      },
      {
        id: 'ist-4',
        name: 'Boğaz Vapuru Turu (Eminönü - Kadıköy / Üsküdar)',
        category: 'nature',
        shortDescription: 'Martılara simit atarak kıtalararası geçiş ve deniz havası.',
        whyVisit: 'İstanbul\'u denizden izlemenin en ekonomik ve keyifli yolu.',
        estimatedDuration: '45 dakika',
        costCategory: 'low',
        ticketPriceEstimated: 'İstanbulkart ile standart toplu taşıma',
        bestTimeToVisit: 'İkindi güneşi',
        insiderTip: 'Vapurun arka açık güvertesinde oturup çay için.',
        googleMapsQuery: 'Eminonu Ferry Pier Istanbul',
      },
      {
        id: 'ist-5',
        name: 'Kapalıçarşı & Mısır Çarşısı',
        category: 'shopping',
        shortDescription: 'Dünyanın en eski ve en büyük üstü kapalı alışveriş labirenti.',
        whyVisit: 'Baharat kokuları, lokumlar, antika ve deri ustalarını keşfetmek için.',
        estimatedDuration: '2 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Giriş ücretsiz',
        bestTimeToVisit: 'Öğleden sonra',
        insiderTip: 'Közde Türk kahvesi yapan Şark Kahvesi\'nde dinlenin.',
        googleMapsQuery: 'Grand Bazaar Istanbul',
      },
      {
        id: 'ist-6',
        name: 'Balat & Fener Renkli Evleri',
        category: 'historic',
        shortDescription: 'Tarihi Rum patrikhanesi, merdivenli yokuşlar ve antika dükkanları.',
        whyVisit: 'Nostaljik sokak dokusu ve rengarenk cumbalı evler için.',
        estimatedDuration: '2 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Ücretsiz sokak gezisi',
        bestTimeToVisit: 'Öğle üzeri',
        insiderTip: 'Fener Rum Erkek Lisesi\'nin kırmızı tuğlalı şatosu muhteşem bir fotoğraf fonudur.',
        googleMapsQuery: 'Balat Colorful Houses Istanbul',
      },
    ],
    cuisine: [
      {
        dishName: 'Tarihi Sultanahmet Köftesi',
        description: 'Özel baharat karışımlı ızgara köfte, piyaz ve acı sos.',
        whereToEat: 'Tarihi Sultanahmet Köftecisi (1920)',
        budgetFriendly: true,
      },
      {
        dishName: 'Balık Ekmek & Turşu Suyu',
        description: 'Taze ızgara uskumru, çıtır ekmek ve közlenmiş soğan.',
        whereToEat: 'Eminönü veya Karaköy sahil tezgahları',
        budgetFriendly: true,
      },
      {
        dishName: 'Karaköy Güllüoğlu Baklavası',
        description: 'Antep fıstıklı sıcak şerbetli çıtır baklava ve manda kaymağı.',
        whereToEat: 'Karaköy Rıhtım caddesi',
        budgetFriendly: false,
      },
    ],
    transit: 'İstanbulkart ile metro, tramvay, füniküler ve vapurlar son derece pratiktir. Taksi yerine raylı sistem ve vapur tercih edin.',
    visaNote: 'T.C. Kimlik kartı ve dijital İstanbulkart uygulaması yeterlidir.',
  },
  antalya: {
    name: 'Antalya & Kaş',
    tagline: 'Turkuaz Akdeniz kıyıları, antik Likya kentleri ve kanyonlar',
    mustSee: [
      {
        id: 'ant-1',
        name: 'Kaleiçi & Hadrian Kapısı (Üçkapılar)',
        category: 'historic',
        shortDescription: 'Roma surları, Osmanlı konakları ve yat limanına inen taş sokaklar.',
        whyVisit: 'Antalya\'nın tarihi kalbini ve deniz manzarasını yaşamak için.',
        estimatedDuration: '2 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Ücretsiz',
        bestTimeToVisit: 'Akşamüstü serinliği',
        insiderTip: 'Hıdırlık Kulesi yanından falezler üzerinden gün batımını izleyin.',
        googleMapsQuery: 'Hadrian Gate Kaleici Antalya',
      },
      {
        id: 'ant-2',
        name: 'Kaputaş Plajı',
        category: 'nature',
        shortDescription: 'Kanyon ağzında turkuaz renkli doğa harikası kumsal.',
        whyVisit: 'Türkiye\'nin en meşhur turkuaz suyunda yüzmek için.',
        estimatedDuration: '2 - 3 saat',
        costCategory: 'low',
        ticketPriceEstimated: 'Plaja giriş ücretsiz (Şezlong opsiyonel)',
        bestTimeToVisit: 'Sabah 09:00 - 11:00 arası',
        insiderTip: 'Merdivenlerden inerken panoramik fotoğraf çekmeyi unutmayın.',
        googleMapsQuery: 'Kaputas Beach Kas Antalya',
      },
      {
        id: 'ant-3',
        name: 'Düden & Kurşunlu Şelaleleri',
        category: 'nature',
        shortDescription: 'Falezlerden denize dökülen Aşağı Düden ve mağaralı Yukarı Düden.',
        whyVisit: 'Akdeniz sıcağında serinlemek ve su sesini dinlemek için.',
        estimatedDuration: '2 saat',
        costCategory: 'low',
        ticketPriceEstimated: 'Uygun belediye girişi',
        bestTimeToVisit: 'Öğle üzeri',
        insiderTip: 'Aşağı Düden\'i Lara falez parkından deniz üzerinden izlemek harikadır.',
        googleMapsQuery: 'Duden Waterfalls Antalya',
      },
      {
        id: 'ant-4',
        name: 'Patara Antik Kenti & Kum Tepeleri',
        category: 'historic',
        shortDescription: 'Likya Birliği meclis binası ve 18 km uzunluğundaki altın kum plajı.',
        whyVisit: 'Çöl manzaralı kum tepelerinde gün batımını izlemek için.',
        estimatedDuration: '3 saat',
        costCategory: 'medium',
        ticketPriceEstimated: 'Müzekart geçerli',
        bestTimeToVisit: 'Gün batımı saatleri',
        insiderTip: 'Kum tepelerinde rüzgar çıktığında fotoğraf makinenizi koruyun.',
        googleMapsQuery: 'Patara Ancient City Antalya',
      },
    ],
    cuisine: [
      {
        dishName: 'Antalya Usulü Tahinli Piyaz',
        description: 'Haşlanmış Çandır fasulyesi, tarator kıvamında tahin sosu, sirke ve yumurta.',
        whereToEat: 'Kaleiçi veya Şarampol esnaf lokantaları',
        budgetFriendly: true,
      },
      {
        dishName: 'Yanık Dondurma',
        description: 'Keçi sütünden yapılan ve hafif karamelize yanık lezzeti olan geleneksel dondurma.',
        whereToEat: 'Akdeniz Dondurma şubeleri',
        budgetFriendly: true,
      },
    ],
    transit: 'AntRay tramvayı havalimanından merkeze bağlar. Kaş ve Kemer için otogardan düzenli ilçeler arası otobüsler vardır.',
    visaNote: 'T.C. Kimlik kartınız yeterlidir.',
  },
  roma: {
    name: 'Roma, İtalya',
    tagline: 'Açık hava müzesi sokaklar, antik gladyatörler ve eşsiz İtalyan lezzetleri',
    mustSee: [
      {
        id: 'rom-1',
        name: 'Kolezyum & Roma Forumu',
        category: 'historic',
        shortDescription: 'Antik Roma imparatorluğunun gladyatör arenası ve siyasi merkezi.',
        whyVisit: 'Dünyanın 7 harikasından biri, tarihin en ikonik amfitiyatrosu.',
        estimatedDuration: '3 saat',
        costCategory: 'high',
        ticketPriceEstimated: '18€ (Online önceden alınmalı)',
        bestTimeToVisit: 'Sabah 08:30 ilk giriş saati',
        insiderTip: 'Biletinizi resmi siteden haftalar öncesinden rezerve edin, kapıda saatlerce sıra beklemeyin.',
        googleMapsQuery: 'Colosseum Rome Italy',
      },
      {
        id: 'rom-2',
        name: 'Trevi Çeşmesi (Aşk Çeşmesi)',
        category: 'viewpoint',
        shortDescription: 'Barok mimarinin zirvesi heykeller ve dilek parası geleneği.',
        whyVisit: 'Roma\'ya tekrar gelmek için arkaya dönüp sol omuzdan bozuk para atmak.',
        estimatedDuration: '45 dakika',
        costCategory: 'free',
        ticketPriceEstimated: 'Ücretsiz',
        bestTimeToVisit: 'Sabah 07:00 (kalabalıksız) veya Gece aydınlatması',
        insiderTip: 'Çeşmenin karşısındaki dondurmacılardan Antep fıstıklı (pistacchio) gelato alın.',
        googleMapsQuery: 'Trevi Fountain Rome Italy',
      },
      {
        id: 'rom-3',
        name: 'Vatikan & Aziz Petrus Bazilikası',
        category: 'museum',
        shortDescription: 'Michelangelo\'nun kubbesi, Pieta heykeli ve Sistina Şapeli.',
        whyVisit: 'Rönesans sanatının doruk noktası.',
        estimatedDuration: '3 - 4 saat',
        costCategory: 'high',
        ticketPriceEstimated: 'Müzeler 20€ / Bazilika girişi ücretsiz',
        bestTimeToVisit: 'Öğle saatleri',
        insiderTip: 'Omuzları ve dizleri örten kıyafet kuralı katıdır, şal bulundurun.',
        googleMapsQuery: 'St Peters Basilica Vatican Rome',
      },
      {
        id: 'rom-4',
        name: 'Pantheon',
        category: 'historic',
        shortDescription: '2000 yıldır ayakta duran desteksiz beton kubbe ve oculus ışığı.',
        whyVisit: 'Antik mühendisliğin en kusursuz örneği.',
        estimatedDuration: '1 saat',
        costCategory: 'low',
        ticketPriceEstimated: '5€ giriş bileti',
        bestTimeToVisit: 'Öğle güneşi (ışık deliğinden süzülen huzme için)',
        insiderTip: 'Hemen yakınındaki Giolitti\'de Roma\'nın en eski dondurmasını tadın.',
        googleMapsQuery: 'Pantheon Rome Italy',
      },
      {
        id: 'rom-5',
        name: 'Trastevere Sokakları',
        category: 'food',
        shortDescription: 'Arnavut kaldırımlı dar sokaklar, asma yapraklı trattorialar.',
        whyVisit: 'Otantik Roma gece hayatı ve geleneksel İtalyan yemekleri için.',
        estimatedDuration: '2.5 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Sokaklar ücretsiz, yemek bütçeye bağlı',
        bestTimeToVisit: 'Akşam 19:30 sonrası',
        insiderTip: 'Tiber adası üzerinden yürüyerek nehir köprüsünden geçin.',
        googleMapsQuery: 'Trastevere Rome Italy',
      },
    ],
    cuisine: [
      {
        dishName: 'Cacio e Pepe & Carbonara',
        description: 'Pecorino Romano peyniri, taze karabiber ve guanciale ile yapılan orijinal Roma makarnaları.',
        whereToEat: 'Trastevere bölgesindeki geleneksel aile işletmesi osterialar',
        budgetFriendly: true,
      },
      {
        dishName: 'Pizza al Taglio (Dilim Pizza)',
        description: 'Çıtır hamurlu tepsi pizzanın gramajla kesilip servis edilmesi.',
        whereToEat: 'Pizzarium Bonci veya Forno Campo de\' Fiori',
        budgetFriendly: true,
      },
      {
        dishName: 'Orijinal İtalyan Tiramisu',
        description: 'Savoiardi bisküvi, espresso ve taze mascarpone kremi.',
        whereToEat: 'Pompi Tiramisù (İspanyol Merdivenleri yanı)',
        budgetFriendly: true,
      },
    ],
    transit: 'Roma Metrosu (A ve B hatları) ve yürüyüş en hızlısıdır. 24/48 saatlik sınırsız bilet (Roma Pass) tasarruf sağlar.',
    visaNote: 'Bordo pasaport için Schengen Vizesi gereklidir. Yeşil (Hususi) pasaport vizesizdir.',
  },
  paris: {
    name: 'Paris, Fransa',
    tagline: 'Işıklar şehri, Seine kıyısı, dünya sanat başyapıtları ve pastaneler',
    mustSee: [
      {
        id: 'par-1',
        name: 'Eyfel Kulesi & Champ de Mars',
        category: 'viewpoint',
        shortDescription: 'Gustave Eiffel\'in demir kulesi ve Trocadéro seyir meydanı.',
        whyVisit: 'Paris denince akla gelen ilk simgeyi görmek ve akşam ışık gösterisini izlemek.',
        estimatedDuration: '2 saat',
        costCategory: 'medium',
        ticketPriceEstimated: 'Zemin ücretsiz / Asansörle zirve 28€',
        bestTimeToVisit: 'Gün batımı ve her saat başı 5 dakikalık ışıltı şovu',
        insiderTip: 'Trocadéro meydanından Eyfel fotoğrafları en iyi açıyı verir.',
        googleMapsQuery: 'Eiffel Tower Paris',
      },
      {
        id: 'par-2',
        name: 'Louvre Müzesi',
        category: 'museum',
        shortDescription: 'Mona Lisa, Milo Venüsü ve cam piramit avlusu.',
        whyVisit: 'Dünyanın en büyük ve en çok ziyaret edilen sanat müzesi.',
        estimatedDuration: '3 - 4 saat',
        costCategory: 'high',
        ticketPriceEstimated: '22€ (Online saatli rezervasyon zorunlu)',
        bestTimeToVisit: 'Sabah 09:00 veya Cuma akşamı',
        insiderTip: 'Ana piramit yerine Carrousel du Louvre alt girişini kullanarak sıra beklemeden girin.',
        googleMapsQuery: 'Louvre Museum Paris',
      },
      {
        id: 'par-3',
        name: 'Montmartre & Sacré-Cœur Bazilikası',
        category: 'historic',
        shortDescription: 'Ressamlar tepesi, beyaz kubbeli bazilika ve Amélie kafeleri.',
        whyVisit: 'Paris\'i tepeden izlemek ve bohem sanatçı sokaklarında kaybolmak.',
        estimatedDuration: '2.5 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Bazilika ücretsiz / Kubbeye çıkış ücretli',
        bestTimeToVisit: 'Öğleden sonra',
        insiderTip: 'Place du Tertre meydanında portrenizi çizdirebilirsiniz.',
        googleMapsQuery: 'Sacre Coeur Montmartre Paris',
      },
      {
        id: 'par-4',
        name: 'Seine Nehri & Notre-Dame Katedrali',
        category: 'nature',
        shortDescription: 'Nehir boyu sahaf tezgahları (bouquinistes) ve Île de la Cité adası.',
        whyVisit: 'Gotik mimariyi ve nehir esintisini hissetmek için.',
        estimatedDuration: '2 saat',
        costCategory: 'low',
        ticketPriceEstimated: 'Nehir yürüyüşü ücretsiz / Tekne turu 17€',
        bestTimeToVisit: 'İkindi vakti',
        insiderTip: 'Batobus veya Vedettes de Paris tekne turları ayaklarınızı dinlendirir.',
        googleMapsQuery: 'Notre Dame Cathedral Paris',
      },
    ],
    cuisine: [
      {
        dishName: 'Tereyağlı Kruvasan & Pain au Chocolat',
        description: 'Kat kat çıtır Fransız tereyağlı hamuru ve taze kahve.',
        whereToEat: 'Mahalle fırınları (Boulangerie)',
        budgetFriendly: true,
      },
      {
        dishName: 'Krep ve Galette',
        description: 'Karabuğday unlu tuzlu galette ve tatlı çikolatalı krep.',
        whereToEat: 'Montparnasse veya Latin Quarter krepçileri',
        budgetFriendly: true,
      },
      {
        dishName: 'Fransız Soğan Çorbası & Ördek Konfi',
        description: 'Eritilmiş Gravyer peynirli geleneksel kış çorbası ve fırınlanmış ördek budu.',
        whereToEat: 'Geleneksel Paris bistroları',
        budgetFriendly: false,
      },
    ],
    transit: 'Paris Metrosu dünyanın en sık istasyon ağına sahiptir. Navigo Easy kart ile metro kullanın.',
    visaNote: 'Bordo pasaport için Schengen vizesi gereklidir.',
  },
};

// Generates dynamic days for any destination
function generateDynamicDays(
  destName: string,
  totalDays: number,
  mustSeePlaces: MustSeePlace[],
  budgetLevel: string,
  cuisine: LocalDish[]
): DayItinerary[] {
  const days: DayItinerary[] = [];

  const morningSpots = [
    'Tarihi Meydan & Anıtsal Yapılar Keşfi',
    'Panoramik Seyir Noktası & Sabah Fotoğrafları',
    'Ünlü Müze & Kültür Mirası Gezisi',
    'Tarihi Çarşı & Yerel Yaşam Pazarı',
    'Doğa Parkı & Botanik Yürüyüş Yolu',
    'Eski Şehir (Old Town) Arnavut Kaldırımlı Sokakları',
    'Nehir / Sahil Kordonu Sabah Esintisi',
    'Zanaatkarlar Sokağı & Antika Pazarı',
  ];

  const afternoonSpots = [
    'Ören Yeri & Heybetli Surlar / Anıtlar',
    'Geleneksel El Sanatları & Hediyelik Çarşısı',
    'Sanat Galerisi & Kültür Merkezi Molası',
    'Doğal Kanyon & Vadi Yürüyüş Rotası',
    'Şehir Parkında Dinlenme & Yerel Tatlar',
    'Tarihi Hanlar ve Avlular Gezisi',
    'Liman / Nehir Kenarı Dinlenme',
  ];

  const eveningSpots = [
    'Gün Batımı Seyir Terası & Şehir Işıkları',
    'Geleneksel Müzik & Yerel Lezzetler Akşamı',
    'Canlı Meydan & Kafeler Bölgesi Gezintisi',
    'Işıklandırılmış Tarihi Köprü ve Kordon Yürüyüşü',
    'Sakin Sokaklarda Çay / Kahve & Tatlı Molası',
    'Gece Manzaralı Teras Restoranda Veda',
  ];

  const dayThemes = [
    'Şehre Giriş, İkonik Simgeler ve İlk Adımlar',
    'Tarihin Derinlikleri ve Kültürel Miras',
    'Doğa, Manzaralar ve Gizli Cevherler',
    'Yerel Zanaat, Gastronomi ve Çarşılar',
    'Sakin Dinlenme, Sanat ve Fotoğraf Rotaları',
    'Günübirlik Çevre Keşfi ve Eşsiz Deneyimler',
    'Alışveriş, Son Hatıralar ve Şehre Veda',
  ];

  for (let i = 1; i <= totalDays; i++) {
    const place1 = mustSeePlaces[(i * 2 - 2) % mustSeePlaces.length];
    const place2 = mustSeePlaces[(i * 2 - 1) % mustSeePlaces.length];
    const lunchFood = cuisine[(i - 1) % cuisine.length];
    const dinnerFood = cuisine[i % cuisine.length];

    const morningTitle = place1 ? place1.name : `${destName} ${morningSpots[(i - 1) % morningSpots.length]}`;
    const afternoonTitle = place2 ? place2.name : `${destName} ${afternoonSpots[(i - 1) % afternoonSpots.length]}`;
    const eveningTitle = `${eveningSpots[(i - 1) % eveningSpots.length]} (${destName})`;

    const theme = dayThemes[(i - 1) % dayThemes.length] || `${i}. Gün: ${destName} Özel Keşfi`;

    let dayBudget = '750 ₺ - 1.200 ₺ (Kişi Başı)';
    if (budgetLevel === 'budget') {
      dayBudget = '450 ₺ - 800 ₺ (Kişi Başı)';
    } else if (budgetLevel === 'luxury') {
      dayBudget = '2.500 ₺ - 4.500 ₺ (Kişi Başı)';
    }

    days.push({
      dayNumber: i,
      title: `${i}. Gün: ${morningTitle.slice(0, 35)} & Akşam Rotası`,
      theme,
      morning: {
        title: morningTitle,
        description: place1?.shortDescription || `${destName} merkezinde sabahın sakin saatlerinde keşfe başlayın. Fotoğraf için en uygun ışıktan faydalanın.`,
        location: place1?.name || `${destName} Tarihi Bölgesi`,
        costEstimate: place1?.ticketPriceEstimated || 'Ücretsiz / Düşük Maliyet',
      },
      afternoon: {
        title: afternoonTitle,
        description: place2?.shortDescription || `Öğle yemeği sonrasında bölgenin karakteristik sokaklarında yürüyüş yapın ve el sanatlarını inceleyin.`,
        location: place2?.name || `${destName} Çarşısı`,
        lunchRecommendation: `${lunchFood?.dishName || 'Yöresel Öğle Menüsü'}: ${lunchFood?.whereToEat || 'Yerel lokantalar'}`,
        costEstimate: budgetLevel === 'budget' ? '150 ₺ - 250 ₺' : '300 ₺ - 600 ₺',
      },
      evening: {
        title: eveningTitle,
        description: `Günün yorgunluğunu yerel lezzetler ve akşam ışıkları eşliğinde keyifli bir yürüyüşle tamamlayın.`,
        dinnerRecommendation: `${dinnerFood?.dishName || 'Akşam Lezzeti'}: ${dinnerFood?.whereToEat || 'Öne çıkan mekanlar'}`,
        costEstimate: budgetLevel === 'budget' ? '250 ₺ - 400 ₺' : '500 ₺ - 1.200 ₺',
      },
      dayTips: `Günün en yoğun yürüyüşü öğleden önce olacaktır; rahat bir spor ayakkabı tercih edin.`,
      estimatedDayBudget: dayBudget,
    });
  }

  return days;
}

// Season detection from date string
function getSeasonInfo(dateStr?: string) {
  if (!dateStr) {
    return {
      season: 'Bahar',
      advice: 'Gündüzleri ılık, akşamları serin olabileceğinden kat kat giyebileceğiniz hafif bir hırka veya rüzgarlık bulundurun.',
    };
  }

  const month = new Date(dateStr).getMonth() + 1; // 1 to 12
  if (month >= 6 && month <= 8) {
    return {
      season: 'Yaz',
      advice: 'Hava sıcak ve güneşli olacaktır. Güneş kremi, şapka, güneş gözlüğü ve bol su bulundurmayı unutmayın. Açık hava gezilerini sabah erken ve ikindi saatlerine planlayın.',
    };
  } else if (month >= 9 && month <= 11) {
    return {
      season: 'Sonbahar',
      advice: 'Ilıman ve yürüyüş için en konforlu dönemdir. Sabah ve akşam serinliği için ince bir mont, vadi yürüyüşleri için suya dayanıklı ayakkabı tercih edin.',
    };
  } else if (month === 12 || month <= 2) {
    return {
      season: 'Kış',
      advice: 'Hava serin veya soğuk olabilir. Termal içlik, kalın mont, atkı-bere ve kaymayan tabanlı kışlık ayakkabı bavulunuzda mutlaka olmalıdır.',
    };
  } else {
    return {
      season: 'İlkbahar',
      advice: 'Doğanın canlandığı en güzel seyahat mevsimi. Ani bahar yağmurlarına karşı kompakt bir şemsiye ve rüzgarlık mont bulundurun.',
    };
  }
}

// Master Generator
export function generateSmartTravelPlan(req: TravelPlanRequest): TravelPlan {
  const destClean = req.destination.toLowerCase().trim();
  const matchedKey = Object.keys(DESTINATION_DATABASE).find((key) => destClean.includes(key));
  const known = matchedKey ? DESTINATION_DATABASE[matchedKey] : null;

  const destDisplayName = known ? known.name : req.destination;
  const season = getSeasonInfo(req.startDate);

  // Must see places
  let mustSee: MustSeePlace[] = [];
  if (known) {
    mustSee = known.mustSee;
  } else {
    mustSee = [
      {
        id: 'gen-1',
        name: `${destDisplayName} Tarihi Şehir Merkezi & Meydanı`,
        category: 'historic',
        shortDescription: `${destDisplayName} bölgesinin kalbi sayılan, tarihi mimariyle çevrili ana meydan.`,
        whyVisit: 'Şehrin ruhunu ve gündelik yaşamını ilk dakikadan hissetmek için.',
        estimatedDuration: '2 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Ücretsiz',
        bestTimeToVisit: 'Sabah saatleri',
        insiderTip: 'Meydandaki tarihi çeşme veya anıt önünde fotoğraf molası verin.',
        googleMapsQuery: `${destDisplayName} City Center`,
      },
      {
        id: 'gen-2',
        name: `${destDisplayName} Kültür & Arkeoloji Müzesi`,
        category: 'museum',
        shortDescription: 'Bölgeden çıkarılan arkeolojik eserler, sikkeler ve etnografik miras.',
        whyVisit: 'Bölgenin köklü tarihini ve medeniyetler zincirini yakından tanımak.',
        estimatedDuration: '2 saat',
        costCategory: 'medium',
        ticketPriceEstimated: req.tripType === 'domestic' ? 'Müzekart geçerli' : '10€ - 15€',
        bestTimeToVisit: 'Öğle saatleri',
        insiderTip: 'Müze mağazasında yerel tasarım hatıra eşyaları bulabilirsiniz.',
        googleMapsQuery: `${destDisplayName} Museum`,
      },
      {
        id: 'gen-3',
        name: `${destDisplayName} Panoramik Seyir Tepesi & Kalesi`,
        category: 'viewpoint',
        shortDescription: 'Şehri ve coğrafyayı kuşbakışı gören en yüksek hakim tepe.',
        whyVisit: 'Gün batımında tüm şehrin ve ufkun büyüleyici renklerini izlemek.',
        estimatedDuration: '1.5 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Ücretsiz',
        bestTimeToVisit: 'Gün batımından 45 dakika önce',
        insiderTip: 'Tepeye çıkarken yanınıza sıcak bir içecek alıp manzaranın tadını çıkarın.',
        googleMapsQuery: `${destDisplayName} Castle Viewpoint`,
      },
      {
        id: 'gen-4',
        name: `${destDisplayName} Tarihi Çarşılar & Bakırcılar/Kapalıçarşı`,
        category: 'shopping',
        shortDescription: 'Yüzyıllık dükkanlar, baharatçılar, el sanatları ustaları ve kahvehaneler.',
        whyVisit: 'Otantik lezzetler ve hediyelik alışverişi yapmak.',
        estimatedDuration: '2 saat',
        costCategory: 'free',
        ticketPriceEstimated: 'Giriş ücretsiz',
        bestTimeToVisit: 'İkindi vakti',
        insiderTip: 'Geleneksel közde kahve yapan eski kahvehanede soluklanın.',
        googleMapsQuery: `${destDisplayName} Bazaar`,
      },
      {
        id: 'gen-5',
        name: `${destDisplayName} Doğa Parkı & Kanyon/Sahil Yürüyüş Yolu`,
        category: 'nature',
        shortDescription: 'Temiz hava, yeşillik ve suyun buluştuğu sakin yürüyüş parkuru.',
        whyVisit: 'Şehir kalabalığından uzaklaşıp doğayla baş başa kalmak.',
        estimatedDuration: '2.5 saat',
        costCategory: 'low',
        ticketPriceEstimated: 'Belediye parkı / Ücretsiz',
        bestTimeToVisit: 'Sabah erken saatler',
        insiderTip: 'Rahat yürüyüş ayakkabısı ve sırt çantasıyla gidin.',
        googleMapsQuery: `${destDisplayName} Nature Park`,
      },
    ];
  }

  // Cuisines
  let cuisineList: LocalDish[] = [];
  if (known) {
    cuisineList = known.cuisine;
  } else {
    cuisineList = [
      {
        dishName: `${destDisplayName} Yöresel Tava & Izgara Lezzeti`,
        description: 'Taze yerel etler ve baharatlarla taş fırında pişen geleneksel ana yemek.',
        whereToEat: `${destDisplayName} merkezindeki köklü esnaf lokantaları`,
        budgetFriendly: true,
      },
      {
        dishName: `Geleneksel El Açması Hamur İşi & Mantı`,
        description: 'İncecik açılmış hamur, zengin iç harç ve süzme yoğurtlu sos.',
        whereToEat: 'Tarihi mahalle içi aile işletmeleri',
        budgetFriendly: true,
      },
      {
        dishName: `Meşhur Yöresel Tatlı & Taze Kahve`,
        description: 'Bölgeye özgü şerbetli veya sütlü geleneksel tatlı ikramı.',
        whereToEat: 'Tarihi meydan tatlıcıları',
        budgetFriendly: true,
      },
    ];
  }

  // Itinerary
  const itinerary = generateDynamicDays(
    destDisplayName,
    req.totalDays,
    mustSee,
    req.budgetLevel,
    cuisineList
  );

  // Budget calculations
  const curr = req.currency || (req.tripType === 'domestic' ? 'TRY' : 'EUR');
  const symbol = curr === 'EUR' ? '€' : curr === 'USD' ? '$' : '₺';

  let totalCostEstimate = '';
  let dailyPerPerson = '';
  let accommodationText = '';
  let foodText = '';
  let museumText = '';
  let transitText = '';

  if (curr === 'TRY') {
    if (req.budgetLevel === 'budget') {
      const daily = 650;
      const total = daily * req.totalDays * (req.travelersCount || 1);
      totalCostEstimate = `${total.toLocaleString('tr-TR')} ₺ (Toplam ${req.travelersCount} Kişi)`;
      dailyPerPerson = `Kişi başı günlük yaklaşık ${daily.toLocaleString('tr-TR')} ₺`;
      accommodationText = '%45 - Temiz pansiyon, butik hostel veya uygun misafirhane';
      foodText = '%30 - Esnaf lokantaları, yerel börekçiler ve sokak tatları';
      museumText = '%15 - Müzekart ve ücretsiz doğal yürüyüş alanları';
      transitText = '%10 - Şehir içi belediye otobüsü, dolmuş ve yürüyüş';
    } else if (req.budgetLevel === 'luxury') {
      const daily = 3500;
      const total = daily * req.totalDays * (req.travelersCount || 1);
      totalCostEstimate = `${total.toLocaleString('tr-TR')} ₺ (Toplam ${req.travelersCount} Kişi)`;
      dailyPerPerson = `Kişi başı günlük yaklaşık ${daily.toLocaleString('tr-TR')} ₺`;
      accommodationText = '%50 - 5 yıldızlı veya seçkin lüks mağara/butik otel';
      foodText = '%25 - Gurme restoranlar, şef menüleri ve şık akşam yemekleri';
      museumText = '%15 - Özel rehberli turlar ve sıra beklemeden VIP geçiş';
      transitText = '%10 - Özel araç kiralama veya transfer';
    } else {
      const daily = 1800;
      const total = daily * req.totalDays * (req.travelersCount || 1);
      totalCostEstimate = `${total.toLocaleString('tr-TR')} ₺ (Toplam ${req.travelersCount} Kişi)`;
      dailyPerPerson = `Kişi başı günlük yaklaşık ${daily.toLocaleString('tr-TR')} ₺`;
      accommodationText = '%40 - Merkezi konumlu butik otel veya konforlu oda';
      foodText = '%30 - Popüler yerel restoranlar ve keyifli kafeler';
      museumText = '%18 - Müzekart, ören yeri biletleri ve vadiler';
      transitText = '%12 - Toplu taşıma ve gerektiğinde kısa taksi transferi';
    }
  } else {
    // EUR / USD
    const daily = req.budgetLevel === 'budget' ? 60 : req.budgetLevel === 'luxury' ? 250 : 130;
    const total = daily * req.totalDays * (req.travelersCount || 1);
    totalCostEstimate = `${total.toLocaleString('en-US')} ${symbol} (${req.travelersCount} Kişi)`;
    dailyPerPerson = `Kişi başı günlük ortalama ${daily} ${symbol}`;
    accommodationText = req.budgetLevel === 'budget' ? '%45 - Hostel / Guesthouse' : req.budgetLevel === 'luxury' ? '%55 - 4-5 Yıldızlı Seçkin Otel' : '%40 - 3-4 Yıldızlı Merkezi Otel';
    foodText = '%30 - Yerel trattoria, bistrolar ve sokak lezzetleri';
    museumText = '%15 - Şehir kartı / Online indirimli biletler';
    transitText = '%10 - Metro kartı ve yürüyüş';
  }

  // Packing items
  const packingChecklist = [
    'Rahat ve sağlam tabanlı yürüyüş ayakkabısı (Günde 10.000+ adım)',
    'Yedek powerbank (Harita kullanımı ve bol fotoğraf çekimi için)',
    `${season.season} mevsimine uygun hafif rüzgarlık veya ceket`,
    'Güneş gözlüğü ve yüksek faktörlü koruyucu güneş kremi',
    req.tripType === 'domestic'
      ? 'T.C. Kimlik Kartı ve Dijital Müzekart uygulaması'
      : 'Pasaport, vize evrakları ve seyahat sağlık sigortası çıktısı',
    'Kişisel ilaçlar, ağrı kesici ve küçük ilk yardım seti',
    'Termos bardak veya su matarası',
  ];

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    requestParams: req,
    summary: {
      title: `${req.totalDays} Günlük ${destDisplayName} Gezi Planı`,
      tagline: known?.tagline || `${destDisplayName} için bütçenize, tarihinize ve ilgi alanlarınıza özel optimize edilmiş rota`,
      destination: destDisplayName,
      tripType: req.tripType,
      durationDays: req.totalDays,
      datesFormatted: req.startDate && req.endDate ? `${req.startDate} - ${req.endDate} (${req.totalDays} Gün)` : `${req.totalDays} Günlük Gezi`,
      seasonAdvice: `${season.season} dönemi seyahati: ${season.advice}`,
      budgetOverview: {
        level: req.budgetLevel === 'budget' ? 'Ekonomik / Sırt Çantalı Bütçe' : req.budgetLevel === 'luxury' ? 'Lüks & Konforlu Bütçe' : 'Dengeli / Orta Bütçe',
        estimatedTotalCost: req.budgetAmount ? `${req.budgetAmount.toLocaleString('tr-TR')} ${symbol} (Hedef Bütçe)` : totalCostEstimate,
        dailyPerPersonCost: dailyPerPerson,
        costBreakdown: {
          accommodation: accommodationText,
          foodAndDrink: foodText,
          activitiesAndMuseums: museumText,
          localTransport: transitText,
        },
        savingTips: [
          req.tripType === 'domestic'
            ? 'Müzekart kullanarak tüm Kültür ve Turizm Bakanlığı müzelerine ücretsiz veya çok cüzi ücretle girebilirsiniz.'
            : 'Popüler müzelerin biletlerini resmi sitelerinden online alarak aracı komisyonlarından ve uzun kuyruklardan kurtulun.',
          'Öğle yemeklerini popüler turistik meydanların 1-2 sokak arkasındaki esnaf lokantalarında yiyerek %40 tasarruf edin.',
          'Şehir içi ulaşımda tek tek bilet almak yerine günlük veya çok kullanımlık toplu taşıma kartı tercih edin.',
        ],
      },
    },
    mustSeePlaces: mustSee,
    itinerary,
    localCuisine: cuisineList,
    packingChecklist,
    transportAdvice: known?.transit || `${destDisplayName} merkezinde tarihi yerler birbirine yürüme mesafesindedir. Uzak noktalar için yerel toplu taşıma ve raylı sistemleri tercih edebilirsiniz.`,
    emergencyAndPracticalInfo: {
      localEmergencyNumbers: req.tripType === 'domestic' ? '112 Acil Çağrı Merkezi' : '112 (Avrupa Geneli Acil Numara)',
      currencyAndPaymentTips: 'Kredi kartı ve temassız ödeme yaygındır; ancak küçük esnaf, halk pazarları ve bahşişler için yanınızda bir miktar nakit bulundurmanız faydalıdır.',
      visaOrEntryNote: known?.visaNote || (req.tripType === 'domestic' ? 'T.C. Kimlik kartınız yeterlidir.' : 'Pasaportunuzun geçerlilik süresinin en az 6 ay olduğundan emin olun.'),
    },
  };
}
