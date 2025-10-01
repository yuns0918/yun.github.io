// 날씨 API 키 (실제 사용 시에는 서버 사이드에서 처리하는 것이 안전합니다)
const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // 실제 API 키로 교체 필요

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
                gender: ['male', 'female'],
                age: ['10', '20', '30']
            },
            { 
                title: '크롭 터틀넥 니트 + 와이드 팬츠', 
                desc: '크롭 기장의 따뜻한 터틀넥 니트에 와이드한 핏의 팬츠로 2025년 트렌디한 실루엣 완성',
                tags: ['크롭', '터틀넥', '니트', '와이드팬츠'],
                tempRange: '0°C 이하',
                gender: ['female'],
                age: ['10', '20', '30']
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
                age: ['10', '20', '30']
            },
            {
                title: '오버사이즈 블레이저 + 와이드 팬츠',
                desc: '오피스룩의 정석, 오버사이즈 블레이저와 와이드 팬츠의 조화',
                tags: ['오피스룩', '블레이저', '와이드팬츠', '데일리'],
                tempRange: '1°C ~ 10°C',
                gender: ['male'],
                age: ['20', '30', '40']
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
                gender: ['male', 'female'],
                age: ['10', '20', '30']
            },
            {
                title: '크롭 가디건 + 미니스커트',
                desc: '여성들을 위한 키치한 감성의 크롭 가디건과 미니스커트 매치',
                tags: ['크롭', '가디건', '미니스커트', '키치'],
                tempRange: '11°C ~ 20°C',
                gender: ['female'],
                age: ['10', '20', '30']
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
                age: ['10', '20', '30']
            },
            {
                title: '린넨 셔츠 + 반바지',
                desc: '시원한 린넨 소재의 셔츠와 반바지로 여름을 시원하게',
                tags: ['린넨', '셔츠', '반바지', '시원한'],
                tempRange: '21°C ~ 30°C',
                gender: ['male'],
                age: ['10', '20', '30', '40']
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
                age: ['10', '20', '30']
            },
            {
                title: '린넨 셔츠 + 반바지',
                desc: '통기성 좋은 린넨 소재로 한여름 무더위를 이기세요',
                tags: ['린넨', '셔츠', '반바지', '시원한'],
                tempRange: '31°C 이상',
                gender: ['male'],
                age: ['20', '30', '40']
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

// 패션 아이템을 UI에 표시
function displayFashionItems(items) {
    if (!items || items.length === 0) {
        fashionGrid.innerHTML = '<div class="col-12 text-center py-5">추천할 패션이 없습니다.</div>';
        return;
    }
    
    // 50개로 제한
    const limitedItems = items.slice(0, 50);
    
    fashionGrid.innerHTML = limitedItems.map((item, index) => `
        <div class="col-md-4 col-sm-6 col-12 mb-4 fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="fashion-item">
                <div class="fashion-img" style="background-color: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 3rem;">👕</span>
                </div>
                <div class="fashion-content">
                    <h4 class="fashion-title">${item.title}</h4>
                    <p class="fashion-desc">${item.desc}</p>
                    <div class="fashion-tags">
                        <span class="badge bg-light text-dark">${item.tempRange}</span>
                        ${item.tags.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
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
