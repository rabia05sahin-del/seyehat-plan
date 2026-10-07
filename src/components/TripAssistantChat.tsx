import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, Loader2 } from 'lucide-react';

interface TripAssistantChatProps {
  destination: string;
  planSummary: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const TripAssistantChat: React.FC<TripAssistantChatProps> = ({
  destination,
  planSummary,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Merhaba! ${destination} seyahat planınızla ilgili merak ettiğiniz tüm soruları bana sorabilirsiniz. Örneğin yağmurlu gün alternatifleri, rota değişiklikleri, bütçe tüyoları veya çocuk dostu mekanlar hakkında yardımcı olabilirim.`,
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Yağmur yağarsa rota için kapalı mekan alternatifleri nelerdir?',
    'Bütçemi %20 daha kısmak için hangi harcamalardan tasarruf edebilirim?',
    'Bu rotayı çocuklu aile veya bebek arabasıyla gezmek kolay mı?',
    'Akşamları güvenli ve keyifli vakit geçirilecek semtler neresi?',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputQuestion;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      let answered = false;

      try {
        const res = await fetch('/api/ask-travel-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            question: textToSend,
            currentPlanSummary: planSummary,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.answer) {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                sender: 'assistant',
                text: data.answer,
              },
            ]);
            answered = true;
          }
        }
      } catch (e) {
        console.warn('API request failed, generating client response:', e);
      }

      if (!answered) {
        // Fallback smart guide answer
        const qLower = textToSend.toLowerCase();
        let fallbackReply = '';
        if (qLower.includes('yağmur') || qLower.includes('hava')) {
          fallbackReply = `${destination} için yağmurlu günlerde açık hava vadileri yerine bölgedeki kapalı müzeleri, tarihi sarnıç veya kapalı çarşıları, seramik/zanaat atölyelerini ve otantik kahvehaneleri ziyaret etmek harika bir alternatiftir.`;
        } else if (qLower.includes('bütçe') || qLower.includes('tasarruf') || qLower.includes('indirim')) {
          fallbackReply = `Bütçenizi kısmak için en etkili 3 yöntem:\n1. Müzekart veya yerel indirimli şehir kartlarını kullanmak.\n2. Turistik caddeler yerine yerel esnaf lokantalarını tercih etmek.\n3. Şehir içi raylı sistem, metro ve yürüyüş rotalarından faydalanmak.`;
        } else if (qLower.includes('çocuk') || qLower.includes('bebek') || qLower.includes('aile')) {
          fallbackReply = `${destination} rotasında çocuklu aileler için basamaklı veya dik yokuşlu alanlar yerine geniş meydanlar, parklar ve düz yürüyüş yolları tercih edilmelidir. Eski taş sokaklar için ergonomik kanguru taşımak bebek arabasından daha rahattır.`;
        } else {
          fallbackReply = `${destination} seyahatiniz için önerimiz: Sabah saatlerinde ikonik yerleri kalabalıksız gezip, öğleden sonra yerel sokaklarda otantik çay/kahve molaları vermenizdir. Yerel esnaf lokantaları hem bütçe dostudur hem de en iyi yerel lezzetleri sunar!`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: fallbackReply,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Tavsiye: Gezi sırasında yerel halkın tercih ettiği mekanlar hem bütçenizi korur hem de en otantik seyahat deneyimini sunar.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Seyahat Danışmanına Sor</h4>
            <span className="text-[11px] text-slate-300">
              Rotayı revize et, ek tavsiye veya alternatifler iste
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-2xl w-fit border border-slate-200">
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>Seyahat uzmanı yanıt hazırlıyor...</span>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-200 shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Seyahat veya rotanız hakkında bir soru yazın..."
          disabled={isLoading}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gönder</span>
        </button>
      </form>
    </div>
  );
};
