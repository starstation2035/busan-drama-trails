const fs = require('fs');

let content = fs.readFileSync('c:\\Users\\ADMIN\\busan-drama-trails\\src\\data\\mockReviews.ts', 'utf-8');

const idToContentEn = {
  108: "I could feel the refreshing ocean view where Woo Young-woo imagined whales, and it was so liberating! The waves crashing beneath the transparent glass floor were thrilling. On a sunny afternoon, the sparkling water makes it feel like a real whale might jump out. Pro tip: Walk straight to the observatory right after getting off the Cheongsapo Beach Train!",
  102: "The nostalgic alleyway from 'The Attorney', where Song Kang-ho made his heartfelt decision, is still perfectly preserved. Walking along the white walls overlooking the blue Busan sea, I kept remembering famous lines from the movie. The alleys are narrow with many stairs, so comfortable sneakers are a must! Go around sunset for the best life shot.",
  101: "It was amazing to see the dynamic parking lot and market alleys where the main characters of the masterpiece 'Friend' ran around wildly! You can feel the true, raw, and vibrant energy of Busan here. Take a picture from the filming angle, then grab a plate of fresh grilled fish or sashimi nearby—it's the perfect pilgrimage course.",
  103: "The heartbreaking beach scene from 'Pachinko', where Sunja wept before leaving her hometown of Busan, kept lingering in my mind. It's a pebble beach, so every time the waves crash, you hear the stones rolling—it sounds so sad yet beautiful. Unlike major tourist spots, it's quiet, making it the best place to silently savor the lingering emotions of the drama.",
  104: "A fairytale-like alley tour where Running Man members ran around colorful houses to solve missions! Finding hidden photo zones in every corner is incredibly fun. You might have to line up on weekends to take a photo next to the famous Little Prince statue, but looking down at the charming village makes the wait 100% worth it.",
  105: "Walking on the very same wide sandy beach where the giant tsunami hit in the movie 'Haeundae' felt both grand and surreal! Now, with high-rise buildings blending in, it has become a very exotic and sophisticated beach. Walking during the day is nice, but taking photos at sunset when the red glow reflects on the glass buildings is absolutely stunning. There are many delicious pork soup and milmyeon places nearby, making it super convenient to eat after your pilgrimage!",
  106: "The night view of Gwangandaegyo Bridge is truly breathtaking every time! As a Marvel fan, my heart raced knowing this was the backdrop for the spectacular chase scene in 'Black Panther'. There are so many nice ocean-view cafes along the beach, and drinking coffee while looking at the sparkling bridge through a glass window feels like heaven. I highly recommend visiting on a Saturday evening to catch the spectacular drone show!",
  201: "I will arrive in Busan next month on June 25th. I'm a solo female traveler. Looking for someone to travel with~ Anyone want to visit K-drama filming spots together?",
  202: "Between the Beach Train to Cheongsapo and the Blue Capsule, which one do you recommend? I want to ride both but don't have enough time.",
  301: "If you don't have enough time, I recommend a combined course: take the Blue Capsule on the way up to enjoy the ocean view privately and leisurely, and take the cool and fast Beach Train on the way down! It's the best way to experience both. 👍"
};

for (const [id, en] of Object.entries(idToContentEn)) {
  const searchPattern = new RegExp(`(id:\\s*${id},[\\s\\S]*?)(likes:|createdAt:)`, 'g');
  
  content = content.replace(searchPattern, (match, p1, p2) => {
    // If it already has content_en, skip
    if (match.includes('content_en:')) {
      return match;
    }
    return p1 + `content_en: ${JSON.stringify(en)},\n    ` + p2;
  });
}

fs.writeFileSync('c:\\Users\\ADMIN\\busan-drama-trails\\src\\data\\mockReviews.ts', content);
