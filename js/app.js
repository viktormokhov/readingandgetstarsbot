// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Mock data for categories and topics (in a real app, this would come from an API)
const CATEGORIES = {
    "История": [
        ["Древний Египет", "Изучение цивилизации Древнего Египта"],
        ["Средневековье", "Европа в Средние века"],
        ["Великие открытия", "Эпоха географических открытий"]
    ],
    "Наука": [
        ["Астрономия", "Изучение космических объектов"],
        ["Биология", "Наука о живых организмах"],
        ["Физика", "Законы природы и материи"]
    ],
    "Литература": [
        ["Классика", "Классические произведения мировой литературы"],
        ["Современная проза", "Произведения современных авторов"],
        ["Поэзия", "Стихотворные произведения разных эпох"]
    ]
};

// DOM Elements
const categoryButtonsContainer = document.getElementById('category-buttons');
const topicsContainer = document.getElementById('topics-container');
const topicButtonsContainer = document.getElementById('topic-buttons');
const selectedCategoryTitle = document.getElementById('selected-category');
const readingContentContainer = document.getElementById('reading-content');
const selectedTopicTitle = document.getElementById('selected-topic');
const textContentContainer = document.getElementById('text-content');
const questionsContainer = document.getElementById('questions-container');
const currentQuestionElement = document.getElementById('current-question');
const optionsContainer = document.getElementById('options-container');
const backToCategoriesButton = document.getElementById('back-to-categories');
const backToTopicsButton = document.getElementById('back-to-topics');

// Current state
let currentCategory = '';
let currentTopic = '';
let currentQuestionIndex = 0;
let readingData = null;

// Initialize the app
function initApp() {
    // Populate categories
    populateCategories();
    
    // Set up event listeners
    backToCategoriesButton.addEventListener('click', showCategories);
    backToTopicsButton.addEventListener('click', () => showTopics(currentCategory));
    
    // Show categories initially
    showCategories();
}

// Populate categories
function populateCategories() {
    categoryButtonsContainer.innerHTML = '';
    
    Object.keys(CATEGORIES).forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => showTopics(category));
        categoryButtonsContainer.appendChild(button);
    });
}

// Show categories
function showCategories() {
    document.querySelector('.categories').style.display = 'block';
    topicsContainer.style.display = 'none';
    readingContentContainer.style.display = 'none';
}

// Show topics for a category
function showTopics(category) {
    currentCategory = category;
    selectedCategoryTitle.textContent = category;
    
    topicButtonsContainer.innerHTML = '';
    
    CATEGORIES[category].forEach(topic => {
        const button = document.createElement('button');
        button.textContent = topic[0];
        button.addEventListener('click', () => loadReading(category, topic[0]));
        topicButtonsContainer.appendChild(button);
    });
    
    document.querySelector('.categories').style.display = 'none';
    topicsContainer.style.display = 'block';
    readingContentContainer.style.display = 'none';
}

// Load reading content
function loadReading(category, topic) {
    currentTopic = topic;
    selectedTopicTitle.textContent = topic;
    
    // In a real app, this would be an API call to get the reading content
    // For now, we'll use mock data
    fetchReadingContent(category, topic)
        .then(data => {
            readingData = data;
            displayReadingContent(data);
        })
        .catch(error => {
            console.error('Error loading reading content:', error);
            textContentContainer.innerHTML = '<p>Ошибка загрузки содержимого. Пожалуйста, попробуйте позже.</p>';
        });
    
    topicsContainer.style.display = 'none';
    readingContentContainer.style.display = 'block';
}

// Mock API call to fetch reading content
async function fetchReadingContent(category, topic) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return {
        text: `Это пример текста по теме "${topic}" из категории "${category}". В реальном приложении здесь будет настоящий контент, загруженный с сервера. Текст будет содержать информативный и увлекательный материал по выбранной теме, адаптированный для соответствующего возраста читателя.`,
        qa: [
            {
                question: "Пример вопроса 1?",
                options: ["Правильный ответ", "Неверный ответ 1", "Неверный ответ 2"]
            },
            {
                question: "Пример вопроса 2?",
                options: ["Правильный ответ", "Неверный ответ 1", "Неверный ответ 2"]
            },
            {
                question: "Пример вопроса 3?",
                options: ["Правильный ответ", "Неверный ответ 1", "Неверный ответ 2"]
            }
        ]
    };
}

// Display reading content
function displayReadingContent(data) {
    textContentContainer.innerHTML = `<p>${data.text}</p>`;
    
    // Show the first question after a delay
    setTimeout(() => {
        currentQuestionIndex = 0;
        displayQuestion(data.qa[currentQuestionIndex]);
        questionsContainer.style.display = 'block';
    }, 2000);
}

// Display a question
function displayQuestion(questionData) {
    currentQuestionElement.textContent = questionData.question;
    
    optionsContainer.innerHTML = '';
    
    questionData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
}

// Handle option selection
function selectOption(optionIndex) {
    const options = optionsContainer.querySelectorAll('.option');
    
    // Clear previous selections
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Mark selected option
    options[optionIndex].classList.add('selected');
    
    // Check if correct (first option is always correct in our mock data)
    if (optionIndex === 0) {
        options[optionIndex].classList.add('correct');
        
        // Move to next question after delay
        setTimeout(() => {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < readingData.qa.length) {
                displayQuestion(readingData.qa[currentQuestionIndex]);
            } else {
                // All questions answered
                questionsContainer.innerHTML = '<h3>Поздравляем!</h3><p>Вы успешно ответили на все вопросы.</p>';
                
                // Send results to Telegram
                sendResultsToTelegram();
            }
        }, 1500);
    } else {
        options[optionIndex].classList.add('incorrect');
        options[0].classList.add('correct');
        
        // Show correct answer and stay on same question
    }
}

// Send results to Telegram
function sendResultsToTelegram() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userData = {
            userId: tg.initDataUnsafe.user.id,
            category: currentCategory,
            topic: currentTopic,
            result: 'completed'
        };
        
        // In a real app, this would send data to your backend
        console.log('Sending results to Telegram:', userData);
        
        // Close the WebApp after a delay
        setTimeout(() => {
            tg.close();
        }, 3000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);