// API 키 (실제 사용 시에는 서버 사이드에서 처리하는 것이 안전합니다)
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // OpenWeather API 키
const STABLE_DIFFUSION_API_KEY = 'YOUR_STABLE_DIFFUSION_API_KEY'; // Stable Diffusion API 키

// DOM 요소
const weatherIcon = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const weatherDescEl = document.getElementById('weather-description');
const getWeatherBtn = document.getElementById('get-weather');
const fashionGrid = document.getElementById('fashion-grid');

// 날씨 데이터 (기본값: 서울)
let currentWeather = {
    temp: 20,
    description: '맑음',
    icon: '01d'
};

// 날씨 아이콘 매핑
const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

// 날씨별 패션 추천 데이터 (2025년 한국 트렌드 반영)
const fashionRecommendations = {
    // 추운 날씨 (0°C 이하)
    cold: {
        title: '2025 겨울 핫 아이템',
        items: [
            { 
                title: '오버사이즈 퍼 후드 패딩', 
                desc: '2025년 겨울 최고의 아이템! 털 안감이 들어간 오버사이즈 퍼 후드 패딩으로 스타일리시하게 체온을 유지하세요.',
                tags: ['오버핏', '퍼후드', '패딩', '겨울'],
                tempRange: '0°C 이하',
                gender: ['female'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1605901309581-48e723c60bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            { 
                title: '크롭 터틀넥 니트 + 와이드 팬츠', 
                desc: '크롭 기장의 따뜻한 터틀넥 니트에 와이드한 핏의 팬츠로 2025년 트렌디한 실루엣 완성',
                tags: ['크롭', '터틀넥', '니트', '와이드팬츠'],
                tempRange: '0°C 이하',
                gender: ['female'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '롱 패딩 + 스키니 진',
                desc: '따뜻한 롱 패딩과 슬림한 실루엣의 스키니 진으로 체온을 보호하세요',
                tags: ['롱패딩', '스키니진', '겨울', '데일리'],
                tempRange: '0°C 이하',
                gender: ['male'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '퍼 코트 + 앵클 부츠',
                desc: '고급스러운 퍼 코트와 앵클 부츠로 우아한 겨울 룩 완성',
                tags: ['퍼코트', '부츠', '엘레강스', '아우터'],
                tempRange: '0°C 이하',
                gender: ['female'],
                age: ['30', '40'],
                image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '다운 베스트 + 후드티 + 조거 팬츠',
                desc: '캐주얼하면서도 스타일리시한 겨울 아우터 스타일링',
                tags: ['다운베스트', '후드티', '조거팬츠', '캐주얼'],
                tempRange: '0°C 이하',
                gender: ['male'],
                age: ['10', '20'],
                image: 'https://images.unsplash.com/photo-1605901309581-48e723c60bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            { 
                title: '오버사이즈 더블 코트', 
                desc: '클래식한 더블 코트를 오버사이즈로 연출해 2025년 무드 가득한 겨울 룩',
                tags: ['오버핏', '더블코트', '클래식', '겨울'],
                tempRange: '0°C 이하',
                gender: ['male'],
                age: ['20', '30', '40']
            },
            { 
                title: '퍼 트리밍 후디 집업', 
                desc: '후드에 고급스러운 퍼 트리밍이 더해진 집업으로 포인트 주기',
                tags: ['퍼', '후디', '집업', '트렌드'],
                tempRange: '0°C 이하',
                gender: ['male', 'female'],
                age: ['10', '20', '30', '40']
            },
        ]
    },
    // 쌀쌀한 날씨 (1°C ~ 10°C)
    chilly: {
        title: '2025 봄가을 트렌드',
        items: [
            {
                title: '크롭 트렌치 코트 세트',
                desc: '크롭 기장의 모던한 트렌치 코트 세트로 2025년 트렌디한 룩 완성',
                tags: ['크롭', '트렌치코트', '세트', '봄가을'],
                tempRange: '1°C ~ 10°C',
                gender: ['female'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '오버사이즈 블레이저 + 와이드 팬츠',
                desc: '오피스룩의 정석, 오버사이즈 블레이저와 와이드 팬츠의 조화',
                tags: ['오피스룩', '블레이저', '와이드팬츠', '데일리'],
                tempRange: '1°C ~ 10°C',
                gender: ['male'],
                age: ['30', '40'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '가디건 + 미디 스커트',
                desc: '부드러운 가디건과 미디 길이의 스커트로 여성스러운 룩 연출',
                tags: ['가디건', '미디스커트', '여성스타일', '데일리'],
                tempRange: '1°C ~ 10°C',
                gender: ['female'],
                age: ['20', '30', '40'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '니트 베스트 + 셔츠',
                desc: '클래식한 셔츠 위에 니트 베스트를 레이어링한 스마트 캐주얼 룩',
                tags: ['니트베스트', '셔츠', '스마트캐주얼', '레이어링'],
                tempRange: '1°C ~ 10°C',
                gender: ['male'],
                age: ['30', '40'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '레더 자켓 + 스키니진',
                desc: '시크한 무드의 레더 자켓으로 포인트를 준 스타일링',
                tags: ['레더자켓', '스키니진', '시크', '아우터'],
                tempRange: '1°C ~ 10°C',
                gender: ['female'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '크롭 가디건 레이어드 룩',
                desc: '크롭 가디건에 셔츠를 레이어링해 포인트 주기',
                tags: ['크롭', '가디건', '레이어드', '캐주얼'],
                tempRange: '1°C ~ 10°C',
                gender: ['female'],
                age: ['10', '20', '30']
            },
            {
                title: '오버핏 코듀로이 재킷',
                desc: '빈티지 감성의 코듀로이 재킷으로 무드 있는 가을 룩 연출',
                tags: ['오버핏', '코듀로이', '재킷', '빈티지'],
                tempRange: '1°C ~ 10°C',
                gender: ['male', 'female'],
                age: ['10', '20', '30', '40']
            },
        ]
    },
    // 선선한 날씨 (11°C ~ 20°C)
    mild: {
        title: '2025 캐주얼 트렌드',
        items: [
            {
                title: '오버사이즈 데미지 데님',
                desc: '2025년 봄, 여름에 인기 많은 오버사이즈 데미지 데님 룩',
                tags: ['오버사이즈', '데미지진', '데님', '캐주얼'],
                tempRange: '11°C ~ 20°C',
                gender: ['male'],
                age: ['10', '20'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '크롭 가디건 + 미니스커트',
                desc: '여성들을 위한 키치한 감성의 크롭 가디건과 미니스커트 매치',
                tags: ['크롭', '가디건', '미니스커트', '키치'],
                tempRange: '11°C ~ 20°C',
                gender: ['female'],
                age: ['10', '20'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '데님 셔츠 + 반바지',
                desc: '시원한 봄, 가을을 위한 캐주얼한 데님 셔츠 스타일링',
                tags: ['데님셔츠', '반바지', '캐주얼', '데일리'],
                tempRange: '11°C ~ 20°C',
                gender: ['male'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '린넨 셔츠 + 슬랙스',
                desc: '통기성 좋은 린넨 소재의 셔츠로 편안한 하루를',
                tags: ['린넨', '셔츠', '슬랙스', '스마트캐주얼'],
                tempRange: '11°C ~ 20°C',
                gender: ['male'],
                age: ['30', '40'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '플라워 원피스 + 데님 자켓',
                desc: '로맨틱한 플라워 원피스에 캐주얼한 데님 자켓을 더한 룩',
                tags: ['플라워', '원피스', '데님자켓', '로맨틱'],
                tempRange: '11°C ~ 20°C',
                gender: ['female'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '오버사이즈 셔츠 + 반바지',
                desc: '남성들을 위한 캐주얼한 오버사이즈 셔츠와 반바지 매치',
                tags: ['오버사이즈', '셔츠', '반바지', '캐주얼'],
                tempRange: '11°C ~ 20°C',
                gender: ['male'],
                age: ['10', '20', '30']
            },
            {
                title: '크롭 니트 + 와이드 진',
                desc: '여성들을 위한 세련된 크롭 니트와 와이드 진의 조화',
                tags: ['크롭', '니트', '와이드진', '세련된'],
                tempRange: '11°C ~ 20°C',
                gender: ['female'],
                age: ['20', '30', '40']
            },
        ]
    },
    // 따뜻한 날씨 (21°C ~ 30°C)
    warm: {
        title: '2025 여름 시즌',
        items: [
            {
                title: '크롭 셔츠 + 미니 스커트',
                desc: '2025년 여름 트렌디한 크롭 셔츠와 미니 스커트 매치',
                tags: ['크롭', '셔츠', '미니스커트', '여름'],
                tempRange: '21°C ~ 30°C',
                gender: ['female'],
                age: ['10', '20'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '린넨 셔츠 + 반바지',
                desc: '시원한 린넨 소재의 셔츠와 반바지로 여름을 시원하게',
                tags: ['린넨', '셔츠', '반바지', '시원한'],
                tempRange: '21°C ~ 30°C',
                gender: ['male'],
                age: ['20', '30', '40'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '플로럴 원피스',
                desc: '여름 휴가에 어울리는 상큼한 플로럴 원피스',
                tags: ['원피스', '플로럴', '여름', '휴가'],
                tempRange: '21°C ~ 30°C',
                gender: ['female'],
                age: ['20', '30', '40'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '하와이안 셔츠 + 치노 팬츠',
                desc: '캐주얼하면서도 시크한 여름 룩',
                tags: ['하와이안', '셔츠', '치노팬츠', '캐주얼'],
                tempRange: '21°C ~ 30°C',
                gender: ['male'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '비치웨어 세트',
                desc: '여름 휴가를 위한 스타일리시한 비치웨어',
                tags: ['비치웨어', '수영복', '휴가', '여름'],
                tempRange: '21°C ~ 30°C',
                gender: ['female'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '비치웨어 원피스',
                desc: '해변가에서도 멋진 2025년 여름 비치웨어 원피스',
                tags: ['비치웨어', '원피스', '여름', '휴가'],
                tempRange: '21°C ~ 30°C',
                gender: ['female'],
                age: ['10', '20', '30']
            },
            {
                title: '오버핏 반팔티 + 와이드 팬츠',
                desc: '캐주얼한 오버핏 반팔티에 와이드 팬츠로 여름 룩 완성',
                tags: ['오버핏', '반팔', '와이드팬츠', '캐주얼'],
                tempRange: '21°C ~ 30°C',
                gender: ['male', 'female'],
                age: ['10', '20', '30', '40']
            },
        ]
    },
    // 더운 날씨 (31°C 이상)
    hot: {
        title: '2025 한여름 무더위',
        items: [
            {
                title: '크롭 민소매 + 쇼츠',
                desc: '무더운 여름을 위한 시원한 크롭 민소매와 쇼츠 매치',
                tags: ['크롭', '민소매', '쇼츠', '시원한'],
                tempRange: '31°C 이상',
                gender: ['female'],
                age: ['10', '20'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '린넨 셔츠 + 반바지',
                desc: '통기성 좋은 린넨 소재로 한여름 무더위를 이기세요',
                tags: ['린넨', '셔츠', '반바지', '시원한'],
                tempRange: '31°C 이상',
                gender: ['male'],
                age: ['30', '40'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '비치 커버업 + 비키니',
                desc: '한여름 바캉스에 어울리는 스타일리시한 비치웨어',
                tags: ['비치웨어', '비키니', '커버업', '휴가'],
                tempRange: '31°C 이상',
                gender: ['female'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '탱크탑 + 린넨 팬츠',
                desc: '시원하고 스타일리시한 여름 캐주얼 룩',
                tags: ['탱크탑', '린넨', '팬츠', '캐주얼'],
                tempRange: '31°C 이상',
                gender: ['male'],
                age: ['20', '30'],
                image: 'https://images.unsplash.com/photo-1539109136884-43da582ce1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '에어리한 원피스',
                desc: '통풍이 잘되는 시원한 소재의 여름 원피스',
                tags: ['원피스', '여름', '시원한', '에어리'],
                tempRange: '31°C 이상',
                gender: ['female'],
                age: ['20', '30', '40'],
                image: 'https://images.unsplash.com/photo-1609505848912-42d451a59423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: '비치웨어 세트',
                desc: '한여름 휴가철을 위한 트렌디한 비치웨어 세트',
                tags: ['비치웨어', '수영복', '휴가', '여름'],
                tempRange: '31°C 이상',
                gender: ['male', 'female'],
                age: ['10', '20', '30', '40']
            },
            {
                title: '에어리한 원피스',
                desc: '통풍이 잘 되는 시원한 원피스로 무더위를 이겨내세요',
                tags: ['원피스', '시원한', '여름', '에어리'],
                tempRange: '31°C 이상',
                gender: ['female'],
                age: ['10', '20', '30', '40']
            },
        ]
    }
};

// 날씨 데이터 가져오기
async function fetchWeather() {
    try {
        // 실제 API 호출 (OpenWeatherMap API 사용)
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Seoul,kr&appid=${API_KEY}&units=metric&lang=kr`);
        // const data = await response.json();
        
        // 테스트를 위한 더미 데이터 (실제로는 위의 API 호출 사용)
        const data = {
            main: { temp: 22 },
            weather: [{ description: '맑음', icon: '01d' }],
            name: '서울'
        };
        
        updateWeatherUI(data);
        return data;
    } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error);
        // 오류 시 기본값 사용
        updateWeatherUI({
            main: { temp: 22 },
            weather: [{ description: '날씨 정보를 불러올 수 없음', icon: '01d' }],
            name: '서울'
        });
    }
}

// 날씨 UI 업데이트
function updateWeatherUI(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const city = data.name;
    
    currentWeather = { temp, description, icon: iconCode };
    
    weatherIcon.textContent = weatherIcons[iconCode] || '☀️';
    temperatureEl.textContent = `${temp}°C`;
    weatherDescEl.textContent = `${city} · ${description}`;
}

// 날씨에 따른 패션 추천
function getFashionRecommendations(temp, gender, age) {
    let weatherType;
    
    if (temp <= 0) weatherType = 'cold';
    else if (temp <= 10) weatherType = 'chilly';
    else if (temp <= 20) weatherType = 'mild';
    else if (temp <= 30) weatherType = 'warm';
    else weatherType = 'hot';
    
    // 필터링된 패션 아이템 반환
    return fashionRecommendations[weatherType].items.filter(item => 
        item.gender.includes(gender) && item.age.includes(age)
    );
}

// AI로 패션 이미지 생성
async function generateAIFashionImage(prompt, gender = 'person', age = '') {
    // 성별에 따른 모델 설정
    const modelType = gender === 'female' ? 'beautiful korean woman' : 
                     gender === 'male' ? 'handsome korean man' : 'fashion model';
    
    // 연령대에 따른 설명 추가
    let ageDesc = '';
    if (age) {
        const ageMap = {
            '10': 'teenage',
            '20': 'young adult',
            '30': 'professional',
            '40': 'mature',
            '50': 'sophisticated'
        };
        ageDesc = ageMap[age] || '';
    }
    
    // 상세한 프롬프트 생성
    let fullPrompt = `Full body fashion photography of a ${ageDesc} ${modelType} wearing ${prompt}. `;
    fullPrompt += 'High-end editorial style, studio lighting, clean background, professional model pose, ';
    fullPrompt += 'detailed clothing texture, fashion magazine quality, 8k resolution, ultra-realistic, ';
    fullPrompt += 'perfect composition, full body visible, front view, natural skin texture, ';
    fullPrompt += 'professional photography, vogue style, commercial fashion shoot.';
    
    try {
        const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: STABLE_DIFFUSION_API_KEY,
                prompt: fullPrompt,
                width: '512',
                height: '512',
                samples: '1',
                num_inference_steps: '30',
                safety_checker: 'yes',
                enhance_prompt: 'yes',
                seed: null,
                guidance_scale: 7.5,
                multi_lingual: 'no',
                panorama: 'no',
                self_attention: 'no',
                upscale: 'no',
                embeddings_model: null,
                webhook: null,
                track_id: null
            })
        });

        const data = await response.json();
        if (data.status === 'success' && data.output && data.output[0]) {
            return data.output[0];
        }
        throw new Error('이미지 생성에 실패했습니다.');
    } catch (error) {
        console.error('AI 이미지 생성 오류:', error);
        // 기본 이미지 반환
        return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    }
}

// 이미지 로드 실패 시 AI 모델 이미지로 대체
async function handleImageError(imgElement, item) {
    try {
        // 로딩 상태 표시
        imgElement.style.background = 'linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)';
        imgElement.style.backgroundSize = '200% 200%';
        imgElement.alt = '이미지 생성 중...';
        
        // 프롬프트 생성
        const gender = item.gender && item.gender.length > 0 ? item.gender[0] : '';
        const age = item.age && item.age.length > 0 ? item.age[0] : '20'; // 기본값 20대
        let prompt = item.title;
        
        // 날씨에 따른 배경 추가
        if (item.tempRange) {
            if (item.tempRange.includes('이하')) prompt += ', winter fashion';
            else if (item.tempRange.includes('~10°C')) prompt += ', early spring/fall fashion';
            else if (item.tempRange.includes('~20°C')) prompt += ', spring/fall fashion';
            else if (item.tempRange.includes('~30°C')) prompt += ', summer fashion';
            else if (item.tempRange.includes('이상')) prompt += ', hot summer fashion';
        }
        
        // AI 모델 이미지 생성
        const aiImageUrl = await generateAIFashionImage(prompt, gender, age);
        
        // 생성된 이미지로 업데이트
        if (aiImageUrl) {
            imgElement.src = aiImageUrl;
            imgElement.style.background = 'none';
            imgElement.alt = item.title;
            
            // 원본 데이터 업데이트
            item.image = aiImageUrl;
            
            // 새로고침 시 다시 생성하지 않도록 로컬 스토리지에 저장
            try {
                const storedItems = JSON.parse(localStorage.getItem('fashionItems') || '{}');
                storedItems[item.title] = aiImageUrl;
                localStorage.setItem('fashionItems', JSON.stringify(storedItems));
            } catch (e) {
                console.error('로컬 스토리지 저장 실패:', e);
            }
        }
    } catch (error) {
        console.error('AI 모델 이미지 생성 실패:', error);
        // 기본 이미지로 대체
        imgElement.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
        imgElement.alt = '패션 이미지';
    }
}

// 패션 아이템을 UI에 표시
async function displayFashionItems(items) {
    if (!items || items.length === 0) {
        fashionGrid.innerHTML = '<div class="col-12 text-center py-5">추천할 패션이 없습니다.</div>';
        return;
    }
    
    // 50개로 제한
    const limitedItems = items.slice(0, 50);
    
    // 기존에 생성된 이미지 URL 가져오기
    let storedItems = {};
    try {
        storedItems = JSON.parse(localStorage.getItem('fashionItems') || '{}');
    } catch (e) {
        console.error('로컬 스토리지 로드 실패:', e);
    }
    
    fashionGrid.innerHTML = '';
    for (const item of limitedItems) {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        // Create the fashion item container
        const fashionItem = document.createElement('div');
        fashionItem.className = 'fashion-item h-100';
        
        // Create image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'fashion-img-container';
        
        // Create image element
        const img = document.createElement('img');
        img.className = 'fashion-img';
        img.alt = item.title || 'Fashion item';
        img.loading = 'lazy';
        
        // Set image source with fallback
        let imageUrl = item.image || storedItems[item.title] || '';
        
        // 기본 이미지 설정
        if (!imageUrl) {
            // 날씨에 따른 기본 이미지
            if (item.tempRange) {
                if (item.tempRange.includes('이하')) {
                    imageUrl = 'https://images.unsplash.com/photo-1519699047748-de8e457f634c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                } else if (item.tempRange.includes('~10°C')) {
                    imageUrl = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                } else if (item.tempRange.includes('~20°C')) {
                    imageUrl = 'https://images.unsplash.com/photo-1445205170230-053b83016042?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                } else if (item.tempRange.includes('~30°C')) {
                    imageUrl = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                } else if (item.tempRange.includes('이상')) {
                    imageUrl = 'https://images.unsplash.com/photo-1515886653613-9d4d1f37b43b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                }
            } else {
                imageUrl = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
            }
        }
        
        img.src = imageUrl;
        img.onload = function() {
            this.style.opacity = '1';
        };
        
        // Set up error handling
        img.onerror = function() {
            this.onerror = null; // Prevent infinite loop
            this.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
        };
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'fashion-content';
        
        // Create title
        const title = document.createElement('h5');
        title.className = 'fashion-title';
        title.textContent = item.title || '패션 아이템';
        
        // Create description
        const desc = document.createElement('p');
        desc.className = 'fashion-desc';
        desc.textContent = item.desc || '';
        
        // Create tags container
        const tags = document.createElement('div');
        tags.className = 'fashion-tags';
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'badge bg-primary me-1';
                tagSpan.textContent = tag;
                tags.appendChild(tagSpan);
            });
        }
        
        // Create meta info
        const meta = document.createElement('div');
        meta.className = 'fashion-meta mt-2';
        const genderText = item.gender ? item.gender.join(', ') : '';
        const ageText = item.age ? item.age.join(', ') : '';
        meta.innerHTML = `<small class="text-muted">${item.tempRange || ''} ${genderText ? '• ' + genderText : ''} ${ageText ? '• ' + ageText + 's' : ''}</small>`;
        
        // Assemble the content
        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(tags);
        content.appendChild(meta);
        
        // Assemble the item
        imgContainer.appendChild(img);
        fashionItem.appendChild(imgContainer);
        fashionItem.appendChild(content);
        
        // Add to column
        col.appendChild(fashionItem);
        
        fashionGrid.appendChild(col);
    }
}

// 이벤트 리스너
function initEventListeners() {
    getWeatherBtn.addEventListener('click', async () => {
        const gender = document.getElementById('gender').value;
        const age = document.getElementById('age').value;
        
        // 로딩 상태 표시
        fashionGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">로딩 중...</span>
                </div>
                <p class="mt-3">패션을 추천하고 있어요...</p>
            </div>
        `;
        
        try {
            // 날씨 데이터 가져오기
            const weatherData = await fetchWeather();
            const temp = Math.round(weatherData.main.temp);
            
            // 패션 추천 가져오기
            const recommendations = getFashionRecommendations(temp, gender, age);
            
            // UI 업데이트
            displayFashionItems(recommendations);
        } catch (error) {
            console.error('오류 발생:', error);
            fashionGrid.innerHTML = `
                <div class="col-12 text-center py-5 text-danger">
                    <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <p>패션 추천을 불러오는 중 오류가 발생했습니다.</p>
                    <button class="btn btn-primary mt-2" onclick="window.location.reload()">다시 시도하기</button>
                </div>
            `;
        }
    });
}

// 초기화
async function init() {
    // 기본 날씨 데이터 로드
    await fetchWeather();
    
    // 이벤트 리스너 초기화
    initEventListeners();
    
    // 초기 패션 추천 로드 (기본값: 20대 남성)
    const initialRecs = getFashionRecommendations(22, 'male', '20');
    displayFashionItems(initialRecs);
}

// 문서 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
