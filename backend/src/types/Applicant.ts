interface GitHubProfileAssessment {
    criteria_met: boolean;
    evaluation: string;
  }
  
  interface ProgrammingExperienceAssessment {
    criteria_met: boolean;
    evaluation: string;
  }
  
  interface OverallAssessment {
    approved: boolean;
    explanation: string;
    experience_level: string;
  }
  
  interface Applicant {
    "Отметка времени": string;
    "ФИО ": string;
    "Электронная почта": string;
    "Дата рождения (Формат: ДД-ММ-ГГГГ)": string;
    "Номер телефона": string;
    "Уровень навыков программирования": string;
    "Резюме (ссылка)": string;
    "Готовы ли вы участвовать на платной основе?": string;
    "Telegram": string;
    "Ссылка на LinkedIn": string;
    "Ссылки на социальные сети": string;
    "Ссылка на GitHub": string;
    "Учебное заведение": string;
    "Специальность (Если есть)": string;
    "Текущее место работы (Если есть)": string;
    "Опишите ваш опыт программирования": string;
    "Расскажите о ваших прошлых проектах по программированию": string;
    "Ваше самое большое достижение": string;
    "Доступны ли вы для работы в Алматы?": string;
    "Нуждаетесь ли вы в помощи с жильем в Алматы?": string;
    "К каким группам представителей вы относитесь?": string;
    assessment: {
      github_profile: GitHubProfileAssessment;
      programming_experience: ProgrammingExperienceAssessment;
      overall_assessment: OverallAssessment;
    };
  }

  export default Applicant;