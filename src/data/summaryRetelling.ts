import type { SummaryScenario } from '../lib/summaryTypes';
export const summaryRetelling: SummaryScenario[] = [
  {
    id: 'game',
    level: 2,
    title: 'A game I like',
    question: 'Tell me about your favourite game.',
    original:
      'First I turn on the computer. Then I wait for it to load. I click the game. I open a new world. I like Minecraft because I can build things with my friends. Yesterday we built a castle with a bridge and a garden.',
    models: [
      'My favourite game is Minecraft because I can build with my friends. Yesterday we made a castle.',
      'I like Minecraft. Building a world with friends makes it creative and fun.',
    ],
    details: [
      {
        id: 'name',
        text: 'My favourite game is Minecraft.',
        relevant: true,
        explanation: 'Name the game so the listener knows your main answer.',
      },
      {
        id: 'load',
        text: 'I wait for the computer to load.',
        relevant: false,
        explanation: 'Loading steps are useful in a tutorial, but not essential to this question.',
      },
      {
        id: 'why',
        text: 'I enjoy building things with friends.',
        relevant: true,
        explanation: 'This explains what you enjoy about the game.',
      },
      {
        id: 'example',
        text: 'We built a castle together.',
        relevant: true,
        explanation: 'A short example can make the explanation more concrete.',
      },
    ],
  },
  {
    id: 'trip',
    level: 2,
    title: 'A change of plan',
    question: 'How was your school trip?',
    original:
      'We met outside school at 8 o’clock. The teacher checked our names. We got on the bus and found our seats. At the museum we discovered the science room was closed. Instead, we joined a workshop about space. Everyone enjoyed making a small model rocket.',
    models: [
      'Our trip had a surprise: the science room was closed, but we enjoyed a space workshop instead.',
      'The trip was fun despite a change of plan. We made model rockets at a space workshop.',
    ],
    details: [
      {
        id: 'change',
        text: 'The science room was closed, so the plan changed.',
        relevant: true,
        explanation: 'The change of plan explains what made this trip different.',
      },
      {
        id: 'names',
        text: 'The teacher checked our names.',
        relevant: false,
        explanation: 'This routine step does not change the meaning of the experience.',
      },
      {
        id: 'rocket',
        text: 'We enjoyed making model rockets.',
        relevant: true,
        explanation: 'This gives the listener an important activity and a feeling.',
      },
      {
        id: 'seats',
        text: 'We found our seats on the bus.',
        relevant: false,
        explanation: 'A short summary does not need every travel step.',
      },
    ],
  },
];
