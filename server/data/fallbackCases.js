export const fallbackCases = {
  Easy: {
    title: "The Vanishing Emerald of Ravencrest Manor",
    premise: "During an intimate family dinner at Ravencrest Manor, Lord Harrington's prized Colombian Emerald disappeared from his locked study.",
    theme: "Classic Noir",
    difficulty: "Easy",
    storyBriefing: "Lord Reginald Harrington was hosting a celebration for his 60th birthday. At precisely 9:15 PM, the grandfather clock struck, the lights momentarily flickered, and Lord Harrington discovered his study safe cracked open. The famed 45-carat Emerald was gone. The only three individuals present in the west wing were his niece Clara, his estate butler Arthur, and the art appraiser Julian.",
    victim: {
      name: "Lord Reginald Harrington",
      details: "Wealthy eccentric collector of rare gems, known for strict household routines and meticulous record-keeping."
    },
    crimeScene: {
      location: "Private Study, 2nd Floor West Wing, Ravencrest Manor",
      time: "9:15 PM, Rainy Friday Evening"
    },
    suspects: [
      {
        id: "suspect-1",
        name: "Arthur Pendelton",
        occupation: "Head Butler",
        alibi: "Claims he was in the downstairs pantry polishing the silverware from 9:00 PM to 9:30 PM.",
        motive: "Rumored to have incurred heavy gambling debts at the docks.",
        demeanor: "Nervous and defensive, constantly adjusting his collar and checking the pocket watch.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      },
      {
        id: "suspect-2",
        name: "Clara Harrington",
        occupation: "Niece & Heiress",
        alibi: "Claims she was reading Victorian poetry in the library next door with the gramophone playing.",
        motive: "Recently cut out of Lord Harrington's primary will following an argument over her business investments.",
        demeanor: "Aloof and impatient, treating the investigation as a nuisance.",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      },
      {
        id: "suspect-3",
        name: "Julian Vance",
        occupation: "Art & Antique Appraiser",
        alibi: "Claims he was taking a telephone call in the conservatory about an upcoming London auction.",
        motive: "Facing imminent bankruptcy and possesses illicit black-market connections to fence rare gems.",
        demeanor: "Charming and overly cooperative, offering unsolicited theories about external burglars.",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
      }
    ],
    clues: [
      {
        id: "clue-1",
        title: "Smudged Velvet Safe Lining",
        description: "Fine white velvet fibers caught in the safe dial. The safe was opened using the combination, not forced.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-2",
        title: "Damp Wool Scarf in Conservatory",
        description: "A monogrammed cashmere scarf damp with rainwater found draped over an empty chair in the conservatory.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-3",
        title: "Pawn Ticket & Telegram",
        description: "A torn telegram found in the fireplace ashes: 'Buyer waiting in Amsterdam. Vessel departs midnight.'",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-4",
        title: "Gramophone Needle Scratch",
        description: "The record in the library was looping on a single scratch since 8:50 PM, suggesting the room was unoccupied.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-5",
        title: "Chalk Residue on Cufflinks",
        description: "Traces of safe-combination chalk residue found under Julian Vance's ivory cufflinks.",
        discovered: false,
        discoveredAt: null
      }
    ],
    hints: [
      {
        id: "hint-1",
        text: "Examine who had prior knowledge of the safe's combination or expertise in appraisal mechanisms.",
        unlocked: false,
        order: 1
      },
      {
        id: "hint-2",
        text: "Compare the alibi in the conservatory with the evidence found near the fireplace and cufflinks.",
        unlocked: false,
        order: 2
      }
    ],
    solution: {
      culpritId: "suspect-3",
      culpritName: "Julian Vance",
      explanation: "Julian Vance used his earlier appraisal inspection to covertly record the safe's combination. At 9:10 PM, he slipped away from the conservatory, leaving a damp decoy scarf, cracked the safe, and hid the emerald in his pocket watch case. The chalk residue on his cufflinks and the Amsterdam telegram confirm his premeditated escape plan.",
      criticalClueId: "clue-5"
    }
  },

  Medium: {
    title: "Cyanide in Silicon Valley",
    premise: "The controversial CEO of NeuralByte is poisoned during the closed-door launch dinner of their breakthrough neuro-chip.",
    theme: "Modern Thriller",
    difficulty: "Medium",
    storyBriefing: "Dr. Elijah Thorne was found slumped over his desk at 10:45 PM in the executive suite of NeuralByte HQ. His vintage bourbon contained lethal traces of potassium cyanide. The company was hours away from filing a $10B IPO, but internal whistleblowers alleged the neuro-chip had fatal biometric flaws. Four key executives had keycard access to the private bar.",
    victim: {
      name: "Dr. Elijah Thorne",
      details: "Visionary but ruthless CEO of NeuralByte, known for silencing dissenters and aggressive intellectual property buyouts."
    },
    crimeScene: {
      location: "Executive Penthouse Suite & Private Bar, 42nd Floor, NeuralByte Tower",
      time: "10:30 PM, Thursday Night"
    },
    suspects: [
      {
        id: "suspect-1",
        name: "Marcus Kane",
        occupation: "Co-Founder & Chief Technology Officer",
        alibi: "Claims he was in the server cleanroom executing the final diagnostic compile.",
        motive: "Dr. Thorne was secretly preparing to fire Marcus and claim full patent authorship.",
        demeanor: "Exhausted, hands trembling slightly, speaks in rapid technical jargon.",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      },
      {
        id: "suspect-2",
        name: "Dr. Vivienne Chen",
        occupation: "Lead Neuro-Pharmacologist",
        alibi: "Claims she was on a Zoom video conference with overseas clinical trial coordinators.",
        motive: "Discovered Thorne faked clinical trial safety data, threatening her medical license and reputation.",
        demeanor: "Calm, calculating, and guarded. Avoids eye contact when discussing toxicology.",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
      },
      {
        id: "suspect-3",
        name: "David Sterling",
        occupation: "Chief Financial Officer",
        alibi: "Claims he was reviewing SEC disclosure filings in the 40th floor boardroom.",
        motive: "Embezzled $14 million in escrow funds that the IPO audit would inevitably expose.",
        demeanor: "Sweating profusely, continuously wiping his brow with a silk handkerchief.",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      {
        id: "suspect-4",
        name: "Maya Lin",
        occupation: "Executive Assistant to Dr. Thorne",
        alibi: "Claims she left the building at 9:45 PM after delivering Dr. Thorne's evening bourbon glass.",
        motive: "Her brother committed suicide after NeuralByte allegedly stole his startup's core algorithm.",
        demeanor: "Subdued, visibly grieving, but with a cold intensity in her voice.",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
      }
    ],
    clues: [
      {
        id: "clue-1",
        title: "Crystal Bourbon Tumbler",
        description: "Residual bourbon coating the rim tested positive for fast-acting synthetic potassium cyanide.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-2",
        title: "Laboratory Reagent Logbook",
        description: "A chemical checkout record from the 38th floor bio-lab shows 50mg of cyanide missing, logged as 'routine reagent disposal'.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-3",
        title: "Server Room Keycard Badge Swipe",
        description: "Marcus Kane's badge logged entry into the server room at 10:15 PM, but the automated backup script ran autonomously with no keyboard inputs.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-4",
        title: "Encrypted Flash Drive",
        description: "Recovered from Dr. Vivienne Chen's handbag containing the unredacted clinical toxicity reports ready for the FBI.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-5",
        title: "Dissolvable Ice Sphere Mold",
        description: "A specialized slow-melting silicone sphere mold discovered in the kitchenette freezer, infused with chemical sediment.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-6",
        title: "Pre-Scheduled Wire Transfer",
        description: "CFO David Sterling initiated an offshore wire transfer at 10:25 PM from his laptop in the boardroom.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-7",
        title: "Toxicology Glass Pipette in Bio-Waste",
        description: "A micro-pipette discarded in the 38th floor bio-hazardous bin containing Vivienne Chen's fingerprint on the bulb.",
        discovered: false,
        discoveredAt: null
      }
    ],
    hints: [
      {
        id: "hint-1",
        text: "Look at the method of poison delivery: when was the drink poured versus when did the poison activate?",
        unlocked: false,
        order: 1
      },
      {
        id: "hint-2",
        text: "The killer needed specialized pharmacological knowledge to time the toxin with a delayed-release vehicle.",
        unlocked: false,
        order: 2
      },
      {
        id: "hint-3",
        text: "Check who had both access to laboratory reagents and left forensic traces on the disposal equipment.",
        unlocked: false,
        order: 3
      }
    ],
    solution: {
      culpritId: "suspect-2",
      culpritName: "Dr. Vivienne Chen",
      explanation: "Dr. Vivienne Chen utilized her access to the pharmacology lab to synthesize a slow-dissolving cyanide ice sphere. She placed the poisoned ice sphere into Dr. Thorne's decanter earlier in the evening. When the ice melted at approximately 10:20 PM, it released the lethal dosage while she established an artificial video alibi. Her fingerprint on the discarded pipette in the bio-waste bin seals her guilt.",
      criticalClueId: "clue-7"
    }
  },

  Hard: {
    title: "The Phantom of the Orient Express",
    premise: "As the luxury snowbound train halts in a Balkan blizzard, an international diplomat is found stabbed in a sealed compartment.",
    theme: "Agatha Christie Mystery",
    difficulty: "Hard",
    storyBriefing: "The Simplon-Orient Express is stalled high in the Vinkovci mountain pass. At 2:00 AM, Count Alexi Voronin, a Russian diplomat carrying confidential peace treaties, was discovered dead inside Cabin 7. The door was bolted from the inside, the window latched shut with ice frozen over the outer frame. Five distinguished passengers occupied the first-class carriage.",
    victim: {
      name: "Count Alexi Voronin",
      details: "Veteran diplomat carrying sensitive border treaty documents capable of halting an impending European conflict."
    },
    crimeScene: {
      location: "Cabin 7, First-Class Sleeping Car, Stalled Balkan Mountain Pass",
      time: "1:45 AM - 2:15 AM, Zero Visibility Blizzard"
    },
    suspects: [
      {
        id: "suspect-1",
        name: "Baroness Greta Von Klaus",
        occupation: "Austrian Aristocrat",
        alibi: "Claims she took sleeping drops at midnight and slept through until the emergency whistle sounded.",
        motive: "Her family fortune was wiped out due to treaties negotiated by Count Voronin after the Great War.",
        demeanor: "Haughty and condescending, clutching a lace handkerchief scented with bitter almonds.",
        avatarUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150"
      },
      {
        id: "suspect-2",
        name: "Colonel Hector Sterling",
        occupation: "British Military Attaché",
        alibi: "Claims he was in the dining salon smoking cigars with the train conductor until 1:30 AM.",
        motive: "Suspected Voronin of treasonous intelligence leaks compromising British imperial garrisons.",
        demeanor: "Stiff upper lip, disciplined posture, with fresh scratches along his left forearm.",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
      },
      {
        id: "suspect-3",
        name: "Madame Elena Rostova",
        occupation: "Prima Ballerina",
        alibi: "Claims she was suffering from a migraine in Cabin 5 with her door locked.",
        motive: "Voronin possessed private letters revealing her real identity as a revolutionary spy.",
        demeanor: "Dramatically distressed, wearing heavy theatrical makeup that masks her true expressions.",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
      },
      {
        id: "suspect-4",
        name: "Dr. Sandor Kovacs",
        occupation: "Hungarian Physician & Antiquities Collector",
        alibi: "Claims he was treating the train engineer for frostbite in the engine tender until 2:00 AM.",
        motive: "Blackmailed by Voronin over the smuggling of stolen Byzantine relics.",
        demeanor: "Clinical, detached, speaks with surgical precision, hands clean and steady.",
        avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150"
      },
      {
        id: "suspect-5",
        name: "Pierre Dubois",
        occupation: "Carriage Conductor",
        alibi: "Claims he was patrolling the corridor and checking boiler steam gauges throughout the night.",
        motive: "Offered a massive bribe by foreign syndicates to ensure the treaty papers never reached Geneva.",
        demeanor: "Meek, subservient, continually checking the master brass skeleton key set on his belt.",
        avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150"
      }
    ],
    clues: [
      {
        id: "clue-1",
        title: "Engraved Pearl-Handled Stiletto",
        description: "The murder weapon left in the victim's chest, bearing an engraved double-headed eagle crest.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-2",
        title: "Inter-Cabin Communicating Door Latch",
        description: "The hidden panel connecting Cabin 7 and Cabin 5 had its wooden stop shimmed with a thin silver hairpin.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-3",
        title: "Singed Match and Turkish Cigarette Butt",
        description: "A rare Balkan Sobranie cigarette stub found in the ashtray; only Madame Rostova and Count Voronin smoked this blend.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-4",
        title: "Snow Tracks on Outer Gangway",
        description: "No footprints outside in the snowdrifts, ruling out an intruder entering through the frosted window.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-5",
        title: "Torn Page from Ballet Schedule",
        description: "A handwritten itinerary inside Madame Rostova's vanity listing secret rendezvous dates across Saint Petersburg.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-6",
        title: "Master Skeleton Key Inspection",
        description: "Conductor Dubois's skeleton key was found bent at the tooth, unable to engage the heavy deadbolt of Cabin 7.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-7",
        title: "Surgical Scalpel Case",
        description: "Dr. Kovacs's medical bag was inspected; all surgical instruments were present and accounted for.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-8",
        title: "Blood-Stained Silk Ribbon",
        description: "A crimson-stained pink satin ribbon identical to those used on prima ballerina pointe shoes found behind the radiator in Cabin 5.",
        discovered: false,
        discoveredAt: null
      },
      {
        id: "clue-9",
        title: "Forged Bulgarian Passport",
        description: "Found tucked inside the lining of Madame Elena Rostova's fur coat under the alias 'Natalia Volkova'.",
        discovered: false,
        discoveredAt: null
      }
    ],
    hints: [
      {
        id: "hint-1",
        text: "The locked room was an illusion: investigate the architecture connecting adjacent cabins.",
        unlocked: false,
        order: 1
      },
      {
        id: "hint-2",
        text: "Compare the cigarette ash and hairpins with the personal habits and belongings of the occupants in neighboring cabins.",
        unlocked: false,
        order: 2
      },
      {
        id: "hint-3",
        text: "Physical evidence was concealed in Cabin 5; the victim's blackmailer had an urgent deadline before the train reached the border.",
        unlocked: false,
        order: 3
      }
    ],
    solution: {
      culpritId: "suspect-3",
      culpritName: "Madame Elena Rostova",
      explanation: "Madame Elena Rostova used the discreet communicating door between Cabin 5 and Cabin 7, having picked the lock with a silver hairpin. She confronted Count Voronin over the incriminating letters, stabbed him with his own family stiletto, bolted the corridor door from inside to simulate a locked room mystery, and retreated back into Cabin 5. The matching Balkan cigarette, the blood-stained pointe ribbon, and her forged passport establish her undeniable guilt.",
      criticalClueId: "clue-8"
    }
  }
};

