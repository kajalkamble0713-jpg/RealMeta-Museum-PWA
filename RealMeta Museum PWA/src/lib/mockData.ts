// Mock data for demo mode - simulates backend responses
import { Artwork, MuseumMap } from './types';

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: 'starry-night',
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
    year: 1889,
    shortBlurb: 'A swirling night sky over a French village, painted from memory during van Gogh\'s stay at an asylum.',
    longStory: '<p>Painted in June 1889, The Starry Night depicts the view from van Gogh\'s asylum room window at Saint-RÃ©my-de-Provence, just before sunrise. The painting is one of the most recognized pieces in modern culture.</p><p>The village in the painting is an imagined composite, as van Gogh painted from memory. The prominent cypress tree in the foreground connects earth and sky, a common motif in van Gogh\'s work during this period.</p>',
    technique: 'Oil on canvas with characteristic impasto brushwork and swirling compositions',
    provenance: 'Created at Saint-Paul-de-Mausole asylum; acquired by MoMA in 1941',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    audioUrl: '/audio/starry-night.mp3',
    tags: ['post-impressionism', 'landscape', 'night scene', 'van gogh'],
    related: ['cafe-terrace', 'irises'],
    galleryLocation: { room: 'Gallery A', x: 150, y: 200 },
    arMarker: { markerId: 'starry-night-marker', markerFile: '/markers/starry-night.png' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'girl-with-pearl',
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: 1665,
    shortBlurb: 'An iconic portrait of a girl in exotic dress wearing a large pearl earring, capturing a moment of intimate connection.',
    longStory: '<p>Often called the "Mona Lisa of the North," this painting is Vermeer\'s most famous work. The subject\'s identity remains unknown, adding to the painting\'s mystery and allure.</p><p>Vermeer\'s masterful use of light and shadow, combined with the subject\'s enigmatic gaze over her shoulder, creates an sense of timeless intimacy. The luminous pearl earring serves as the focal point, demonstrating Vermeer\'s exceptional skill in rendering light.</p>',
    technique: 'Oil on canvas with Vermeer\'s signature soft, diffused lighting and precise color harmony',
    provenance: 'Part of the Mauritshuis collection since 1902',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
    audioUrl: '/audio/girl-with-pearl.mp3',
    tags: ['dutch golden age', 'portrait', 'vermeer', 'baroque'],
    related: ['milkmaid', 'view-of-delft'],
    galleryLocation: { room: 'Gallery A', x: 300, y: 200 },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'the-scream',
    title: 'The Scream',
    artist: 'Edvard Munch',
    year: 1893,
    shortBlurb: 'An expressionist masterpiece depicting overwhelming anxiety, with a figure against a tumultuous orange sky.',
    longStory: '<p>The Scream is one of the most iconic images in art history, representing universal human anxiety. Munch created several versions using different media between 1893 and 1910.</p><p>Munch described the inspiration: walking at sunset, he felt a "great, infinite scream pass through nature." The swirling sky and landscape reflect the inner turmoil of the agonized figure in the foreground.</p>',
    technique: 'Oil, tempera, pastel and crayon on cardboard with bold, expressive brushwork',
    provenance: 'National Gallery of Norway; various versions in private and public collections',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg',
    tags: ['expressionism', 'symbolism', 'anxiety', 'munch'],
    related: ['madonna', 'vampire'],
    galleryLocation: { room: 'Gallery B', x: 150, y: 350 },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'the-kiss',
    title: 'The Kiss',
    artist: 'Gustav Klimt',
    year: 1908,
    shortBlurb: 'A golden embrace symbolizing love and intimacy, featuring Klimt\'s signature decorative style.',
    longStory: '<p>The Kiss is the pinnacle of Klimt\'s "Golden Period," when he incorporated gold leaf into his paintings. The work shows a couple embracing, their bodies entwined in elaborate robes decorated with organic and geometric forms.</p><p>The painting represents the moment of supreme bliss, with the couple isolated against a golden background that seems to dissolve into eternity. The contrast between the angular male patterns and flowing female patterns reflects contemporary ideas about gender.</p>',
    technique: 'Oil and gold leaf on canvas with Byzantine-inspired mosaic patterns',
    provenance: 'Austrian Gallery Belvedere, Vienna, acquired 1908',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gustav_Klimt_016.jpg/800px-Gustav_Klimt_016.jpg',
    audioUrl: '/audio/the-kiss.mp3',
    tags: ['art nouveau', 'symbolism', 'klimt', 'gold leaf'],
    related: ['judith', 'portrait-of-adele'],
    galleryLocation: { room: 'Gallery B', x: 300, y: 350 },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'the-birth-of-venus',
    title: 'The Birth of Venus',
    artist: 'Sandro Botticelli',
    year: 1485,
    shortBlurb: 'Venus emerging from the sea on a shell, a Renaissance masterpiece of mythological beauty.',
    longStory: '<p>This iconic painting depicts the goddess Venus arriving at the shore after her birth, when she had emerged from the sea fully-grown. It is one of the most famous works of the Renaissance.</p><p>Botticelli\'s Venus is shown nude, standing in a contrapposto pose on a giant scallop shell. To the left, the wind god Zephyrus blows her ashore, while a nymph rushes to cover her with a flowered cloak. The painting represents divine love and beauty.</p>',
    technique: 'Tempera on canvas with graceful linear rhythms and delicate coloring',
    provenance: 'Commissioned by the Medici family; Uffizi Gallery since 1815',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1200px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
    tags: ['renaissance', 'mythology', 'botticelli', 'nude'],
    related: ['primavera', 'pallas-and-centaur'],
    galleryLocation: { room: 'Gallery C', x: 150, y: 150 },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'guernica',
    title: 'Guernica',
    artist: 'Pablo Picasso',
    year: 1937,
    shortBlurb: 'A powerful anti-war statement depicting the bombing of Guernica during the Spanish Civil War.',
    longStory: '<p>Guernica is Picasso\'s most famous political statement, painted in response to the Nazi bombing of the Basque town of Guernica during the Spanish Civil War. The monochromatic palette emphasizes the starkness of war.</p><p>The painting shows the tragedies of war and the suffering it inflicts upon individuals. The bull and horse are central figures, along with human figures in various states of anguish. Its power lies in its universal condemnation of the brutality of war.</p>',
    technique: 'Oil on canvas, cubist style in monochromatic greys, blacks, and whites',
    provenance: 'Museo Reina SofÃ­a, Madrid; traveled internationally before returning to Spain in 1981',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/1200px-PicassoGuernica.jpg',
    videoUrl: '/video/guernica-analysis.mp4',
    tags: ['cubism', 'political art', 'picasso', 'war'],
    related: ['weeping-woman', 'three-musicians'],
    galleryLocation: { room: 'Gallery C', x: 300, y: 150 },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'american-gothic',
    title: 'American Gothic',
    artist: 'Grant Wood',
    year: 1930,
    shortBlurb: 'An iconic depiction of a farmer and his daughter standing before a Gothic Revival house.',
    longStory: '<p>American Gothic has become one of the most parodied images in American art. Wood intended it as a positive statement about rural American values, though many interpreted it as satire.</p><p>The models were Wood\'s sister and his dentist. The painting\'s austere subjects and rigid composition reflect the sober work ethic and puritanical values of the American Midwest. The Gothic window in the background inspired both the painting\'s title and composition.</p>',
    technique: 'Oil on beaverboard with meticulous detail and smooth surface',
    provenance: 'Art Institute of Chicago, purchased 1930',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/800px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg',
    tags: ['regionalism', 'americana', 'portrait', 'grant wood'],
    related: ['daughters-of-revolution', 'fall-plowing'],
    galleryLocation: { room: 'Gallery D', x: 150, y: 300 },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'the-persistence-of-memory',
    title: 'The Persistence of Memory',
    artist: 'Salvador DalÃ­',
    year: 1931,
    shortBlurb: 'Melting clocks in a dreamlike landscape, exploring themes of time, memory, and perception.',
    longStory: '<p>Perhaps the most famous work of Surrealism, The Persistence of Memory features DalÃ­\'s iconic melting pocket watches in a barren landscape. The soft watches represent the fluidity and irrelevance of time during sleep.</p><p>DalÃ­ described the inspiration as coming after contemplating a melting wheel of Camembert cheese while suffering from a headache. The painting challenges our understanding of reality and the rigidity of temporal measurement, suggesting that time itself is subjective and malleable.</p>',
    technique: 'Oil on canvas with DalÃ­\'s precise, dream-like realism',
    provenance: 'Museum of Modern Art, New York, since 1934',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/1200px-The_Persistence_of_Memory.jpg',
    audioUrl: '/audio/persistence-of-memory.mp3',
    tags: ['surrealism', 'dali', 'dreamscape', 'time'],
    related: ['swans-reflecting-elephants', 'the-elephants'],
    galleryLocation: { room: 'Gallery D', x: 300, y: 300 },
    arMarker: { markerId: 'persistence-marker', markerFile: '/markers/persistence.png' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

export const MOCK_MUSEUM_MAP: MuseumMap = {
  name: 'RealMeta Museum Floor Plan',
  imageUrl: '/map/floor-plan.svg',
  rooms: [
    {
      id: 'gallery-a',
      name: 'Gallery A - Post-Impressionism',
      bounds: { x: 50, y: 50, width: 350, height: 250 },
      description: 'Post-Impressionist and Dutch Golden Age masterpieces'
    },
    {
      id: 'gallery-b',
      name: 'Gallery B - Expressionism',
      bounds: { x: 50, y: 320, width: 350, height: 200 },
      description: 'Expressionist and Art Nouveau works'
    },
    {
      id: 'gallery-c',
      name: 'Gallery C - Classical & Modern',
      bounds: { x: 420, y: 50, width: 300, height: 250 },
      description: 'Renaissance and Cubist collections'
    },
    {
      id: 'gallery-d',
      name: 'Gallery D - 20th Century',
      bounds: { x: 420, y: 320, width: 300, height: 200 },
      description: 'American Regionalism and Surrealism'
    }
  ],
  artworks: MOCK_ARTWORKS.map(artwork => ({
    artworkId: artwork.id,
    x: artwork.galleryLocation.x,
    y: artwork.galleryLocation.y
  }))
};

// Mock recognition - maps image characteristics to artwork IDs
// NOTE: Order matters! More specific keywords should come first
export const MOCK_RECOGNITION_DATABASE: Record<string, string> = {
  'starry': 'starry-night',
  'van gogh': 'starry-night',
  'vangogh': 'starry-night',
  'gogh': 'starry-night',
  'swirl': 'starry-night',
  'night': 'starry-night',
  'cypress': 'starry-night',
  'pearl': 'girl-with-pearl',
  'earring': 'girl-with-pearl',
  'vermeer': 'girl-with-pearl',
  'girl': 'girl-with-pearl',
  'scream': 'the-scream',
  'munch': 'the-scream',
  'anxiety': 'the-scream',
  'kiss': 'the-kiss',
  'klimt': 'the-kiss',
  'gold': 'the-kiss',
  'embrace': 'the-kiss',
  'venus': 'the-birth-of-venus',
  'shell': 'the-birth-of-venus',
  'botticelli': 'the-birth-of-venus',
  'birth': 'the-birth-of-venus',
  'guernica': 'guernica',
  'picasso': 'guernica',
  'bombing': 'guernica',
  'war': 'guernica',
  'gothic': 'american-gothic',
  'farmer': 'american-gothic',
  'american': 'american-gothic',
  'dali': 'the-persistence-of-memory',
  'dalÃ­': 'the-persistence-of-memory',
  'clock': 'the-persistence-of-memory',
  'melting': 'the-persistence-of-memory',
  'persistence': 'the-persistence-of-memory',
  'memory': 'the-persistence-of-memory'
};

