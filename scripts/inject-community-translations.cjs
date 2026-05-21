const fs = require('fs');
const langs = ['en', 'ko', 'ja', 'zh-CN', 'zh-TW'];

const dicts = {
  'en': {
    title: 'Community',
    subtitle: 'Find travel buddies and share stories.',
    writeButton: 'Write Post',
    emptyTalk: 'No free talk posts yet.',
    filters: { all: 'All', reviews: 'Travel Reviews', talk: 'Free Talk' },
    sections: { reviewsTitle: 'Travel Reviews', reviewsSubtitle: 'K-Content location visits', freeTalkTitle: 'Free Talk', freeTalkSubtitle: 'Questions and free talk' },
    list: { latest: 'Latest', popular: 'Popular' },
    modal: { title: 'New Post', subtitle: 'What story do you want to share?', category: 'Category', details: 'Details', photo: 'Attach Photo', clear: 'Clear', changePhoto: 'Change Photo', addPhoto: 'Click to add photo', location: 'Location Tag (Optional)', selectLocation: 'Please select a location', cancel: 'Cancel', submit: 'Post' },
    post: { categoryError: 'Please select a category.', imageError: 'Please attach at least one photo!', captionError: 'Please write some content.', success: 'Post created successfully!', fail: 'Failed to create post. Please try again.', placeholder: 'Share your stories with other travelers...', locationPlaceholder: 'e.g. Gamcheon Culture Village' }
  },
  'ko': {
    title: '커뮤니티',
    subtitle: '부산 여행을 함께할 동행을 찾고, 생생한 후기를 공유해보세요.',
    writeButton: '글쓰기',
    emptyTalk: '등록된 자유토크가 없습니다.',
    filters: { all: '전체', reviews: '여행후기', talk: '자유토크' },
    sections: { reviewsTitle: '생생한 여행후기', reviewsSubtitle: 'K-콘텐츠 촬영지 방문 인증', freeTalkTitle: '자유토크', freeTalkSubtitle: '질문 및 자유로운 대화' },
    list: { latest: '최신순', popular: '인기순' },
    modal: { title: '새 글 쓰기', subtitle: '어떤 이야기를 나누고 싶으신가요?', category: '글 분류', details: '내용', photo: '사진 첨부', clear: '지우기', changePhoto: '사진 변경', addPhoto: '클릭해서 사진 추가하기', location: '장소 태그 (선택)', selectLocation: '장소를 선택해주세요', cancel: '취소', submit: '작성 완료' },
    post: { categoryError: '어떤 글을 작성하실지 카테고리를 선택해주세요.', imageError: '인증 사진을 최소 1장 이상 첨부해주세요!', captionError: '내용을 작성해주세요.', success: '글이 성공적으로 등록되었습니다!', fail: '글 등록에 실패했습니다. 다시 시도해주세요.', placeholder: '다른 여행자들과 나누고 싶은 이야기를 적어보세요...', locationPlaceholder: '예: 감천문화마을' }
  },
  'ja': {
    title: 'コミュニティ',
    subtitle: '釜山旅行の仲間を見つけて、物語を共有しましょう。',
    writeButton: '投稿する',
    emptyTalk: 'フリートークの投稿はまだありません。',
    filters: { all: 'すべて', reviews: '旅行の感想', talk: 'フリートーク' },
    sections: { reviewsTitle: '旅行の感想', reviewsSubtitle: 'K-コンテンツのロケ地訪問', freeTalkTitle: 'フリートーク', freeTalkSubtitle: '質問とフリートーク' },
    list: { latest: '最新', popular: '人気' },
    modal: { title: '新規投稿', subtitle: 'どんな物語を共有したいですか？', category: 'カテゴリー', details: '詳細', photo: '写真を添付', clear: 'クリア', changePhoto: '写真を変更', addPhoto: 'クリックして写真を追加', location: '場所タグ (任意)', selectLocation: '場所を選択してください', cancel: 'キャンセル', submit: '投稿' },
    post: { categoryError: 'カテゴリーを選択してください。', imageError: '写真を少なくとも1枚添付してください！', captionError: '内容を記入してください。', success: '投稿が完了しました！', fail: '投稿に失敗しました。もう一度お試しください。', placeholder: '他の旅行者と物語を共有しましょう...', locationPlaceholder: '例: 甘川文化村' }
  },
  'zh-CN': {
    title: '社区',
    subtitle: '寻找一起去釜山旅行的伙伴，分享你的故事。',
    writeButton: '写文章',
    emptyTalk: '目前还没有自由讨论文章。',
    filters: { all: '全部', reviews: '旅游后记', talk: '自由讨论' },
    sections: { reviewsTitle: '生动的旅游后记', reviewsSubtitle: 'K-Content拍摄地造访认证', freeTalkTitle: '自由讨论', freeTalkSubtitle: '提问及自由讨论' },
    list: { latest: '最新', popular: '热门' },
    modal: { title: '撰写新文章', subtitle: '想分享什么故事呢？', category: '文章分类', details: '内容', photo: '附上照片', clear: '清除', changePhoto: '更换照片', addPhoto: '点击添加照片', location: '打卡地点 (选填)', selectLocation: '请选择地点', cancel: '取消', submit: '发布' },
    post: { categoryError: '请选择要撰写的文章分类。', imageError: '请至少附上一张认证照片！', captionError: '请填写内容。', success: '文章已成功发布！', fail: '文章发布失败，请稍后再试。', placeholder: '写下你想与其他旅人分享的故事...', locationPlaceholder: '例：甘川文化村' }
  },
  'zh-TW': {
    title: '社區',
    subtitle: '尋找一起去釜山旅行的夥伴，分享你的故事。',
    writeButton: '寫文章',
    emptyTalk: '目前還沒有自由討論文章。',
    filters: { all: '全部', reviews: '旅遊後記', talk: '自由討論' },
    sections: { reviewsTitle: '生動的旅遊後記', reviewsSubtitle: 'K-Content拍攝地造訪認證', freeTalkTitle: '自由討論', freeTalkSubtitle: '提問及自由討論' },
    list: { latest: '最新', popular: '熱門' },
    modal: { title: '撰寫新文章', subtitle: '想分享什麼故事呢？', category: '文章分類', details: '內容', photo: '附上照片', clear: '清除', changePhoto: '更換照片', addPhoto: '點擊新增照片', location: '打卡地點 (選填)', selectLocation: '請選擇地點', cancel: '取消', submit: '發布' },
    post: { categoryError: '請選擇要撰寫的文章分類。', imageError: '請至少附上一張認證照片！', captionError: '請填寫內容。', success: '文章已成功發布！', fail: '文章發布失敗，請稍後再試。', placeholder: '寫下你想與其他旅人分享的故事...', locationPlaceholder: '例：甘川文化村' }
  }
};

for (const lang of langs) {
  const path = `src/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.community = Object.assign(data.community || {}, dicts[lang]);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
console.log('Injected community dict into all locales');
