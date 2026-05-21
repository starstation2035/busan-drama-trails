const fs = require('fs');

const mockReviewsPath = 'src/data/mockReviews.ts';
let content = fs.readFileSync(mockReviewsPath, 'utf8');

const translationsByAuthor = {
  "Mei-Ling": {
    location_ja: "海雲台海水浴場", location_zh_CN: "海云台海水浴场",
    content_ja: "ここからの夕日は本当に魔法のようです。ドラマのよう！最高の光を狙うなら午後5時頃の訪問がおすすめ。🌅",
    content_zh_CN: "这里的日落绝对充满魔力。就像韩剧里一样！一定要在下午5点左右来，才能拍到最美的光线。🌅"
  },
  "Seung-jin": {
    location_ja: "甘川文化村", location_zh_CN: "甘川文化村",
    content_ja: "星の王子さまの像はお見逃しなく！カラフルな家々の景色は実物の方がずっと素敵です。釜山最高のフォトスポット！📸",
    content_zh_CN: "千万别错过小王子雕像！色彩缤纷的房屋亲眼看更美。釜山最棒的拍照景点！📸"
  },
  "Emily_R": {
    location_ja: "広安里海水浴場", location_zh_CN: "广安里海水浴场",
    content_ja: "橋の夜景が本当に息をのむ美しさ！夕食後のロマンチックな散歩に最適な場所です。🌃",
    content_zh_CN: "广安大桥的夜景美得令人惊叹！晚餐后浪漫散步的完美去处。🌃"
  },
  "Whale_Lover": {
    location_ja: "青沙浦ダリットル展望台", location_zh_CN: "青沙浦踏石观景台",
    content_ja: "ウ・ヨンウがクジラを想像していたあの爽快な海の景色がそのまま感じられ、胸がすっとしました！透明なガラスの床の下で波が砕けるのはスリル満点です。プロのヒント：海辺列車を降りたらまっすぐ展望台へ向かうのがおすすめ！",
    content_zh_CN: "在这里能感受到禹英禑想象中鲸鱼出现的那片清爽海景，让人心胸开阔！在透明的玻璃地板下看着海浪拍打，真的非常刺激。小提示：强烈建议下海滨列车后直接走来观景台！"
  },
  "K_Drama_Tour": {
    location_ja: "ヒンヨウル文化村", location_zh_CN: "白浅滩文化村",
    content_ja: "映画「弁護人」でソン・ガンホが心を決めたノスタルジックな路地が、今も完璧に残されています。青い海を見下ろす白い壁沿いを歩くと、映画の名台詞が蘇ります。夕暮れ時が最高のフォトチャンス！",
    content_zh_CN: "电影《辩护人》中，宋康昊在探望汤饭馆阿姨的儿子前，下定决心全力辩护的那个小巷依然完好保留着。巷子很窄而且有很多阶梯，一定要穿舒服的运动鞋！傍晚夕阳西下时去，绝对能拍出人生美照。"
  },
  "MovieBuff_Busan": {
    location_ja: "チャガルチ市場", location_zh_CN: "札嘎其市场",
    content_ja: "名作「友へ チング」の主人公たちが走り回った駐車場や市場の路地を見ることができて感激！釜山の生々しく活気あるエネルギーをここで感じることができます。",
    content_zh_CN: "亲眼看到经典电影《朋友》里主角们疯狂奔跑的停车场和市场小巷，真的觉得很神奇！虽然有点粗犷，但这里能感受到充满人情味、最真实生动的釜山能量。"
  },
  "Sunja_Heart": {
    location_ja: "影島カムジ海辺", location_zh_CN: "影岛甘池海滩",
    content_ja: "ドラマ「Pachinko」でソンジャが故郷を離れる前に泣いていたあの切ない海辺がずっと心に残っています。波が打ち寄せるたびに石が転がる音が聞こえ、悲しくも美しい響きです。",
    content_zh_CN: "韩剧《柏青哥》中，善慈离开故乡釜山前流泪漫步的那片令人心碎的海滩，一直在我的脑海中挥之不去。这里不是沙滩而是鹅卵石海滩，所以每当海浪拍打时，都能听到石头滚动的声音。"
  },
  "Running_Runner": {
    location_ja: "甘川文化村", location_zh_CN: "甘川文化村",
    content_ja: "ランニングマンのメンバーがカラフルな家々の間を駆け巡ってミッションをこなした、おとぎ話のような路地ツアー！至る所にある隠れたフォトゾーンを見つけるのが最高に楽しいです。",
    content_zh_CN: "就像童话般的小巷之旅，Running Man成员们就是在这些色彩缤纷的房子之间穿梭解任务的！在每个角落寻找隐藏的拍照区真的超级有趣。"
  },
  "Tsunami_Survivor": {
    location_ja: "海雲台海水浴場", location_zh_CN: "海云台海水浴场",
    content_ja: "映画「TSUNAMI-ツナミ-」で巨大な津波が押し寄せた同じ広大な砂浜を歩くのは、壮大でありながら不思議な感覚でした！",
    content_zh_CN: "走在电影《大浩劫》中巨大海啸袭来的同一片宽阔沙滩上，感觉既壮观又不可思议！现在，这里已经与高楼大厦融为一体，变成了一个充满异国风情又时尚的海滩。"
  },
  "Marvel_Fan": {
    location_ja: "広安里海水浴場", location_zh_CN: "广安里海水浴场",
    content_ja: "広安大橋の夜景は毎回本当に息をのむ美しさです！マーベルファンとして、「ブラックパンサー」の壮大なチェイスシーンの背景がここだと知って胸が高鳴りました。",
    content_zh_CN: "每次看到广安大桥的夜景都忍不住惊叹！身为漫威迷，知道这里就是《黑豹》里那场华丽追逐战的背景，心脏都跟着狂跳。"
  },
  "Solo_Traveler_Taipei": {
    location_ja: "釜山", location_zh_CN: "釜山",
    content_ja: "来月6月25日に釜山に行きます。一人旅の女性です。一緒にドラマロケ地を巡ってくれる方を探しています！",
    content_zh_CN: "我下个月6月25日会到釜山。我是女生，一个人旅行。寻找旅伴～有人想一起去韩剧拍摄地朝圣吗？"
  },
  "Train_Enthusiast": {
    location_ja: "海雲台ブルーラインパーク", location_zh_CN: "海云台蓝线公园",
    content_ja: "青沙浦への海辺列車とスカイカプセル、どちらがおすすめですか？両方乗りたいのですが時間がありません。",
    content_zh_CN: "去青沙浦的海滨列车和胶囊列车，大家比较推荐哪一个呢？两个都想搭，但是时间不够。"
  }
};

for (const [author, tr] of Object.entries(translationsByAuthor)) {
  // We match author: "AuthorName" and then location_zh_TW: "..."
  const rxLoc = new RegExp(`(author:\\s*"${author}",[\\s\\S]*?location_zh_TW:\\s*"[^"]+",)`, "g");
  content = content.replace(rxLoc, `$1\n    location_ja: ${JSON.stringify(tr.location_ja)},\n    location_zh_CN: ${JSON.stringify(tr.location_zh_CN)},`);

  // We match author: "AuthorName" and then content_zh_TW: ...
  const rxCont = new RegExp(`(author:\\s*"${author}",[\\s\\S]*?content_zh_TW:\\s*(\\"[^\\"]+\\"|\`[^\`]+\`),)`, "g");
  content = content.replace(rxCont, `$1\n    content_ja: ${JSON.stringify(tr.content_ja)},\n    content_zh_CN: ${JSON.stringify(tr.content_zh_CN)},`);
}

fs.writeFileSync(mockReviewsPath, content);
console.log('Injected missing Japanese/Chinese mock reviews by author name');
