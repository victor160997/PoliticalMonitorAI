
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export interface Politician {
  id: string;
  name: string;
  type: string;
  party: string;
  state: string;
  photoUrl: string;
}

interface PoliticianSelectorProps {
  onSelect: (politician: Politician) => void;
  selectedPolitician: Politician | null;
}

const PoliticianSelector: React.FC<PoliticianSelectorProps> = ({ onSelect, selectedPolitician }) => {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchPoliticians = async () => {
      setIsLoading(true);
      console.log('Iniciando busca de políticos...');
      try {
        const response = await fetch('http://localhost:3001/api/politicians');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setPoliticians(data);
        setFilteredPoliticians(data);
        console.log(`${data.length} políticos carregados`);
      } catch (error) {
        console.error('Erro ao carregar políticos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoliticians();
  }, []);

  useEffect(() => {
    const filtered = politicians.filter(politician =>
      politician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politician.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politician.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPoliticians(filtered);
  }, [searchTerm, politicians]);

  const handleSelect = (politician: Politician) => {
    onSelect(politician);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar político, partido ou estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="pl-10 pr-10"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {isDropdownOpen && (
          <Card className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-50 bg-white shadow-lg">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Carregando políticos...</div>
            ) : filteredPoliticians.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Nenhum político encontrado</div>
            ) : (
              <div className="p-2">
                {filteredPoliticians.map((politician) => (
                  <div
                    key={politician.id}
                    onClick={() => handleSelect(politician)}
                    className="flex items-center space-x-3 p-2 hover:bg-blue-50 cursor-pointer rounded-md transition-colors"
                  >
                    <img
                      src={politician.photoUrl}
                      alt={politician.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{politician.name}</div>
                      <div className="text-xs text-gray-500">
                        {politician.party} - {politician.state}
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {politician.type === 'deputado' ? 'Deputado' : 'Senador'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {selectedPolitician && (
        <Card className="mt-4 p-4">
          <div className="flex items-center space-x-4">
            <img
              src={selectedPolitician.photoUrl}
              alt={selectedPolitician.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{selectedPolitician.name}</h3>
              <p className="text-gray-600">
                {selectedPolitician.party} - {selectedPolitician.state}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                {selectedPolitician.type === 'deputado' ? 'Deputado Federal' : 'Senador'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PoliticianSelector;
