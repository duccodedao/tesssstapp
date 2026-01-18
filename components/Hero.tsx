
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-[#f9f9f9]">
      <div className="max-w-4xl animate-fade-in">
        <h1 className="font-title text-5xl md:text-8xl font-normal leading-tight mb-8">
          Chụp ảnh là<br /><span className="italic">kể chuyện</span> bằng ánh sáng
        </h1>
        <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Ghi lại những khoảnh khắc chân thực, tinh tế và đầy cảm xúc của bạn. Chúng tôi mang đến trải nghiệm chụp ảnh chuyên nghiệp, đẳng cấp.
        </p>
        <a 
          href="#services" 
          className="inline-block bg-black text-white px-10 py-4 uppercase text-xs tracking-widest font-bold hover:bg-neutral-800 transition-all shadow-xl hover:translate-y-[-2px]"
        >
          Đặt lịch ngay
        </a>
      </div>
    </section>
  );
};

export default Hero;
