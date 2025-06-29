
import React, { useState } from 'react';
import PoliticianSelector, { Politician } from '@/components/PoliticianSelector';
import PoliticianInfo from '@/components/PoliticianInfo';
import ChatInterface from '@/components/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [selectedPolitician, setSelectedPolitician] = useState<Politician | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Monitor Legislativo Inteligente
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparência política com inteligência artificial. Pesquise deputados e senadores, 
              explore seus dados e converse com nossa IA especializada.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Seletor de Político */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Selecione um Político
                </h2>
                <p className="text-gray-600">
                  Busque por nome, partido ou estado para começar
                </p>
              </div>
              <PoliticianSelector
                onSelect={setSelectedPolitician}
                selectedPolitician={selectedPolitician}
              />
            </CardContent>
          </Card>

          {/* Conteúdo Principal */}
          {selectedPolitician ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações do Político */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Informações Detalhadas
                </h2>
                <PoliticianInfo politician={selectedPolitician} />
              </div>

              {/* Chat com IA */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Converse com a IA
                </h2>
                <ChatInterface politician={selectedPolitician} />
              </div>
            </div>
          ) : (
            /* Estado Inicial */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Explore a Transparência Política
                </h3>
                <p className="text-gray-600 mb-6">
                  Use o seletor acima para escolher um deputado ou senador e descobrir 
                  informações detalhadas sobre sua atuação parlamentar.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📊 Dados Completos</h4>
                    <p className="text-blue-600">Proposições, votações, presença e gastos</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">🤖 IA Especializada</h4>
                    <p className="text-green-600">Chat inteligente com contexto político</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">🔍 Transparência</h4>
                    <p className="text-purple-600">Informações públicas organizadas</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Monitor Legislativo Inteligente - Promovendo transparência através da tecnologia
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dados obtidos de APIs oficiais do governo brasileiro
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
