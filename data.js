/* Pre-written compliment & fortune banks.
   200 compliments and 200 fortunes are built by pairing two fixed phrase
   pools (20 x 10 = 200 each). Nothing here calls any AI or network service —
   it's all local text, picked and shuffled in the browser. Edit the pools
   below to change the tone or add more variety. */

const COMPLIMENT_A = [
  "You walked in and the room quietly upgraded itself.",
  "That's not just a photo, that's a personality flex.",
  "Certified heartthrob energy, no cap.",
  "You're giving main character energy and everyone's just living in your episode.",
  "Confidence like that should require a permit.",
  "You look like the plot twist nobody saw coming — in the best way.",
  "There's a whole vibe happening here and it's working.",
  "You didn't just take a photo, you took the whole mood.",
  "Somebody call security, this is a full-on charm offensive.",
  "That smile could start a small, very charming riot.",
  "You look like trouble in the most fun way possible.",
  "This is what 'effortlessly magnetic' looks like.",
  "You're basically the trailer for a really good movie.",
  "Whoever's around you today is lucky and doesn't even know it yet.",
  "That's a whole mood board of confidence right there.",
  "You look like you already know the answer is yes.",
  "Ten out of ten, would let this person cut in line.",
  "This photo has main-character lighting, literally and figuratively.",
  "You've got 'walked past the mirror and it winked back' energy.",
  "That's the kind of glow you can't buy at a store."
];

const COMPLIMENT_B = [
  "Someone's clearly got it figured out.",
  "Not everyone can pull that off. You did.",
  "Keep doing whatever this is.",
  "This is your sign to own it.",
  "Charisma level: dangerously high.",
  "The confidence really is the whole outfit.",
  "That's the energy the room needed.",
  "Bottle that up and sell it, seriously.",
  "You clearly didn't get the 'play it cool' memo, and honestly, good.",
  "Somebody's feeling themselves today, and rightfully so."
];

const FORTUNE_A = [
  "The universe is drafting a plan, and you're the main character in it.",
  "Something spicy (in a good way) is headed your way this week.",
  "A stranger is about to slide into something — could be your DMs, could be your destiny.",
  "Good things are circling you like they're too shy to land yet.",
  "The stars are gossiping about you, and it's all good things.",
  "You're one bold text message away from a very good week.",
  "Plot twist incoming — and this one you'll actually like.",
  "Your luck is warming up like a phone left in the sun.",
  "Someone's thinking about you right now. No, really.",
  "The next unexpected invite you get? Say yes.",
  "A little chaos is coming, but the fun kind.",
  "You're about to get a compliment from someone you didn't expect.",
  "This is the week your 'maybe' turns into a 'definitely'.",
  "Something you almost gave up on is quietly turning around.",
  "A green light is coming for something you've been waiting on.",
  "You're due for a plot twist that actually works in your favor.",
  "That risky idea in your head? Less risky than you think.",
  "Someone new is about to notice you in a very good way.",
  "Your confidence today is setting something in motion — let it.",
  "A little spark is about to become a whole flame."
];

const FORTUNE_B = [
  "Trust it.",
  "Lean into it.",
  "You'll know it when you see it.",
  "Don't overthink this one.",
  "It's closer than it looks.",
  "Say yes before you talk yourself out of it.",
  "This one's a good one, promise.",
  "Ride the wave on this.",
  "You've earned this one.",
  "Let it happen."
];

function buildCombos(poolA, poolB){
  const out = [];
  for (const a of poolA){
    for (const b of poolB){
      out.push(a + " " + b);
    }
  }
  return out;
}

const COMPLIMENTS = buildCombos(COMPLIMENT_A, COMPLIMENT_B); // 200 unique combos
const FORTUNES = buildCombos(FORTUNE_A, FORTUNE_B);           // 200 unique combos
