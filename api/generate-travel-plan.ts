import { GoogleGenAI, Type } from '@google/genai';
import { generateSmartTravelPlan } from '../src/services/smartTravelEngine';

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

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
      return res.status(400).json({ error: 'Lütfen bir seyahat hedefi belirtin.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available, try generating with Gemini
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' },
          },
        });

        const tripTypeLabel = tripType === 'domestic' ? 'YURT İÇİ (Türkiye İçi)' : 'YURT DIŞI';
        const budgetLevelLabel =
          budgetLevel === 'budget'
            ? 'Ekonomik / Sırt Çantalı (Düşük bütçe, toplu taşıma, esnaf lokantaları, ücretsiz/uygun yerler)'
            : budgetLevel === 'luxury'
            ? 'Lüks / Üst Segment (Yüksek bütçe, gurme restoranlar, özel transferler)'
            : 'Dengeli / Orta Bütçe (Butik oteller, popüler yerel restoranlar, dengeli bütçe)';

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
1. "mustSeePlaces" listesinde seçilen destinasyon için gerçekten GÖRÜLMESİ GEREKEN en önemli en az 6-10 adet yeri listele. Her birinin bütçe kategorisini, tahmini bilet/giriş ücretini (varsa Müzekart geçerli mi belirt), en uygun ziyaret saatini ve gizli yerel tüyosunu ("insiderTip") ekle.
2. "itinerary" kısmında tam olarak ${totalDays} günlük program oluştur (1. Gün'den ${totalDays}. Gün'e kadar).
3. Bütçe ayarlaması: Seçilen bütçe seviyesine (${budgetLevel}) göre konaklama türü, yemek mekanları ve aktiviteler tamamen optimize edilmiş olmalıdır.
4. "localCuisine": Oranın mutlaka tadılması gereken yerel yemeklerini ekle.
5. "packingChecklist": Seyahat tarihindeki mevsime ve bölgeye özel akıllı bavul kontrol listesi oluştur.
6. "emergencyAndPracticalInfo": Yurt dışı ise vize/pasaport, yurt içi ise Müzekart ve acil numaraları içersin.
7. Tüm metinler akıcı, samimi ve Türkçe olsun.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: travelPlanResponseSchema,
            temperature: 0.7,
          },
        });

        const responseText = response.text || '';
        const travelPlan = JSON.parse(responseText);
        return res.status(200).json({ success: true, plan: travelPlan });
      } catch (geminiError) {
        console.warn('Gemini API call failed or quota exceeded, falling back to smart travel engine:', geminiError);
      }
    }

    // Zero API key required fallback: Smart Travel Engine
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

    return res.status(200).json({ success: true, plan });
  } catch (err: any) {
    console.error('Error generating travel plan:', err);
    return res.status(500).json({
      error: 'Seyahat planı oluşturulurken bir hata oluştu: ' + (err?.message || 'Bilinmeyen hata'),
    });
  }
}
