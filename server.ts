import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { generateSmartTravelPlan } from './src/services/smartTravelEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client only if a valid API key is present
const apiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
  ? process.env.GEMINI_API_KEY
  : '';

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Travel plan schema for Gemini response
const travelPlanResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        tagline: { type: Type.STRING },
        destination: { type: Type.STRING },
        tripType: { type: Type.STRING },
        durationDays: { type: Type.INTEGER },
        datesFormatted: { type: Type.STRING },
        seasonAdvice: { type: Type.STRING },
        budgetOverview: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            estimatedTotalCost: { type: Type.STRING },
            dailyPerPersonCost: { type: Type.STRING },
            costBreakdown: {
              type: Type.OBJECT,
              properties: {
                accommodation: { type: Type.STRING },
                foodAndDrink: { type: Type.STRING },
                activitiesAndMuseums: { type: Type.STRING },
                localTransport: { type: Type.STRING },
              },
              required: ['accommodation', 'foodAndDrink', 'activitiesAndMuseums', 'localTransport'],
            },
            savingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['level', 'estimatedTotalCost', 'dailyPerPersonCost', 'costBreakdown', 'savingTips'],
        },
      },
      required: ['title', 'tagline', 'destination', 'tripType', 'durationDays', 'datesFormatted', 'seasonAdvice', 'budgetOverview'],
    },
    mustSeePlaces: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          shortDescription: { type: Type.STRING },
          whyVisit: { type: Type.STRING },
          estimatedDuration: { type: Type.STRING },
          costCategory: { type: Type.STRING },
          ticketPriceEstimated: { type: Type.STRING },
          bestTimeToVisit: { type: Type.STRING },
          insiderTip: { type: Type.STRING },
          googleMapsQuery: { type: Type.STRING },
        },
        required: ['id', 'name', 'category', 'shortDescription', 'whyVisit', 'estimatedDuration', 'costCategory', 'ticketPriceEstimated', 'bestTimeToVisit', 'insiderTip'],
      },
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          theme: { type: Type.STRING },
          morning: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              location: { type: Type.STRING },
              costEstimate: { type: Type.STRING },
            },
            required: ['title', 'description', 'location'],
          },
          afternoon: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              location: { type: Type.STRING },
              lunchRecommendation: { type: Type.STRING },
              costEstimate: { type: Type.STRING },
            },
            required: ['title', 'description', 'location', 'lunchRecommendation'],
          },
          evening: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              dinnerRecommendation: { type: Type.STRING },
              costEstimate: { type: Type.STRING },
            },
            required: ['title', 'description', 'dinnerRecommendation'],
          },
          dayTips: { type: Type.STRING },
          estimatedDayBudget: { type: Type.STRING },
        },
        required: ['dayNumber', 'title', 'theme', 'morning', 'afternoon', 'evening', 'dayTips', 'estimatedDayBudget'],
      },
    },
    localCuisine: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          description: { type: Type.STRING },
          whereToEat: { type: Type.STRING },
          budgetFriendly: { type: Type.BOOLEAN },
        },
        required: ['dishName', 'description', 'whereToEat', 'budgetFriendly'],
      },
    },
    packingChecklist: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    transportAdvice: { type: Type.STRING },
    emergencyAndPracticalInfo: {
      type: Type.OBJECT,
      properties: {
        localEmergencyNumbers: { type: Type.STRING },
        currencyAndPaymentTips: { type: Type.STRING },
        visaOrEntryNote: { type: Type.STRING },
      },
      required: ['localEmergencyNumbers', 'currencyAndPaymentTips', 'visaOrEntryNote'],
    },
  },
  required: ['summary', 'mustSeePlaces', 'itinerary', 'localCuisine', 'packingChecklist', 'transportAdvice', 'emergencyAndPracticalInfo'],
};

