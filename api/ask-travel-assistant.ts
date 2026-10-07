import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { destination = 'Seyahat', question, currentPlanSummary } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: 'Lütfen bir soru belirtin.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' },
          },
        });

        const prompt = `
Sen bir seyahat uzmanı ve yerel rehbersin.
Kullanıcının ${destination} ile ilgili şu sorusuna net, pratik ve Türkçe yanıt ver:
${currentPlanSummary ? `Mevcut Rota Özeti: ${currentPlanSummary}` : ''}

Kullanıcı Sorusu:
"${question}"

Lütfen samimi, seyahatsever dostu ve doğrudan uygulanabilir ipuçları ver.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        return res.status(200).json({ success: true, answer: response.text });
      } catch (geminiError) {
        console.warn('Gemini call failed in assistant, using smart fallback:', geminiError);
      }
    }

    // Smart fallback answer when no API key is set
    const qLower = question.toLowerCase();
    let reply = '';

    if (qLower.includes('yağmur') || qLower.includes('hava')) {
      reply = `${destination} için yağmurlu günlerde açık hava vadileri yerine bölgedeki kapalı müzeleri, tarihi sarnıç veya kapalı çarşıları, seramik atölyelerini ve otantik kahvehaneleri ziyaret etmek harika bir alternatiftir. Ayrıca yerel lezzet tadımları ve kapalı müze galerileri için harika bir fırsat!`;
    } else if (qLower.includes('bütçe') || qLower.includes('tasarruf') || qLower.includes('indirim')) {
      reply = `Bütçenizi kısmak için en etkili 3 yöntem:\n1. Müzekart veya şehir indirim kartlarını kullanmak (bilet maliyetlerini %60+ düşürür).\n2. Öğle yemeklerini turistik caddelerin arka sokaklarındaki esnaf lokantalarında veya yerel börekçi/fırınlarda yemek.\n3. Taksi yerine hafif raylı sistem, metro ve yürüyüşü tercih etmek.`;
    } else if (qLower.includes('çocuk') || qLower.includes('bebek') || qLower.includes('aile')) {
      reply = `${destination} rotasında çocuklu aileler için basamaklı veya dik yokuşlu alanlar yerine geniş meydanlar, parklar ve düz yürüyüş yolları tercih edilmelidir. Bebek arabası yerine ergonomik kanguru taşımak eski taş sokaklarda büyük kolaylık sağlar. Sık mola vermeyi ve yanınızda su/atıştırmalık bulundurmayı unutmayın.`;
    } else {
      reply = `${destination} seyahatiniz için tavsiyemiz: Planlanan ana durakları sabah erken saatlerde gezerek kalabalıktan kaçınabilir, öğleden sonra ise yerel sokaklarda kaybolup otantik çay/kahve molaları verebilirsiniz. Yerel halkın tavsiye ettiği esnaf lokantaları hem bütçe dostudur hem de en lezzetli yöresel tatları sunar!`;
    }

    return res.status(200).json({ success: true, answer: reply });
  } catch (err: any) {
    console.error('Error in travel assistant question:', err);
    return res.status(500).json({
      error: 'Soru yanıtlanırken bir hata oluştu: ' + (err?.message || 'Bilinmeyen hata'),
    });
  }
}
