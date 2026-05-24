export const teamFlags = {
  // Grupo A
  "México": "🇲🇽",
  "Sudáfrica": "🇿🇦",
  "República de Corea": "🇰🇷",
  "Chequia": "🇨🇿",

  // Grupo B
  "Canadá": "🇨🇦",
  "Bosnia y Herzegovina": "🇧🇦",
  "Catar": "🇶🇦",
  "Suiza": "🇨🇭",

  // Grupo C
  "Brasil": "🇧🇷",
  "Marruecos": "🇲🇦",
  "Haití": "🇭🇹",
  "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",

  // Grupo D
  "Estados Unidos": "🇺🇸",
  "Paraguay": "🇵🇾",
  "Australia": "🇦🇺",
  "Turquía": "🇹🇷",

  // Grupo E
  "Alemania": "🇩🇪",
  "Curazao": "🇨🇼",
  "Costa de Marfil": "🇨🇮",
  "Ecuador": "🇪🇨",

  // Grupo F
  "Países Bajos": "🇳🇱",
  "Japón": "🇯🇵",
  "Suecia": "🇸🇪",
  "Túnez": "🇹🇳",

  // Grupo G
  "Bélgica": "🇧🇪",
  "Egipto": "🇪🇬",
  "Irán": "🇮🇷",
  "Nueva Zelanda": "🇳🇿",

  // Grupo H
  "España": "🇪🇸",
  "Cabo Verde": "🇨🇻",
  "Arabia Saudí": "🇸🇦",
  "Uruguay": "🇺🇾",

  // Grupo I
  "Francia": "🇫🇷",
  "Senegal": "🇸🇳",
  "Irak": "🇮🇶",
  "Noruega": "🇳🇴",

  // Grupo J
  "Argentina": "🇦🇷",
  "Argelia": "🇩🇿",
  "Austria": "🇦🇹",
  "Jordania": "🇯🇴",

  // Grupo K
  "Portugal": "🇵🇹",
  "RD Congo": "🇨🇩",
  "Uzbekistán": "🇺🇿",
  "Colombia": "🇨🇴",

  // Grupo L
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Croacia": "🇭🇷",
  "Ghana": "🇬🇭",
  "Panamá": "🇵🇦",

  // Placeholder para eliminatorias
  "Por definir": "🏳️",
};

export const getFlag = (teamName) => teamFlags[teamName] ?? "🏳️";