// API Endpoint to generate travel plan
app.post('/api/generate-travel-plan', async (req, res) => {
  try {
    const {
      tripType = 'domestic',
      destination,
      departureCity,
      startDate,
      endDate,
      totalDays = 3,
      budgetLevel = 'moderate',
      budgetAmount,
      currency = 'TRY',
      travelersCount = 1,
      travelStyle = [],
      specialRequests = '',
    } = req.body || {};

    if (!destination) {
      return res.status(400).json({ error: 'Lütfen bir seyahat hedefi (şehir/ülke) belirtin.' });
    }

    // Try Gemini if API key is configured with a 6-second timeout
    if (ai) {
      try {
        const tripTypeLabel = tripType === 'domestic' ? 'YURT İÇİ (Türkiye İçi)' : 'YURT DIŞI';
        const budgetLevelLabel =
          budgetLevel === 'budget'
            ? 'Ekonomik / Sırt Çantalı (Düşük bütçe, toplu taşıma, esnaf lokantaları & sokak lezzetleri, ücretsiz/uygun yerler)'
            : budgetLevel === 'luxury'
            ? 'Lüks / Üst Segment (Yüksek bütçe, gurme restoranlar, özel transferler, birinci sınıf konfor)'
            : 'Dengeli / Orta Bütçe (Makul harcamalar, butik oteller, popüler yerel restoranlar, dengeli aktivite bütçesi)';

        const prompt = `
Sen Türkiye'nin ve dünyanın en deneyimli seyahat rehberi ve rota planlayıcısısın.
Kullanıcı için eksiksiz, pratik, büyüleyici ve bütçesine tam uyarlanmış Türkçe bir seyahat planı hazırla.

Kullanıcı Seyahat Bilgileri:
- Seyahat Türü: ${tripTypeLabel}
- Gidilecek Yer: ${destination}
${departureCity ? `- Çıkış Noktası: ${departureCity}` : ''}
- Tarih Aralığı: ${startDate || 'Belirtilmedi'} ile ${endDate || 'Belirtilmedi'}
- Toplam Gün Sayısı: ${totalDays} gün
- Bütçe Seviyesi: ${budgetLevelLabel}
${budgetAmount ? `- Belirlenen Toplam Bütçe: ${budgetAmount} ${currency}` : `- Para Birimi: ${currency}`}
- Kişi Sayısı: ${travelersCount} kişi
- Seyahat İlgi Alanları: ${travelStyle.length > 0 ? travelStyle.join(', ') : 'Genel gezi, kültür, doğa, gastronomi'}
${specialRequests ? `- Özel İstekler / Notlar: ${specialRequests}` : ''}

ÖNEMLİ KURALLAR:
1. "mustSeePlaces" listesinde seçilen destinasyon için gerçekten GÖRÜLMESİ GEREKEN en önemli en az 6-10 adet yeri listele.
2. "itinerary" kısmında tam olarak ${totalDays} günlük program oluştur (1. Gün'den ${totalDays}. Gün'e kadar).
3. Bütçe ayarlaması: Seçilen bütçe seviyesine (${budgetLevel}) göre konaklama, yeme-içme ve ulaşım optimize olsun.
4. "localCuisine": Oranın mutlaka tadılması gereken yerel yemeklerini ekle.
5. "packingChecklist": Seyahat tarihindeki mevsime uygun akıllı bavul kontrol listesi oluştur.
6. "emergencyAndPracticalInfo": Yurt dışı ise vize/pasaport ve döviz/kart, yurt içi ise Müzekart ve acil numaraları içersin.
7. Tüm metinler Türkçe olsun.
`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: travelPlanResponseSchema,
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        if (response && response.text) {
          const travelPlan = JSON.parse(response.text);
          return res.json({ success: true, plan: travelPlan });
        }
      } catch (geminiErr) {
        console.warn('Gemini skipped or timed out, using smart travel engine:', geminiErr);
      }
    }

    // Zero API Key required fallback: Smart Travel Engine
    const plan = generateSmartTravelPlan({
      tripType,
      destination,
      departureCity,
      startDate,
      endDate,
      totalDays: Number(totalDays) || 3,
      budgetLevel,
      budgetAmount: budgetAmount ? Number(budgetAmount) : undefined,
      currency,
      travelersCount: Number(travelersCount) || 1,
      travelStyle,
      specialRequests,
    });

    return res.json({ success: true, plan });
  } catch (err: any) {
    console.error('Error generating travel plan:', err);
    return res.status(500).json({
      error: 'Seyahat planı oluşturulurken bir hata oluştu: ' + (err?.message || 'Bilinmeyen hata'),
    });
  }
});

