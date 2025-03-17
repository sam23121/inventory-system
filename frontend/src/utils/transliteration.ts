/**
 * A mapping of Amharic characters to their English phonetic equivalents
 */
const AMHARIC_TO_ENGLISH_MAP: Record<string, string> = {
  'ሀ': 'ha', 'ሁ': 'hu', 'ሂ': 'hi', 'ሃ': 'ha', 'ሄ': 'he', 'ህ': 'h', 'ሆ': 'ho',
  'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'le', 'ል': 'l', 'ሎ': 'lo',
  'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'me', 'ም': 'm', 'ሞ': 'mo',
  'ሠ': 'se', 'ሡ': 'su', 'ሢ': 'si', 'ሣ': 'sa', 'ሤ': 'se', 'ሥ': 's', 'ሦ': 'so',
  'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 're', 'ር': 'r', 'ሮ': 'ro',
  'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'se', 'ስ': 's', 'ሶ': 'so',
  'ሸ': 'she', 'ሹ': 'shu', 'ሺ': 'shi', 'ሻ': 'sha', 'ሼ': 'she', 'ሽ': 'sh', 'ሾ': 'sho',
  'ቀ': 'qe', 'ቁ': 'qu', 'ቂ': 'qi', 'ቃ': 'qa', 'ቄ': 'qe', 'ቅ': 'q', 'ቆ': 'qo',
  'በ': 'be', 'ቡ': 'bu', 'ቢ': 'bi', 'ባ': 'ba', 'ቤ': 'be', 'ብ': 'b', 'ቦ': 'bo',
  'ተ': 'te', 'ቱ': 'tu', 'ቲ': 'ti', 'ታ': 'ta', 'ቴ': 'te', 'ት': 't', 'ቶ': 'to',
  'ቸ': 'che', 'ቹ': 'chu', 'ቺ': 'chi', 'ቻ': 'cha', 'ቼ': 'che', 'ች': 'ch', 'ቾ': 'cho',
  'ኀ': 'he', 'ኁ': 'hu', 'ኂ': 'hi', 'ኃ': 'ha', 'ኄ': 'he', 'ኅ': 'h', 'ኆ': 'ho',
  'ነ': 'ne', 'ኑ': 'nu', 'ኒ': 'ni', 'ና': 'na', 'ኔ': 'ne', 'ን': 'n', 'ኖ': 'no',
  'ኘ': 'nye', 'ኙ': 'nyu', 'ኚ': 'nyi', 'ኛ': 'nya', 'ኜ': 'nye', 'ኝ': 'ny', 'ኞ': 'nyo',
  'አ': 'a', 'ኡ': 'u', 'ኢ': 'i', 'ኣ': 'a', 'ኤ': 'e', 'እ': 'e', 'ኦ': 'o',
  'ከ': 'ke', 'ኩ': 'ku', 'ኪ': 'ki', 'ካ': 'ka', 'ኬ': 'ke', 'ክ': 'k', 'ኮ': 'ko',
  'ወ': 'we', 'ዉ': 'wu', 'ዊ': 'wi', 'ዋ': 'wa', 'ዌ': 'we', 'ው': 'w', 'ዎ': 'wo',
  'ዐ': 'a', 'ዑ': 'u', 'ዒ': 'i', 'ዓ': 'a', 'ዔ': 'e', 'ዕ': 'i', 'ዖ': 'o',
  'ዘ': 'ze', 'ዙ': 'zu', 'ዚ': 'zi', 'ዛ': 'za', 'ዜ': 'ze', 'ዝ': 'z', 'ዞ': 'zo',
  'ዠ': 'zhe', 'ዡ': 'zhu', 'ዢ': 'zhi', 'ዣ': 'zha', 'ዤ': 'zhe', 'ዥ': 'zh', 'ዦ': 'zho',
  'የ': 'ye', 'ዩ': 'yu', 'ዪ': 'yi', 'ያ': 'ya', 'ዬ': 'ye', 'ይ': 'y', 'ዮ': 'yo',
  'ደ': 'de', 'ዱ': 'du', 'ዲ': 'di', 'ዳ': 'da', 'ዴ': 'de', 'ድ': 'd', 'ዶ': 'do',
  'ጀ': 'je', 'ጁ': 'ju', 'ጂ': 'ji', 'ጃ': 'ja', 'ጄ': 'je', 'ጅ': 'j', 'ጆ': 'jo',
  'ገ': 'ge', 'ጉ': 'gu', 'ጊ': 'gi', 'ጋ': 'ga', 'ጌ': 'ge', 'ግ': 'g', 'ጎ': 'go',
  'ጠ': 'Te', 'ጡ': 'Tu', 'ጢ': 'Ti', 'ጣ': 'Ta', 'ጤ': 'Te', 'ጥ': 'T', 'ጦ': 'To',
  'ጨ': 'Che', 'ጩ': 'Chu', 'ጪ': 'Chi', 'ጫ': 'Cha', 'ጬ': 'Che', 'ጭ': 'Ch', 'ጮ': 'Cho',
  'ጸ': 'Tse', 'ጹ': 'Tsu', 'ጺ': 'Tsi', 'ጻ': 'Tsa', 'ጼ': 'Tse', 'ጽ': 'Ts', 'ጾ': 'Tso',
  'ፀ': 'Tse', 'ፁ': 'Tsu', 'ፂ': 'Tsi', 'ፃ': 'Tsa', 'ፄ': 'Tse', 'ፅ': 'Ts', 'ፆ': 'Tso',
  'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fe', 'ፍ': 'f', 'ፎ': 'fo',
  'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pe', 'ፕ': 'p', 'ፖ': 'po',
  '፡': ' ', '።': '.', '፣': ',', '፤': ';', '፥': ':', '፦': '-', '፧': '?', '፨': '!',
  ' ': ' '
};

