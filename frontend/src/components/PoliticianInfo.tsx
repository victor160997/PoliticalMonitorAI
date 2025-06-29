
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Politician } from './PoliticianSelector';

interface PoliticianInfoProps {
  politician: Politician;
}

interface DetailedPolitician {
  id: number;
  nomeCivil: string;
  ultimoStatus: {
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
    email?: string;
    gabinete?: {
      nome: string;
      predio: string;
      sala: string;
      telefone: string;
    };
    situacao: string;
    condicaoEleitoral: string;
  };
  proposicoes: Array<{
    id: number;
    siglaTipo: string;
    numero: number;
    ano: number;
    ementa: string;
  }>;
  numberOfPropositions: number;
  votacoes: any[];
  redeSocial?: string[];
  escolaridade?: string;
}

const PoliticianInfo: React.FC<PoliticianInfoProps> = ({ politician }) => {
  const [detailedInfo, setDetailedInfo] = useState<DetailedPolitician | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedInfo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/politicians/${politician.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDetailedInfo(data);
      } catch (error) {
        console.error('Erro ao carregar informações detalhadas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedInfo();
  }, [politician.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-48"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!detailedInfo) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Erro ao carregar informações do político</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-4">
            <img
              src={detailedInfo.ultimoStatus.urlFoto}
              alt={detailedInfo.ultimoStatus.nome}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{detailedInfo.ultimoStatus.nome}</h2>
              <p className="text-gray-600 text-sm">{detailedInfo.nomeCivil}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">{detailedInfo.ultimoStatus.siglaPartido}</Badge>
                <Badge variant="outline">{detailedInfo.ultimoStatus.siglaUf}</Badge>
                <Badge className="bg-blue-600">
                  {politician.type === 'deputado' ? 'Deputado Federal' : 'Senador'}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{detailedInfo.numberOfPropositions}</div>
            <div className="text-sm text-gray-600">Proposições</div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{detailedInfo.votacoes.length}</div>
            <div className="text-sm text-gray-600">Votações</div>
          </CardContent>
        </Card> */}

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-600">{detailedInfo.ultimoStatus.situacao}</div>
            <div className="text-sm text-gray-600">Situação</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-600">{detailedInfo.escolaridade || 'N/A'}</div>
            <div className="text-sm text-gray-600">Escolaridade</div>
          </CardContent>
        </Card>
      </div>

      {/* Gabinete */}
      {detailedInfo.ultimoStatus.gabinete && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Gabinete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Sala:</strong> {detailedInfo.ultimoStatus.gabinete.sala}
              </div>
              <div>
                <strong>Prédio:</strong> {detailedInfo.ultimoStatus.gabinete.predio}
              </div>
              <div>
                <strong>Telefone:</strong> {detailedInfo.ultimoStatus.gabinete.telefone}
              </div>
              {detailedInfo.ultimoStatus.email && (
                <div>
                  <strong>Email:</strong> {detailedInfo.ultimoStatus.email}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Últimas Proposições */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Proposições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailedInfo.proposicoes.slice(0, 5).map((proposicao) => (
              <div key={proposicao.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {proposicao.siglaTipo} {proposicao.numero}/{proposicao.ano}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{proposicao.ementa}</p>
              </div>
            ))}
            {detailedInfo.proposicoes.length === 0 && (
              <p className="text-gray-500 text-center">Nenhuma proposição encontrada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociais */}
      {detailedInfo.redeSocial && detailedInfo.redeSocial.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {detailedInfo.redeSocial.map((rede, index) => (
                <a
                  key={index}
                  href={rede}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {rede.includes('twitter') ? 'Twitter' :
                    rede.includes('facebook') ? 'Facebook' :
                      rede.includes('youtube') ? 'YouTube' : 'Link'}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PoliticianInfo;
