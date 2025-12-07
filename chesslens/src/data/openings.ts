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
    {
      id: 'ruy-lopez',
      name: 'Ruy Lopez',
      eco: 'C60',
      side: 'white',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
      description:
        'Ruy Lopez is a classical king’s pawn opening where White pressures the c6 knight to increase control over the center.',
      ideas: [
        'White aims for strong central control with pieces and pawns on e4 and d4.',
        'Typical plans include castling kingside and preparing c3 and d4 to build a pawn center.',
        'Black chooses between solid (…Be7, …d6) or more active (…a6, …b5) counterplay.',
      ],
    },
    {
      id: 'french-defense',
      name: 'French Defense',
      eco: 'C00',
      side: 'black',
      moves: ['e4', 'e6', 'd4', 'd5'],
      description:
        'The French Defense is a solid response to 1.e4 where Black challenges the center with …d5 and prepares for counterattacks on the queenside.',
      ideas: [
        'Black accepts a somewhat cramped position in exchange for a strong pawn chain.',
        'Typical plans involve attacking White’s center with c5 and f6 breaks.',
        'White often gains space and may attack on the kingside, especially in the Advance and Winawer variations.',
      ],
    },
    {
      id: 'kings-indian-defense',
      name: "King's Indian Defense",
      eco: 'E60',
      side: 'black',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
      description:
        "King's Indian Defense is a dynamic reply to 1.d4 where Black allows White space in the center and aims for a later kingside counterattack.",
      ideas: [
        'Black fianchettoes the king’s bishop and castles quickly.',
        'Typical pawn breaks are …e5 or …c5 to challenge White’s center.',
        'White often expands with e4 and d5, while Black prepares a pawn storm with …f5 and a kingside attack.',
      ],
    },
    {
      id: 'caro-kann',
      name: 'Caro-Kann Defense',
      eco: 'B12',
      side: 'black',
      moves: ['e4', 'c6', 'd4', 'd5'],
      description:
        'The Caro-Kann is a solid and resilient defense to 1.e4 where Black supports the d5 thrust with the c-pawn.',
      ideas: [
        'Black aims for a sound structure with fewer weaknesses than in many 1.e4 defenses.',
        'Typical piece development includes …Bf5 or …Bg4 followed by …e6 and …Nd7.',
        'White often gains a space advantage and tries to use it for a kingside initiative.',
      ],
    },
    {
      id: 'london-system',
      name: 'London System',
      eco: 'D02',
      side: 'white',
      moves: ['d4', 'Nf3', 'Bf4', 'e3'],
      description:
        'The London System is a flexible setup opening where White develops the dark-squared bishop early to f4 and builds a solid structure.',
      ideas: [
        'White aims for a stable pawn triangle with pawns on d4, e3, and often c3.',
        'The setup is resilient to many Black responses and easy to play as a system.',
        'Typical plans include castling kingside, placing a rook on e1 or c1, and later pushing e4 or c4 for central play.',
      ],
    },
  ];
  