/**
 * A mapping of English phonetic combinations to their Amharic equivalents
 */
const ENGLISH_TO_AMHARIC_MAP: Record<string, string> = {
  // Reverse mapping created from AMHARIC_TO_ENGLISH_MAP
  // This is simplified and would need to be more sophisticated for a real implementation
  'ha': 'ሀ', 'hu': 'ሁ', 'hi': 'ሂ', 'he': 'ሄ', 'h': 'ህ', 'ho': 'ሆ',
  'le': 'ለ', 'lu': 'ሉ', 'li': 'ሊ', 'la': 'ላ', 'l': 'ል', 'lo': 'ሎ',
  'me': 'መ', 'mu': 'ሙ', 'mi': 'ሚ', 'ma': 'ማ', 'm': 'ም', 'mo': 'ሞ',
  'se': 'ሰ', 'su': 'ሱ', 'si': 'ሲ', 'sa': 'ሳ', 's': 'ስ', 'so': 'ሶ',
  're': 'ረ', 'ru': 'ሩ', 'ri': 'ሪ', 'ra': 'ራ', 'r': 'ር', 'ro': 'ሮ',
  'she': 'ሸ', 'shu': 'ሹ', 'shi': 'ሺ', 'sha': 'ሻ', 'sh': 'ሽ', 'sho': 'ሾ',
  'qe': 'ቀ', 'qu': 'ቁ', 'qi': 'ቂ', 'qa': 'ቃ', 'q': 'ቅ', 'qo': 'ቆ',
  'be': 'በ', 'bu': 'ቡ', 'bi': 'ቢ', 'ba': 'ባ', 'b': 'ብ', 'bo': 'ቦ',
  'te': 'ተ', 'tu': 'ቱ', 'ti': 'ቲ', 'ta': 'ታ', 't': 'ት', 'to': 'ቶ',
  'che': 'ቸ', 'chu': 'ቹ', 'chi': 'ቺ', 'cha': 'ቻ', 'ch': 'ች', 'cho': 'ቾ',
  'ne': 'ነ', 'nu': 'ኑ', 'ni': 'ኒ', 'na': 'ና', 'n': 'ን', 'no': 'ኖ',
  'nye': 'ኘ', 'nyu': 'ኙ', 'nyi': 'ኚ', 'nya': 'ኛ', 'ny': 'ኝ', 'nyo': 'ኞ',
  'a': 'አ', 'u': 'ኡ', 'i': 'ኢ', 'e': 'ኤ', 'o': 'ኦ',
  'ke': 'ከ', 'ku': 'ኩ', 'ki': 'ኪ', 'ka': 'ካ', 'k': 'ክ', 'ko': 'ኮ',
  'we': 'ወ', 'wu': 'ዉ', 'wi': 'ዊ', 'wa': 'ዋ', 'w': 'ው', 'wo': 'ዎ',
  'ze': 'ዘ', 'zu': 'ዙ', 'zi': 'ዚ', 'za': 'ዛ', 'z': 'ዝ', 'zo': 'ዞ',
  'zhe': 'ዠ', 'zhu': 'ዡ', 'zhi': 'ዢ', 'zha': 'ዣ', 'zh': 'ዥ', 'zho': 'ዦ',
  'ye': 'የ', 'yu': 'ዩ', 'yi': 'ዪ', 'ya': 'ያ', 'y': 'ይ', 'yo': 'ዮ',
  'de': 'ደ', 'du': 'ዱ', 'di': 'ዲ', 'da': 'ዳ', 'd': 'ድ', 'do': 'ዶ',
  'je': 'ጀ', 'ju': 'ጁ', 'ji': 'ጂ', 'ja': 'ጃ', 'j': 'ጅ', 'jo': 'ጆ',
  'ge': 'ገ', 'gu': 'ጉ', 'gi': 'ጊ', 'ga': 'ጋ', 'g': 'ግ', 'go': 'ጎ',
  'Te': 'ጠ', 'Tu': 'ጡ', 'Ti': 'ጢ', 'Ta': 'ጣ', 'T': 'ጥ', 'To': 'ጦ',
  'Che': 'ጨ', 'Chu': 'ጩ', 'Chi': 'ጪ', 'Cha': 'ጫ', 'Ch': 'ጭ', 'Cho': 'ጮ',
  'Tse': 'ጸ', 'Tsu': 'ጹ', 'Tsi': 'ጺ', 'Tsa': 'ጻ', 'Ts': 'ጽ', 'Tso': 'ጾ',
  'fe': 'ፈ', 'fu': 'ፉ', 'fi': 'ፊ', 'fa': 'ፋ', 'f': 'ፍ', 'fo': 'ፎ',
  'pe': 'ፐ', 'pu': 'ፑ', 'pi': 'ፒ', 'pa': 'ፓ', 'p': 'ፕ', 'po': 'ፖ',
};

