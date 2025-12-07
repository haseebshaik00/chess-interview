export interface Opening {
    id: string;
    name: string;
    eco: string;
    side: 'white' | 'black';
    moves: string[];        
    description: string;
    ideas: string[];
  }
  
  export const openings: Opening[] = [
    {
      id: 'queens-gambit',
      name: "Queen's Gambit",
      eco: 'D06',
      side: 'white',
      moves: ['d4', 'd5', 'c4'],
      description:
        "Queen's Gambit is a queen's pawn opening where White offers the c-pawn to deflect Black's d-pawn and gain central control.",
      ideas: [
        'White fights for central dominance with pawns on d4 and often e4.',
        'If Black accepts with dxc4, White gains time by attacking the c4 pawn.',
        "If Black declines, the game often leads to solid but slightly cramped positions for Black.",
      ],
    },
    {
      id: 'sicilian',
      name: 'Sicilian Defense',
      eco: 'B20',
      side: 'black',
      moves: ['e4', 'c5'],
      description:
        'The Sicilian is an aggressive reply to 1.e4 where Black immediately fights for the d4 square and counterplay.',
      ideas: [
        'Asymmetrical pawn structure leads to rich, unbalanced positions.',
        'Black often plays d6, Nf6, and g6 or e6 depending on the setup.',
        'White usually aims for quick development and kingside attack.',
      ],
    },
    // Add more techq later!
  ];
  