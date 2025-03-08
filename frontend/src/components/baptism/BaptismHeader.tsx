import { useTranslation } from 'react-i18next';

export const BaptismHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center mb-8">
      <img 
        src="/images/cross-v2.png" 
        alt="Cross" 
        className="w-16 h-16 mx-auto mb-4 dark:invert" // Added dark:invert for dark mode support
      />
      <div className="text-2xl font-semibold">{t('baptism.title')}</div>
      {/* <div className="text-xl mt-2 flex justify-center gap-2">
        <span className="font-amharic">የጥምቀት ምስክር ወረቀት</span>
        <span>|</span>
        <span>Certificate of Baptism</span>
      </div> */}
    </div>
  );
};