/**
 * Transliterates Amharic text to English
 * @param text The Amharic text to transliterate
 * @returns The transliterated English text
 */
export const transliterateAmharicToEnglish = (text: string): string => {
  if (!text) return '';
  
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += AMHARIC_TO_ENGLISH_MAP[char] || char;
  }
  
  return result;
};

/**
 * Transliterates English text to Amharic
 * @param text The English text to transliterate
 * @returns The transliterated Amharic text
 */
export const transliterateEnglishToAmharic = (text: string): string => {
  if (!text) return '';
  
  // Sort keys by length (longest first) to handle multi-character sequences properly
  const sortedKeys = Object.keys(ENGLISH_TO_AMHARIC_MAP).sort((a, b) => b.length - a.length);
  
  let result = '';
  let remainingText = text.toLowerCase();
  
  // Continue processing until no text remains
  while (remainingText.length > 0) {
    let matched = false;
    
    // Try to match the longest prefix first
    for (const key of sortedKeys) {
      if (remainingText.startsWith(key)) {
        result += ENGLISH_TO_AMHARIC_MAP[key];
        remainingText = remainingText.slice(key.length);
        matched = true;
        break;
      }
    }
    
    // If no match was found, keep the character as is
    if (!matched) {
      result += remainingText[0];
      remainingText = remainingText.slice(1);
    }
  }
  
  return result;
};