// Endpoint to answer custom questions or adjust the plan
app.post('/api/ask-travel-assistant', async (req, res) => {
  try {
    const { destination = 'Seyahat', question, currentPlanSummary } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: 'Lütfen bir soru belirtin.' });
    }

    if (ai) {
      try {
        const prompt = `
Sen bir seyahat uzmanı ve yerel rehbersin.
Kullanıcının ${destination} ile ilgili şu sorusuna net, pratik ve Türkçe yanıt ver:
${currentPlanSummary ? `Mevcut Rota Özeti: ${currentPlanSummary}` : ''}

Kullanıcı Sorusu:
"${question}"

Lütfen samimi, seyahatsever dostu ve doğrudan uygulanabilir ipuçları ver.
`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 5000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        if (response && response.text) {
          return res.json({ success: true, answer: response.text });
        }
      } catch (geminiErr) {
        console.warn('Gemini assistant timeout or error, using smart fallback answer:', geminiErr);
      }
    }

    // Smart fallback answer
    const qLower = question.toLowerCase();
    let reply = '';

    if (qLower.includes('yağmur') || qLower.includes('hava')) {
      reply = `${destination} için yağmurlu günlerde açık hava vadileri yerine bölgedeki kapalı müzeleri, tarihi sarnıç veya kapalı çarşıları, seramik atölyelerini ve otantik kahvehaneleri ziyaret etmek harika bir alternatiftir. Ayrıca yerel lezzet tadımları ve kapalı müze galerileri için harika bir fırsat!`;
    } else if (qLower.includes('bütçe') || qLower.includes('tasarruf') || qLower.includes('indirim')) {
      reply = `Bütçenizi kısmak için en etkili 3 yöntem:\n1. Müzekart veya şehir indirim kartlarını kullanmak (bilet maliyetlerini %60+ düşürür).\n2. Öğle yemeklerini turistik caddelerin arka sokaklarındaki esnaf lokantalarında veya yerel börekçi/fırınlarda yemek.\n3. Taksi yerine hafif raylı sistem, metro ve yürüyüşü tercih etmek.`;
    } else if (qLower.includes('çocuk') || qLower.includes('bebek') || qLower.includes('aile')) {
      reply = `${destination} rotasında çocuklu aileler için basamaklı veya dik yokuşlu alanlar yerine geniş meydanlar, parklar ve düz yürüyüş yolları tercih edilmelidir. Bebek arabası yerine ergonomik kanguru taşımak eski taş sokaklarda büyük kolaylık sağlar. Sık mola vermeyi ve yanınızda su/atıştırmalık bulundurmayı unutmayın.`;
    } else {
      reply = `${destination} seyahatiniz için tavsiyemiz: Planlanan ana durakları sabah erken saatlerde gezerek kalabalıktan kaçınabilir, öğleden sonra ise yerel sokaklarda kaybolup otantik çay/kahve molaları verebilirsiniz. Yerel esnaf lokantaları hem bütçe dostudur hem de en lezzetli yöresel tatları sunar!`;
    }

    return res.json({ success: true, answer: reply });
  } catch (err: any) {
    console.error('Error in travel assistant question:', err);
    return res.status(500).json({
      error: 'Soru yanıtlanırken bir hata oluştu: ' + (err?.message || 'Bilinmeyen hata'),
    });
  }
});

// Vite integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
